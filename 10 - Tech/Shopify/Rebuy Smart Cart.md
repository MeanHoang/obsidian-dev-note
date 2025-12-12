### Rebuy Là Gì?
Rebuy Engine là một third-party cart drawer app cho Shopify:
- Thay thế cart drawer mặc định của Shopify
- Smart recommendations (AI-powered)
- Upsell/cross-sell products
- Custom cart experience
- Widget system riêng
Tương tự như:
- Slide Cart
- Cart Upsell
- Ajax Cart Pro

### **Installation Instructions**
1. In the Rebuy Dashboard, go to Smart Cart.
2. Click Add to insert a new component.
3. Select Smart Cart App and search for Joy Loyalty.
4. Click Install to add it to your cart.
5. Toggle the app to Active and click Save.
6. (Optional) Adjust the position of the Joy Loyalty block in your cart layout.
### HungLV note guide:
- Docs:
    - [https://developers.rebuyengine.com/reference/smart-cart-event-listeners](https://developers.rebuyengine.com/reference/smart-cart-event-listeners)
    - [https://developers.rebuyengine.com/docs/building-your-smartcart-app](https://developers.rebuyengine.com/docs/building-your-smartcart-app)
	- https://developers.rebuyengine.com/discuss/64b69baaaed40300375ff27f](https://developers.rebuyengine.com/discuss/64b69baaaed40300375ff27f)
- Setup ở phía Merchant:
    - Cài app shopify Rebuy: [https://apps.shopify.com/rebuy](https://apps.shopify.com/rebuy)
    - Setup smart cart: [https://www.youtube.com/watch?v=J2KHWP0tzOQ](https://www.youtube.com/watch?v=J2KHWP0tzOQ)        
    - Setup Redeem Inline như bình thường
    ![[Pasted image 20251203172049.png]]
- Setup bên phía Joy Loyalty
    
    - Phải tạo được **Smart Cart App →** Để merchant add vào cart của họ
        - Docs: [https://developers.rebuyengine.com/docs/building-your-smartcart-app](https://developers.rebuyengine.com/docs/building-your-smartcart-app)
                    ![[Pasted image 20251203172024.png]]
            
        - App code:
            
	<div class="joy-redeem-inline"></div>
            
    - Request access for all stores:
    ![[Pasted image 20251203172005.png]]

- Kết quả:![[Pasted image 20251203171916.png]]