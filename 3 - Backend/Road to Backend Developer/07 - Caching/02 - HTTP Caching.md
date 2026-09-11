# 02 — HTTP Caching

> **Nguồn chính:** RFC 9111 — *HTTP Caching* (STD 98, June 2022) — https://www.rfc-editor.org/rfc/rfc9111.txt
> Bài này bám các mục §1 (private/shared cache), §3 (Storing Responses in Caches), §4.1 (Vary), §4.2 (Freshness), §4.3 (Validation), §4.4 (Invalidating Stored Responses), §5.2 (Cache-Control), §5.3 (Expires) của RFC 9111; bổ sung RFC 5861 (`stale-while-revalidate`, `stale-if-error`), RFC 8246 (`immutable`) và RFC 9110 §8.8 / §13 / §15.4.5 cho phần validator và 304.

`Cache-Control`, `ETag`, `If-None-Match` đã được giới thiệu ở mức nhập môn tại [[01 - API là gì và nền tảng HTTP]] — bài này đi sâu vào từng directive và từng phép tính của spec, không lặp lại phần nhập môn đó.

---

## 1. HTTP cache là gì — private cache vs shared cache

📖 **Nguyên văn** (RFC 9111 §1)
> "An HTTP "cache" is a local store of response messages and the subsystem that controls storage, retrieval, and deletion of messages in it.  A cache stores cacheable responses to reduce the response time and network bandwidth consumption on future equivalent requests.  Any client or server MAY use a cache, though not when acting as a tunnel (Section 3.7 of [HTTP])."

🇻🇳 **Dịch**
> "Một HTTP "cache" là kho lưu trữ cục bộ các response message cùng phân hệ điều khiển việc lưu, lấy ra và xoá các message trong đó. Cache lưu các response có thể cache được nhằm giảm thời gian phản hồi và lượng băng thông mạng tiêu thụ cho các request tương đương trong tương lai. Bất kỳ client hay server nào cũng CÓ THỂ dùng cache, trừ khi đang đóng vai trò tunnel (Mục 3.7 của [HTTP])."

📖 **Nguyên văn** (RFC 9111 §1)
> "A "shared cache" is a cache that stores responses for reuse by more than one user; shared caches are usually (but not always) deployed as a part of an intermediary.  A "private cache", in contrast, is dedicated to a single user; often, they are deployed as a component of a user agent."

🇻🇳 **Dịch**
> "Một "shared cache" là cache lưu response để nhiều hơn một người dùng tái sử dụng; shared cache thường (nhưng không phải luôn luôn) được triển khai như một phần của intermediary. Ngược lại, một "private cache" dành riêng cho một người dùng duy nhất; thường thì chúng được triển khai như một thành phần của user agent."

📖 **Nguyên văn** (RFC 9111 §1)
> "The goal of HTTP caching is significantly improving performance by reusing a prior response message to satisfy a current request.  A cache considers a stored response "fresh", as defined in Section 4.2, if it can be reused without "validation" (checking with the origin server to see if the cached response remains valid for this request).  A fresh response can therefore reduce both latency and network overhead each time the cache reuses it.  When a cached response is not fresh, it might still be reusable if validation can freshen it (Section 4.3) or if the origin is unavailable (Section 4.2.4)."

🇻🇳 **Dịch**
> "Mục tiêu của HTTP caching là cải thiện đáng kể hiệu năng bằng cách tái sử dụng một response message trước đó để đáp ứng một request hiện tại. Cache coi một response đã lưu là "fresh", theo định nghĩa ở Mục 4.2, nếu nó có thể được tái sử dụng mà không cần "validation" (hỏi origin server xem response đã cache còn hợp lệ cho request này không). Do đó một response fresh giảm được cả latency lẫn chi phí mạng mỗi lần cache tái sử dụng nó. Khi một response đã cache không còn fresh, nó vẫn có thể tái sử dụng được nếu validation làm nó tươi trở lại (Mục 4.3) hoặc nếu origin không khả dụng (Mục 4.2.4)."

> [!note] Hai khái niệm nền tảng của cả bài
> Toàn bộ RFC 9111 xoay quanh hai cơ chế: **freshness** (§4.2 — dùng lại mà không hỏi ai) và **validation** (§4.3 — hỏi lại origin xem còn dùng được không). Nắm hai cái này là nắm 80% bài.

💡 **Ví dụ đời sống — freshness vs validation**
Bạn có hộp sữa trong tủ lạnh.
- **Freshness** = trên vỏ hộp in "HSD 20/09". Hôm nay 15/09 → bạn uống luôn, **không cần gọi điện cho ai**. Đó chính là `max-age` / `Expires`: origin server in sẵn hạn dùng lên response.
- **Validation** = hôm nay đã 21/09, quá hạn in trên hộp. Bạn **gọi điện cho cửa hàng**: "lô sữa mã `abc123` tôi mua còn dùng được không?". Cửa hàng trả lời "còn, y nguyên lô đó" → bạn uống hộp cũ, **không phải đi mua hộp mới**. Đó chính là conditional request: bạn gửi `If-None-Match: "abc123"`, server trả `304 Not Modified` (không kèm nội dung), bạn dùng lại bản đã có.
- Nếu cửa hàng nói "lô đó đổi rồi, lô mới mã `xyz789`" → họ giao hộp mới. Đó là `200 OK` kèm body mới.

Điểm mấu chốt: **freshness tiết kiệm cả round-trip**, **validation chỉ tiết kiệm băng thông body** — vẫn phải đi một vòng mạng.

---

## 2. Khi nào một response được LƯU vào cache (§3)

Đây là danh sách điều kiện bắt buộc. Thiếu một gạch đầu dòng là response không được lưu.

📖 **Nguyên văn** (RFC 9111 §3 "Storing Responses in Caches")
> "A cache MUST NOT store a response to a request unless:
>
>    *  the request method is understood by the cache;
>
>    *  the response status code is final (see Section 15 of [HTTP]);
>
>    *  if the response status code is 206 or 304, or the must-understand cache directive (see Section 5.2.2.3) is present: the cache understands the response status code;
>
>    *  the no-store cache directive is not present in the response (see Section 5.2.2.5);
>
>    *  if the cache is shared: the private response directive is either not present or allows a shared cache to store a modified response; see Section 5.2.2.7);
>
>    *  if the cache is shared: the Authorization header field is not present in the request (see Section 11.6.2 of [HTTP]) or a response directive is present that explicitly allows shared caching (see Section 3.5); and
>
>    *  the response contains at least one of the following:
>
>       -  a public response directive (see Section 5.2.2.9);
>
>       -  a private response directive, if the cache is not shared (see Section 5.2.2.7);
>
>       -  an Expires header field (see Section 5.3);
>
>       -  a max-age response directive (see Section 5.2.2.1);
>
>       -  if the cache is shared: an s-maxage response directive (see Section 5.2.2.10);
>
>       -  a cache extension that allows it to be cached (see Section 5.2.3); or
>
>       -  a status code that is defined as heuristically cacheable (see Section 4.2.2)."

🇻🇳 **Dịch**
> "Một cache KHÔNG ĐƯỢC lưu response của một request trừ khi:
>
> - method của request được cache hiểu;
> - status code của response là final (xem Mục 15 của [HTTP]);
> - nếu status code của response là 206 hoặc 304, hoặc có mặt cache directive `must-understand` (xem Mục 5.2.2.3): cache phải hiểu status code đó;
> - directive `no-store` không có mặt trong response (xem Mục 5.2.2.5);
> - nếu cache là shared: response directive `private` hoặc không có mặt, hoặc cho phép shared cache lưu một response đã được chỉnh sửa; xem Mục 5.2.2.7);
> - nếu cache là shared: header field `Authorization` không có mặt trong request (xem Mục 11.6.2 của [HTTP]), hoặc có một response directive cho phép rõ ràng việc shared caching (xem Mục 3.5); và
> - response chứa ít nhất một trong các thứ sau:
>   - một response directive `public` (Mục 5.2.2.9);
>   - một response directive `private`, nếu cache không phải shared (Mục 5.2.2.7);
>   - một header field `Expires` (Mục 5.3);
>   - một response directive `max-age` (Mục 5.2.2.1);
>   - nếu cache là shared: một response directive `s-maxage` (Mục 5.2.2.10);
>   - một cache extension cho phép nó được cache (Mục 5.2.3); hoặc
>   - một status code được định nghĩa là heuristically cacheable (Mục 4.2.2)."

📖 **Nguyên văn** (RFC 9111 §3)
> "In this context, a cache has "understood" a request method or a response status code if it recognizes it and implements all specified caching-related behavior."

🇻🇳 **Dịch**
> "Trong ngữ cảnh này, một cache đã "hiểu" một request method hay một response status code nếu nó nhận ra được và cài đặt đầy đủ mọi hành vi liên quan tới caching đã được đặc tả."

📖 **Nguyên văn** (RFC 9111 §3)
> "Note that, in normal operation, some caches will not store a response that has neither a cache validator nor an explicit expiration time, as such responses are not usually useful to store.  However, caches are not prohibited from storing such responses."

🇻🇳 **Dịch**
> "Lưu ý rằng, trong vận hành bình thường, một số cache sẽ không lưu response nào không có cache validator lẫn thời điểm hết hạn tường minh, vì những response như vậy thường không hữu ích để lưu. Tuy nhiên, các cache không bị cấm lưu những response như thế."

> [!tip] Đọc lại điều kiện áp chót
> Với shared cache, chỉ cần request có header `Authorization` là response **không được lưu**, trừ khi server chủ động bật bằng `public`, `must-revalidate`, hoặc `s-maxage`. Đây là hàng rào an toàn mặc định cho các endpoint đã xác thực — liên quan trực tiếp tới [[13 - Token Authentication và Bearer Token]] và [[12 - Cookie và Session based Authentication]].

---

## 3. Freshness (§4.2)

### 3.1. Định nghĩa

📖 **Nguyên văn** (RFC 9111 §4.2)
> "A "fresh" response is one whose age has not yet exceeded its freshness lifetime.  Conversely, a "stale" response is one where it has.
>
>    A response's "freshness lifetime" is the length of time between its generation by the origin server and its expiration time.  An "explicit expiration time" is the time at which the origin server intends that a stored response can no longer be used by a cache without further validation, whereas a "heuristic expiration time" is assigned by a cache when no explicit expiration time is available.
>
>    A response's "age" is the time that has passed since it was generated by, or successfully validated with, the origin server."

🇻🇳 **Dịch**
> "Một response "fresh" là response mà age của nó chưa vượt quá freshness lifetime. Ngược lại, một response "stale" là response đã vượt quá.
>
> "freshness lifetime" của một response là khoảng thời gian giữa lúc nó được origin server sinh ra và thời điểm hết hạn của nó. "explicit expiration time" (thời điểm hết hạn tường minh) là thời điểm mà origin server muốn rằng response đã lưu không còn được cache dùng nữa nếu không validate thêm, trong khi "heuristic expiration time" là do chính cache tự gán khi không có thời điểm hết hạn tường minh nào.
>
> "age" của một response là khoảng thời gian đã trôi qua kể từ khi nó được origin server sinh ra, hoặc được validate thành công với origin server."

📖 **Nguyên văn** (RFC 9111 §4.2)
> "The calculation to determine if a response is fresh is:
>
>       response_is_fresh = (freshness_lifetime > current_age)
>
>    freshness_lifetime is defined in Section 4.2.1; current_age is defined in Section 4.2.3."

🇻🇳 **Dịch**
> "Phép tính để xác định một response có fresh hay không là:
>
> `response_is_fresh = (freshness_lifetime > current_age)`
>
> freshness_lifetime được định nghĩa ở Mục 4.2.1; current_age được định nghĩa ở Mục 4.2.3."

