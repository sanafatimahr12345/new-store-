import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Data storage directory
const DATA_DIR = path.join(process.cwd(), 'server-data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const DELETED_IDS_FILE = path.join(DATA_DIR, 'deleted_ids.json');
const UNREAD_COUNT_FILE = path.join(DATA_DIR, 'unread_count.json');

const INITIAL_DEFAULT_PRODUCTS = [
  {
    id: 'desi-ghee-pure',
    name: 'Pure Desi Ghee',
    slug: 'pure-desi-ghee',
    category: 'ghee',
    categoryLabel: 'Desi Ghee',
    description: 'Traditional homemade-style desi ghee with rich aroma and authentic taste.',
    longDescription: 'Crafted following age-old Pakistani churned butter traditions, our Pure Desi Ghee is prepared in small batches from whole milk curds (bilona method). Slowly simmered over low flame until golden clarity and intoxicating nutty aroma are achieved. Free from palm oil, artificial flavors, preservatives, and chemicals.',
    price: 2450,
    oldPrice: 2800,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'BEST SELLER',
    image: '/images/product_pure_desi_ghee_1793354317123.jpg',
    sizes: ['500g', '1kg', '2kg'],
    defaultSize: '1kg',
    origin: 'Punjab Dairy Heartland, Pakistan',
    ingredients: ['100% Clarified Butter Fat from Pure Whole Buffalo Milk'],
    nutritionalHighlights: ['Rich in Omega-3 and Butyric Acid', 'High Smoke Point (250°C)', 'Natural Vitamins A, D, E & K'],
    inStock: true,
    featured: true,
    isBestSeller: true,
  },
  {
    id: 'organic-honey-pure',
    name: 'Organic Pure Honey',
    slug: 'organic-pure-honey',
    category: 'honey',
    categoryLabel: 'Organic Honey',
    description: 'Naturally harvested honey with rich flavor and traditional goodness.',
    longDescription: 'Raw, unfiltered, and 100% pure wildflower honey ethically harvested from untouched mountain valleys. Kept unheated to retain naturally occurring bee pollen, active enzymes, and beneficial antioxidants. Delivers an opulent amber hue and deep floral notes that elevate morning breakfast and herbal tea.',
    price: 1850,
    oldPrice: 2100,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'ORGANIC',
    image: '/public/assets/aistudio/image_ba2ec814.png',
    sizes: ['450g', '900g'],
    defaultSize: '450g',
    origin: 'Margalla Foothills & Northern Valleys, Pakistan',
    ingredients: ['100% Raw Unpasteurized Pure Honey'],
    nutritionalHighlights: ['Natural Prebiotic & Digestive Enzymes', 'Zero Added Corn Syrup or Sugar', 'Rich in Polyphenols'],
    inStock: true,
    featured: true,
    isBestSeller: true,
  },
  {
    id: 'traditional-mix-achar',
    name: 'Traditional Mix Achar',
    slug: 'traditional-mix-achar',
    category: 'pickles',
    categoryLabel: 'Traditional Pickles',
    description: 'Authentic homemade-style pickle with carefully selected spices.',
    longDescription: 'Handcrafted according to ancestral household recipes, this vibrant traditional Pakistani mix achar features crunchy green raw mango, zesty local lemons, tender green chilies, and whole sun-cured spices immersed in pure cold-pressed mustard oil. Sun-cured for three weeks for optimal maturation and tangy, zesty bite.',
    price: 850,
    oldPrice: 1000,
    rating: 4.9,
    reviewsCount: 89,
    badge: 'TRADITIONAL',
    image: '/images/product_mix_achar_1793354318513.jpg',
    sizes: ['450g', '1kg'],
    defaultSize: '450g',
    origin: 'Multan, South Punjab',
    ingredients: ['Raw Mango', 'Lemon', 'Green Chili', 'Cold-Pressed Mustard Oil', 'Fennel Seeds (Saunf)', 'Fenugreek (Methi Dana)', 'Nigella Seeds (Kalonji)', 'Himalayan Pink Salt', 'Turmeric'],
    nutritionalHighlights: ['Naturally Fermented with Probiotics', 'Zero Synthetic Acetic Acid/Vinegar', 'Cold-Pressed Oil Base'],
    inStock: true,
    featured: true,
    isBestSeller: false,
  },
  {
    id: 'khalis-cow-ghee',
    name: 'Khalis Cow Desi Ghee',
    slug: 'khalis-cow-desi-ghee',
    category: 'ghee',
    categoryLabel: 'Desi Ghee',
    description: 'Golden yellow A2 grass-fed cow ghee with a delicate sweet fragrance.',
    longDescription: 'Sourced from free-grazing indigenous Sahiwal and Cholistani cows. Golden yellow due to natural beta-carotene, this light and easily digestible ghee is ideal for children, elders, and ayurvedic wellness recipes.',
    price: 2850,
    oldPrice: 3200,
    rating: 5.0,
    reviewsCount: 64,
    badge: 'A2 GRASS-FED',
    image: '/images/product_khalis_cow_ghee_1793359292362.jpg',
    sizes: ['500g', '1kg'],
    defaultSize: '1kg',
    origin: 'Cholistan & Sahiwal Meadows',
    ingredients: ['100% Clarified Butter Fat from Grass-Fed Desi Cow Milk'],
    nutritionalHighlights: ['Natural Beta-Carotene', 'Easy Digestion', 'A2 Beta-Casein Origin'],
    inStock: true,
    featured: false,
    isBestSeller: true,
  },
  {
    id: 'shahi-garam-masala',
    name: 'Shahi Royal Garam Masala',
    slug: 'shahi-royal-garam-masala',
    category: 'spices',
    categoryLabel: 'Organic Spices',
    description: 'Slow-roasted whole 14-spice royal blend freshly stone-ground in stone mills.',
    longDescription: 'A majestic Mughal-inspired blend combining green cardamom, black cumin (shahi jeera), mace (javitri), nutmeg (jaiphal), star anise, cinnamon quills, and cloves. Mildly roasted on heavy iron skillets before gentle slow grinding to prevent volatile oil loss.',
    price: 650,
    oldPrice: 750,
    rating: 4.9,
    reviewsCount: 43,
    badge: 'HAND-GROUND',
    image: '/images/product_mix_achar_1793354318513.jpg',
    sizes: ['150g', '300g'],
    defaultSize: '150g',
    origin: 'Handmade in Lahore',
    ingredients: ['Cardamom', 'Cinnamon', 'Cloves', 'Mace', 'Nutmeg', 'Star Anise', 'Black Cumin', 'Coriander'],
    nutritionalHighlights: ['Zero Fillers or Starch', '100% Whole Spices', 'Sealed in Aroma-Lock Jar'],
    inStock: true,
    featured: false,
    isBestSeller: false,
  }
];

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
  }
}

