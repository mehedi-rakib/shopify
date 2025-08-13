# 🚀 Deployment Guide for Azan Wholesale Shopify App

This guide will help you deploy the Azan Wholesale Shopify App and make it available for merchants.

## 📋 **Deployment Options**

### Option A: Vercel (Recommended for Beginners)
### Option B: AWS/Google Cloud (For Production Scale)
### Option C: Docker (Self-hosted)

---

## 🎯 **Option A: Deploy to Vercel (Easiest)**

### 1. **Prepare Your Repository**
```bash
# Ensure your code is committed to Git
git add .
git commit -m "Initial commit - Azan Wholesale Shopify App"
git push origin main
```

### 2. **Deploy to Vercel**
- Go to [Vercel.com](https://vercel.com)
- Sign up (free tier available)
- Click "New Project"
- Connect your GitHub repository
- Select the repository

### 3. **Configure Environment Variables**
In Vercel dashboard:
```
# Azan Wholesale API
AZAN_APP_ID=your_app_id
AZAN_SECRET_KEY=your_secret_key

# Shopify App (get from Shopify Partner Dashboard)
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME="Azan Wholesale Dropshipping"
```

### 4. **Deploy**
- Click "Deploy"
- Vercel will automatically build and deploy your app
- You'll get a URL like `https://your-app.vercel.app`

---

## 🎯 **Option B: Deploy to AWS/Google Cloud**

### 1. **Choose Your Platform**
- **AWS**: EC2, Elastic Beanstalk, or AWS Amplify
- **Google Cloud**: Cloud Run or App Engine

### 2. **Prepare for Deployment**
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Create production build
npm run deploy:prepare
```

### 3. **AWS EC2 Deployment**
```bash
# Launch EC2 instance (Ubuntu 20.04)
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Upload your application
scp -i your-key.pem -r ./ ubuntu@your-ec2-ip:/home/ubuntu/azan-app

# On the server:
cd /home/ubuntu/azan-app
npm install --production
pm2 start server.js --name "azan-wholesale-app"
pm2 startup
pm2 save
```

### 4. **Set Up Domain and SSL**
- Purchase domain (e.g., Namecheap, GoDaddy)
- Point DNS to your server IP
- Install Let's Encrypt SSL certificate
```bash
sudo apt install certbot
sudo certbot --nginx -d your-domain.com
```

---

## 🎯 **Option C: Docker Deployment**

### 1. **Build Docker Image**
```bash
# Build the image
docker build -t azan-wholesale-shopify-app .

# Test locally
docker run -p 3000:3000 --env-file .env azan-wholesale-shopify-app
```

### 2. **Deploy to Docker Hub**
```bash
# Tag the image
docker tag azan-wholesale-shopify-app your-dockerhub-username/azan-wholesale-app:latest

# Push to Docker Hub
docker push your-dockerhub-username/azan-wholesale-app:latest
```

### 3. **Deploy to Cloud Services**
```bash
# Using Docker Compose (for production)
version: '3.8'
services:
  azan-app:
    image: your-dockerhub-username/azan-wholesale-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - AZAN_APP_ID=${AZAN_APP_ID}
      - AZAN_SECRET_KEY=${AZAN_SECRET_KEY}
      - SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
      - SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
    restart: unless-stopped
```

---

## 🔧 **Shopify App Store Submission**

### 1. **Create Shopify Partner Account**
- Visit [Shopify Partners](https://www.shopify.com/partners)
- Sign up for free
- Complete your profile

### 2. **Create Your App**
1. Go to **Apps** → **Create app**
2. Choose **Public app** (for App Store)
3. Fill in app details:
   ```
   App name: Azan Wholesale Dropshipping
   App URL: https://your-deployed-app.com
   Redirect URL: https://your-deployed-app.com/api/auth/callback
   ```

### 3. **Configure App Permissions**
In your app settings, request these scopes:
```javascript
// Required permissions
const SCOPES = [
  'read_products',      // To read product data
  'write_products',     // To create/update products
  'read_orders',         // To process orders
  'read_customers',      // For customer data (optional)
  'read_inventory',     // For inventory management
  'write_inventory'      // To update stock levels
]
```

### 4. **Set Up Webhooks**
Configure these webhooks in Shopify:
```
Topic: orders/create
URL: https://your-app.com/api/webhooks/orders

Topic: orders/updated
URL: https://your-app.com/api/webhooks/orders
```

### 5. **App Store Listing**
Prepare these assets:
- **App Icon**: 128x128 PNG
- **Screenshots**: 5-7 screenshots showing app features
- **Description**: Detailed app description
- **Pricing**: Free or paid model
- **Support**: Email and documentation links

### 6. **Submit for Review**
- Complete all required fields
- Submit for Shopify review
- Wait for approval (usually 1-2 weeks)

---

## 🌐 **Making It Work for Others**

### **For Merchants (End Users):**

#### 1. **Installation Process**
```
1. Merchant finds app in Shopify App Store
2. Clicks "Install app"
3. Logs into Shopify account
4. Grants permissions
5. Redirected to your app
6. Enters Azan Wholesale credentials
7. Starts importing products
```

#### 2. **User Experience**
- **Step 1**: Install app from Shopify App Store
- **Step 2**: Connect Azan Wholesale account (App ID + Secret Key)
- **Step 3**: Browse and import products
- **Step 4**: Set custom pricing
- **Step 5**: Products appear in Shopify store
- **Step 6**: Automatic stock sync when orders are placed

### **For You (App Owner):**

#### 1. **User Management**
- Track which stores are using your app
- Monitor API usage and performance
- Handle user support requests
- Manage app updates and maintenance

#### 2. **Revenue Model Options**
```
Option A: Free App
- No charge to merchants
- You earn from wholesale margins

Option B: Monthly Subscription
- Basic: $9.99/month (100 products)
- Pro: $29.99/month (unlimited products)

Option C: Per-Import Fee
- $0.10 per product imported
- Or 1% of product price

Option D: Freemium
- Free for 10 products
- Paid plans for more features
```

#### 3. **Analytics and Monitoring**
- Track number of active stores
- Monitor product imports
- Track order processing
- Analyze user behavior

---

## 🔐 **Security Considerations**

### 1. **Production Security**
```bash
# Always use HTTPS
# Implement rate limiting
# Validate all inputs
# Use environment variables for secrets
# Implement proper error handling
# Add logging and monitoring
```

### 2. **Shopify Security Requirements**
- Must use HTTPS
- Must validate webhook signatures
- Must follow Shopify's API rate limits
- Must have proper data handling policies
- Must provide privacy policy

### 3. **Data Protection**
- Encrypt sensitive data
- Follow GDPR compliance
- Have clear data retention policies
- Provide data deletion options

---

## 📊 **Monitoring and Maintenance**

### 1. **Set Up Monitoring**
```bash
# Health check endpoint
GET /api/health

# Error tracking (Sentry, etc.)
# Performance monitoring
# User analytics
```

### 2. **Regular Updates**
- Keep dependencies updated
- Monitor Shopify API changes
- Update app features based on feedback
- Regular security audits

### 3. **Customer Support**
- Provide documentation
- Set up support email
- Create FAQ section
- Monitor user feedback

---

## 🎯 **Next Steps**

### Immediate Actions:
1. **Deploy the app** using one of the methods above
2. **Test with real credentials** from Azan Wholesale
3. **Create Shopify Partner account**
4. **Prepare app store listing**

### Medium-term Goals:
1. **Submit to Shopify App Store**
2. **Set up user onboarding**
3. **Create documentation**
4. **Implement analytics**

### Long-term Goals:
1. **Scale infrastructure**
2. **Add more features**
3. **Expand to other platforms**
4. **Build user community**

---

## 🆘 **Troubleshooting**

### Common Issues:
1. **CORS Errors**: Ensure proper CORS configuration
2. **Authentication Failures**: Check API credentials and headers
3. **Shopify API Limits**: Implement rate limiting
4. **Webhook Failures**: Verify webhook signatures
5. **Deployment Issues**: Check environment variables

### Support Resources:
- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Shopify API Reference](https://shopify.dev/docs/api/admin-rest)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

---

Ready to deploy? Start with Option A (Vercel) for the quickest setup, then move to Shopify App Store submission!