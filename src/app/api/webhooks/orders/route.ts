import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface ShopifyOrder {
  id: number
  order_number: string
  created_at: string
  financial_status: string
  fulfillment_status: string
  line_items: Array<{
    id: number
    sku: string
    quantity: number
    title: string
    variant_id: number
  }>
}

interface StockUpdateRequest {
  sku: string
  quantity: number
  action: 'decrease' | 'increase'
}

// This would be your Azan Wholesale API endpoint for stock updates
const AZAN_STOCK_UPDATE_URL = 'https://beta.azanwholesale.com/api/update-stock'

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook request (you should add proper HMAC verification)
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    const topic = request.headers.get('x-shopify-topic')
    
    // For now, we'll skip HMAC verification for development
    // In production, you should verify the webhook signature
    
    if (topic !== 'orders/create' && topic !== 'orders/updated') {
      return NextResponse.json(
        { success: false, message: 'Unsupported webhook topic' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const shopifyOrder: ShopifyOrder = body

    // Only process paid orders
    if (shopifyOrder.financial_status !== 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Order not paid, skipping stock update'
      })
    }

    // Extract line items and prepare stock updates
    const stockUpdates: StockUpdateRequest[] = []
    
    for (const item of shopifyOrder.line_items) {
      if (item.sku) {
        stockUpdates.push({
          sku: item.sku,
          quantity: item.quantity,
          action: 'decrease'
        })
      }
    }

    if (stockUpdates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No items with SKU found in order'
      })
    }

    // Send stock updates to Azan Wholesale API
    // Note: You'll need to implement this endpoint on your backend
    // For now, we'll simulate the response
    
    const appId = process.env.AZAN_APP_ID || request.headers.get('x-azan-app-id')
    const secretKey = process.env.AZAN_SECRET_KEY || request.headers.get('x-azan-secret-key')

    if (!appId || !secretKey) {
      return NextResponse.json(
        { success: false, message: 'Missing Azan API credentials' },
        { status: 400 }
      )
    }

    // Simulate sending stock updates to your API
    // In reality, you would make actual API calls here
    console.log('Stock updates to send:', stockUpdates)
    
    // Example of how you would call your API:
    /*
    const apiClient = axios.create({
      baseURL: 'https://beta.azanwholesale.com',
      headers: {
        'Content-Type': 'application/json',
        'App-ID': appId,
        'Secret-Key': secretKey
      }
    })

    for (const update of stockUpdates) {
      await apiClient.post('/api/update-stock', update)
    }
    */

    return NextResponse.json({
      success: true,
      message: `Stock updates processed for ${stockUpdates.length} items`,
      updates: stockUpdates,
      orderId: shopifyOrder.id
    })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}