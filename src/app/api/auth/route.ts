import { NextRequest, NextResponse } from 'next/server'

// Shopify OAuth configuration
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!
const SCOPES = ['read_products', 'write_products', 'read_orders', 'read_inventory', 'write_inventory']
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')

  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
  }

  // Validate shop domain format
  if (!shop.endsWith('.myshopify.com') && !shop.endsWith('.shopify.com')) {
    return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 })
  }

  // Generate nonce for security
  const nonce = crypto.randomUUID()
  
  // Build authorization URL
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`)
  authUrl.searchParams.append('client_id', SHOPIFY_API_KEY)
  authUrl.searchParams.append('scope', SCOPES.join(','))
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
  authUrl.searchParams.append('state', nonce)
  authUrl.searchParams.append('grant_options[]', 'per-user')

  return NextResponse.redirect(authUrl.toString())
}