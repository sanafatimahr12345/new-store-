import { Product, PlacedOrder } from '../types';

const CATALOG_KEY = 'ph_catalog';
const CUSTOM_PRODUCTS_KEY = 'ph_custom_products';
const DELETED_IDS_KEY = 'ph_deleted_product_ids';
const ORDERS_KEY = 'ph_orders';
const UNREAD_ORDERS_KEY = 'ph_unread_orders_count';

// Compress any image file before saving to prevent localStorage QuotaExceededError
export const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.78
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original base64 if canvas is unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Fill background with white in case of transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// IndexedDB Helper for permanent persistence fallback
const DB_NAME = 'DesiRassoiDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

const openDB = (): Promise<IDBDatabase | null> => {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

const idbSet = async (key: string, value: any): Promise<void> => {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
};

const idbGet = async <T>(key: string): Promise<T | null> => {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

// Load catalog seamlessly from localStorage with deleted IDs filtered
export const loadCatalog = (initialProducts: Product[]): Product[] => {
  try {
    const deletedIdsRaw = localStorage.getItem(DELETED_IDS_KEY);
    const deletedIds: string[] = deletedIdsRaw ? JSON.parse(deletedIdsRaw) : [];

    const savedRaw = localStorage.getItem(CATALOG_KEY);
    const customRaw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);

    let parsedCatalog: Product[] = [];

    if (savedRaw) {
      try {
        parsedCatalog = JSON.parse(savedRaw);
      } catch (e) {
        parsedCatalog = [];
      }
    }

    let customProducts: Product[] = [];
    if (customRaw) {
      try {
        customProducts = JSON.parse(customRaw);
      } catch (e) {
        customProducts = [];
      }
    }

    // Build the master active list
    if (parsedCatalog.length > 0) {
      // Filter out deleted products and deprecated dummy IDs
      const cleaned = parsedCatalog.filter(
        (p) => !deletedIds.includes(p.id) && p.id !== 'sidr-berry-honey' && p.id !== 'cold-pressed-mustard-oil'
      );

      // Ensure any custom products are retained
      for (const cp of customProducts) {
        if (!cleaned.some((p) => p.id === cp.id) && !deletedIds.includes(cp.id)) {
          cleaned.unshift(cp);
        }
      }

      // Ensure initial products are present unless user explicitly deleted them
      for (const ip of initialProducts) {
        if (!cleaned.some((p) => p.id === ip.id) && !deletedIds.includes(ip.id)) {
          cleaned.push(ip);
        }
      }

      return cleaned;
    }

    // First time load: filter initial products by any stored deleted IDs + custom products
    const filteredInitial = initialProducts.filter((ip) => !deletedIds.includes(ip.id));
    return [...customProducts.filter((cp) => !deletedIds.includes(cp.id)), ...filteredInitial];
  } catch (err) {
    console.error('Error loading catalog from storage:', err);
    return initialProducts;
  }
};

// Persist the entire products array into localStorage and IndexedDB
export const saveCatalog = (products: Product[]): void => {
  try {
    // 1. Separate custom products (added by admin) to store in dedicated key
    const customProducts = products.filter(
      (p) => p.id.startsWith('prod-') || p.id.startsWith('custom-')
    );

    try {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
    } catch (quotaError) {
      console.warn('LocalStorage quota exceeded for full catalog; saving custom products only and backing up to IndexedDB', quotaError);
      try {
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
      } catch {}
    }

    // 2. Always back up to IndexedDB (virtually unlimited quota)
    idbSet(CATALOG_KEY, products);
    idbSet(CUSTOM_PRODUCTS_KEY, customProducts);
  } catch (err) {
    console.error('Error in saveCatalog:', err);
  }
};

// Record deleted product ID so it stays permanently deleted across all reloads
export const recordDeletedProductId = (productId: string): void => {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    const deletedIds: string[] = raw ? JSON.parse(raw) : [];
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
      idbSet(DELETED_IDS_KEY, deletedIds);
    }

    // Also remove from custom products if it was custom
    const customRaw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    if (customRaw) {
      try {
        const customProducts: Product[] = JSON.parse(customRaw);
        const filtered = customProducts.filter((p) => p.id !== productId);
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(filtered));
        idbSet(CUSTOM_PRODUCTS_KEY, filtered);
      } catch {}
    }
  } catch (err) {
    console.error('Error recording deleted product ID:', err);
  }
};