📖 **Nguyên văn** (RFC 9111 §4.2)
> "The primary mechanism for determining freshness is for an origin server to provide an explicit expiration time in the future, using either the Expires header field (Section 5.3) or the max-age response directive (Section 5.2.2.1). ... If an origin server wishes to force a cache to validate every request, it can assign an explicit expiration time in the past to indicate that the response is already stale."

🇻🇳 **Dịch**
> "Cơ chế chính để xác định freshness là origin server cung cấp một thời điểm hết hạn tường minh trong tương lai, dùng hoặc header field `Expires` (Mục 5.3) hoặc response directive `max-age` (Mục 5.2.2.1). ... Nếu origin server muốn ép cache phải validate mọi request, nó có thể gán một thời điểm hết hạn tường minh trong quá khứ để báo rằng response đã stale sẵn rồi."

### 3.2. Tính freshness lifetime (§4.2.1) — thứ tự ưu tiên

📖 **Nguyên văn** (RFC 9111 §4.2.1 "Calculating Freshness Lifetime")
> "A cache can calculate the freshness lifetime (denoted as freshness_lifetime) of a response by evaluating the following rules and using the first match:
>
>    *  If the cache is shared and the s-maxage response directive (Section 5.2.2.10) is present, use its value, or
>
>    *  If the max-age response directive (Section 5.2.2.1) is present, use its value, or
>
>    *  If the Expires response header field (Section 5.3) is present, use its value minus the value of the Date response header field (using the time the message was received if it is not present, as per Section 6.6.1 of [HTTP]), or
>
>    *  Otherwise, no explicit expiration time is present in the response.  A heuristic freshness lifetime might be applicable; see Section 4.2.2."

🇻🇳 **Dịch**
> "Cache có thể tính freshness lifetime (ký hiệu freshness_lifetime) của một response bằng cách xét các quy tắc sau và dùng quy tắc khớp ĐẦU TIÊN:
>
> - Nếu cache là shared và có response directive `s-maxage` (Mục 5.2.2.10), dùng giá trị của nó, hoặc
> - Nếu có response directive `max-age` (Mục 5.2.2.1), dùng giá trị của nó, hoặc
> - Nếu có header field response `Expires` (Mục 5.3), dùng giá trị của nó trừ đi giá trị của header field `Date` (dùng thời điểm nhận được message nếu `Date` không có mặt, theo Mục 6.6.1 của [HTTP]), hoặc
> - Ngược lại, response không có thời điểm hết hạn tường minh nào. Một heuristic freshness lifetime có thể áp dụng được; xem Mục 4.2.2."

📖 **Nguyên văn** (RFC 9111 §4.2.1)
> "When there is more than one value present for a given directive (e.g., two Expires header field lines or multiple Cache-Control: max-age directives), either the first occurrence should be used or the response should be considered stale.  If directives conflict (e.g., both max-age and no-cache are present), the most restrictive directive should be honored.  Caches are encouraged to consider responses that have invalid freshness information (e.g., a max-age directive with non-integer content) to be stale."

🇻🇳 **Dịch**
> "Khi có nhiều hơn một giá trị cho cùng một directive (ví dụ hai dòng header `Expires` hoặc nhiều directive `Cache-Control: max-age`), hoặc là nên dùng lần xuất hiện đầu tiên, hoặc là nên coi response đó là stale. Nếu các directive mâu thuẫn nhau (ví dụ có cả `max-age` lẫn `no-cache`), nên tuân theo directive khắt khe nhất. Các cache được khuyến khích coi những response có thông tin freshness không hợp lệ (ví dụ directive `max-age` với nội dung không phải số nguyên) là stale."

### 3.3. Heuristic freshness (§4.2.2)

📖 **Nguyên văn** (RFC 9111 §4.2.2 "Calculating Heuristic Freshness")
> "Since origin servers do not always provide explicit expiration times, a cache MAY assign a heuristic expiration time when an explicit time is not specified, employing algorithms that use other field values (such as the Last-Modified time) to estimate a plausible expiration time.  This specification does not provide specific algorithms, but it does impose worst-case constraints on their results.
>
>    A cache MUST NOT use heuristics to determine freshness when an explicit expiration time is present in the stored response."

🇻🇳 **Dịch**
> "Vì origin server không phải lúc nào cũng cung cấp thời điểm hết hạn tường minh, cache CÓ THỂ gán một heuristic expiration time khi không có thời điểm tường minh nào được chỉ định, dùng các thuật toán dựa trên giá trị của những field khác (chẳng hạn thời điểm `Last-Modified`) để ước lượng một thời điểm hết hạn hợp lý. Đặc tả này không đưa ra thuật toán cụ thể, nhưng có áp các ràng buộc cho trường hợp xấu nhất lên kết quả của chúng.
>
> Cache KHÔNG ĐƯỢC dùng heuristic để xác định freshness khi trong response đã lưu có sẵn một thời điểm hết hạn tường minh."

📖 **Nguyên văn** (RFC 9111 §4.2.2)
> "If the response has a Last-Modified header field (Section 8.8.2 of [HTTP]), caches are encouraged to use a heuristic expiration value that is no more than some fraction of the interval since that time.  A typical setting of this fraction might be 10%."

🇻🇳 **Dịch**
> "Nếu response có header field `Last-Modified` (Mục 8.8.2 của [HTTP]), các cache được khuyến khích dùng một giá trị hết hạn heuristic không lớn hơn một phần nào đó của khoảng thời gian tính từ thời điểm đó. Một thiết lập điển hình cho phần này có thể là 10%."

📖 **Nguyên văn** (RFC 9111 §4.2.2, ghi chú)
> "|  *Note:* A previous version of the HTTP specification (Section 13.9 of [RFC2616]) prohibited caches from calculating heuristic freshness for URIs with query components (i.e., those containing "?").  In practice, this has not been widely implemented.  Therefore, origin servers are encouraged to send explicit directives (e.g., Cache-Control: no-cache) if they wish to prevent caching."

🇻🇳 **Dịch**
> "*Ghi chú:* Một phiên bản trước của đặc tả HTTP (Mục 13.9 của [RFC2616]) cấm cache tính heuristic freshness cho các URI có phần query (tức là chứa dấu "?"). Trên thực tế điều này không được cài đặt rộng rãi. Vì vậy, các origin server được khuyến khích gửi directive tường minh (ví dụ `Cache-Control: no-cache`) nếu muốn ngăn việc caching."

> [!warning] Hệ quả thực tế của heuristic freshness
> Nếu bạn trả một response `200 OK` mà **không** kèm `Cache-Control` lẫn `Expires`, cache **vẫn được phép** tự đoán một thời hạn và phục vụ lại bản cũ. "Không viết header" không hề đồng nghĩa với "không cache". Muốn không cache thì phải nói ra bằng directive.

### 3.4. `Age` và cách tính current_age (§4.2.3)

📖 **Nguyên văn** (RFC 9111 §5.1 "Age")
> "The "Age" response header field conveys the sender's estimate of the time since the response was generated or successfully validated at the origin server.  Age values are calculated as specified in Section 4.2.3.
>
>      Age = delta-seconds
>
>    The Age field value is a non-negative integer, representing time in seconds (see Section 1.2.2)."

🇻🇳 **Dịch**
> "Header field response "Age" truyền tải ước lượng của bên gửi về khoảng thời gian kể từ khi response được sinh ra hoặc được validate thành công tại origin server. Giá trị `Age` được tính như đặc tả ở Mục 4.2.3.
>
> `Age = delta-seconds`
>
> Giá trị của field `Age` là một số nguyên không âm, biểu diễn thời gian tính bằng giây (xem Mục 1.2.2)."

📖 **Nguyên văn** (RFC 9111 §5.1)
> "The presence of an Age header field implies that the response was not generated or validated by the origin server for this request.  However, lack of an Age header field does not imply the origin was contacted."

🇻🇳 **Dịch**
> "Sự hiện diện của header field `Age` hàm ý rằng response này không phải do origin server sinh ra hay validate cho request hiện tại. Tuy nhiên, việc thiếu header field `Age` KHÔNG hàm ý là origin đã được liên hệ."

📖 **Nguyên văn** (RFC 9111 §4.2.3 "Calculating Age" — công thức, giữ nguyên căn cột)
> ```
>      apparent_age = max(0, response_time - date_value);
>
>      response_delay = response_time - request_time;
>      corrected_age_value = age_value + response_delay;
> ```
>
> "The corrected_age_value MAY be used as the corrected_initial_age.  In circumstances where very old cache implementations that might not correctly insert Age are present, corrected_initial_age can be calculated more conservatively as
>
> ```
>      corrected_initial_age = max(apparent_age, corrected_age_value);
> ```
>
>    The current_age of a stored response can then be calculated by adding the time (in seconds) since the stored response was last validated by the origin server to the corrected_initial_age.
>
> ```
>      resident_time = now - response_time;
>      current_age = corrected_initial_age + resident_time;
> ```
> "

🇻🇳 **Dịch**
> "corrected_age_value CÓ THỂ được dùng làm corrected_initial_age. Trong hoàn cảnh có mặt những cài đặt cache rất cũ có thể không chèn `Age` đúng cách, corrected_initial_age có thể được tính thận trọng hơn bằng `corrected_initial_age = max(apparent_age, corrected_age_value);`
>
> current_age của một response đã lưu sau đó được tính bằng cách cộng khoảng thời gian (tính bằng giây) kể từ lần cuối response đó được origin server validate vào corrected_initial_age."
>
> Các biến trong công thức (§4.2.3): `age_value` = giá trị header `Age` (hoặc 0 nếu không có); `date_value` = giá trị header `Date`; `now` = đồng hồ hiện tại của cài đặt; `request_time` = giá trị đồng hồ tại thời điểm gửi request dẫn tới response đã lưu; `response_time` = giá trị đồng hồ tại thời điểm nhận response.

> [!tip] Debug cache bằng `Age`
> Khi gọi một endpoint qua CDN mà thấy response có `Age: 240`, nghĩa là bản bạn đang cầm đã nằm trong tầng cache 240 giây. So `Age` với `max-age`/`s-maxage` là cách nhanh nhất để biết còn bao lâu nữa cache mới đi hỏi origin.

### 3.5. Phục vụ response stale (§4.2.4)

📖 **Nguyên văn** (RFC 9111 §4.2.4 "Serving Stale Responses")
> "A cache MUST NOT generate a stale response if it is prohibited by an explicit in-protocol directive (e.g., by a no-cache response directive, a must-revalidate response directive, or an applicable s-maxage or proxy-revalidate response directive; see Section 5.2.2).
>
>    A cache MUST NOT generate a stale response unless it is disconnected or doing so is explicitly permitted by the client or origin server (e.g., by the max-stale request directive in Section 5.2.1, extension directives such as those defined in [RFC5861], or configuration in accordance with an out-of-band contract)."

🇻🇳 **Dịch**
> "Cache KHÔNG ĐƯỢC sinh ra một response stale nếu điều đó bị cấm bởi một directive tường minh trong protocol (ví dụ bởi response directive `no-cache`, response directive `must-revalidate`, hoặc response directive `s-maxage` / `proxy-revalidate` đang áp dụng; xem Mục 5.2.2).
>
> Cache KHÔNG ĐƯỢC sinh ra một response stale trừ khi nó đang mất kết nối, hoặc việc đó được client hay origin server cho phép rõ ràng (ví dụ bằng request directive `max-stale` ở Mục 5.2.1, các extension directive như những cái định nghĩa trong [RFC5861], hoặc cấu hình theo một thoả thuận ngoài protocol)."

---

## 4. Validation — conditional request và 304 (§4.3)

📖 **Nguyên văn** (RFC 9111 §4.3 "Validation")
> "When a cache has one or more stored responses for a requested URI, but cannot serve any of them (e.g., because they are not fresh, or one cannot be chosen; see Section 4.1), it can use the conditional request mechanism (Section 13 of [HTTP]) in the forwarded request to give the next inbound server an opportunity to choose a valid stored response to use, updating the stored metadata in the process, or to replace the stored response(s) with a new response.  This process is known as "validating" or "revalidating" the stored response."

