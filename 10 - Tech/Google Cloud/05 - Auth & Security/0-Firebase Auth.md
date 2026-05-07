> [!quote] 💬
> *"Auth is easy until it isn't. Use Firebase Auth and don't roll your own."*

# 🔐 Firebase Authentication là gì?
**Firebase Authentication** = service quản lý user identity: signup/login/reset password, OAuth social (Google/Apple/FB), phone, anonymous, custom token. Trả về **ID token (JWT)** để client gọi backend → backend verify bằng Admin SDK.
Lý do dùng:
- Tránh tự xây password hash, reset flow, OAuth dance.
- Tích hợp sẵn với Firestore Security Rules (`request.auth.uid`).
- Free up to 50k MAU (Spark plan).

> [!note] 📝 So sánh dễ hiểu
> Firebase Auth giống **bộ phận lễ tân khách sạn**: phát thẻ key (ID token) cho khách đã verify, bạn không cần kiểm tra giấy tờ mỗi lần khách đi qua. Backend chỉ cần "quẹt thẻ" (verify token) là biết đó là ai.

---
# 🧱 Khái niệm cốt lõi
| Khái niệm | Là gì |
|---|---|
| **User** | Mỗi user có UID duy nhất, không đổi |
| **ID token** | JWT 1 tiếng, gửi từ client lên backend mỗi request |
| **Refresh token** | Token dài hạn (60 ngày), client tự refresh ID token khi hết hạn |
| **Custom claims** | Field tự định nghĩa nhúng vào JWT (vd `role: admin`) |
| **Session cookie** | Cookie HttpOnly thay ID token cho web SSR (5 phút - 2 tuần) |
| **Custom token** | Token bạn tự gen ở server để client signInWithCustomToken |

---
# 🔄 Flow auth điển hình
```
Client                          Backend (Cloud Functions/Run)        Firebase Auth
  │                                       │                                │
  ├─► signInWithEmailAndPassword ──────────────────────────────────────►   │
  │◄────────── ID Token + Refresh Token ────────────────────────────────   │
  │                                       │                                │
  ├─► fetch /api/profile                  │                                │
  │   Authorization: Bearer <ID Token> ──►│                                │
  │                                       ├─► verifyIdToken() ─────────►   │
  │                                       │◄────── decoded user ───────    │
  │                                       │                                │
  │◄────── { name, email } ───────────────│                                │
```

---
# 🛠 Code thực tế

## Client (web SDK)
```js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
const app = initializeApp({ /* config */ });
const auth = getAuth(app);

// Sign in
const cred = await signInWithEmailAndPassword(auth, "a@joy.app", "password");
const idToken = await cred.user.getIdToken();

// Listen state
onAuthStateChanged(auth, user => {
  if (user) console.log("Signed in:", user.uid);
  else console.log("Signed out");
});

// Gọi backend với token
fetch("https://api.joy.app/profile", {
  headers: { Authorization: `Bearer ${idToken}` },
});
```

## Backend (Admin SDK Node.js)
```js
const admin = require("firebase-admin");
admin.initializeApp();

// Middleware verify ID token
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "no_token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;     // { uid, email, role?, ... }
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});
```

---
# 👑 Custom Claims — RBAC (role-based access)
Custom claim = field tự định nghĩa nhúng vào ID token. Set từ **server**, dùng để phân quyền.

## Set claim từ server
```js
// Backend: chỉ admin được set
await admin.auth().setCustomUserClaims(uid, {
  role: "merchant_admin",
  shopId: "demo.myshopify.com",
});
```

> [!warning] ⚠️
> Set xong claim, **client phải refresh ID token** mới thấy:
> ```js
> await user.getIdToken(true);   // force refresh
> ```
> Không refresh = claim cũ vẫn dùng đến khi token hết hạn (~1 tiếng).

## Verify claim ở backend
```js
async function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).end();
    next();
  };
}
app.delete("/admin/user/:id", authMiddleware, requireRole("admin"), handler);
```

## Dùng trong Firestore Security Rules
```
match /shops/{shopId}/orders/{orderId} {
  allow read: if request.auth.token.shopId == shopId;
  allow write: if request.auth.token.role == "merchant_admin";
}
```

> [!danger] ⛔
> Custom claims **không quá 1000 bytes**. Đừng nhồi cả profile vào — chỉ nhồi field cần dùng cho authorization (role, shopId, plan).