// Orders persistence
export const loadOrders = (): PlacedOrder[] => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load orders from localStorage:', e);
  }
  return [];
};

export const saveOrders = (orders: PlacedOrder[]): void => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    idbSet(ORDERS_KEY, orders);
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
};

export const getUnreadOrdersCount = (): number => {
  try {
    const val = localStorage.getItem(UNREAD_ORDERS_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const setUnreadOrdersCount = (count: number): void => {
  try {
    localStorage.setItem(UNREAD_ORDERS_KEY, count.toString());
  } catch {}
};

// ----------------------------------------------------------------------
// Centralized Cloud / Server API Synchronization (Multi-device support)
// ----------------------------------------------------------------------

// Fetch products from server, saving to local cache on success
export const fetchRemoteProducts = async (fallbackProducts: Product[]): Promise<Product[]> => {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        saveCatalog(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.warn('[Sync] Falling back to local catalog:', err);
  }
  return loadCatalog(fallbackProducts);
};

// Save a new product to server (visible across all mobile devices & browsers)
export const saveRemoteProduct = async (product: Product): Promise<Product[] | null> => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        saveCatalog(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.error('[Sync] Error saving remote product:', err);
  }
  return null;
};

// Update an existing product on server
export const updateRemoteProduct = async (product: Product): Promise<Product[] | null> => {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        saveCatalog(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.error('[Sync] Error updating remote product:', err);
  }
  return null;
};

// Permanently delete a product on server
export const deleteRemoteProduct = async (productId: string): Promise<Product[] | null> => {
  try {
    recordDeletedProductId(productId);
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        saveCatalog(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.error('[Sync] Error deleting remote product:', err);
  }
  return null;
};

// Batch sync any custom products stored locally in this device's browser to the server
export const syncLocalCustomProductsToServer = async (): Promise<Product[] | null> => {
  try {
    const customRaw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    if (!customRaw) return null;
    const customProducts = JSON.parse(customRaw);
    if (!Array.isArray(customProducts) || customProducts.length === 0) return null;

    const res = await fetch('/api/products/batch-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customProducts }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        saveCatalog(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.warn('[Sync] Local batch sync notice:', err);
  }
  return null;
};

// Fetch orders placed by customers across all devices
export const fetchRemoteOrders = async (): Promise<PlacedOrder[]> => {
  try {
    const res = await fetch('/api/orders', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        saveOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.warn('[Sync] Falling back to local orders:', err);
  }
  return loadOrders();
};

// Post a new customer order to the central server so admin receives it immediately
export const saveRemoteOrder = async (order: PlacedOrder): Promise<PlacedOrder[] | null> => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        saveOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.error('[Sync] Error saving order to server:', err);
  }
  return null;
};

// Update order status on the server
export const updateRemoteOrderStatus = async (
  orderId: string, 
  status: PlacedOrder['status']
): Promise<PlacedOrder[] | null> => {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        saveOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.error('[Sync] Error updating order status on server:', err);
  }
  return null;
};

// Delete an order on the server
export const deleteRemoteOrder = async (orderId: string): Promise<PlacedOrder[] | null> => {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        saveOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.error('[Sync] Error deleting order on server:', err);
  }
  return null;
};

// Real-time synchronization poll
export const fetchSyncData = async (): Promise<{
  products: Product[];
  orders: PlacedOrder[];
  unreadCount: number;
} | null> => {
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.products)) saveCatalog(data.products);
        if (Array.isArray(data.orders)) saveOrders(data.orders);
        if (typeof data.unreadCount === 'number') setUnreadOrdersCount(data.unreadCount);
        return {
          products: data.products,
          orders: data.orders,
          unreadCount: data.unreadCount,
        };
      }
    }
  } catch {
    // Silent on network hiccup
  }
  return null;
};

// Reset unread count on server
export const resetRemoteUnreadCount = async (): Promise<void> => {
  try {
    setUnreadOrdersCount(0);
    await fetch('/api/admin/reset-unread', { method: 'POST' });
  } catch (err) {
    console.warn('[Sync] Reset unread count notice:', err);
  }
};