🇻🇳 **Dịch**
> "Khi cache có một hoặc nhiều response đã lưu cho một URI được yêu cầu, nhưng không thể phục vụ cái nào trong số đó (ví dụ vì chúng không còn fresh, hoặc không chọn được cái nào; xem Mục 4.1), nó có thể dùng cơ chế conditional request (Mục 13 của [HTTP]) trong request được chuyển tiếp để cho server phía trong kế tiếp một cơ hội chọn ra một response đã lưu còn hợp lệ để dùng — đồng thời cập nhật metadata đã lưu trong quá trình đó — hoặc thay thế (các) response đã lưu bằng một response mới. Quá trình này gọi là "validating" hay "revalidating" response đã lưu."

📖 **Nguyên văn** (RFC 9110 §13 "Conditional Requests")
> "A conditional request is an HTTP request with one or more request header fields that indicate a precondition to be tested before applying the request method to the target resource. ... Conditional GET requests are the most efficient mechanism for HTTP cache updates [CACHING].  Conditionals can also be applied to state-changing methods, such as PUT and DELETE, to prevent the "lost update" problem: one client accidentally overwriting the work of another client that has been acting in parallel."

🇻🇳 **Dịch**
> "Một conditional request là một HTTP request có một hoặc nhiều header field request chỉ ra một precondition cần được kiểm tra trước khi áp dụng method của request lên target resource. ... Conditional GET request là cơ chế hiệu quả nhất để cập nhật HTTP cache [CACHING]. Conditional cũng có thể áp dụng cho các method làm thay đổi trạng thái như PUT và DELETE, để ngăn vấn đề "lost update": một client vô tình ghi đè lên công việc của một client khác đang làm song song."

### 4.1. Hai loại validator: `Last-Modified` và `ETag`

📖 **Nguyên văn** (RFC 9111 §4.3.1 "Sending a Validation Request")
> "One such validator is the timestamp given in a Last-Modified header field (Section 8.8.2 of [HTTP]), which can be used in an If-Modified-Since header field for response validation, or in an If-Unmodified-Since or If-Range header field for representation selection ...
>
>    Another validator is the entity tag given in an ETag field (Section 8.8.3 of [HTTP]).  One or more entity tags, indicating one or more stored responses, can be used in an If-None-Match header field for response validation, or in an If-Match or If-Range header field for representation selection ..."

🇻🇳 **Dịch**
> "Một validator như vậy là dấu thời gian cho trong header field `Last-Modified` (Mục 8.8.2 của [HTTP]), có thể dùng trong header field `If-Modified-Since` để validate response, hoặc trong `If-Unmodified-Since` / `If-Range` để chọn representation ...
>
> Một validator khác là entity tag cho trong field `ETag` (Mục 8.8.3 của [HTTP]). Một hoặc nhiều entity tag, chỉ tới một hoặc nhiều response đã lưu, có thể dùng trong header field `If-None-Match` để validate response, hoặc trong `If-Match` / `If-Range` để chọn representation ..."

📖 **Nguyên văn** (RFC 9111 §4.3.1 — quy tắc sinh conditional request)
> "When generating a conditional request for validation, a cache:
>
>    *  MUST send the relevant entity tags (using If-Match, If-None-Match, or If-Range) if the entity tags were provided in the stored response(s) being validated.
>
>    *  SHOULD send the Last-Modified value (using If-Modified-Since) if the request is not for a subrange, a single stored response is being validated, and that response contains a Last-Modified value.
>
>    *  MAY send the Last-Modified value (using If-Unmodified-Since or If-Range) if the request is for a subrange, a single stored response is being validated, and that response contains only a Last-Modified value (not an entity tag)."

🇻🇳 **Dịch**
> "Khi sinh một conditional request để validate, cache:
>
> - PHẢI gửi các entity tag liên quan (dùng `If-Match`, `If-None-Match`, hoặc `If-Range`) nếu các entity tag đó có trong (các) response đã lưu đang được validate.
> - NÊN gửi giá trị `Last-Modified` (dùng `If-Modified-Since`) nếu request không nhắm tới một subrange, chỉ có một response đã lưu đang được validate, và response đó chứa giá trị `Last-Modified`.
> - CÓ THỂ gửi giá trị `Last-Modified` (dùng `If-Unmodified-Since` hoặc `If-Range`) nếu request nhắm tới một subrange, chỉ có một response đã lưu đang được validate, và response đó chỉ chứa `Last-Modified` (không có entity tag)."

📖 **Nguyên văn** (RFC 9110 §8.8.2 "Last-Modified")
> "The "Last-Modified" header field in a response provides a timestamp indicating the date and time at which the origin server believes the selected representation was last modified, as determined at the conclusion of handling the request.
>
>      Last-Modified = HTTP-date
>
>    An example of its use is
>
>    Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT"

🇻🇳 **Dịch**
> "Header field "Last-Modified" trong một response cung cấp một dấu thời gian cho biết ngày giờ mà origin server tin rằng selected representation được sửa đổi lần cuối, xác định tại thời điểm kết thúc xử lý request."
>
> Cú pháp là một HTTP-date, ví dụ: `Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT`.

