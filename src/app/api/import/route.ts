import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { tokenStorage } from '@/lib/token-storage'

interface ImportRequest {
  productId: number
  shop: string
  customPrice?: number
  appId: string
  secretKey: string
}

interface AzanProduct {
  id: number
  name: string
  slug: string
  sku: string
  mrp_price: number
  wholesale_price: number
  stock: number
  description: string
  pictures: string[]
  category?: string
  brand?: string
}

interface ShopifyProduct {
  title: string
  body_html: string
  vendor: string
  product_type: string
  variants: Array<{
    title: string
    price: string
    sku: string
    inventory_quantity: number
    inventory_management: string
  }>
  images: Array<{
    src: string
  }>
}

// In-memory storage for shop tokens (shared with auth callback)
const shopTokens = tokenStorage

export async function POST(request: NextRequest) {
  try {
    const body: ImportRequest = await request.json()
    const { productId, shop, customPrice, appId, secretKey } = body

    if (!productId || !shop || !appId || !secretKey) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the Shopify access token for this shop
    const shopifyAccessToken = shopTokens.get(shop)
    if (!shopifyAccessToken) {
      return NextResponse.json(
        { success: false, message: 'Shop not authenticated. Please reinstall the app.' },
        { status: 401 }
      )
    }

    // Fetch product data from Azan Wholesale API
    const apiClient = axios.create({
      baseURL: 'https://beta.azanwholesale.com',
      headers: {
        'Content-Type': 'application/json',
        'App-ID': appId,
        'Secret-Key': secretKey
      }
    })

    const productResponse = await apiClient.get('/api/en/products/by-api')
    
    if (!productResponse.data.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch product data from Azan Wholesale' },
        { status: 400 }
      )
    }

    const azanProduct = productResponse.data.data.find((p: AzanProduct) => p.id === productId)
    
    if (!azanProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Prepare Shopify product data
    const shopifyProduct: ShopifyProduct = {
      title: azanProduct.name,
      body_html: azanProduct.description,
      vendor: azanProduct.brand || 'Azan Wholesale',
      product_type: azanProduct.category || 'General',
      variants: [{
        title: 'Default',
        price: (customPrice || azanProduct.mrp_price).toString(),
        sku: azanProduct.sku,
        inventory_quantity: azanProduct.stock,
        inventory_management: 'shopify'
      }],
      images: azanProduct.pictures.map(pic => ({ src: pic }))
    }

    // Create product in Shopify
    const shopifyApiUrl = `https://${shop}/admin/api/2024-01/products.json`
    const shopifyResponse = await axios.post(
      shopifyApiUrl,
      { product: shopifyProduct },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken
        }
      }
    )

    if (shopifyResponse.status === 201) {
      return NextResponse.json({
        success: true,
        message: 'Product imported successfully',
        azanProduct: azanProduct,
        shopifyProduct: shopifyResponse.data.product
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to create product in Shopify' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}