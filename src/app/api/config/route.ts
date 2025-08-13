import { NextRequest, NextResponse } from 'next/server'

interface AppConfig {
  appId: string
  secretKey: string
  shopifyStoreUrl: string
  shopifyAccessToken: string
}

// In a real application, you would store this in a database
// For now, we'll use in-memory storage (this will reset on server restart)
let appConfig: AppConfig | null = null

export async function GET() {
  return NextResponse.json({
    success: true,
    config: appConfig
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: AppConfig = await request.json()
    const { appId, secretKey, shopifyStoreUrl, shopifyAccessToken } = body

    if (!appId || !secretKey || !shopifyStoreUrl || !shopifyAccessToken) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    appConfig = {
      appId,
      secretKey,
      shopifyStoreUrl,
      shopifyAccessToken
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      config: appConfig
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}