📖 **Nguyên văn** (RFC 9110 §8.8.3 "ETag")
> "The "ETag" field in a response provides the current entity tag for the selected representation, as determined at the conclusion of handling the request.  An entity tag is an opaque validator for differentiating between multiple representations of the same resource, regardless of whether those multiple representations are due to resource state changes over time, content negotiation resulting in multiple representations being valid at the same time, or both.  An entity tag consists of an opaque quoted string, possibly prefixed by a weakness indicator."
>
> ```
>      ETag       = entity-tag
>
>      entity-tag = [ weak ] opaque-tag
>      weak       = %s"W/"
>      opaque-tag = DQUOTE *etagc DQUOTE
>      etagc      = %x21 / %x23-7E / obs-text
>                 ; VCHAR except double quotes, plus obs-text
> ```
>
> "Examples:
>
>    ETag: "xyzzy"
>    ETag: W/"xyzzy"
>    ETag: """

🇻🇳 **Dịch**
> "Field "ETag" trong một response cung cấp entity tag hiện tại của selected representation, xác định tại thời điểm kết thúc xử lý request. Một entity tag là một validator dạng opaque (đục — client không được suy diễn ý nghĩa bên trong) dùng để phân biệt giữa nhiều representation của cùng một resource, bất kể nhiều representation đó là do trạng thái resource thay đổi theo thời gian, do content negotiation khiến nhiều representation cùng hợp lệ một lúc, hay cả hai. Một entity tag gồm một quoted string opaque, có thể được thêm tiền tố là một chỉ báo weakness."
>
> ABNF ở trên nói: `ETag` = tuỳ chọn tiền tố `W/` + một chuỗi trong dấu nháy kép. Ví dụ hợp lệ: `ETag: "xyzzy"` (strong), `ETag: W/"xyzzy"` (weak), `ETag: ""` (chuỗi rỗng cũng hợp lệ).

### 4.2. Strong validator vs weak validator

📖 **Nguyên văn** (RFC 9110 §8.8.1 "Weak versus Strong")
> "Validators come in two flavors: strong or weak.  Weak validators are easy to generate but are far less useful for comparisons.  Strong validators are ideal for comparisons but can be very difficult (and occasionally impossible) to generate efficiently. ...
>
>    A "strong validator" is representation metadata that changes value whenever a change occurs to the representation data that would be observable in the content of a 200 (OK) response to GET."

🇻🇳 **Dịch**
> "Validator có hai loại: strong hoặc weak. Weak validator dễ sinh ra nhưng kém hữu dụng hơn nhiều khi so sánh. Strong validator lý tưởng cho việc so sánh nhưng có thể rất khó (và đôi khi bất khả thi) để sinh ra một cách hiệu quả. ...
>
> Một "strong validator" là metadata của representation, có giá trị thay đổi mỗi khi xảy ra bất kỳ thay đổi nào trong dữ liệu của representation mà thay đổi đó quan sát được trong nội dung của một response 200 (OK) cho GET."

📖 **Nguyên văn** (RFC 9110 §8.8.1)
> "In contrast, a "weak validator" is representation metadata that might not change for every change to the representation data.  This weakness might be due to limitations in how the value is calculated (e.g., clock resolution), an inability to ensure uniqueness for all possible representations of the resource, or a desire of the resource owner to group representations by some self-determined set of equivalency rather than unique sequences of data."

🇻🇳 **Dịch**
> "Ngược lại, một "weak validator" là metadata của representation mà có thể KHÔNG đổi ứng với mọi thay đổi của dữ liệu representation. Sự "yếu" này có thể do giới hạn trong cách tính giá trị (ví dụ độ phân giải của đồng hồ), do không đảm bảo được tính duy nhất cho mọi representation khả dĩ của resource, hoặc do chủ resource muốn gom các representation theo một tập tương đương do họ tự định nghĩa thay vì theo chuỗi dữ liệu duy nhất."

📖 **Nguyên văn** (RFC 9110 §8.8.1)
> "Strong validators are usable for all conditional requests, including cache validation, partial content ranges, and "lost update" avoidance.  Weak validators are only usable when the client does not require exact equality with previously obtained representation data, such as when validating a cache entry or limiting a web traversal to recent changes."

🇻🇳 **Dịch**
> "Strong validator dùng được cho mọi conditional request, bao gồm cache validation, partial content range, và tránh "lost update". Weak validator chỉ dùng được khi client không đòi hỏi sự bằng nhau chính xác với dữ liệu representation đã lấy trước đó — chẳng hạn khi validate một cache entry hoặc giới hạn phạm vi duyệt web ở những thay đổi gần đây."

📖 **Nguyên văn** (RFC 9110 §8.8.3)
> "An entity tag can be either a weak or strong validator, with strong being the default.  If an origin server provides an entity tag for a representation and the generation of that entity tag does not satisfy all of the characteristics of a strong validator (Section 8.8.1), then the origin server MUST mark the entity tag as weak by prefixing its opaque value with "W/" (case-sensitive)."

🇻🇳 **Dịch**
> "Một entity tag có thể là weak hoặc strong validator, mặc định là strong. Nếu origin server cung cấp một entity tag cho một representation mà cách sinh ra entity tag đó không thoả mãn đầy đủ các đặc trưng của một strong validator (Mục 8.8.1), thì origin server PHẢI đánh dấu entity tag đó là weak bằng cách thêm tiền tố "W/" (phân biệt hoa thường) vào trước giá trị opaque của nó."

> [!warning] Gzip và weak ETag
> RFC 9110 §8.8.1 nêu thẳng: *"if the origin server sends the same validator for a representation with a gzip content coding applied as it does for a representation with no content coding, then that validator is weak."* (🇻🇳 "nếu origin server gửi cùng một validator cho representation đã áp gzip content coding và cho representation không áp content coding nào, thì validator đó là weak"). Đây là lý do nhiều reverse proxy tự động đổi `ETag: "abc"` thành `W/"abc"` khi bật nén — hành vi đúng chuẩn, không phải bug.

### 4.3. `If-None-Match` và `If-Modified-Since`

📖 **Nguyên văn** (RFC 9110 §13.1.2 "If-None-Match")
> "The "If-None-Match" header field makes the request method conditional on a recipient cache or origin server either not having any current representation of the target resource, when the field value is "*", or having a selected representation with an entity tag that does not match any of those listed in the field value.
>
>    A recipient MUST use the weak comparison function when comparing entity tags for If-None-Match (Section 8.8.3.2), since weak entity tags can be used for cache validation even if there have been changes to the representation data."

🇻🇳 **Dịch**
> "Header field "If-None-Match" khiến method của request trở thành có điều kiện: điều kiện là cache nhận hoặc origin server hoặc là KHÔNG có representation hiện tại nào của target resource (khi giá trị field là "*"), hoặc là có một selected representation với entity tag KHÔNG khớp với bất kỳ tag nào liệt kê trong giá trị field.
>
> Bên nhận PHẢI dùng hàm so sánh weak khi so entity tag cho `If-None-Match` (Mục 8.8.3.2), vì weak entity tag vẫn dùng được cho cache validation ngay cả khi dữ liệu representation đã có thay đổi."

📖 **Nguyên văn** (RFC 9110 §13.1.2)
> "If-None-Match is primarily used in conditional GET requests to enable efficient updates of cached information with a minimum amount of transaction overhead.  When a client desires to update one or more stored responses that have entity tags, the client SHOULD generate an If-None-Match header field containing a list of those entity tags when making a GET request; this allows recipient servers to send a 304 (Not Modified) response to indicate when one of those stored responses matches the selected representation."

🇻🇳 **Dịch**
> "`If-None-Match` chủ yếu được dùng trong conditional GET request để cập nhật thông tin đã cache một cách hiệu quả với chi phí giao dịch tối thiểu. Khi client muốn cập nhật một hay nhiều response đã lưu có entity tag, client NÊN sinh một header field `If-None-Match` chứa danh sách các entity tag đó khi gửi GET request; điều này cho phép server nhận gửi về response 304 (Not Modified) để báo rằng một trong các response đã lưu đó khớp với selected representation."

📖 **Nguyên văn** (RFC 9110 §13.1.3 "If-Modified-Since")
> "The "If-Modified-Since" header field makes a GET or HEAD request method conditional on the selected representation's modification date being more recent than the date provided in the field value.  Transfer of the selected representation's data is avoided if that data has not changed.
>
>      If-Modified-Since = HTTP-date
>
>    An example of the field is:
>
>    If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
>
>    A recipient MUST ignore If-Modified-Since if the request contains an If-None-Match header field; the condition in If-None-Match is considered to be a more accurate replacement for the condition in If-Modified-Since, and the two are only combined for the sake of interoperating with older intermediaries that might not implement If-None-Match."

🇻🇳 **Dịch**
> "Header field "If-Modified-Since" khiến method GET hoặc HEAD trở thành có điều kiện: điều kiện là ngày sửa đổi của selected representation mới hơn ngày cho trong giá trị field. Việc truyền dữ liệu của selected representation sẽ được tránh nếu dữ liệu đó chưa thay đổi.
>
> Cú pháp là HTTP-date, ví dụ `If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT`.
>
> Bên nhận PHẢI bỏ qua `If-Modified-Since` nếu request có chứa header field `If-None-Match`; điều kiện trong `If-None-Match` được coi là bản thay thế chính xác hơn cho điều kiện trong `If-Modified-Since`, và hai cái chỉ được gửi kèm nhau vì mục đích tương thích với các intermediary cũ có thể chưa cài đặt `If-None-Match`."

### 4.4. `304 Not Modified`

📖 **Nguyên văn** (RFC 9110 §15.4.5 "304 Not Modified")
> "The 304 (Not Modified) status code indicates that a conditional GET or HEAD request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition evaluated to false.  In other words, there is no need for the server to transfer a representation of the target resource because the request indicates that the client, which made the request conditional, already has a valid representation; the server is therefore redirecting the client to make use of that stored representation as if it were the content of a 200 (OK) response.
>
>    The server generating a 304 response MUST generate any of the following header fields that would have been sent in a 200 (OK) response to the same request:
>
>    *  Content-Location, Date, ETag, and Vary
>
>    *  Cache-Control and Expires (see [CACHING])
>
> ...  A 304 response is terminated by the end of the header section; it cannot contain content or trailers."

🇻🇳 **Dịch**
> "Status code 304 (Not Modified) cho biết server đã nhận một conditional GET hoặc HEAD request, và request đó lẽ ra đã cho ra response 200 (OK) nếu không phải vì điều kiện được đánh giá là sai. Nói cách khác, server không cần truyền representation của target resource vì request cho thấy client — bên đã đặt điều kiện cho request — đã có sẵn một representation hợp lệ rồi; do đó server đang chuyển hướng client sang dùng chính representation đã lưu ấy như thể nó là nội dung của một response 200 (OK).
>
> Server sinh response 304 PHẢI sinh bất kỳ header field nào trong các field sau mà lẽ ra sẽ được gửi trong response 200 (OK) cho cùng request đó:
> - `Content-Location`, `Date`, `ETag`, và `Vary`
> - `Cache-Control` và `Expires` (xem [CACHING])
>
> ... Một response 304 kết thúc ngay khi hết phần header; nó không thể chứa content hay trailer."

📖 **Nguyên văn** (RFC 9111 §4.3.3 "Handling a Validation Response")
> "Cache handling of a response to a conditional request depends upon its status code:
>
>    *  A 304 (Not Modified) response status code indicates that the stored response can be updated and reused; see Section 4.3.4.
>
>    *  A full response (i.e., one containing content) indicates that none of the stored responses nominated in the conditional request are suitable.  Instead, the cache MUST use the full response to satisfy the request.  The cache MAY store such a full response, subject to its constraints (see Section 3).
>
>    *  However, if a cache receives a 5xx (Server Error) response while attempting to validate a response, it can either forward this response to the requesting client or act as if the server failed to respond.  In the latter case, the cache can send a previously stored response, subject to its constraints on doing so (see Section 4.2.4), or retry the validation request."

🇻🇳 **Dịch**
> "Cách cache xử lý response của một conditional request phụ thuộc vào status code của nó:
>
> - Status code 304 (Not Modified) cho biết response đã lưu có thể được cập nhật và tái sử dụng; xem Mục 4.3.4.
> - Một response đầy đủ (tức là có chứa content) cho biết không response đã lưu nào được nêu trong conditional request là phù hợp. Thay vào đó, cache PHẢI dùng response đầy đủ này để đáp ứng request. Cache CÓ THỂ lưu response đầy đủ đó, tuỳ theo các ràng buộc của nó (xem Mục 3).
> - Tuy nhiên, nếu cache nhận được response 5xx (Server Error) khi đang cố validate một response, nó có thể hoặc chuyển tiếp response này cho client đang yêu cầu, hoặc hành xử như thể server không phản hồi. Trong trường hợp sau, cache có thể gửi một response đã lưu trước đó, tuỳ theo các ràng buộc cho việc đó (xem Mục 4.2.4), hoặc thử lại request validation."

📖 **Nguyên văn** (RFC 9111 §4.3.4 "Freshening Stored Responses upon Validation")
> "For each stored response identified, the cache MUST update its header fields with the header fields provided in the 304 (Not Modified) response, as per Section 3.2."

🇻🇳 **Dịch**
> "Với mỗi response đã lưu được xác định, cache PHẢI cập nhật các header field của nó bằng các header field cung cấp trong response 304 (Not Modified), theo Mục 3.2."

> [!note] Vì sao 304 lại "làm tươi" được response cũ
> 304 mang theo `Cache-Control`/`Expires` mới. Cache lấy các header đó ghi đè lên bản đã lưu → `freshness_lifetime` được tính lại từ đầu, `current_age` về 0. Bản body cũ trong ổ đĩa được "gia hạn" mà không phải tải lại một byte nào. Chi tiết status code xem [[04 - HTTP Status Code và thiết kế lỗi]].

---

## 5. `Cache-Control` — trung tâm của bài

📖 **Nguyên văn** (RFC 9111 §5.2 "Cache-Control")
> "The "Cache-Control" header field is used to list directives for caches along the request/response chain.  Cache directives are unidirectional, in that the presence of a directive in a request does not imply that the same directive is present or copied in the response. ...
>
>    A proxy, whether or not it implements a cache, MUST pass cache directives through in forwarded messages, regardless of their significance to that application, since the directives might apply to all recipients along the request/response chain.  It is not possible to target a directive to a specific cache."
>
> ```
>      Cache-Control   = #cache-directive
>
>      cache-directive = token [ "=" ( token / quoted-string ) ]
> ```

🇻🇳 **Dịch**
> "Header field "Cache-Control" dùng để liệt kê các directive dành cho các cache dọc theo chuỗi request/response. Cache directive là một chiều: sự hiện diện của một directive trong request KHÔNG hàm ý directive đó cũng có mặt hay được sao chép sang response. ...
>
> Một proxy, dù có cài đặt cache hay không, PHẢI chuyển tiếp nguyên vẹn các cache directive trong message mà nó forward, bất kể chúng có ý nghĩa gì với ứng dụng đó hay không, vì directive có thể áp dụng cho mọi bên nhận dọc theo chuỗi request/response. KHÔNG thể nhắm một directive tới một cache cụ thể."
>
> Cú pháp: `Cache-Control` là một danh sách phân tách bằng dấu phẩy của các `cache-directive`; mỗi directive là một token, tuỳ chọn kèm `= giá trị`.

### 5.1. Request directives (§5.2.1)

📖 **Nguyên văn** (RFC 9111 §5.2.1)
> "This section defines cache request directives.  They are advisory; caches MAY implement them, but are not required to."

🇻🇳 **Dịch**
> "Mục này định nghĩa các cache request directive. Chúng mang tính khuyến nghị; cache CÓ THỂ cài đặt chúng, nhưng không bắt buộc."

| Directive | Nguyên văn rút gọn (RFC 9111 §5.2.1) | Dịch | Khi nào dùng |
|---|---|---|---|
| `max-age=Δ` | "indicates that the client prefers a response whose age is less than or equal to the specified number of seconds. Unless the max-stale request directive is also present, the client does not wish to receive a stale response." | client muốn response có age ≤ số giây chỉ định; trừ khi có kèm `max-stale`, client không muốn nhận response stale | Client tự giới hạn độ "cũ" của dữ liệu chấp nhận được |
| `max-stale[=Δ]` | "indicates that the client will accept a response that has exceeded its freshness lifetime. If a value is present, then the client is willing to accept a response that has exceeded its freshness lifetime by no more than the specified number of seconds. If no value is assigned to max-stale, then the client will accept a stale response of any age." | client chấp nhận response đã quá freshness lifetime; có giá trị thì quá không quá số giây đó, không giá trị thì chấp nhận stale bao lâu cũng được | Client ưu tiên tốc độ hơn độ mới; job chạy nền chịu được dữ liệu cũ |
| `min-fresh=Δ` | "indicates that the client prefers a response whose freshness lifetime is no less than its current age plus the specified time in seconds. That is, the client wants a response that will still be fresh for at least the specified number of seconds." | client muốn response còn fresh thêm ít nhất số giây đó nữa | Client biết mình sẽ còn dùng dữ liệu này thêm N giây nữa |
| `no-cache` | "indicates that the client prefers a stored response not be used to satisfy the request without successful validation on the origin server." | client muốn response đã lưu KHÔNG được dùng để đáp ứng request nếu chưa validate thành công với origin server | Nút "Reload" của trình duyệt; ép revalidate |
| `no-store` | "indicates that a cache MUST NOT store any part of either this request or any response to it. This directive applies to both private and shared caches." | cache KHÔNG ĐƯỢC lưu bất kỳ phần nào của request này lẫn response của nó; áp dụng cho cả private và shared cache | Request mang dữ liệu nhạy cảm không muốn nằm lại ở bất kỳ tầng nào |
| `no-transform` | "indicates that the client is asking for intermediaries to avoid transforming the content, as defined in Section 7.7 of [HTTP]." | client yêu cầu các intermediary tránh biến đổi content | Ảnh/video không muốn bị proxy nén lại hay đổi định dạng |
| `only-if-cached` | "indicates that the client only wishes to obtain a stored response. Caches that honor this request directive SHOULD, upon receiving it, respond with either a stored response consistent with the other constraints of the request or a 504 (Gateway Timeout) status code." | client chỉ muốn lấy response đã lưu; cache tuân thủ NÊN trả về hoặc response đã lưu phù hợp, hoặc status 504 | Chế độ offline: chấp nhận thất bại chứ không đi mạng |

📖 **Nguyên văn** (RFC 9111 §5.2.1.5 — chi tiết `no-store` phía request)
> ""MUST NOT store" in this context means that the cache MUST NOT intentionally store the information in non-volatile storage and MUST make a best-effort attempt to remove the information from volatile storage as promptly as possible after forwarding it. ... Note that if a request containing this directive is satisfied from a cache, the no-store request directive does not apply to the already stored response."

🇻🇳 **Dịch**
> ""KHÔNG ĐƯỢC lưu" trong ngữ cảnh này nghĩa là cache KHÔNG ĐƯỢC cố ý lưu thông tin vào bộ nhớ không bay hơi (non-volatile), và PHẢI nỗ lực hết sức để xoá thông tin khỏi bộ nhớ bay hơi (volatile) càng sớm càng tốt sau khi forward nó. ... Lưu ý rằng nếu một request chứa directive này được đáp ứng từ cache, thì request directive `no-store` KHÔNG áp dụng cho response vốn đã được lưu sẵn."

### 5.2. Response directives (§5.2.2)

📖 **Nguyên văn** (RFC 9111 §5.2.2)
> "This section defines cache response directives.  A cache MUST obey the Cache-Control directives defined in this section."

🇻🇳 **Dịch**
> "Mục này định nghĩa các cache response directive. Một cache PHẢI tuân theo các directive `Cache-Control` được định nghĩa trong mục này."

> [!note] Khác biệt quan trọng
> Request directive là **advisory** (khuyến nghị, cache MAY cài đặt). Response directive là **bắt buộc** (cache MUST obey). Header server gửi ra có sức nặng hơn hẳn header client gửi vào.

| Directive | Nguyên văn rút gọn (RFC 9111 §5.2.2) | Dịch | Khi nào dùng |
|---|---|---|---|
| `max-age=Δ` | "indicates that the response is to be considered stale after its age is greater than the specified number of seconds." | response bị coi là stale khi age của nó vượt quá số giây chỉ định | Directive nền tảng để đặt thời hạn fresh |
| `must-revalidate` | "indicates that once the response has become stale, a cache MUST NOT reuse that response to satisfy another request until it has been successfully validated by the origin" | khi response đã stale, cache KHÔNG ĐƯỢC tái sử dụng nó cho request khác cho tới khi validate thành công với origin | Dữ liệu mà phục vụ bản cũ sẽ gây sai nghiệp vụ |
| `must-understand` | "limits caching of the response to a cache that understands and conforms to the requirements for that response's status code." | giới hạn việc cache response chỉ cho những cache hiểu và tuân thủ yêu cầu ứng với status code của response đó | Dùng kèm status code mới/ít phổ biến |
| `no-cache` | "in its unqualified form (without an argument), indicates that the response MUST NOT be used to satisfy any other request without forwarding it for validation and receiving a successful response" | dạng không tham số: response KHÔNG ĐƯỢC dùng để đáp ứng request nào khác nếu chưa forward đi validate và nhận được phản hồi thành công | Được LƯU, nhưng mỗi lần dùng phải hỏi lại origin |
| `no-store` | "indicates that a cache MUST NOT store any part of either the immediate request or the response and MUST NOT use the response to satisfy any other request." | cache KHÔNG ĐƯỢC lưu bất kỳ phần nào của request lẫn response, và KHÔNG ĐƯỢC dùng response đó cho bất kỳ request nào khác | Dữ liệu tuyệt đối không được nằm lại ở đâu |
| `no-transform` | "indicates that an intermediary (regardless of whether it implements a cache) MUST NOT transform the content, as defined in Section 7.7 of [HTTP]." | intermediary (dù có cache hay không) KHÔNG ĐƯỢC biến đổi content | Giữ nguyên byte gốc: ảnh chất lượng cao, file ký số |
| `private` | "The unqualified private response directive indicates that a shared cache MUST NOT store the response (i.e., the response is intended for a single user). It also indicates that a private cache MAY store the response" | shared cache KHÔNG ĐƯỢC lưu response (response dành cho một người dùng duy nhất); private cache thì CÓ THỂ lưu | Nội dung cá nhân hoá: trang tài khoản, giỏ hàng |
| `proxy-revalidate` | "indicates that once the response has become stale, a shared cache MUST NOT reuse that response to satisfy another request until it has been successfully validated by the origin ... except that proxy-revalidate does not apply to private caches." | như `must-revalidate` nhưng chỉ áp cho shared cache, không áp cho private cache | Chặt với CDN/proxy, thoáng với browser cache |
| `public` | "indicates that a cache MAY store the response even if it would otherwise be prohibited ... In other words, public explicitly marks the response as cacheable." | cache CÓ THỂ lưu response ngay cả khi lẽ ra bị cấm; nói cách khác `public` đánh dấu tường minh rằng response cache được | Muốn shared cache lưu response của một request có `Authorization` |
| `s-maxage=Δ` | "indicates that, for a shared cache, the maximum age specified by this directive overrides the maximum age specified by either the max-age directive or the Expires header field." | với shared cache, giá trị max age của directive này ĐÈ lên giá trị của `max-age` hoặc header `Expires` | Đặt TTL khác nhau cho CDN và cho browser |

Một số điểm cần trích đầy đủ hơn:

📖 **Nguyên văn** (RFC 9111 §5.2.2.2 `must-revalidate`)
> "The must-revalidate directive is necessary to support reliable operation for certain protocol features.  In all circumstances, a cache MUST NOT ignore the must-revalidate directive; in particular, if a cache is disconnected, the cache MUST generate an error response rather than reuse the stale response.  The generated status code SHOULD be 504 (Gateway Timeout) unless another error status code is more applicable.
>
>    The must-revalidate directive ought to be used by servers if and only if failure to validate a request could cause incorrect operation, such as a silently unexecuted financial transaction."

🇻🇳 **Dịch**
> "Directive `must-revalidate` là cần thiết để hỗ trợ vận hành tin cậy cho một số tính năng của protocol. Trong mọi hoàn cảnh, cache KHÔNG ĐƯỢC bỏ qua directive `must-revalidate`; đặc biệt, nếu cache đang mất kết nối, cache PHẢI sinh ra một response lỗi thay vì tái sử dụng response stale. Status code sinh ra NÊN là 504 (Gateway Timeout) trừ khi có status code lỗi khác phù hợp hơn.
>
> Server chỉ nên dùng directive `must-revalidate` khi và chỉ khi việc không validate được một request có thể gây ra hành vi sai — chẳng hạn một giao dịch tài chính âm thầm không được thực thi."

📖 **Nguyên văn** (RFC 9111 §5.2.2.4 `no-cache`, dạng có tham số)
> "The qualified form of the no-cache response directive, with an argument that lists one or more field names, indicates that a cache MAY use the response to satisfy a subsequent request, subject to any other restrictions on caching, if the listed header fields are excluded from the subsequent response or the subsequent response has been successfully revalidated with the origin server (updating or removing those fields).  This allows an origin server to prevent the reuse of certain header fields in a response, while still allowing caching of the rest of the response."
>
> "|  *Note:* The qualified form of the directive is often handled by caches as if an unqualified no-cache directive was received; that is, the special handling for the qualified form is not widely implemented."

🇻🇳 **Dịch**
> "Dạng có tham số của response directive `no-cache`, với đối số liệt kê một hoặc nhiều tên field, cho biết cache CÓ THỂ dùng response đó để đáp ứng một request sau — tuỳ theo các hạn chế caching khác — nếu các header field được liệt kê bị loại khỏi response sau đó, hoặc response sau đó đã được revalidate thành công với origin server (cập nhật hoặc gỡ bỏ các field ấy). Điều này cho phép origin server ngăn việc tái sử dụng một số header field nhất định trong response, trong khi vẫn cho phép cache phần còn lại của response."
>
> "*Ghi chú:* Dạng có tham số của directive này thường bị các cache xử lý như thể nhận được `no-cache` không tham số; tức là cách xử lý đặc biệt cho dạng có tham số không được cài đặt rộng rãi."

📖 **Nguyên văn** (RFC 9111 §5.2.2.7 `private`, ghi chú)
> "|  *Note:* This usage of the word "private" only controls where the response can be stored; it cannot ensure the privacy of the message content.  Also, the qualified form of the directive is often handled by caches as if an unqualified private directive was received; that is, the special handling for the qualified form is not widely implemented."

🇻🇳 **Dịch**
> "*Ghi chú:* Cách dùng từ "private" ở đây chỉ điều khiển việc response được lưu Ở ĐÂU; nó KHÔNG đảm bảo tính riêng tư của nội dung message. Ngoài ra, dạng có tham số của directive này thường bị các cache xử lý như thể nhận được `private` không tham số; tức là cách xử lý đặc biệt cho dạng có tham số không được cài đặt rộng rãi."

📖 **Nguyên văn** (RFC 9111 §5.2.2.9 `public`)
> "Note that it is unnecessary to add the public directive to a response that is already cacheable according to Section 3.
>
>    If a response with the public directive has no explicit freshness information, it is heuristically cacheable (Section 4.2.2)."

🇻🇳 **Dịch**
> "Lưu ý rằng không cần thiết phải thêm directive `public` vào một response vốn đã cache được theo Mục 3.
>
> Nếu một response có directive `public` mà không có thông tin freshness tường minh, nó là heuristically cacheable (Mục 4.2.2)."

📖 **Nguyên văn** (RFC 9111 §5.2.2.10 `s-maxage`)
> "The s-maxage directive incorporates the semantics of the proxy-revalidate response directive (Section 5.2.2.8) for a shared cache.  A shared cache MUST NOT reuse a stale response with s-maxage to satisfy another request until it has been successfully validated by the origin, as defined by Section 4.3.  This directive also permits a shared cache to reuse a response to a request containing an Authorization header field, subject to the above requirements on maximum age and revalidation (Section 3.5)."

🇻🇳 **Dịch**
> "Directive `s-maxage` bao hàm luôn ngữ nghĩa của response directive `proxy-revalidate` (Mục 5.2.2.8) đối với shared cache. Một shared cache KHÔNG ĐƯỢC tái sử dụng một response stale có `s-maxage` để đáp ứng request khác cho tới khi nó được validate thành công với origin, như định nghĩa ở Mục 4.3. Directive này cũng cho phép shared cache tái sử dụng response của một request có chứa header field `Authorization`, tuân theo các yêu cầu về maximum age và revalidation nêu trên (Mục 3.5)."

### 5.3. ⚠️ `no-cache` vs `no-store` — chỗ nhầm kinh điển nhất

> [!warning] `no-cache` KHÔNG có nghĩa là "không lưu"
> Đây là hiểu lầm phổ biến nhất về HTTP caching. Đọc kỹ hai định nghĩa nguyên văn dưới đây và so từng chữ.
>
> 📖 **Nguyên văn** (RFC 9111 §5.2.2.4 `no-cache`)
> > "The no-cache response directive, in its unqualified form (without an argument), indicates that the response MUST NOT be used to satisfy any other request without forwarding it for validation and receiving a successful response; see Section 4.3.
> >
> >    This allows an origin server to prevent a cache from using the response to satisfy a request without contacting it, even by caches that have been configured to send stale responses."
>
> 🇻🇳 **Dịch**
> > "Response directive `no-cache`, ở dạng không tham số (không có đối số), cho biết response KHÔNG ĐƯỢC dùng để đáp ứng bất kỳ request nào khác nếu chưa forward nó đi validate và nhận được phản hồi thành công; xem Mục 4.3.
> >
> > Điều này cho phép origin server ngăn cache dùng response để đáp ứng một request mà không liên hệ với nó, kể cả với các cache đã được cấu hình để gửi response stale."
>
> 📖 **Nguyên văn** (RFC 9111 §5.2.2.5 `no-store`)
> > "The no-store response directive indicates that a cache MUST NOT store any part of either the immediate request or the response and MUST NOT use the response to satisfy any other request.
> >
> >    This directive applies to both private and shared caches.  "MUST NOT store" in this context means that the cache MUST NOT intentionally store the information in non-volatile storage and MUST make a best-effort attempt to remove the information from volatile storage as promptly as possible after forwarding it."
>
> 🇻🇳 **Dịch**
> > "Response directive `no-store` cho biết cache KHÔNG ĐƯỢC lưu bất kỳ phần nào của request trực tiếp lẫn response, và KHÔNG ĐƯỢC dùng response đó để đáp ứng bất kỳ request nào khác.
> >
> > Directive này áp dụng cho cả private cache lẫn shared cache. "KHÔNG ĐƯỢC lưu" trong ngữ cảnh này nghĩa là cache KHÔNG ĐƯỢC cố ý lưu thông tin vào bộ nhớ non-volatile, và PHẢI nỗ lực hết sức để xoá thông tin khỏi bộ nhớ volatile càng sớm càng tốt sau khi forward nó."

Chốt lại khác biệt:

| | `no-cache` | `no-store` |
|---|---|---|
| Cache có được **lưu** response không? | **CÓ** — vẫn lưu bình thường | **KHÔNG** — cấm lưu mọi phần |
| Trước khi dùng bản đã lưu? | Phải validate với origin (thường ra `304`) | Không có bản nào để dùng |
| Tiết kiệm băng thông? | Có — `304` không kèm body | Không — mỗi request tải lại toàn bộ |
| Mục đích | Luôn đúng bản mới nhất, nhưng vẫn tận dụng được bản cũ | Không để dữ liệu tồn tại ở tầng trung gian |

📖 **Nguyên văn** (RFC 9111 §5.2.2.5)
> "This directive is not a reliable or sufficient mechanism for ensuring privacy.  In particular, malicious or compromised caches might not recognize or obey this directive, and communications networks might be vulnerable to eavesdropping."

🇻🇳 **Dịch**
> "Directive này KHÔNG phải là cơ chế đáng tin cậy hay đủ để đảm bảo tính riêng tư. Cụ thể, các cache độc hại hoặc đã bị xâm nhập có thể không nhận ra hoặc không tuân theo directive này, và mạng truyền thông có thể bị nghe lén."

📖 **Nguyên văn** (RFC 9111 §5.2.2.5)
> "Note that the must-understand cache directive overrides no-store in certain circumstances; see Section 5.2.2.3."

🇻🇳 **Dịch**
> "Lưu ý rằng cache directive `must-understand` ghi đè `no-store` trong một số hoàn cảnh nhất định; xem Mục 5.2.2.3."

📖 **Nguyên văn** (RFC 9111 §5.2.2.3 `must-understand`)
> "A response that contains the must-understand directive SHOULD also contain the no-store directive.  When a cache that implements the must-understand directive receives a response that includes it, the cache SHOULD ignore the no-store directive if it understands and implements the status code's caching requirements."

🇻🇳 **Dịch**
> "Một response chứa directive `must-understand` NÊN chứa luôn cả directive `no-store`. Khi một cache có cài đặt directive `must-understand` nhận được response có chứa nó, cache NÊN bỏ qua directive `no-store` nếu nó hiểu và cài đặt được các yêu cầu caching ứng với status code đó."

🇻🇳 Ý đồ của cặp này: gửi `Cache-Control: must-understand, no-store` cho một status code mới — cache **hiểu** status code đó thì bỏ qua `no-store` và cache theo đúng quy tắc của status code; cache **không hiểu** thì rơi về `no-store` và không cache gì cả. Là một cơ chế "an toàn khi không hiểu".

---

## 6. `Vary` — cache key không chỉ là URL (§4.1)

📖 **Nguyên văn** (RFC 9110 §12.5.5 "Vary")
> "The "Vary" header field in a response describes what parts of a request message, aside from the method and target URI, might have influenced the origin server's process for selecting the content of this response.
>
>      Vary = #( "*" / field-name )
>
>    A Vary field value is either the wildcard member "*" or a list of request field names, known as the selecting header fields, that might have had a role in selecting the representation for this response."

🇻🇳 **Dịch**
> "Header field "Vary" trong một response mô tả những phần nào của request message — ngoài method và target URI — có thể đã ảnh hưởng tới quá trình origin server chọn nội dung cho response này.
>
> Giá trị của field `Vary` hoặc là ký tự đại diện "*", hoặc là một danh sách tên các request field, gọi là selecting header fields, những field có thể đã đóng vai trò trong việc chọn representation cho response này."

📖 **Nguyên văn** (RFC 9111 §4.1 "Calculating Cache Keys with the Vary Header Field")
> "When a cache receives a request that can be satisfied by a stored response and that stored response contains a Vary header field (Section 12.5.5 of [HTTP]), the cache MUST NOT use that stored response without revalidation unless all the presented request header fields nominated by that Vary field value match those fields in the original request (i.e., the request that caused the cached response to be stored)."

🇻🇳 **Dịch**
> "Khi cache nhận được một request có thể được đáp ứng bởi một response đã lưu, và response đã lưu ấy chứa header field `Vary` (Mục 12.5.5 của [HTTP]), thì cache KHÔNG ĐƯỢC dùng response đã lưu đó mà không revalidate, trừ khi TẤT CẢ các header field của request được nêu tên trong giá trị `Vary` đều khớp với các field tương ứng trong request gốc (tức là request đã khiến response đó được lưu vào cache)."

📖 **Nguyên văn** (RFC 9111 §4.1 — quy tắc so khớp)
> "The header fields from two requests are defined to match if and only if those in the first request can be transformed to those in the second request by applying any of the following:
>
>    *  adding or removing whitespace, where allowed in the header field's syntax
>
>    *  combining multiple header field lines with the same field name (see Section 5.2 of [HTTP])
>
>    *  normalizing both header field values in a way that is known to have identical semantics, according to the header field's specification (e.g., reordering field values when order is not significant; case-normalization, where values are defined to be case-insensitive)
>
>    If (after any normalization that might take place) a header field is absent from a request, it can only match another request if it is also absent there.
>
>    A stored response with a Vary header field value containing a member "*" always fails to match."

🇻🇳 **Dịch**
> "Các header field của hai request được định nghĩa là khớp nhau khi và chỉ khi các field ở request thứ nhất có thể biến đổi thành các field ở request thứ hai bằng cách áp dụng bất kỳ phép nào sau đây:
>
> - thêm hoặc bớt khoảng trắng, ở nơi cú pháp của header field cho phép
> - gộp nhiều dòng header field có cùng tên field (xem Mục 5.2 của [HTTP])
> - chuẩn hoá cả hai giá trị header field theo cách đã biết là giữ nguyên ngữ nghĩa, theo đặc tả của header field đó (ví dụ sắp xếp lại thứ tự giá trị khi thứ tự không quan trọng; chuẩn hoá hoa thường, khi giá trị được định nghĩa là không phân biệt hoa thường)
>
> Nếu (sau mọi phép chuẩn hoá có thể có) một header field vắng mặt trong một request, thì nó chỉ khớp với request khác nếu ở đó nó cũng vắng mặt.
>
> Một response đã lưu có giá trị `Vary` chứa thành viên "*" thì LUÔN LUÔN không khớp."

📖 **Nguyên văn** (RFC 9111 §4.1 — cảnh báo về việc thiếu `Vary`)
> "Some resources mistakenly omit the Vary header field from their default response (i.e., the one sent when the request does not express any preferences), with the effect of choosing it for subsequent requests to that resource even when more preferable responses are available.  When a cache has multiple stored responses for a target URI and one or more omits the Vary header field, the cache SHOULD choose the most recent (see Section 4.2.3) stored response with a valid Vary field value."

🇻🇳 **Dịch**
> "Một số resource nhầm lẫn bỏ sót header field `Vary` khỏi response mặc định của chúng (tức là response gửi ra khi request không bày tỏ sở thích nào), dẫn tới hệ quả là response đó bị chọn cho các request tiếp theo tới resource ấy ngay cả khi đã có những response phù hợp hơn. Khi cache có nhiều response đã lưu cho cùng một target URI và một hoặc nhiều trong số đó thiếu header field `Vary`, cache NÊN chọn response đã lưu mới nhất (xem Mục 4.2.3) có giá trị `Vary` hợp lệ."

> [!danger] Thiếu `Vary` = phục vụ nội dung của người này cho người khác
> Cache key mặc định chỉ gồm method + target URI. Nếu response của bạn **phụ thuộc vào một request header** mà bạn **không khai báo trong `Vary`**, shared cache sẽ coi mọi request tới cùng URL là như nhau.
>
> Hậu quả cụ thể:
> - Response phụ thuộc `Accept-Language` mà thiếu `Vary: Accept-Language` → người dùng tiếng Nhật nhận trang tiếng Việt của người trước.
> - Response phụ thuộc `Accept-Encoding` mà thiếu `Vary: Accept-Encoding` → client không hỗ trợ gzip nhận về body đã nén → hiển thị ký tự rác.
> - **Nguy hiểm nhất**: response phụ thuộc `Authorization` hay `Cookie` mà thiếu `Vary` và lại không có `private`/`no-store` → CDN lưu trang tài khoản của user A và trả cho user B. Đây là rò rỉ dữ liệu thật sự, không phải lỗi hiển thị.
>
> Điều kiện §3 ("nếu cache là shared: header `Authorization` không có mặt trong request...") là lớp phòng vệ cho `Authorization`, **nhưng không có lớp nào tương đương cho `Cookie`**. Session định danh bằng cookie (xem [[12 - Cookie và Session based Authentication]]) hoàn toàn có thể bị cache nhầm nếu server không đánh dấu `private`/`no-store`.

> [!warning] `Vary` quá rộng thì cache vô dụng
> Nhận định thực hành: mỗi giá trị khác nhau của header được liệt kê trong `Vary` tạo ra một cache entry riêng. `Vary: User-Agent` gần như chia nhỏ cache thành vô số mảnh vì chuỗi User-Agent rất đa dạng, khiến tỉ lệ cache hit sụt xuống. Và `Vary: *` thì theo §4.1 là "always fails to match" — tương đương tắt cache.

---

## 7. `stale-while-revalidate` và `stale-if-error` (RFC 5861)

📖 **Nguyên văn** (RFC 5861 §3 "The stale-while-revalidate Cache-Control Extension")
> "When present in an HTTP response, the stale-while-revalidate Cache-Control extension indicates that caches MAY serve the response in which it appears after it becomes stale, up to the indicated number of seconds.
>
>      stale-while-revalidate = "stale-while-revalidate" "=" delta-seconds
>
>    If a cached response is served stale due to the presence of this extension, the cache SHOULD attempt to revalidate it while still serving stale responses (i.e., without blocking).
>
> ...  If delta-seconds passes without the cached entity being revalidated, it SHOULD NOT continue to be served stale, absent other information."

🇻🇳 **Dịch**
> "Khi có mặt trong một HTTP response, extension `stale-while-revalidate` của `Cache-Control` cho biết các cache CÓ THỂ phục vụ response chứa nó sau khi response đã trở nên stale, tối đa tới số giây được chỉ định.
>
> Cú pháp: `stale-while-revalidate = "stale-while-revalidate" "=" delta-seconds`
>
> Nếu một response đã cache được phục vụ ở trạng thái stale nhờ sự có mặt của extension này, cache NÊN thử revalidate nó trong khi vẫn đang phục vụ các response stale (tức là không chặn).
>
> ... Nếu delta-seconds trôi qua mà cached entity vẫn chưa được revalidate, nó KHÔNG NÊN tiếp tục được phục vụ ở trạng thái stale, nếu không có thông tin nào khác."

📖 **Nguyên văn** (RFC 5861 §3.1 "Example")
> "A response containing:
>
>      Cache-Control: max-age=600, stale-while-revalidate=30
>
>    indicates that it is fresh for 600 seconds, and it may continue to be served stale for up to an additional 30 seconds while an asynchronous validation is attempted.  If validation is inconclusive, or if there is not traffic that triggers it, after 30 seconds the stale-while-revalidate function will cease to operate, and the cached response will be "truly" stale (i.e., the next request will block and be handled normally)."

🇻🇳 **Dịch**
> "Một response chứa `Cache-Control: max-age=600, stale-while-revalidate=30` cho biết nó fresh trong 600 giây, và có thể tiếp tục được phục vụ ở trạng thái stale thêm tối đa 30 giây nữa trong khi một lần validation bất đồng bộ đang được thực hiện. Nếu validation không đi tới kết luận, hoặc nếu không có traffic nào kích hoạt nó, thì sau 30 giây chức năng `stale-while-revalidate` sẽ ngừng hoạt động, và response đã cache sẽ "thực sự" stale (tức là request kế tiếp sẽ bị chặn và được xử lý như bình thường)."

📖 **Nguyên văn** (RFC 5861 §4 "The stale-if-error Cache-Control Extension")
> "The stale-if-error Cache-Control extension indicates that when an error is encountered, a cached stale response MAY be used to satisfy the request, regardless of other freshness information.
>
>      stale-if-error = "stale-if-error" "=" delta-seconds
>
>    When used as a request Cache-Control extension, its scope of application is the request it appears in; when used as a response Cache-Control extension, its scope is any request applicable to the cached response in which it occurs.
>
>    Its value indicates the upper limit to staleness; when the cached response is more stale than the indicated amount, the cached response SHOULD NOT be used to satisfy the request, absent other information.
>
>    In this context, an error is any situation that would result in a 500, 502, 503, or 504 HTTP response status code being returned."

🇻🇳 **Dịch**
> "Extension `stale-if-error` của `Cache-Control` cho biết khi gặp lỗi, một response stale đã cache CÓ THỂ được dùng để đáp ứng request, bất kể thông tin freshness khác ra sao.
>
> Cú pháp: `stale-if-error = "stale-if-error" "=" delta-seconds`
>
> Khi dùng như một request `Cache-Control` extension, phạm vi áp dụng của nó là chính request nó xuất hiện trong đó; khi dùng như một response extension, phạm vi của nó là mọi request áp dụng được cho response đã cache mà nó nằm trong.
>
> Giá trị của nó chỉ ra giới hạn trên của độ stale; khi response đã cache stale quá mức chỉ định, response đã cache đó KHÔNG NÊN được dùng để đáp ứng request, nếu không có thông tin nào khác.
>
> Trong ngữ cảnh này, lỗi là bất kỳ tình huống nào dẫn tới việc trả về HTTP status code 500, 502, 503, hoặc 504."

📖 **Nguyên văn** (RFC 5861 §4.1 "Example")
> ```
>      HTTP/1.1 200 OK
>      Cache-Control: max-age=600, stale-if-error=1200
>      Content-Type: text/plain
>
>      success
> ```
>
> "indicates that it is fresh for 600 seconds, and that it may be used if an error is encountered after becoming stale for an additional 1200 seconds."

🇻🇳 **Dịch**
> Response mẫu trên "cho biết nó fresh trong 600 giây, và nó có thể được dùng nếu gặp lỗi trong khoảng 1200 giây tiếp theo sau khi đã stale." Ví dụ: cache thử validate sau 900 giây và nhận `500 Internal Server Error` → cache trả bản `success` cũ kèm `Age: 900` thay vì trả lỗi cho người dùng.

> [!tip] Hai extension này giải quyết hai nỗi đau khác nhau
> - `stale-while-revalidate` giải quyết **latency**: không ai phải chờ lần fetch đầu tiên sau khi cache hết hạn.
> - `stale-if-error` giải quyết **availability**: origin sập nhưng người dùng vẫn thấy nội dung (cũ) thay vì trang lỗi.
>
> RFC 5861 là **Informational**, không phải Standards Track — nhưng RFC 9111 §4.2.4 có trích dẫn nó trực tiếp như một cơ chế hợp lệ để cho phép phục vụ response stale.

---

## 8. `immutable` (RFC 8246)

📖 **Nguyên văn** (RFC 8246 §1 "Introduction")
> "However, some content providers never create more than one variant of a sub-resource, because they use "versioned" URLs.  When these resources need an update, they are simply published under a new URL, typically embedding an identifier unique to that version of the resource in the path, and references to the sub-resource are updated with the new path information.
>
>    For example, "https://www.example.com/101016/main.css" might be updated and republished as "https://www.example.com/102026/main.css", with any links that reference it being changed at the same time. ...
>
>    Unfortunately, the user agent does not know when this versioned URL design pattern is used.  As a result, user-driven refreshes still translate into wasted conditional requests for each sub-resource as each will return 304 responses."

🇻🇳 **Dịch**
> "Tuy nhiên, một số nhà cung cấp nội dung không bao giờ tạo quá một biến thể cho một sub-resource, vì họ dùng URL có "đánh version". Khi các resource này cần cập nhật, chúng đơn giản là được publish dưới một URL mới, thường là nhúng một định danh duy nhất cho version đó của resource vào trong path, và các tham chiếu tới sub-resource được cập nhật sang thông tin path mới.
>
> Ví dụ, "https://www.example.com/101016/main.css" có thể được cập nhật và publish lại thành "https://www.example.com/102026/main.css", đồng thời mọi link tham chiếu tới nó cũng được đổi theo. ...
>
> Đáng tiếc, user agent không biết khi nào mẫu thiết kế URL có version này đang được dùng. Kết quả là, những lần refresh do người dùng chủ động vẫn biến thành các conditional request lãng phí cho từng sub-resource, vì mỗi cái sẽ chỉ trả về response 304."

📖 **Nguyên văn** (RFC 8246 §2 "The Immutable Cache-Control Extension")
> "When present in an HTTP response, the immutable Cache-Control extension indicates that the origin server will not update the representation of that resource during the freshness lifetime of the response.
>
>    Clients SHOULD NOT issue a conditional request during the response's freshness lifetime (e.g., upon a reload) unless explicitly overridden by the user (e.g., a force reload).
>
>    The immutable extension only applies during the freshness lifetime of the stored response.  Stale responses SHOULD be revalidated as they normally would be in the absence of the immutable extension.
>
>    The immutable extension takes no arguments.  If any arguments are present, they have no meaning and MUST be ignored.  Multiple instances of the immutable extension are equivalent to one instance.  The presence of an immutable Cache-Control extension in a request has no effect."

🇻🇳 **Dịch**
> "Khi có mặt trong một HTTP response, extension `immutable` của `Cache-Control` cho biết origin server sẽ KHÔNG cập nhật representation của resource đó trong suốt freshness lifetime của response.
>
> Client KHÔNG NÊN phát ra conditional request trong suốt freshness lifetime của response (ví dụ khi người dùng reload) trừ khi bị người dùng ghi đè một cách tường minh (ví dụ force reload).
>
> Extension `immutable` chỉ áp dụng trong freshness lifetime của response đã lưu. Các response stale NÊN được revalidate như bình thường, như thể không có extension `immutable`.
>
> Extension `immutable` không nhận đối số. Nếu có đối số nào, chúng vô nghĩa và PHẢI bị bỏ qua. Nhiều lần xuất hiện của extension `immutable` tương đương với một lần. Sự hiện diện của extension `immutable` trong một request không có tác dụng gì."

📖 **Nguyên văn** (RFC 8246 §2.1 "About Intermediaries")
> "An immutable response has the same semantic meaning when received by proxy clients as it does when received by user-agent-based clients.  Therefore, proxies SHOULD skip conditionally revalidating fresh responses containing the immutable extension unless there is a signal from the client that a validation is necessary (e.g., a no-cache Cache-Control request directive defined in Section 5.2.1.4 of [RFC7234])."

🇻🇳 **Dịch**
> "Một response `immutable` mang cùng ý nghĩa ngữ nghĩa khi được proxy client nhận cũng như khi được client dạng user agent nhận. Do đó, proxy NÊN bỏ qua việc revalidate có điều kiện đối với các response còn fresh có chứa extension `immutable`, trừ khi có tín hiệu từ client rằng cần phải validate (ví dụ request directive `no-cache` của `Cache-Control` định nghĩa ở Mục 5.2.1.4 của [RFC7234])."

> [!warning] `immutable` chỉ đúng khi URL thực sự bất biến
> `immutable` là lời hứa của server: "URL này sẽ không bao giờ đổi nội dung". Nếu bạn đặt `immutable` lên một URL mà sau này lại đổi nội dung ở cùng đường dẫn đó, client sẽ **không có cách nào** biết được cho tới khi hết `max-age` — và bạn thường đặt `max-age` rất dài khi dùng `immutable`. Chỉ dùng cho URL có hash/version trong tên file.

---

## 9. Invalidation — method không an toàn làm mất hiệu lực cache (§4.4)

📖 **Nguyên văn** (RFC 9111 §4.4 "Invalidating Stored Responses")
> "Because unsafe request methods (Section 9.2.1 of [HTTP]) such as PUT, POST, or DELETE have the potential for changing state on the origin server, intervening caches are required to invalidate stored responses to keep their contents up to date.
>
>    A cache MUST invalidate the target URI (Section 7.1 of [HTTP]) when it receives a non-error status code in response to an unsafe request method (including methods whose safety is unknown).
>
>    A cache MAY invalidate other URIs when it receives a non-error status code in response to an unsafe request method (including methods whose safety is unknown).  In particular, the URI(s) in the Location and Content-Location response header fields (if present) are candidates for invalidation; other URIs might be discovered through mechanisms not specified in this document.  However, a cache MUST NOT trigger an invalidation under these conditions if the origin (Section 4.3.1 of [HTTP]) of the URI to be invalidated differs from that of the target URI (Section 7.1 of [HTTP]).  This helps prevent denial-of-service attacks."

🇻🇳 **Dịch**
> "Vì các request method không an toàn (Mục 9.2.1 của [HTTP]) như PUT, POST, hay DELETE có khả năng làm thay đổi trạng thái trên origin server, các cache nằm ở giữa được yêu cầu phải làm mất hiệu lực (invalidate) các response đã lưu để giữ nội dung của chúng luôn mới.
>
> Một cache PHẢI invalidate target URI (Mục 7.1 của [HTTP]) khi nó nhận được một status code không phải lỗi trong response cho một request method không an toàn (kể cả các method không rõ có an toàn hay không).
>
> Một cache CÓ THỂ invalidate các URI khác khi nó nhận được status code không phải lỗi trong response cho một request method không an toàn (kể cả các method không rõ có an toàn hay không). Cụ thể, (các) URI trong header field response `Location` và `Content-Location` (nếu có) là ứng viên để invalidate; các URI khác có thể được phát hiện qua những cơ chế không đặc tả trong tài liệu này. Tuy nhiên, cache KHÔNG ĐƯỢC kích hoạt invalidation trong các điều kiện này nếu origin (Mục 4.3.1 của [HTTP]) của URI cần invalidate khác với origin của target URI (Mục 7.1 của [HTTP]). Điều này giúp ngăn các cuộc tấn công từ chối dịch vụ."

📖 **Nguyên văn** (RFC 9111 §4.4)
> ""Invalidate" means that the cache will either remove all stored responses whose target URI matches the given URI or mark them as "invalid" and in need of a mandatory validation before they can be sent in response to a subsequent request.
>
>    A "non-error response" is one with a 2xx (Successful) or 3xx (Redirection) status code.
>
>    Note that this does not guarantee that all appropriate responses are invalidated globally; a state-changing request would only invalidate responses in the caches it travels through."

🇻🇳 **Dịch**
> ""Invalidate" nghĩa là cache sẽ hoặc xoá tất cả các response đã lưu có target URI khớp với URI cho trước, hoặc đánh dấu chúng là "invalid" và bắt buộc phải validate trước khi có thể gửi ra trong response cho một request sau đó.
>
> Một "non-error response" là response có status code 2xx (Successful) hoặc 3xx (Redirection).
>
> Lưu ý rằng điều này KHÔNG đảm bảo mọi response phù hợp đều bị invalidate trên toàn cầu; một request làm thay đổi trạng thái chỉ invalidate các response trong những cache mà nó đi xuyên qua."

> [!danger] Invalidation của HTTP không phải "purge toàn cầu"
> Câu cuối của §4.4 là điểm dễ bị hiểu sai nhất trong vận hành. Một `POST /products/1` chỉ làm sạch cache ở **những tầng nó thực sự đi qua**. Một CDN edge node ở khu vực khác — nơi request POST đó không hề chạm tới — vẫn giữ nguyên bản cũ cho tới khi hết hạn.
>
> Nghĩa là: HTTP caching **không** cung cấp cơ chế xoá cache chủ động trên toàn hệ thống. Muốn có điều đó phải dùng API purge riêng của từng CDN (ngoài phạm vi spec).

---

## 10. `Expires` — người anh cũ của `max-age` (§5.3)

📖 **Nguyên văn** (RFC 9111 §5.3 "Expires")
> "The "Expires" response header field gives the date/time after which the response is considered stale.  See Section 4.2 for further discussion of the freshness model.
>
>    The presence of an Expires header field does not imply that the original resource will change or cease to exist at, before, or after that time. ...
>
>      Expires = HTTP-date
>
>    For example
>
>    Expires: Thu, 01 Dec 1994 16:00:00 GMT
>
>    A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired")."

🇻🇳 **Dịch**
> "Header field response "Expires" cho biết ngày/giờ mà sau đó response bị coi là stale. Xem Mục 4.2 để bàn thêm về mô hình freshness.
>
> Sự hiện diện của header field `Expires` KHÔNG hàm ý rằng resource gốc sẽ thay đổi hay ngừng tồn tại vào, trước, hay sau thời điểm đó. ...
>
> Cú pháp là HTTP-date, ví dụ `Expires: Thu, 01 Dec 1994 16:00:00 GMT`.
>
> Bên nhận là cache PHẢI diễn giải các định dạng ngày không hợp lệ — đặc biệt là giá trị "0" — như biểu thị một thời điểm trong quá khứ (tức là "đã hết hạn rồi")."

📖 **Nguyên văn** (RFC 9111 §5.3)
> "If a response includes a Cache-Control header field with the max-age directive (Section 5.2.2.1), a recipient MUST ignore the Expires header field.  Likewise, if a response includes the s-maxage directive (Section 5.2.2.10), a shared cache recipient MUST ignore the Expires header field.  In both these cases, the value in Expires is only intended for recipients that have not yet implemented the Cache-Control header field."

🇻🇳 **Dịch**
> "Nếu một response có chứa header field `Cache-Control` với directive `max-age` (Mục 5.2.2.1), bên nhận PHẢI bỏ qua header field `Expires`. Tương tự, nếu response có chứa directive `s-maxage` (Mục 5.2.2.10), bên nhận là shared cache PHẢI bỏ qua header field `Expires`. Trong cả hai trường hợp này, giá trị trong `Expires` chỉ nhằm dành cho những bên nhận chưa cài đặt header field `Cache-Control`."

---

## 11. Bảng "công thức" thực dụng

> [!warning] Đây là **nhận định thực hành**, KHÔNG phải trích RFC
> RFC 9111 định nghĩa cơ chế, không kê đơn cấu hình. Bảng dưới là cách ghép các directive đã trích ở trên cho ba tình huống phổ biến. Phần cột "Vì sao" mới là thứ có gốc spec; bộ header cụ thể luôn phải điều chỉnh theo hệ thống của bạn.

| Tình huống | Bộ header đề xuất | Vì sao (dựa trên mục nào của spec) |
|---|---|---|
| **Tài sản tĩnh có hash trong tên file** (`app.8f3a2c.js`, `main.102026.css`) | `Cache-Control: public, max-age=31536000, immutable` | URL đã mang version nên nội dung không đổi → đúng đối tượng của `immutable` (RFC 8246 §1). `public` đánh dấu tường minh cache được (§5.2.2.9). `max-age` rất dài vì đổi nội dung = đổi URL, không cần chờ hết hạn. Cần nhớ §5.3: `Expires` bị bỏ qua khi có `max-age` |
| **API response dùng chung, đọc nhiều ghi ít** (danh sách sản phẩm công khai) | `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=60` + `ETag` | `s-maxage` đè `max-age` riêng cho shared cache (§5.2.2.10) → CDN giữ lâu hơn browser. `ETag` cho phép revalidate rẻ bằng 304 (§4.3, RFC 9110 §15.4.5). `stale-while-revalidate` để không ai phải chờ lần fetch sau khi hết hạn (RFC 5861 §3) |
| **API response cá nhân hoá** (giỏ hàng, hồ sơ user) | `Cache-Control: private, no-cache` + `Vary` liệt kê đủ header quyết định nội dung | `private` cấm shared cache lưu (§5.2.2.7). `no-cache` cho phép browser lưu nhưng bắt validate mỗi lần (§5.2.2.4) → vẫn tiết kiệm băng thông nhờ 304. `Vary` là bắt buộc nếu nội dung phụ thuộc header (§4.1) |
| **Dữ liệu tuyệt đối không được nằm lại ở đâu** (token, thông tin thanh toán) | `Cache-Control: no-store` | §5.2.2.5: cấm lưu mọi phần ở cả private lẫn shared cache. Nhưng nhớ §5.2.2.5: đây "is not a reliable or sufficient mechanism for ensuring privacy" — chỉ là một lớp, không phải giải pháp bảo mật |
| **Giao dịch không được phép dùng bản cũ** | `Cache-Control: no-cache, must-revalidate` | §5.2.2.2 nói thẳng lý do tồn tại của `must-revalidate`: khi "failure to validate a request could cause incorrect operation, such as a silently unexecuted financial transaction" |

> [!tip] Nhận định thực hành: thứ tự ưu tiên khi thiết kế
> 1. Xác định response này **private hay shared** trước, rồi mới nghĩ tới TTL. Sai bước này là rò rỉ dữ liệu, sai bước 2 chỉ là chậm.
> 2. Nếu nội dung phụ thuộc bất kỳ request header nào → khai `Vary` ngay, đừng để sau.
> 3. `ETag` gần như luôn nên có: nó biến request "hết hạn" từ tải lại toàn bộ thành một `304` rỗng body.
> 4. Nếu bạn kiểm soát được URL, ưu tiên đổi URL thay vì đổi nội dung — đó là cách duy nhất "invalidate" thật sự đáng tin, vì §4.4 đã nói invalidation của HTTP không có tính toàn cầu.

---

## 12. Ghi chú từ nguồn bên thứ ba

> [!note] Nguồn bên thứ ba
> Phần này trích từ **MDN — HTTP caching** (Mozilla, không phải spec): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching

📖 **Nguyên văn** (MDN, "Shared cache" — *nguồn bên thứ ba*)
> "Managed caches are explicitly deployed by service developers to offload the origin server and to deliver content efficiently. Examples include reverse proxies, CDNs, and service workers in combination with the Cache API.
>
> The characteristics of managed caches vary depending on the product deployed. In most cases, you can control the cache's behavior through the Cache-Control header and your own configuration files or dashboards.
>
> For example, the HTTP Caching specification essentially does not define a way to explicitly delete a cache — but with a managed cache, the stored response can be deleted at any time through dashboard operations, API calls, restarts, and so on. That allows for a more proactive caching strategy."

🇻🇳 **Dịch**
> "Managed cache được các nhà phát triển dịch vụ triển khai một cách chủ đích để giảm tải cho origin server và phân phối nội dung hiệu quả. Ví dụ gồm reverse proxy, CDN, và service worker kết hợp với Cache API.
>
> Đặc tính của managed cache thay đổi tuỳ theo sản phẩm được triển khai. Trong hầu hết trường hợp, bạn có thể điều khiển hành vi của cache qua header `Cache-Control` cùng các file cấu hình hoặc dashboard của riêng bạn.
>
> Ví dụ, đặc tả HTTP Caching về cơ bản không định nghĩa cách xoá cache một cách tường minh — nhưng với managed cache, response đã lưu có thể bị xoá bất cứ lúc nào qua thao tác trên dashboard, lời gọi API, khởi động lại, v.v. Điều đó cho phép một chiến lược caching chủ động hơn."

🇻🇳 Đây chính là lời giải cho hạn chế đã nêu ở §4.4 phía trên: purge toàn cầu không nằm trong HTTP, nó nằm ở lớp sản phẩm CDN.

📖 **Nguyên văn** (MDN, "Proxy caches" — *nguồn bên thứ ba*)
> "Kitchen-sink headers like the following are used to try to work around "old and not updated proxy cache" implementations that do not understand current HTTP Caching spec directives like no-store.
>
> Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate
>
> However, in recent years, as HTTPS has become more common and client/server communication has become encrypted, proxy caches in the path can only tunnel a response and can't behave as a cache, in many cases."

🇻🇳 **Dịch**
> "Những header kiểu "ném hết vào bồn rửa bát" như dưới đây được dùng để cố né các cài đặt proxy cache "cũ và không được cập nhật" vốn không hiểu các directive của spec HTTP Caching hiện hành như `no-store`.
>
> `Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate`
>
> Tuy nhiên, những năm gần đây, khi HTTPS đã trở nên phổ biến và giao tiếp client/server đã được mã hoá, các proxy cache nằm trên đường truyền trong nhiều trường hợp chỉ có thể tunnel response chứ không thể hành xử như một cache."

🇻🇳 Nhận định thực hành: chuỗi "kitchen-sink" đó ngày nay phần lớn là thừa; `no-store` một mình là đủ theo §5.2.2.5.

---

## Liên kết

- Bài trước: [[01 - Caching là gì]]
- Bài kế: [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]]
- [[01 - API là gì và nền tảng HTTP]] — nơi `Cache-Control`, `ETag`, `If-None-Match` được giới thiệu lần đầu ở mức nhập môn
- [[04 - HTTP Status Code và thiết kế lỗi]] — `304 Not Modified`, và `504 Gateway Timeout` mà `must-revalidate` / `only-if-cached` yêu cầu sinh ra
- [[02 - REST]] — **cache là một trong sáu ràng buộc kiến trúc của REST**; toàn bộ bài này là phần "làm sao thực thi ràng buộc đó bằng header HTTP"
- [[12 - Cookie và Session based Authentication]] — response phụ thuộc cookie mà thiếu `private`/`Vary` là nguồn rò rỉ dữ liệu ở shared cache
- [[13 - Token Authentication và Bearer Token]] — điều kiện §3 về header `Authorization` với shared cache
- [[04 - Indexes]] · [[07 - N+1 Problem]] — cache giảm tải DB, nhưng không thay thế được index hay việc sửa N+1
- [[05 - Transactions, ACID và MVCC]] — cache đánh đổi tính nhất quán lấy hiệu năng; `freshness_lifetime` chính là khoảng thời gian bạn chấp nhận đọc dữ liệu cũ

## Nguồn tham khảo

- RFC 9111 — *HTTP Caching* (STD 98) : https://www.rfc-editor.org/rfc/rfc9111.txt
- RFC 9110 — *HTTP Semantics* (§8.8 Validator Fields, §12.5.5 Vary, §13 Conditional Requests, §15.4.5 304 Not Modified) : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 5861 — *HTTP Cache-Control Extensions for Stale Content* (`stale-while-revalidate`, `stale-if-error`) : https://www.rfc-editor.org/rfc/rfc5861.txt
- RFC 8246 — *HTTP Immutable Responses* : https://www.rfc-editor.org/rfc/rfc8246.txt
- MDN Web Docs — *HTTP caching* (nguồn bên thứ ba) : https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
