// Simple query cache to prevent duplicate requests
class QueryCache {
  private cache = new Map<
    string,
    { data: unknown; timestamp: number; promise?: Promise<unknown> }
  >();
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds

  get(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  set(key: string, data: unknown) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    return (
      cached !== undefined &&
      Date.now() - cached.timestamp < this.CACHE_DURATION
    );
  }

  isPending(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && cached.promise !== undefined;
  }

  setPending(key: string, promise: Promise<unknown>) {
    this.cache.set(key, { data: null, timestamp: Date.now(), promise });
  }

  clearPending(key: string) {
    const cached = this.cache.get(key);
    if (cached) {
      cached.promise = undefined;
    }
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const queryCache = new QueryCache();

// Cleanup expired entries every minute
setInterval(() => {
  queryCache.cleanup();
}, 60 * 1000);
