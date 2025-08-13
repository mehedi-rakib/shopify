import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET

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
    // Verify HMAC signature (simplified - in production, implement proper HMAC verification)
    const query = searchParams.toString()
    const params = new URLSearchParams(query)
    params.delete('hmac')
    
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

    // In production, store this information in your database
    const shopInfo = {
      shop,
      access_token,
      shop_name: shopData.name,
      shop_email: shopData.email,
      domain: shopData.domain,
      created_at: new Date().toISOString(),
    }

    console.log('Shop successfully connected:', shopInfo)

    // Redirect to the main app with success message
    const redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!)
    redirectUrl.searchParams.append('shop', shop)
    redirectUrl.searchParams.append('success', 'true')
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error: any) {
    console.error('OAuth callback error:', error.response?.data || error.message)
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    )
  }
}