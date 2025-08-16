import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { tokenStorage } from '@/lib/token-storage'

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')
  const hmac = searchParams.get('hmac')
  const state = searchParams.get('state')

  if (!shop || !code || !hmac) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    // Verify HMAC signature
    const queryParams = new URLSearchParams(searchParams.toString())
    queryParams.delete('hmac')
    
    const message = queryParams.toString()
    const generatedHash = crypto
      .createHmac('sha256', SHOPIFY_API_SECRET)
      .update(message)
      .digest('base64')
    
    if (generatedHash !== hmac) {
      return NextResponse.json({ error: 'HMAC verification failed' }, { status: 401 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
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

    // Store shop information and access token
    const shopInfo = {
      shop,
      access_token,
      shop_name: shopData.name,
      shop_email: shopData.email,
      domain: shopData.domain,
      created_at: new Date().toISOString(),
    }

    // Store the access token for this shop
    tokenStorage.setToken(shop, access_token)

    console.log('Shop successfully connected:', shopInfo)

    // For embedded apps, redirect to Shopify admin with the app loaded
    const redirectUrl = `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`
    
    return NextResponse.redirect(redirectUrl)

  } catch (error: any) {
    console.error('OAuth callback error:', error.response?.data || error.message)
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    )
  }
}