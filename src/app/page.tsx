"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Filter, Package, DollarSign, ShoppingCart, Settings, Store, Key, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useShopifyAppBridge } from '@/hooks/use-shopify-app-bridge'

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
  // Add any other fields your API provides
}

interface ApiResponse {
  success: boolean
  data: AzanProduct[]
  message?: string
}

export default function Home() {
  // Get Shopify parameters from URL
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('')
  const shop = urlParams.get('shop') || ''
  const host = urlParams.get('host') || ''
  const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || ''

  // Initialize Shopify App Bridge
  useShopifyAppBridge({ shop, apiKey })

  const [products, setProducts] = useState<AzanProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<AzanProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [appId, setAppId] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [importingProduct, setImportingProduct] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [selectedProductForPricing, setSelectedProductForPricing] = useState<AzanProduct | null>(null)
  const [customPrice, setCustomPrice] = useState('')
  const [isEmbedded, setIsEmbedded] = useState(false)

  // API configuration
  const API_BASE_URL = 'https://beta.azanwholesale.com'
  const API_ENDPOINT = '/api/en/products/by-api'

  // Detect if we're running in Shopify embedded environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setIsEmbedded(!!urlParams.get('shop') && !!urlParams.get('host'))
    }
  }, [])

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<ApiResponse>(API_ENDPOINT, {
        headers: {
          'App-ID': appId,
          'Secret-Key': secretKey
        }
      })

      if (response.data.success && response.data.data) {
        const productsData = response.data.data
        setProducts(productsData)
        setFilteredProducts(productsData)
        
        // Extract unique categories and brands
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))]
        const uniqueBrands = [...new Set(productsData.map(p => p.brand).filter(Boolean))]
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
        
        setIsAuthenticated(true)
      } else {
        setError(response.data.message || 'Failed to fetch products')
        setIsAuthenticated(false)
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.response?.data?.message || err.message || 'Failed to connect to API')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthenticate = () => {
    if (appId && secretKey) {
      fetchProducts()
    }
  }

  const handleImportProduct = async (productId: number, customPrice?: number) => {
    try {
      setImportingProduct(productId)
      
      // For embedded apps, we need to get the session token
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          shop,
          customPrice,
          appId,
          secretKey
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Product "${result.azanProduct.name}" imported successfully!`)
      } else {
        alert(`Failed to import product: ${result.message}`)
      }
    } catch (error: any) {
      console.error('Import error:', error)
      alert(`Failed to import product: ${error.message}`)
    } finally {
      setImportingProduct(null)
    }
  }

  const handleSetCustomPrice = (product: AzanProduct) => {
    setSelectedProductForPricing(product)
    setCustomPrice(product.mrp_price.toString())
    setShowPricingDialog(true)
  }

  const handleImportWithCustomPrice = () => {
    if (selectedProductForPricing && customPrice) {
      const price = parseFloat(customPrice)
      if (!isNaN(price) && price > 0) {
        handleImportProduct(selectedProductForPricing.id, price)
        setShowPricingDialog(false)
        setSelectedProductForPricing(null)
        setCustomPrice('')
      }
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    filterProducts()
  }, [searchTerm, selectedCategory, selectedBrand, products])

  const ProductCard = ({ product }: { product: AzanProduct }) => (
    <Card className="w-full max-w-sm">
      <div className="aspect-square relative">
        <img
          src={product.pictures && product.pictures.length > 0 ? product.pictures[0] : '/placeholder-product.png'}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-product.png'
          }}
        />
        {product.stock > 0 ? (
          <Badge className="absolute top-2 right-2 bg-green-500">In Stock</Badge>
        ) : (
          <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <div>
              <span className="text-2xl font-bold">${product.wholesale_price}</span>
              <p className="text-xs text-muted-foreground">Wholesale Price</p>
              <span className="text-lg text-green-600">${product.mrp_price}</span>
              <p className="text-xs text-muted-foreground">MRP Price</p>
            </div>
          </div>
          <Badge variant="outline">{product.brand}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>SKU: {product.sku}</span>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            disabled={product.stock === 0 || importingProduct === product.id}
            onClick={() => handleSetCustomPrice(product)}
            variant="outline"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Set MRP Price
          </Button>
          <Button 
            className="flex-1" 
            disabled={product.stock === 0 || importingProduct === product.id}
            onClick={() => handleImportProduct(product.id)}
          >
            {importingProduct === product.id ? (
              <>
                <Package className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Import
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ProductSkeleton = () => (
    <Card className="w-full max-w-sm">
      <Skeleton className="aspect-square rounded-t-lg" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                Azan Wholesale Shopify App
                {isEmbedded && <Badge variant="outline">Embedded</Badge>}
              </CardTitle>
              <CardDescription>
                {isEmbedded 
                  ? "Configure your Azan Wholesale credentials to start importing products"
                  : "Connect to your Azan Wholesale account to browse and import products"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Azan App ID</label>
                <Input
                  placeholder="Enter your Azan App ID"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Azan Secret Key</label>
                <Input
                  type="password"
                  placeholder="Enter your Azan Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                className="w-full" 
                onClick={handleAuthenticate}
                disabled={!appId || !secretKey}
              >
                <Key className="h-4 w-4 mr-2" />
                Connect to Azan Wholesale
              </Button>
              {isEmbedded && (
                <div className="text-center text-sm text-gray-600">
                  <p>Running inside Shopify Admin</p>
                  <p className="text-xs">Shop: {shop}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isEmbedded ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Header */}
      {!isEmbedded && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold">Azan Wholesale</h1>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isEmbedded ? 'p-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {isEmbedded && <span className="ml-2 text-blue-600">• Embedded Mode</span>}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shopify Settings</DialogTitle>
            <DialogDescription>
              Configure your Shopify store connection to import products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="store-url" className="text-sm font-medium mb-2 block">
                Shopify Store URL
              </Label>
              <Input
                id="store-url"
                placeholder="https://your-store.myshopify.com"
                value={shopifyStoreUrl}
                onChange={(e) => setShopifyStoreUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include https:// but without /admin
              </p>
            </div>
            <div>
              <Label htmlFor="access-token" className="text-sm font-medium mb-2 block">
                Shopify Access Token
              </Label>
              <Input
                id="access-token"
                type="password"
                placeholder="shpat_..."
                value={shopifyAccessToken}
                onChange={(e) => setShopifyAccessToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Create a custom app in Shopify to get this token
              </p>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">How to get Shopify Access Token:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Go to your Shopify Admin</li>
                <li>2. Navigate to Apps → Develop apps</li>
                <li>3. Create a new custom app</li>
                <li>4. Configure Admin API access with products:write scope</li>
                <li>5. Install the app and copy the access token</li>
              </ol>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setShowSettings(false)}
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Custom Price</DialogTitle>
            <DialogDescription>
              Set your selling price for this product
            </DialogDescription>
          </DialogHeader>
          {selectedProductForPricing && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{selectedProductForPricing.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Your Cost:</span>
                  <span className="font-semibold">${selectedProductForPricing.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className="font-semibold">{selectedProductForPricing.stock}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-price" className="text-sm font-medium mb-2 block">
                  Your Selling Price ($)
                </Label>
                <Input
                  id="custom-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                />
                {customPrice && !isNaN(parseFloat(customPrice)) && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Profit: </span>
                    <span className="font-semibold text-green-600">
                      ${(parseFloat(customPrice) - selectedProductForPricing.price).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({(((parseFloat(customPrice) - selectedProductForPricing.price) / selectedProductForPricing.price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPricingDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleImportWithCustomPrice}
                  disabled={!customPrice || isNaN(parseFloat(customPrice)) || parseFloat(customPrice) <= 0}
                >
                  Import with Custom Price
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}