---
# 🍪 Session Cookie — cho web SSR
Vấn đề: web SSR (Next.js, Nuxt) không thể gọi `getIdToken()` từ server. Giải pháp = **session cookie HttpOnly**.

```js
// Backend: đổi ID token → session cookie
app.post("/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;       // 5 ngày
  const cookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
  res.cookie("__session", cookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ ok: true });
});

// Verify cookie ở route khác
app.get("/dashboard", async (req, res) => {
  try {
    const decoded = await admin.auth().verifySessionCookie(req.cookies.__session, true);
    // decoded.uid, decoded.role, ...
  } catch {
    res.redirect("/login");
  }
});
```
> [!tip] 💡
> Session cookie có cùng claim với ID token (kể cả custom claim). Có thể revoke bằng `admin.auth().revokeRefreshTokens(uid)`.

---
# 🛒 Joy Loyalty patterns

## Pattern 1: Merchant signs in via Shopify OAuth → Firebase custom token
```js
// Server: sau khi Shopify OAuth thành công, gen Firebase token
exports.shopifyOauthCallback = onRequest(async (req, res) => {
  const shop = req.query.shop;            // demo.myshopify.com
  const accessToken = await exchangeShopifyCode(req.query.code);

  // Tạo Firebase user nếu chưa có
  const uid = `shop_${shop.replace(".myshopify.com", "")}`;
  await admin.auth().getUser(uid).catch(() =>
    admin.auth().createUser({ uid, email: `owner@${shop}` })
  );

  // Set custom claims
  await admin.auth().setCustomUserClaims(uid, { shop, role: "merchant" });

  // Gen custom token cho client signIn
  const customToken = await admin.auth().createCustomToken(uid);
  res.redirect(`/?token=${customToken}`);
});
```
```js
// Client: nhận token từ URL → sign in
import { signInWithCustomToken } from "firebase/auth";
const token = new URLSearchParams(location.search).get("token");
await signInWithCustomToken(auth, token);
```

## Pattern 2: Embedded app — verify Shopify session token + Firebase token
```js
async function authMiddleware(req, res, next) {
  // Shopify embedded gửi session token (JWT)
  const shopifyToken = req.headers["x-shopify-session"];
  const shopifyDecoded = verifyShopifyJWT(shopifyToken);    // verify với Shopify secret
  // Đối chiếu với Firebase user
  req.user = await admin.auth().getUser(`shop_${shopifyDecoded.dest}`);
  next();
}
```

---
# 📚 Tham khảo
- [Firebase Authentication docs](https://firebase.google.com/docs/auth) — official, mọi provider + flow.
- [Manage Session Cookies](https://firebase.google.com/docs/auth/admin/manage-cookies) — chi tiết createSessionCookie, verify, revoke.
- [Control Access with Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims) — set claim, sync với security rules.
- 🔥 [Firebase Auth + Custom Claims for RBAC — OneUptime 02/2026](https://oneuptime.com/blog/post/2026-02-17-how-to-set-up-firebase-auth-with-custom-claims-for-role-based-access-control-in-gcp/view) — bài 2026, full pattern RBAC.
- [Firebase RBAC with Custom Claims — freeCodeCamp](https://www.freecodecamp.org/news/firebase-rbac-custom-claims-rules/) — example đầy đủ + Security Rules.
- [Introduction to Admin Auth API](https://firebase.google.com/docs/auth/admin) — getUser, listUsers, deleteUser, import.

---
# ✅ Checklist Firebase Auth
- [ ] Frontend: dùng SDK `firebase/auth`, không tự gọi REST
- [ ] Backend: middleware verify ID token mọi request authenticated
- [ ] Custom claims set từ **server** only, không bao giờ client
- [ ] Custom claims < 1000 bytes (chỉ field cho authorization)
- [ ] Sau setCustomUserClaims → client `getIdToken(true)` để refresh
- [ ] Web SSR: dùng session cookie HttpOnly thay vì gửi ID token
- [ ] Sync claim quan trọng vào Firestore Security Rules
- [ ] Revoke token khi user đổi password / nghi compromise
- [ ] Bật App Check trên `onCall` để chặn client giả mạo (xem [[1-App Check]])
- [ ] Liên kết: [[1-Cloud Functions v2]], [[3-Security Rules]]
