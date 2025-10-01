// Simple query cache to prevent duplicate requests
class QueryCache {
  private cache = new Map<string, { data?: unknown; dataTimestamp?: number; promise?: Promise<unknown> }>();
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (
      cached !== undefined &&
      cached.dataTimestamp !== undefined &&
      Date.now() - cached.dataTimestamp < this.CACHE_DURATION &&
      cached.data !== undefined
    ) {
      return cached.data as T;
    }
    return null;
  }

  set<T>(key: string, data: T) {
    const existing = this.cache.get(key);
    const promise = existing?.promise;
    this.cache.set(key, { data, dataTimestamp: Date.now(), promise });
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    return (
      cached !== undefined &&
      cached.dataTimestamp !== undefined &&
      Date.now() - cached.dataTimestamp < this.CACHE_DURATION &&
      cached.data !== undefined
    );
  }

  isPending(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && cached.promise !== undefined;
  }

  setPending<T>(key: string, promise: Promise<T | null>) {
    // Preserve any existing cached data while marking the request as pending
    const existing = this.cache.get(key);
    this.cache.set(key, {
      data: existing?.data,
      dataTimestamp: existing?.dataTimestamp,
      promise,
    });
    // Ensure pending is cleared only after the shared promise settles
    promise.finally(() => {
      const current = this.cache.get(key);
      if (current && current.promise === promise) {
        current.promise = undefined;
      }
    });
  }

  getPending<T>(key: string): Promise<T | null> | undefined {
    const cached = this.cache.get(key);
    return cached?.promise as Promise<T | null> | undefined;
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
      const hasValidData =
        value.dataTimestamp !== undefined &&
        value.data !== undefined &&
        now - value.dataTimestamp < this.CACHE_DURATION;
      const hasPending = value.promise !== undefined;

      // Delete entries that have no valid data and no pending promise
      if (!hasValidData && !hasPending) {
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
