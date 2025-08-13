# 🛍️ Azan Wholesale Shopify App

A modern Shopify app built with Next.js that enables merchants to browse and import products from Azan Wholesale's dropshipping platform directly into their Shopify stores.

## ✨ Features

### 🛒 Product Management
- **Product Browsing**: Browse and search through Azan Wholesale's product catalog
- **Advanced Filtering**: Filter products by category, brand, and search terms
- **Product Import**: One-click import of products to Shopify stores
- **Pricing Control**: Set custom MRP prices while maintaining wholesale prices
- **Real-time Stock**: Live inventory status and stock level management

### 🔌 API Integration
- **Azan Wholesale API**: Seamless integration with beta.azanwholesale.com
- **Shopify API**: Direct product creation and management
- **Webhook Support**: Automatic stock updates when orders are placed
- **Authentication**: Secure App ID and Secret Key authentication

### 🎨 User Interface
- **Modern Design**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Loading States**: Smooth loading animations and error handling
- **Intuitive Navigation**: Easy-to-use interface for merchants

## 🚀 Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### 🧩 UI Components
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations

### 🔄 API & Data
- **🌐 Axios** - HTTP client for API requests
- **🔄 TanStack Query** - Data synchronization
- **🐻 Zustand** - State management

## 📋 Prerequisites

Before using this app, you'll need:

1. **Azan Wholesale Account**: 
   - App ID and Secret Key from Azan Wholesale
   - Access to beta.azanwholesale.com API

2. **Shopify Store**:
   - Shopify store URL
   - Shopify API access token with appropriate permissions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application running.

## 🛠️ Setup Instructions

### 1. Configure Azan Wholesale API
- Obtain your App ID and Secret Key from Azan Wholesale
- Enter these credentials in the app's authentication screen

### 2. Configure Shopify Store
- Get your Shopify store URL (e.g., `https://your-store.myshopify.com`)
- Generate a Shopify API access token with:
  - `read_products` permission
  - `write_products` permission
  - `read_orders` permission

### 3. Browse and Import Products
- Browse through the available products
- Use search and filters to find specific products
- Click "Set MRP Price" to customize the selling price
- Click "Quick Import" to add products to your Shopify store

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── import/              # Product import endpoint
│   │   ├── webhooks/            # Shopify webhook handlers
│   │   ├── config/              # Configuration management
│   │   └── health/              # Health check endpoint
│   ├── page.tsx                 # Main application page
│   └── layout.tsx              # Root layout
├── components/                   # Reusable React components
│   └── ui/                      # shadcn/ui components
├── hooks/                       # Custom React hooks
└── lib/                         # Utility functions
```

## 🔌 API Endpoints

### Azan Wholesale API
- **Base URL**: `https://beta.azanwholesale.com`
- **Products Endpoint**: `/api/en/products/by-api`
- **Authentication**: App ID and Secret Key in headers

### Shopify Integration
- **Product Creation**: Via Shopify Admin API
- **Webhook Support**: Order creation and updates
- **Stock Management**: Automatic inventory synchronization

## 🔄 Webhook Integration

The app supports Shopify webhooks for:

### Order Webhooks (`/api/webhooks/orders`)
- **Triggers**: `orders/create`, `orders/updated`
- **Function**: Automatically update stock levels when orders are paid
- **Authentication**: HMAC verification (recommended for production)

## 🔧 Configuration

### Environment Variables (Optional)
```env
# Azan Wholesale API Credentials
AZAN_APP_ID=your_app_id
AZAN_SECRET_KEY=your_secret_key

# Shopify Store Configuration
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
```

### In-App Configuration
The app also provides a settings panel for:
- Azan Wholesale API credentials
- Shopify store configuration
- Custom pricing settings

## 🎨 Available Features

### Product Browsing
- **Search**: Real-time product search
- **Filters**: Category and brand filtering
- **Grid View**: Responsive product grid with images
- **Stock Status**: Live inventory indicators

### Product Import
- **One-click Import**: Direct import to Shopify
- **Custom Pricing**: Set MRP prices independently
- **Image Handling**: Automatic image import and optimization
- **Variant Support**: Single variant products with inventory

### Stock Management
- **Real-time Updates**: Live stock synchronization
- **Order Processing**: Automatic stock deduction on sales
- **Error Handling**: Graceful failure recovery
- **Logging**: Detailed import and sync logs

## 🛡️ Security Considerations

- **API Authentication**: Secure header-based authentication
- **Webhook Verification**: HMAC signature verification
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Secure error message handling

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
# Build Docker image
docker build -t azan-wholesale-shopify-app .

# Run container
docker run -p 3000:3000 azan-wholesale-shopify-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Azan Wholesale**: Contact your Azan Wholesale representative
- **Technical Issues**: Create an issue in the repository
- **API Documentation**: Refer to Azan Wholesale API documentation

---

Built with ❤️ for Azan Wholesale merchants. Powered by Next.js and modern web technologies.
