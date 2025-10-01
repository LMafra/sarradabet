// Simple request deduplicator to prevent duplicate API calls
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)! as Promise<T>;
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes
      this.pendingRequests.delete(key);
    });

    // Store the promise
    this.pendingRequests.set(key, promise);

    return promise;
  }

  clear() {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
