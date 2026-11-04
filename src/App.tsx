/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, PlacedOrder, ProductCategory } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { 
  loadCatalog, 
  saveCatalog, 
  recordDeletedProductId, 
  loadOrders, 
  saveOrders,
  getUnreadOrdersCount,
  setUnreadOrdersCount,
  fetchRemoteProducts,
  saveRemoteProduct,
  updateRemoteProduct,
  deleteRemoteProduct,
  syncLocalCustomProductsToServer,
  fetchRemoteOrders,
  saveRemoteOrder,
  updateRemoteOrderStatus,
  deleteRemoteOrder,
  fetchSyncData,
  resetRemoteUnreadCount
} from './utils/productStorage';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DiscoverCollection } from './components/DiscoverCollection';
import { BrandStory } from './components/BrandStory';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { AccountOrdersModal } from './components/AccountOrdersModal';
import { AdminDrawer } from './components/AdminDrawer';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { CompareModal } from './components/CompareModal';
import { FloatingCompareBar } from './components/FloatingCompareBar';

export default function App() {
  // Master products state (with permanent persistence of added & deleted products)
  const [products, setProducts] = useState<Product[]>(() => {
    return loadCatalog(INITIAL_PRODUCTS);
  });

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ph_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ph_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return ['desi-ghee-pure'];
  });

  // Comparison state (up to 3 products)
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('ph_compare');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return ['desi-ghee-pure', 'organic-honey-pure'];
  });

  // Placed orders list
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    return loadOrders();
  });

  // Track unread new orders count for admin notification
  const [unreadOrders, setUnreadOrders] = useState<number>(() => {
    return getUnreadOrdersCount();
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  // Toast notifications for user actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Sync comparison state to localStorage
  useEffect(() => {
    localStorage.setItem('ph_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Comparison toggler
  const handleToggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from comparison');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products at a time');
        return prev;
      }
      const prod = products.find((p) => p.id === productId);
      showToast(`Added ${prod ? prod.name : 'product'} to comparison (${prev.length + 1}/3)`);
      return [...prev, productId];
    });
  };

  const handleClearCompare = () => {
    setCompareList([]);
    showToast('Comparison list cleared');
  };

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ph_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ph_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveCatalog(products);
  }, [products]);

  // Multi-device cloud sync: uploads any local custom products and pulls server catalog/orders
  useEffect(() => {
    let isMounted = true;

    const initializeAndSync = async () => {
      try {
        // Upload any custom products previously created on this device to server
        await syncLocalCustomProductsToServer();

        // Fetch authoritative server catalog and orders
        const [remoteProducts, remoteOrders] = await Promise.all([
          fetchRemoteProducts(INITIAL_PRODUCTS),
          fetchRemoteOrders()
        ]);

        if (isMounted) {
          if (remoteProducts && remoteProducts.length > 0) {
            setProducts(remoteProducts);
          }
          if (remoteOrders) {
            setOrders(remoteOrders);
          }
        }
      } catch (e) {
        console.warn('Initial cloud sync notice:', e);
      }
    };

    initializeAndSync();

    // Poll server every 6 seconds to detect new products or orders placed on other phones
    const interval = setInterval(async () => {
      try {
        const syncData = await fetchSyncData();
        if (syncData && isMounted) {
          if (syncData.products && syncData.products.length > 0) {
            setProducts(syncData.products);
          }
          if (syncData.orders) {
            setOrders(syncData.orders);
          }
          if (typeof syncData.unreadCount === 'number') {
            setUnreadOrders(syncData.unreadCount);
          }
        }
      } catch {}
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Cart actions
  const handleAddToCart = (product: Product, size: string, quantity: number = 1) => {
    const itemId = `${product.id}-${size}`;

    const sizeMultiplier = size.includes('2kg') || size.includes('2 Litre')
      ? 1.9
      : size.includes('1kg') && product.defaultSize === '500g'
      ? 1.85
      : size.includes('900g')
      ? 1.9
      : 1.0;

    const unitPrice = Math.round(product.price * (product.defaultSize === size ? 1 : sizeMultiplier));

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: itemId, product, size, quantity, price: unitPrice }];
    });

    showToast(`Added ${quantity} × ${product.name} (${size}) to your bag`);
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  const handleBuyNow = (product: Product, size: string, quantity: number = 1) => {
    handleAddToCart(product, size, quantity);
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from favorites');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your favorites');
        return [...prev, productId];
      }
    });
  };

  // Order submission - notifies admin and syncs across all devices
  const handleOrderPlaced = async (order: PlacedOrder) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      saveOrders(updated);
      return updated;
    });
    setUnreadOrders((prev) => {
      const next = prev + 1;
      setUnreadOrdersCount(next);
      return next;
    });
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    showToast(`Order #${order.orderNumber} placed! Admin notified.`);

    // Persist to central cloud database so admin immediately sees it on their phone
    try {
      const serverOrders = await saveRemoteOrder(order);
      if (serverOrders) {
        setOrders(serverOrders);
      }
    } catch (e) {
      console.warn('Order sync notice:', e);
    }
  };

  // Open Admin Portal and mark orders as inspected
  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    setUnreadOrders(0);
    setUnreadOrdersCount(0);
    resetRemoteUnreadCount();
  };

  // Admin product actions - guarantees permanent store persistence across all devices
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      saveCatalog(updated);
      return updated;
    });
    showToast(`"${newProduct.name}" added to store catalog!`);

    // Synchronize to server so all phones see it online
    try {
      const serverProducts = await saveRemoteProduct(newProduct);
      if (serverProducts) {
        setProducts(serverProducts);
      }
    } catch (e) {
      console.warn('Product save sync notice:', e);
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      saveCatalog(next);
      return next;
    });
    showToast(`Updated "${updated.name}" in catalog`);

    try {
      const serverProducts = await updateRemoteProduct(updated);
      if (serverProducts) {
        setProducts(serverProducts);
      }
    } catch (e) {
      console.warn('Product update sync notice:', e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    recordDeletedProductId(productId);
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveCatalog(next);
      return next;
    });
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    setCompareList((prev) => prev.filter((id) => id !== productId));
    showToast('Product deleted permanently from store');

    try {
      const serverProducts = await deleteRemoteProduct(productId);
      if (serverProducts) {
        setProducts(serverProducts);
      }
    } catch (e) {
      console.warn('Product delete sync notice:', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: PlacedOrder['status']) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      saveOrders(updated);
      return updated;
    });
    showToast(`Order status updated to ${newStatus}`);

    try {
      const serverOrders = await updateRemoteOrderStatus(orderId, newStatus);
      if (serverOrders) {
        setOrders(serverOrders);
      }
    } catch (e) {
      console.warn('Order status sync notice:', e);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      saveOrders(updated);
      return updated;
    });
    showToast('Order removed from system');

    try {
      const serverOrders = await deleteRemoteOrder(orderId);
      if (serverOrders) {
        setOrders(serverOrders);
      }
    } catch (e) {
      console.warn('Order delete sync notice:', e);
    }
  };

  // Scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-[#25231F] flex flex-col selection:bg-[#C99A43]/20 selection:text-[#174B3B]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10392E] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#C99A43]/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-[#DCA83F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar (Section 3) */}
      <AnnouncementBar />

      {/* Main Sticky Header (Section 3) */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        ordersCount={orders.length}
        unreadOrdersCount={unreadOrders}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1">
        {/* Hero Section (Section 4) */}
        <Hero
          onShopNow={() => {
            setSelectedCategory('all');
            scrollToSection('all-products-section');
          }}
          onExplore={() => scrollToSection('all-products-section')}
        />

        {/* Discover Our Collection Grid with Filter Tabs (Section 7A) */}
        <DiscoverCollection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          wishlist={wishlist}
          compareList={compareList}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          onAddToCart={(p, size) => handleAddToCart(p, size)}
          onBuyNow={handleBuyNow}
          onQuickView={(p) => setActiveDetailProduct(p)}
        />

        {/* Brand Story Section (Section 7B) */}
        <BrandStory
          onOpenStoryModal={() => setIsAboutOpen(true)}
          onExploreProducts={() => {
            setSelectedCategory('all');
            scrollToSection('all-products-section');
          }}
        />

        {/* Customer Reviews Section (Section 7D) */}
        <CustomerReviews />
      </main>

      {/* Floating Compare Bar (Section: Product Comparison) */}
      <FloatingCompareBar
        comparedProducts={comparedProducts}
        onOpenCompare={() => setIsCompareOpen(true)}
        onRemoveProduct={handleToggleCompare}
        onClearAll={handleClearCompare}
      />

      {/* Product Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        allProducts={products}
        onRemoveFromCompare={handleToggleCompare}
        onAddToCompare={handleToggleCompare}
        onClearCompare={handleClearCompare}
        onAddToCart={(p, s) => handleAddToCart(p, s)}
        onBuyNow={(p, s) => handleBuyNow(p, s)}
      />

      {/* Professional Footer (Section 8) */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={setSelectedCategory}
        onScrollToSection={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
        ordersCount={orders.length}
        unreadOrdersCount={unreadOrders}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p, s) => handleAddToCart(p, s)}
        onQuickView={(p) => setActiveDetailProduct(p)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onContinueShopping={() => {
          setConfirmedOrder(null);
          scrollToSection('all-products-section');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeDetailProduct}
        isOpen={!!activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        isWishlisted={activeDetailProduct ? wishlist.includes(activeDetailProduct.id) : false}
        isCompared={activeDetailProduct ? compareList.includes(activeDetailProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        onAddToCart={(p, s, qty) => handleAddToCart(p, s, qty)}
        onBuyNow={(p, s, qty) => handleBuyNow(p, s, qty)}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setActiveDetailProduct(p)}
      />

      {/* Account & Orders Tracking Modal */}
      <AccountOrdersModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        onSelectOrder={(o) => setConfirmedOrder(o)}
      />

      {/* Admin Management Drawer & Portal (Section 14) */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onExploreProducts={() => {
          setSelectedCategory('all');
          scrollToSection('all-products-section');
        }}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}
