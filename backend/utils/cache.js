class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlMs = 60000) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  del(key) {
    this.cache.delete(key);
  }

  flush() {
    this.cache.clear();
  }
}

export const productCache = new SimpleCache();
export default SimpleCache;
