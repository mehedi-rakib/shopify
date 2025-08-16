// Shared token storage for shop access tokens
// In production, this should be replaced with a database

class TokenStorage {
  private tokens = new Map<string, string>()

  setToken(shop: string, token: string): void {
    this.tokens.set(shop, token)
  }

  getToken(shop: string): string | undefined {
    return this.tokens.get(shop)
  }

  removeToken(shop: string): boolean {
    return this.tokens.delete(shop)
  }

  hasToken(shop: string): boolean {
    return this.tokens.has(shop)
  }

  getAllShops(): string[] {
    return Array.from(this.tokens.keys())
  }

  clear(): void {
    this.tokens.clear()
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage()