import { useEffect } from 'react'
import { createApp } from '@shopify/app-bridge'
import { Redirect } from '@shopify/app-bridge/actions'

interface ShopifyAppBridgeProps {
  shop: string
  apiKey: string
}

export function useShopifyAppBridge({ shop, apiKey }: ShopifyAppBridgeProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && shop && apiKey) {
      // Initialize App Bridge
      const app = createApp({
        apiKey: apiKey,
        shop: shop,
        host: new URLSearchParams(window.location.search).get('host'),
      })

      // Set up the app for embedded experience
      const redirect = Redirect.create(app)
      redirect.dispatch(Redirect.Action.REMOTE, `${window.location.origin}?shop=${shop}`)
    }
  }, [shop, apiKey])
}