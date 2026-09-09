# 📰 AVADA Digest — 2026-09-09

> Nguồn: [digest.avada.net/d/2026-09-09](https://digest.avada.net/d/2026-09-09) · Đáng chú ý nhất: Meta ra mắt AI agent **Muse** và merchant Shopify (ship về US, có trong Catalog) **tự động** xuất hiện & checkout được trong Muse — không cần app mới, không cần bật toggle.

## ⏰ Deadlines
- **01/10/2026 (và 01/03/2027):** [Script Tags deprecation](https://shopify.dev/changelog/online-store-script-tags-deprecation) — từ 01/10/2026 API trả user error khi tạo script tag; từ 01/03/2027 script tag cũ ngừng inject. Ảnh hưởng mọi app còn chèn JS vào storefront qua Script Tag.
- **API version 2026-10:** [Tax calculation & tax-summary webhooks dùng Global ID](https://shopify.dev/changelog/tax-webhook-summary-and-calculation-requests-now-use-global-ids) — app tax phải parse GID thay vì ID số.
- **API version 2026-10:** [Đổi shipping address của order sẽ tính lại thuế](https://shopify.dev/changelog/updating-an-orders-shipping-address-returns-accurate-financial-data) — dữ liệu tài chính của order trả về chính xác hơn, ảnh hưởng app đọc/ghi order.
- **Chưa công bố ngày gỡ:** [`ProductVariant.barcode` bị thay bằng `barcodes`](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes) — app đọc field `barcode` cần lên kế hoạch migrate.
- **Customer Account API 2026-10:** [`territoryCode` deprecated, dùng `countryCode`](https://shopify.dev/changelog/customer-address-apis-now-support-countrycode) — ảnh hưởng app dùng Customer Account API / địa chỉ khách.
- **15/06/2026 (đã qua, nhắc lại 08/09):** [Storefront Catalog MCP compatibility layer](https://shopify.dev/changelog/storefront-catalog-mcp-now-implements-ucp) — lớp tương thích cũ hết hiệu lực, MCP nay chạy theo UCP.

## 🛒 Shopify This Week

### Official news (shopify.com/news, cửa sổ 7 ngày)
- **[Shopify Q2 2026 Financial Results](https://www.shopify.com/news/shopify-q2-2026-financial-results)** (05/08) — bản công bố kết quả kinh doanh quý 2/2026.
- **[Shopify Q2 2026 Earnings Call Transcript](https://www.benzinga.com/news/26/09/61633630/shopify-q2-2026-earnings-call-transcript)** (04/09) — transcript buổi earnings call quý 2.

### Changelog
- **[08/09 — Variant hỗ trợ nhiều barcode](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes)** — Admin GraphQL cho tối đa 20 barcode/variant (UPC/EAN/ISBN/GTIN/ASIN có validate), phục vụ ERP, marketplace, POS.
- **[08/09 — Customer Address API hỗ trợ `countryCode`](https://shopify.dev/changelog/customer-address-apis-now-support-countrycode)** — thay thế `territoryCode` từ bản 2026-10.
- **[08/09 — Tax webhooks dùng Global ID](https://shopify.dev/changelog/tax-webhook-summary-and-calculation-requests-now-use-global-ids)** — payload webhook tax chuyển sang GID.
- **[08/09 — Đổi shipping address của order tính lại thuế (2026-10)](https://shopify.dev/changelog/updating-an-orders-shipping-address-returns-accurate-financial-data)** — trả về dữ liệu tài chính chính xác sau khi đổi địa chỉ.
- **[07/09 — Storefront Catalog MCP implement UCP](https://shopify.dev/changelog/storefront-catalog-mcp-now-implements-ucp)** — MCP catalog chuyển sang chuẩn UCP.
- **[04/09 — Storefront hỗ trợ UCP 2026-08-25](https://shopify.dev/changelog/08-25-is-now-supported)** — storefront advertise protocol version mới tại `/.well-known/ucp`, capability không đổi, merchant không cần cấu hình gì.
- **[03/09 — POS xem được cart online của khách đã định danh](https://changelog.shopify.com/posts/permitted-store-staff-can-now-see-an-identified-customer-s-online-cart-in-pos)** — staff có quyền thấy abandoned checkout của khách ngay trong POS v11.14.
- **[03/09 — Hydrogen developer preview update](https://shopify.dev/changelog/hydrogen-developer-preview-update-september-2-2026)** — link variant mở đúng variant thay vì product mặc định; cart reload sau thay đổi server-side; tự sinh HTTPS cert local để test Customer Account.

### Developer updates (mở đầu bản digest)
- Meta ra mắt personal agent tại US; merchant Shopify ship về Mỹ và có mặt trong Catalog **đã searchable ngay** trong Muse — không cần app mới, không feed mới, không toggle merchant. Checkout qua Link, Shop Pay sẽ tích hợp sau; setup phía merchant = 0.

## 🚀 Launches
- **[Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)** (Meta, 08/09) — personal AI agent trên iOS/Android/web/WhatsApp, chạy trên Secure VM, gộp email/calendar/payment/health/shopping; checkout bằng Link hiện tại, Shop Pay sắp có; free tier rồi $20/$100.
- **[Shopify Catalog on Muse](https://x.com/Shopify/status/2097408290967707950)** (Shopify, 08/09) — không phải sản phẩm mới: merchant trong Catalog ship về US tự động searchable và checkout được trong Muse ngay ngày đầu.
- **[Multiple Barcodes on a Variant](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes)** (Shopify, 08/09) — tối đa 20 barcode/variant qua Admin GraphQL, có validate theo chuẩn UPC/EAN/ISBN/GTIN/ASIN.
- **[Devin Auto-Triage, Security Swarm, Automations](https://cognition.com/blog/series-e)** (Cognition, 08/09) — Devin theo dõi alert trong Slack, Security Swarm triage lỗ hổng, Automations trigger từ Slack/GitHub/Linear; công bố cùng Series E $2B, định giá $48B.
- **[Switch](https://www.producthunt.com/products/switch-11)** (FlintAI, 08/09) — đưa bất kỳ AI agent nào vào Slack/Teams/Discord/Telegram như một thành viên thật; #1 Product Hunt (411 upvote), open-source.

## 📦 GitHub Trending

**Hôm nay:**
- [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) — ★30,340 (+656)
- [`cathrynlavery/diagram-design`](https://github.com/cathrynlavery/diagram-design) — ★34,750 (+710)
- [`openai/skills`](https://github.com/openai/skills) — ★26,497 (+490)
- [`affaan-m/ECC`](https://github.com/affaan-m/ECC) — ★254,282 (+1,427)
- [`heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes) — ★47,736 (+2,627)
- [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) — ★48,790 (+666)
- [`obra/superpowers`](https://github.com/obra/superpowers) — ★283,342 (+452)
- [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) — ★211,431 (+333)
- [`microsoft/markitdown`](https://github.com/microsoft/markitdown) — ★181,658 (+2,047)
- [`jo-inc/camofox-browser`](https://github.com/jo-inc/camofox-browser) — ★10,471 (+871)
- [`MoonTechLab/LunaTV`](https://github.com/MoonTechLab/LunaTV) — ★10,152 (+505)
- [`browser-use/browser-use`](https://github.com/browser-use/browser-use) — ★113,470 (+228)
- [`mksglu/context-mode`](https://github.com/mksglu/context-mode) — ★21,373 (+651)
- [`The-Swarm-Corporation/AutoHedge`](https://github.com/The-Swarm-Corporation/AutoHedge) — ★5,691 (+494)
- [`viarotel-org/escrcpy`](https://github.com/viarotel-org/escrcpy) — ★11,377 (+178)
- [`openai/plugins`](https://github.com/openai/plugins) — ★5,776 (+105)

**Tuần này:**
- [`fmtlib/fmt`](https://github.com/fmtlib/fmt) — ★25,679 (+1,935)
- [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) — ★132,165 (+12,598)
- [`tt-a1i/archify`](https://github.com/tt-a1i/archify) — ★54,674 (+13,318)
- [`blader/humanizer`](https://github.com/blader/humanizer) — ★45,401 (+5,790)
- [`Imbad0202/academic-research-skills`](https://github.com/Imbad0202/academic-research-skills) — ★47,042 (+2,430)
- [`mattpocock/skills`](https://github.com/mattpocock/skills) — ★256,950 (+13,419)
- [`ChromeDevTools/chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) — ★51,369 (+1,014)
- [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent) — ★243,443 (+4,221)
- [`bilawalsidhu/gods-eye-view`](https://github.com/bilawalsidhu/gods-eye-view) — ★19,384 (+4,196)
- [`every-app/open-seo`](https://github.com/every-app/open-seo) — ★17,923 (+1,846)
- [`ruvnet/ruflo`](https://github.com/ruvnet/ruflo) — ★71,678 (+1,585)
- [`google-research/timesfm`](https://github.com/google-research/timesfm) — ★32,010 (+3,365)

**Shopify org (7 ngày qua):**
- [`Shopify/hydrogen`](https://github.com/Shopify/hydrogen) — ★2,115, push 08/09
- [`Shopify/react-native-skia`](https://github.com/Shopify/react-native-skia) — ★8,547, push 08/09
- [`Shopify/cli`](https://github.com/Shopify/cli) — ★741, push 08/09
- [`Shopify/shopify-app-template-react-router`](https://github.com/Shopify/shopify-app-template-react-router) — ★196, push 08/09
- [`Shopify/theme-tools`](https://github.com/Shopify/theme-tools) — ★229, push 08/09
- [`Shopify/rubocop-sorbet`](https://github.com/Shopify/rubocop-sorbet) — ★200, push 08/09

## 🐦 On X — SaaS, Ecom, DTC

**SaaS thực sự launch:**
- **Muse (Meta)** — post launch của Zuckerberg 22,268 like / 3.3M view; account Muse 6,419 like / 1.16M view; quote của Harley 576 like / 102k view; quote của Shopify 150 like / 20k view.
- **ZCode Video2code / Video Agent Kit** (07/09) — post của Zixuan Li 1,058 like, 356 bookmark, 56k view; hai plugin GLM-5.3-Flash: video-to-code và video editing.

**Ecom/DTC:**
- **Muse đã là một checkout surface** — [post merchant @SelfMadeMastery](https://x.com/SelfMadeMastery/status/2097461967417978922) (28 like), [newsroom Meta](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), [bài TechCrunch](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/) đặt câu hỏi liệu người dùng có tin agent này không.
- **[Sephora đưa Drop Shop lên TikTok Shop từ 19/09](https://ppc.land/sephora-brings-drop-shop-to-tiktok-shop-starting-september-19/)** — pilot prestige beauty với drop hàng tháng và SKU độc quyền.
- **[Kem tẩy lông thành category breakout](https://wwd.com/beauty-industry-news/beauty-features/tiktok-shop-top-brands-growth-phofay-crowned-1239196925/)** — [PHOFAY trên TikTok Shop](https://shop.tiktok.com/us/store/phofay-skin-care/7496261422029900329) tăng +1,907% (01–08/2026), $1.9M doanh thu, 392k+ đơn vị bán ra.
- **[Vấn đề hiệu quả GMV của TikTok Shop](https://www.netinfluencer.com/tag/tiktok-shop/)** — GMV tăng nhưng hiệu suất chuyển đổi bị đặt dấu hỏi.
- **[eMarketer dự báo TikTok Shop >$20B năm 2026](https://www.retaildive.com/news/tiktok-shop-drives-social-commerce-growth/807665/)** — social commerce tiếp tục là động lực tăng trưởng chính.

**Shopify community:**
- **[Harley Finkelstein nói về tích hợp Muse](https://twitter.com/i/status/2097409855716032592)** — 576 like, 102k view.
- **[Post chính thức của Shopify](https://twitter.com/i/status/2097408290967707950)** — 150 like, 20k view, công bố Catalog có mặt trên Muse.
- **[Chuyên gia product-data người Nhật bàn về UCP](https://twitter.com/i/status/2097454642032750915)** — góc nhìn kỹ thuật về chuẩn UCP mới.
- **[Anya Geimanson (Visually) về test upsell ở checkout](https://twitter.com/i/status/2097298404879839526)** — 8 like, 12k view.

## 🎭 Culture → Commerce
- **[Category kem tẩy lông](https://wwd.com/beauty-industry-news/beauty-features/tiktok-shop-top-brands-growth-phofay-crowned-1239196925/)** — từ ngách thành category thật trên TikTok Shop; [PHOFAY Skin Care](https://shop.tiktok.com/us/store/phofay-skin-care/7496261422029900329) +1,907%, $1.9M, 392k+ units.
- **[Sephora Drop Shop (prestige beauty)](https://ppc.land/sephora-brings-drop-shop-to-tiktok-shop-starting-september-19/)** — pilot khởi động 19/09 tại TikTok Shop US.
- **[Hollister merch / Freya Skye](https://x.com/freyaskyetr/status/2097308730983399640)** — merch xuất hiện qua endorsement người nổi tiếng, được xếp là khoảnh khắc lẻ chứ chưa phải tín hiệu category.
- **[Shopify — AI commerce at scale](https://www.shopify.com/news/ai-commerce-at-scale)** (13/08) — bài tham chiếu chính thức cho xu hướng này.

## 👽 On Reddit
- **Không có tín hiệu Reddit nào trong cửa sổ 7 ngày** — r/shopify, r/shopifyDev, r/ecommerce đều `NO_POSTS_IN_WINDOW`.

## 🧭 Analysis & Commentary
- **[Anthropic Commerce-Agent Blueprint](https://claude.com/blog/claude-for-commerce-agents)** (02/09) — blueprint cho agent thương mại điện tử.
- **[Mistral gọi vốn €3B](https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/)** — đẩy open-weight AI có chủ quyền lên mức frontier.
- **[Cognition Series E](https://cognition.com/blog/series-e)** — $2B, định giá $48B, đi kèm loạt tính năng Devin mới.
- **Đoạn kết bản digest** — trên sân khấu AI Engineer 30 ngày qua, talk vượt 50k view vẫn là Clare Liguori (AWS) về chuyển từ "AI-assisted" sang "AI-native"; cùng đó là Mike Krieger (cách Anthropic xây sản phẩm), Imad Touil (tổ chức AI-native), Jean-Denis Greze (mạng agent-to-agent). Đối trọng thực dụng là mảng giáo dục operator (nội dung dựng store, dựng công ty supplement), nơi bài học từ prototype tới launch và từ founder ecommerce mới là thứ kéo engagement.

## 💡 Liên quan Joy Loyalty
- **Script Tags deprecation (01/10/2026 → 01/03/2027)** là deadline sát sườn nhất: nếu Joy còn chèn widget loyalty/launcher vào storefront bằng Script Tag, phải chuyển hẳn sang Theme App Extension trước hạn, nếu không widget ngừng inject từ 01/03/2027.
- **Customer Account API 2026-10 đổi `territoryCode` → `countryCode`**, cộng với `ProductVariant.barcode` → `barcodes` và tax webhook chuyển sang Global ID: rà lại toàn bộ GraphQL query/webhook handler của Joy khi bump API version lên 2026-10, tránh vỡ luồng đọc địa chỉ khách và luồng tính điểm theo order.
- **Muse + Shopify Catalog + UCP**: checkout đang dịch ra khỏi storefront (agent surface, Link, Shop Pay). Loyalty widget gắn vào theme sẽ không hiện diện ở các surface này — đáng bắt đầu nghĩ cách để earn/redeem điểm chạy được ở tầng order/webhook (server-side) thay vì phụ thuộc UI storefront.
