# 📰 AVADA Digest — 2026-09-22

> Nguồn: [digest.avada.net/d/2026-09-22](https://digest.avada.net/d/2026-09-22) · Điểm nhấn hôm nay: "Amazon locked the agent out of the cart. Shopify handed it Shop Pay." — Amazon chặn AI agent Muse của Meta, còn Shopify thì mở Shop Pay cho Muse, $SHOP đóng cửa +7.3%; đồng thời cách đo session trong Shopify Analytics đổi từ hôm nay.

## ⏰ Deadlines
- **01/10/2026:** [2026-10 API Stability](https://shopify.dev/release-notes/2026-10) — bản API 2026-10 vào giai đoạn stable; app phải sẵn sàng theo release notes.
- **01/10/2026:** [UI Extension API Version & Bundle Size Requirements](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — UI extension phải đạt yêu cầu về phiên bản API và giới hạn bundle size (có quy trình xin ngoại lệ).
- **01/10/2026:** [Script Tag Deprecation](https://shopify.dev/changelog/online-store-script-tags-deprecation) — Script tag trên Online Store bị khai tử; app còn dùng script tag phải chuyển sang theme app extension.
- **21/09:** [Analytics Session Measurement Changes](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements) · [help.shopify.com](https://help.shopify.com/en/manual/reports-and-analytics/discrepancies/session-measurement-update) — cách đếm session đổi từ hôm nay, số liệu conversion rate trước/sau ngày này không so sánh trực tiếp được.
- **16/09:** [Events Payloads & Delivery Headers Updates](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration) — payload và header giao event/webhook thay đổi, app consume webhook cần kiểm lại parser.
- **15/09:** [New Shopify Admin Interface](https://changelog.shopify.com/posts/see-the-shopify-admin-s-new-look) — Admin có giao diện mới; embedded app cần chuẩn bị style cho hợp.
- **2027-01:** [automaticDiscounts Query Removal](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01) — query `automaticDiscounts` bị xoá ở API 2027-01, app discount phải đổi sang query mới.

## 🛒 Shopify This Week

### Official news (Enterprise Blog)
- **[Ecommerce SEO Audit Framework](https://www.shopify.com/enterprise/blog/ecommerce-site-audit)** (19/09) — Shopify Enterprise đăng framework audit site ecommerce.
- **[Mainframe-to-Cloud Migration Playbook](https://www.shopify.com/enterprise/blog/mainframe-cloud-migration-journey)** (17/09) — playbook cho doanh nghiệp chuyển từ mainframe lên cloud.

### Changelog (merchant-facing)
- **[Analytics Session Measurement Improvements](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements)** (21/09) — cải tiến cách đo session trong Analytics, ảnh hưởng mọi merchant đọc báo cáo.
- **[Payouts Page Redesign](https://changelog.shopify.com/posts/payouts-page-redesign-see-all-your-payouts-in-one-view)** (16/09) — trang Payouts được thiết kế lại, xem toàn bộ payout trong một view.
- **[New Admin Look](https://changelog.shopify.com/posts/see-the-shopify-admin-s-new-look)** (15/09) · [bản cho dev](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) — Admin đổi diện mạo; dev cần chuẩn bị app theo hướng dẫn.

### Developer updates (developer-facing changelog)
- **[Unlimited Private Plans & Target Stores](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing)** (21/09) — app pricing cho phép không giới hạn private plan và store mục tiêu.
- **[Metafield `translatable` Boolean](https://shopify.dev/changelog/is-translatable-metafield-field)** (21/09) — metafield có thêm field boolean cho biết có dịch được hay không.
- **[automaticDiscounts Removal (2027-01)](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01)** (18/09) — thông báo xoá query `automaticDiscounts` từ API 2027-01.
- **[Bundle Size Exception Process](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions)** (17/09) — mở quy trình xin ngoại lệ giới hạn bundle size cho UI extension đang tồn tại.
- **[Canceled Receive Action on Inventory Shipments](https://shopify.dev/changelog/adding-a-canceled-receive-action-to-the-inventory-shipments-api)** (17/09) — Inventory Shipments API thêm action huỷ nhận hàng.
- **[POS UI Extensions bỏ `staffMemberId`](https://shopify.dev/changelog/removed-session-currentsession-staffmemberid-from-pos-ui-extensions-2026-10)** (17/09) — `session.currentSession.staffMemberId` bị bỏ khỏi POS UI Extensions từ 2026-10.
- **[Market Hierarchy Queries](https://shopify.dev/changelog/market-relationships)** (17/09) — hỗ trợ query quan hệ/phân cấp giữa các Market.
- **[Contextual Variant Price Audit Trail](https://shopify.dev/changelog/pricing-audit-trail-for-contextual-product-variant-prices)** (17/09) — có audit trail cho giá variant theo ngữ cảnh.
- **[Events Payload Updates](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration)** (16/09) — cập nhật payload event và cấu hình subscription.
- **[Catalog Media Type Filtering](https://shopify.dev/changelog/filter-catalog-search-results-by-media-type)** (15/09) — lọc kết quả tìm kiếm catalog theo loại media.
- **[Admin UI Extension Style Preparation](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look)** (15/09) — hướng dẫn chỉnh style admin UI extension cho Admin look mới.
- **[Dynamic Complexity Cost cho `metafieldsSet`](https://shopify.dev/changelog/dynamic-complexity-cost-for-metafieldsset-mutation)** (15/09) — mutation `metafieldsSet` tính chi phí complexity động, ảnh hưởng rate limit.
- **[Delivery Options Metafield Exposure](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields)** (15/09) — delivery option trong input của Shopify Functions nay expose metafield.
- **[`family_name` optional cho B2B Payments](https://shopify.dev/changelog/family_name-is-optional-for-b2b-orders-in-payments-apps-api-requests)** (15/09) — với đơn B2B qua Payments Apps API, `family_name` không còn bắt buộc.

## 🚀 Launches
- **[Shop Pay in Muse](https://www.morningstar.com/news/dow-jones/202609217371/shopify-to-use-metas-muse-for-agentic-checkout)** (Shopify + Meta, 21/09) — Shopify đưa Shop Pay vào trợ lý Muse của Meta để checkout kiểu agentic; digest ghi "$SHOP closed +7.3% at $137.92".
- **[Grok 4.7](https://x.ai/news/grok-4-7)** (SpaceXAI, 21/09) — model mới với "500k context" và "46.3% CursorBench 4.0".
- **[Jev General Availability](https://typesafe.ai/blog/introducing-system-one-models-and-jev)** · [console](https://console.typesafe.ai/login) (TypeSafe AI, 20/09) — hệ ra quyết định (không phải LLM) mở GA; digest ghi "20,830 likes" và "nearly 13% of paid teams in 24 hours".
- **[Kimi Code Desktop](https://kimi.com/code)** (Moonshot, 21/09) — app desktop cho coding agent, đã public trên Mac + Windows, "1,327 likes".
- **[Unlimited Private Plans in Shopify App Pricing](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing)** (Shopify, 21/09) — bỏ giới hạn số private plan và target store khi định giá app.

## 📦 GitHub Trending

**Hôm nay:** [`BuilderIO/agent-native`](https://github.com/BuilderIO/agent-native) (★5,877, +607) · [`trycua/cua`](https://github.com/trycua/cua) (★25,683, +609) · [`Open-Dev-Society/OpenStock`](https://github.com/Open-Dev-Society/OpenStock) (★17,697, +844) · [`akitaonrails/ai-memory`](https://github.com/akitaonrails/ai-memory) (★7,660, +167) · [`coder/coder`](https://github.com/coder/coder) (★16,411, +460) · [`anthropics/financial-services`](https://github.com/anthropics/financial-services) (★35,808, +424) · [`cloudflare/quiche`](https://github.com/cloudflare/quiche) (★12,341, +32) · [`mvt-project/mvt`](https://github.com/mvt-project/mvt) (★13,576, +169) · [`zhouxiaoka/autoclip`](https://github.com/zhouxiaoka/autoclip) (★8,213, +250) · [`ruanyf/weekly`](https://github.com/ruanyf/weekly) (★103,912, +182) · [`Crosstalk-Solutions/project-nomad`](https://github.com/Crosstalk-Solutions/project-nomad) (★37,845, +394) · [`yynxxxxx/Codex-X`](https://github.com/yynxxxxx/Codex-X) (★3,668, +50)

**Tuần này:** [`alibaba/open-code-review`](https://github.com/alibaba/open-code-review) (★39,179, +14,499) · [`anthropics/claude-code`](https://github.com/anthropics/claude-code) (★147,465, +2,731) · [`JustVugg/colibri`](https://github.com/JustVugg/colibri) (★36,860, +5,565) · [`Tencent/WeKnora`](https://github.com/Tencent/WeKnora) (★28,484, +5,455) · [`affaan-m/ECC`](https://github.com/affaan-m/ECC) (★264,746, +6,865) · [`anthropics/knowledge-work-plugins`](https://github.com/anthropics/knowledge-work-plugins) (★25,359, +1,350) · [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) (★98,132, +4,197) · [`stablyai/orca`](https://github.com/stablyai/orca) (★74,676, +6,125) · [`mksglu/context-mode`](https://github.com/mksglu/context-mode) (★23,884, +1,089) · [`bilawalsidhu/gods-eye-view`](https://github.com/bilawalsidhu/gods-eye-view) (★40,569, +7,318) · [`Panniantong/Agent-Reach`](https://github.com/Panniantong/Agent-Reach) (★84,365, +3,526) · [`blader/humanizer`](https://github.com/blader/humanizer) (★51,070, +3,023) · [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) (★18,973, +15,675) · [`vastsa/PI-Desktop`](https://github.com/vastsa/PI-Desktop) (★4,961, +1,370)

**Shopify org:** [`Shopify/hydrogen`](https://github.com/Shopify/hydrogen) (★2,132) · [`Shopify/remote-dom`](https://github.com/Shopify/remote-dom) (★1,335) · [`Shopify/pitchfork`](https://github.com/Shopify/pitchfork) (★834) · [`Shopify/cli`](https://github.com/Shopify/cli) (★750) · [`Shopify/spoom`](https://github.com/Shopify/spoom) (★272) · [`Shopify/worldwide`](https://github.com/Shopify/worldwide) (★97)

## 🐦 On X — SaaS, Ecom, DTC

**SaaS launches**
- **[Jev (TypeSafe AI)](https://console.typesafe.ai/login)** — digest ghi "Waitlist lasted five days"; tích hợp Vercel, Cloudflare, OpenRouter, LiteLLM, Netlify.
- **[Kimi Code Desktop (Moonshot)](https://kimi.com/code)** — bản desktop của coding agent Kimi được nhắc trên X.

**Ecom/DTC**
- **Amazon Blocks Muse** (21/09) — [GeekWire](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/) · [The Verge](https://www.theverge.com/tech/998078/amazon-blocks-meta-muse-ai-agent-shopping) · [TechCrunch](https://techcrunch.com/2026/09/21/metas-ai-agent-has-been-blocked-from-using-amazon-com/) — Amazon chặn AI agent Muse; popup ghi "continued access by an unauthorized AI agent violates Amazon's Conditions".
- **[Shopify Shop Pay in Muse](https://www.morningstar.com/news/marketwatch/20260921102/amazon-and-shopify-make-starkly-different-moves-in-the-brewing-battle-over-ai-shopping)** (21/09) — MarketWatch đối chiếu hai nước đi trái ngược của Amazon và Shopify trong cuộc chiến AI shopping.
- **[Muse #1 Free iPhone App (US)](https://x.com/VanquishTrader/status/2102058620926218413)** — Muse leo lên top 1 app miễn phí trên iPhone tại Mỹ.
- **[TikTok for Shopify Listing](https://seller-us.tiktok.com/university/essay?knowledge_id=7874080072386317&lang=en)** (17/09) — TikTok Seller University có bài về listing TikTok cho Shopify.
- **[Analytics Session Measurement Changes](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements)** — lời khuyên trong digest: "Don't explain a conversion-rate jump to a client until you've split the series at 21 September".

**Shopify community**
- **[Tobi's Muse Post](https://x.com/tobi/status/2102090718546198790)** — post của Tobi về Muse, 5,670 likes / 710k views.
- **[Shopify AR Post](https://x.com/Shopify/status/2100544899590267076)** (17/09) — post về AR của Shopify, 215 likes.
- **[Shopify Muse Launch Day](https://x.com/Shopify/status/2097408290967707950)** (08/09) — post ngày ra mắt Muse.

## 🎭 Culture → Commerce
- Không có signal nào đạt ngưỡng trong kỳ này; digest ghi đã soi SPECS, Muse, magnesium, medicube, SLUSHi nhưng "insufficient proof".

## 👽 On Reddit
- Không có tín hiệu: digest ghi "No live signal (old.reddit.com access blocked)" — không có thread nào cho r/shopify, r/shopifyDev, r/ecommerce trong bản hôm nay.

## 🧭 Analysis & Commentary
Trang không có heading "Analysis & Commentary" riêng; phần bình luận nằm ở đoạn kết "The rest of the letter is the AI and operator-video weather":
- **Grok 4.7** là tin model chính: cùng giá với 4.6, bền hơn ở task khó, có Grok Bot harness native và lớp safeguard mới (3.3% pass-through trên HackerBench v0.3 risky prompts). Artificial Analysis xếp SpaceXAI vào top 4 lab trên Intelligence Index và thứ 4 trên Coding Agent Index với Grok Build. Điểm trừ là token: ~81k output token/task ở mức xhigh so với 36k của 4.6. Đã live trong Cursor và Grok Build; bản consumer trên X còn đang roll out.
- **Jev** là model còn lại và không phải LLM: TypeSafe (Diogo Almeida, ex-OpenAI RLHF) ship quyết định có type Choice / Score / boolean trong 70–500 ms. Waitlist chỉ tồn tại 5 ngày. Tích hợp trong tuần: Vercel AI Gateway, Cloudflare, OpenRouter, LiteLLM, Netlify — digest coi đây là "SaaS heat", không phải Product Hunt.
- **Kimi Code Desktop** là desktop app thứ ba trong một tháng coi coding agent là *app*, không phải panel trong IDE: parallel agents, Goal mode, Swarm — cùng dạng với Grok Build / Claude Code / Cursor.
- **AI Engineer Paris** 23–24/09 tại Station F. Talk từ World's Fair (tháng 6–7) vẫn đang lên kênh, ba video đã vượt 50k, cộng bảng HOT 14 ngày với 12 video nữa — "Do not wait a month".
- **Operators:** series Build vẫn đang tích luỹ; Episode 1 (start an ecommerce business) là video WATCH duy nhất của kênh. Episode 5 ra hôm qua (vì sao phần khó nhất bắt đầu sau khi launch) mới 1.4k views, còn quá sớm. Ecommerce Therapy (09/09, ba operator chín chữ số nói về focus) được đánh HOT.
- **Chase:** một video HOT là *Learn 97% of Claude for Meta in 10 Minutes* (11/09, 9.5k). Operators E5 ngày 21/09 và các video UGC army / tier-list cũ vẫn ở mức accumulating, chưa phải WATCH.

## 💡 Liên quan Joy Loyalty
- **automaticDiscounts bị xoá ở API 2027-01** và **Delivery Options trong Shopify Functions nay expose metafields** đụng trực tiếp discount function của Joy: cần rà query discount hiện dùng và tận dụng metafield ở delivery option.
- **Analytics session measurement đổi từ 21/09** + **Events payloads/headers đổi từ 16/09**: báo cáo loyalty/conversion sẽ vênh nếu so số liệu xuyên ngày 21/09, còn pipeline webhook (Firebase/GCP) cần kiểm lại parser theo payload mới.
- **Admin look mới (15/09) + yêu cầu API version & bundle size cho UI extension hạn 01/10** và **script tag deprecation hạn 01/10**: embedded admin app (React + Polaris) và các extension của Joy phải cập nhật style, giảm bundle, bỏ hẳn script tag trước 01/10. Thêm hai điểm thuận lợi: **metafield `translatable`** giúp dịch nội dung widget loyalty, và **unlimited private plans** mở đường cho pricing riêng cho merchant lớn.
