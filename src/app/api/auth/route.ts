import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Shopify OAuth configuration
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET
const SCOPES = ['read_products', 'write_products', 'read_orders', 'read_inventory', 'write_inventory']

interface ShopifyAuthRequest {
  shop: string
  code?: string
  hmac?: string
  state?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')
  const hmac = searchParams.get('hmac')
  const state = searchParams.get('state')

  // Step 1: Initial authorization request
  if (!code) {
    if (!shop) {
      return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
    }

    // Generate nonce for security
    const nonce = Math.random().toString(36).substring(2, 15)
    
    // Build authorization URL
    const authUrl = new URL(`https://${shop}/admin/oauth/authorize`)
    authUrl.searchParams.append('client_id', SHOPIFY_API_KEY!)
    authUrl.searchParams.append('scope', SCOPES.join(','))
    authUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`)
    authUrl.searchParams.append('state', nonce)
    authUrl.searchParams.append('grant_options[]', 'per-user')

    return NextResponse.redirect(authUrl.toString())
  }

  // Step 2: Handle callback with authorization code
  if (code && shop && hmac) {
    try {
      // Verify HMAC signature (simplified for demo)
      // In production, you should properly verify the HMAC signature
      
      // Exchange authorization code for access token
      const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      })

      const { access_token } = tokenResponse.data

      // Get shop information
      const shopResponse = await axios.get(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': access_token,
        },
      })

      const shopData = shopResponse.data.shop

      // Store the shop data and access token
      // In production, you would store this in a database
      console.log('Shop connected:', {
        shop,
        access_token,
        shop_name: shopData.name,
        shop_email: shopData.email,
      })

      // Redirect to the app with success message
      const redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!)
      redirectUrl.searchParams.append('shop', shop)
      redirectUrl.searchParams.append('success', 'true')
      
      return NextResponse.redirect(redirectUrl.toString())

    } catch (error: any) {
      console.error('OAuth callback error:', error)
      return NextResponse.json(
        { error: 'Failed to complete OAuth flow' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}