function getDeletedIds(): string[] {
  return readJsonFile<string[]>(DELETED_IDS_FILE, []);
}

function getStoredProducts(): any[] {
  const deletedIds = getDeletedIds();
  let stored = readJsonFile<any[]>(PRODUCTS_FILE, []);
  
  if (!stored || stored.length === 0) {
    stored = [...INITIAL_DEFAULT_PRODUCTS];
    writeJsonFile(PRODUCTS_FILE, stored);
  } else {
    // Ensure default products are included unless deleted
    for (const initProd of INITIAL_DEFAULT_PRODUCTS) {
      if (!deletedIds.includes(initProd.id) && !stored.some((p: any) => p.id === initProd.id)) {
        stored.push(initProd);
      }
    }
  }

  // Filter out any explicitly deleted product IDs
  return stored.filter((p: any) => !deletedIds.includes(p.id));
}

function getStoredOrders(): any[] {
  return readJsonFile<any[]>(ORDERS_FILE, []);
}

function getUnreadCount(): number {
  return readJsonFile<{ count: number }>(UNREAD_COUNT_FILE, { count: 0 }).count;
}

function setUnreadCount(count: number): void {
  writeJsonFile(UNREAD_COUNT_FILE, { count });
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Endpoints
  // 1. Get products (synchronized across all devices)
  app.get('/api/products', (_req: Request, res: Response) => {
    try {
      const products = getStoredProducts();
      res.json({ success: true, products });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 2. Add product (Admin adds product, immediately persisted for all devices)
  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const product = req.body;
      if (!product || !product.id || !product.name) {
        res.status(400).json({ success: false, error: 'Product name and ID are required' });
        return;
      }

      // Remove from deleted IDs if previously deleted
      const deletedIds = getDeletedIds();
      if (deletedIds.includes(product.id)) {
        writeJsonFile(DELETED_IDS_FILE, deletedIds.filter((id) => id !== product.id));
      }

      const products = getStoredProducts();
      const existingIdx = products.findIndex((p: any) => p.id === product.id);
      if (existingIdx >= 0) {
        products[existingIdx] = { ...products[existingIdx], ...product };
      } else {
        products.unshift(product);
      }

      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true, product, products });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 3. Batch sync products (useful if admin had stored products offline in browser)
  app.post('/api/products/batch-sync', (req: Request, res: Response) => {
    try {
      const { customProducts } = req.body;
      if (Array.isArray(customProducts) && customProducts.length > 0) {
        const deletedIds = getDeletedIds();
        const currentProducts = getStoredProducts();
        let changed = false;

        for (const cp of customProducts) {
          if (!deletedIds.includes(cp.id) && !currentProducts.some((p: any) => p.id === cp.id)) {
            currentProducts.unshift(cp);
            changed = true;
          }
        }

        if (changed) {
          writeJsonFile(PRODUCTS_FILE, currentProducts);
        }
        res.json({ success: true, products: currentProducts });
        return;
      }
      res.json({ success: true, products: getStoredProducts() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 4. Update product
  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const products = getStoredProducts();
      const idx = products.findIndex((p: any) => p.id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      products[idx] = { ...products[idx], ...updates };
      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true, product: products[idx], products });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 5. Delete product
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedIds = getDeletedIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        writeJsonFile(DELETED_IDS_FILE, deletedIds);
      }

      const products = getStoredProducts().filter((p: any) => p.id !== id);
      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true, id, products });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 6. Get orders (all devices and admin view)
  app.get('/api/orders', (_req: Request, res: Response) => {
    try {
      const orders = getStoredOrders();
      res.json({ success: true, orders });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 7. Place new order (Customer on mobile or desktop places an order)
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const order = req.body;
      if (!order || !order.customer || !order.items) {
        res.status(400).json({ success: false, error: 'Incomplete order payload' });
        return;
      }

      const orders = getStoredOrders();
      // Ensure order has unique ID and placedAt
      const newOrder = {
        ...order,
        id: order.id || `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        placedAt: order.placedAt || new Date().toISOString(),
        status: order.status || 'Confirmed'
      };

      orders.unshift(newOrder);
      writeJsonFile(ORDERS_FILE, orders);

      // Increment unread order count for admin notification
      const currentUnread = getUnreadCount();
      setUnreadCount(currentUnread + 1);

      res.json({ success: true, order: newOrder, orders, unreadCount: currentUnread + 1 });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 8. Update order status
  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const orders = getStoredOrders();
      const idx = orders.findIndex((o: any) => o.id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      orders[idx].status = status;
      writeJsonFile(ORDERS_FILE, orders);
      res.json({ success: true, order: orders[idx], orders });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 9. Delete order
  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const orders = getStoredOrders().filter((o: any) => o.id !== id);
      writeJsonFile(ORDERS_FILE, orders);
      res.json({ success: true, id, orders });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 10. Unified real-time sync endpoint
  app.get('/api/sync', (_req: Request, res: Response) => {
    try {
      const products = getStoredProducts();
      const orders = getStoredOrders();
      const unreadCount = getUnreadCount();
      res.json({
        success: true,
        products,
        orders,
        unreadCount,
        serverTime: Date.now()
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 11. Reset unread orders count (when admin opens the Admin Portal)
  app.post('/api/admin/reset-unread', (_req: Request, res: Response) => {
    try {
      setUnreadCount(0);
      res.json({ success: true, unreadCount: 0 });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pure Harvest Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
