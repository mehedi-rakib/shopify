# 🛍️ Setting Up Your Azan Wholesale App Under Shopify

## 🎯 **Overview**

Now that you've deployed your app on Vercel, this guide will help you set it up to work within Shopify's admin interface as an embedded app.

---

## 📋 **Prerequisites**

### **Before You Start**
- ✅ App deployed on Vercel
- ✅ Azan Wholesale API credentials (App ID + Secret Key)
- ✅ Shopify Partner account created
- ✅ Your Vercel app URL (e.g., `https://your-app.vercel.app`)

---

## 🚀 **Step 1: Create Shopify App**

### **1.1 Go to Shopify Partner Dashboard**
1. Log in to [Shopify Partners](https://www.shopify.com/partners)
2. Navigate to **Apps** → **Create app**
3. Choose **Public app** (for App Store distribution)

### **1.2 Configure App Details**
Fill in the app information:

#### **Basic Information**
```
App name: Azan Wholesale Dropshipping
App URL: https://your-app.vercel.app
Redirect URL: https://your-app.vercel.app/api/auth/callback
```

#### **Webhook Configuration**
```
Webhook URL: https://your-app.vercel.app/api/webhooks/orders
Webhook topics: orders/create, orders/updated
```

#### **Required Permissions**
Select these API scopes:
```
read_products     - Read product data
write_products    - Create/update products
read_orders       - Process orders
read_inventory    - Read inventory levels
write_inventory   - Update inventory levels
```

### **1.3 Get API Credentials**
After creating the app, you'll get:
- **API Key**: `SHOPIFY_API_KEY`
- **API Secret**: `SHOPIFY_API_SECRET`

---

## 🔧 **Step 2: Configure Environment Variables**

### **2.1 Set Up Environment Variables in Vercel**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
NEXT_PUBLIC_SHOPIFY_API_KEY=your_shopify_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME="Azan Wholesale Dropshipping"

# Azan Wholesale API (Optional - can be entered in app)
AZAN_APP_ID=your_azan_app_id
AZAN_SECRET_KEY=your_azan_secret_key
```

### **2.2 Redeploy the App**
After setting environment variables:
1. Vercel will automatically redeploy
2. Wait for deployment to complete
3. Test that the app is running

---

## 🧪 **Step 3: Test the Installation**

### **3.1 Install the App on a Development Store**
1. In Shopify Partner Dashboard, create a development store
2. Go to your app → **Overview** → **Select store**
3. Choose your development store
4. Click **Install app**

### **3.2 Test the OAuth Flow**
1. You'll be redirected to your app
2. The app should detect it's running in embedded mode
3. Enter your Azan Wholesale credentials
4. Test product browsing and import

### **3.3 Verify Embedded Functionality**
The app should:
- ✅ Show "Embedded Mode" badge
- ✅ Display the current shop name
- ✅ Work within Shopify admin interface
- ✅ Have no external header (embedded mode)
- ✅ Allow product import to the Shopify store

---

## 🎨 **Step 4: Customize Embedded Experience**

### **4.1 App Bridge Integration**
Your app now includes Shopify App Bridge for:
- **Embedded Navigation**: Seamless integration with Shopify admin
- **Context Awareness**: Knows which shop it's running in
- **Resource Linking**: Direct links to products, orders, etc.

### **4.2 UI Adjustments for Embedded Mode**
The app automatically:
- Removes external header when embedded
- Adjusts padding and spacing for iframe
- Shows embedded mode indicators
- Optimizes for smaller admin interface

### **4.3 Shopify Polaris Components (Optional)**
For a more native look, consider adding Shopify Polaris:

```bash
npm install @shopify/polaris
```

---

## 🔐 **Step 5: Set Up Webhooks**

### **5.1 Configure Webhooks in Shopify**
1. In your app settings, go to **Webhooks**
2. Add webhook endpoints:
   ```
   URL: https://your-app.vercel.app/api/webhooks/orders
   Topics: orders/create, orders/updated
   ```

### **5.2 Test Webhook Functionality**
1. Create a test order in your development store
2. Check that the webhook receives the order
3. Verify stock update logic works

### **5.3 Webhook Security**
Your webhook handler includes:
- HMAC signature verification
- Order validation
- Error handling
- Logging

---

## 🚀 **Step 6: Prepare for App Store Submission**

### **6.1 Create App Store Assets**
Prepare these assets for submission:

#### **App Icon**
- Size: 128x128 pixels
- Format: PNG
- Background: Transparent or white
- Design: Professional and recognizable

#### **Screenshots (5-7 required)**
- Size: 1280x800 pixels (minimum)
- Format: PNG or JPG
- Content: Show key features and benefits
- Examples:
  1. Product browsing interface
  2. Product import process
  3. Settings/configuration screen
  4. Success messages
  5. Mobile responsiveness

#### **App Listing Information**
```
App name: Azan Wholesale Dropshipping
Category: Sales and conversion optimization
Short description: Import wholesale products directly to your store
Full description: Detailed feature list and benefits
Pricing: Free (or your chosen pricing model)
Support: Email and documentation links
```

### **6.2 Privacy Policy and Terms**
Create these pages:
- **Privacy Policy**: How you handle user data
- **Terms of Service**: App usage terms
- **Support Documentation**: User guides and FAQs

### **6.3 Demo Store**
Set up a demo store that:
- Has sample products imported
- Shows the app in action
- Allows Shopify reviewers to test functionality

---

## 📊 **Step 7: Testing and Quality Assurance**

### **7.1 Functionality Testing**
Test all features:
- ✅ OAuth installation flow
- ✅ Azan Wholesale API connection
- ✅ Product browsing and filtering
- ✅ Product import to Shopify
- ✅ Custom pricing functionality
- ✅ Webhook order processing
- ✅ Error handling and messages

### **7.2 Cross-Browser Testing**
Test in:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers

### **7.3 Performance Testing**
Ensure:
- Fast loading times (< 3 seconds)
- Responsive design
- Smooth interactions
- Proper error states

---

## 🚀 **Step 8: Submit to Shopify App Store**

### **8.1 Complete App Listing**
1. Go to Shopify Partner Dashboard
2. Navigate to your app
3. Click **Submit to App Store**
4. Fill in all required fields
5. Upload all assets
6. Submit for review

### **8.2 Review Process**
- **Duration**: 1-2 weeks typically
- **Requirements**: All features must work perfectly
- **Communication**: Shopify may request changes
- **Approval**: Once approved, app goes live

### **8.3 Post-Launch**
- Monitor app performance
- Respond to user reviews
- Fix any bugs quickly
- Add new features based on feedback

---

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: OAuth Fails**
```
Problem: App installation redirects to error page
Solution: 
1. Verify redirect URL in app settings
2. Check environment variables
3. Ensure HTTPS is enabled
4. Verify HMAC signature implementation
```

### **Issue 2: Embedded Mode Not Working**
```
Problem: App shows external interface instead of embedded
Solution:
1. Check that 'shop' and 'host' parameters are present
2. Verify App Bridge initialization
3. Ensure proper redirect after OAuth
4. Check browser console for errors
```

### **Issue 3: Product Import Fails**
```
Problem: Products not importing to Shopify
Solution:
1. Verify Shopify API permissions
2. Check Azan Wholesale API credentials
3. Ensure product data format is correct
4. Check Shopify API rate limits
```

### **Issue 4: Webhooks Not Working**
```
Problem: Order webhooks not being received
Solution:
1. Verify webhook URL is accessible
2. Check webhook configuration in Shopify
3. Ensure HMAC verification is correct
4. Check server logs for errors
```

---

## 🎯 **Success Checklist**

### **Pre-Launch Checklist**
- [ ] App deployed successfully on Vercel
- [ ] Environment variables configured
- [ ] OAuth flow working correctly
- [ ] Embedded mode functioning
- [ ] Product import working
- [ ] Webhooks configured and tested
- [ ] All features tested
- [ ] App store assets prepared
- [ ] Documentation complete

### **Launch Checklist**
- [ ] App submitted to Shopify App Store
- [ ] Review process initiated
- [ ] Demo store ready for reviewers
- [ ] Support system in place
- [ ] Monitoring configured
- [ ] Marketing materials prepared

---

## 📞 **Support and Resources**

### **Shopify Resources**
- [Shopify App Development](https://shopify.dev/docs/apps)
- [Shopify App Bridge](https://shopify.dev/docs/apps/app-bridge)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Shopify App Store Review Guidelines](https://shopify.dev/docs/app-store/review)

### **Technical Support**
- Shopify Developer Forums
- Stack Overflow
- GitHub Issues
- Community Discord

### **App Success Tips**
- Respond to user feedback quickly
- Keep app updated with latest Shopify features
- Monitor performance and user satisfaction
- Continuously improve based on user needs

---

## 🎉 **Congratulations!**

Your Azan Wholesale Shopify app is now ready to serve merchants under Shopify's admin interface. The app provides:

✅ **Seamless Integration** - Works within Shopify admin  
✅ **Professional Experience** - Embedded app with native feel  
✅ **Complete Functionality** - Product browsing, import, and stock sync  
✅ **Scalable Architecture** - Ready for thousands of merchants  
✅ **App Store Ready** - Prepared for official distribution  

**Next Steps**: Submit to Shopify App Store and start serving merchants! 🚀