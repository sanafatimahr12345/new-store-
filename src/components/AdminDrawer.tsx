import React, { useState, useRef } from 'react';
import { Product, PlacedOrder, ProductCategory } from '../types';
import { 
  X, Settings, DollarSign, Package, ShoppingCart, Users, Check, 
  Edit3, Trash2, Plus, ShieldCheck, Lock, Mail, Eye, EyeOff, 
  LogOut, AlertCircle, Save, RefreshCw, KeyRound, ArrowLeft, Store,
  Upload, Image as ImageIcon, Camera, Phone, Printer, ExternalLink,
  MessageSquare, CheckCircle2, Clock, Truck, Bell
} from 'lucide-react';

import { compressImage } from '../utils/productStorage';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: PlacedOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder
}) => {
  if (!isOpen) return null;

  // File input refs for uploading images
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ph_admin_auth') === 'true';
  });

  // Login credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Target valid credentials
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('ph_admin_email') || 'maqbool4090092@gmail.com';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('ph_admin_pwd') || 'Rg@47#63$24';
  });

  // Settings tab password change
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateMsg, setPasswordUpdateMsg] = useState('');

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'stats'>('products');

  // Product editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<boolean>(true);
  const [editImage, setEditImage] = useState<string>('');

  // Add product form
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'ghee' | 'honey' | 'pickles' | 'oils' | 'spices'>('ghee');
  const [newProdPrice, setNewProdPrice] = useState<number>(1800);
  const [newProdOldPrice, setNewProdOldPrice] = useState<number>(2200);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdOrigin, setNewProdOrigin] = useState('Khanewal, Punjab');
  const [newProdSize, setNewProdSize] = useState('500g');
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/product_pure_desi_ghee_1793354317123.jpg');
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Orders filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'Confirmed' | 'Processing' | 'Delivered'>('all');

  // Handle image upload with auto-compression (reduces multi-MB photos down to ~50KB to preserve localStorage)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImage(true);
      // Auto compress to max 800x800, JPEG 0.78 quality
      const compressedDataUrl = await compressImage(file, 800, 800, 0.78);
      if (isEditMode) {
        setEditImage(compressedDataUrl);
      } else {
        setNewProdImage(compressedDataUrl);
      }
    } catch (err) {
      console.warn('Image compression fallback:', err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Data = uploadEvent.target?.result as string;
        if (base64Data) {
          if (isEditMode) setEditImage(base64Data);
          else setNewProdImage(base64Data);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = email.trim().toLowerCase();
    const targetEmail = adminEmail.trim().toLowerCase();

    if (trimmedEmail === targetEmail && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('ph_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Email or Password. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ph_admin_auth');
    setEmail('');
    setPassword('');
  };

  const handleFillDemoCredentials = () => {
    setEmail(adminEmail);
    setPassword(adminPassword);
    setLoginError('');
  };

  const handleSavePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordUpdateMsg('Password must be at least 6 characters.');
      return;
    }
    setAdminPassword(newPassword);
    localStorage.setItem('ph_admin_pwd', newPassword);
    setNewPassword('');
    setPasswordUpdateMsg('Admin password updated successfully!');
    setTimeout(() => setPasswordUpdateMsg(''), 3000);
  };

  // Add product submission - ensures permanent store display with all fields
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const id = `prod-${Date.now()}`;
    const slug = newProdName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const categoryLabels: Record<string, string> = {
      ghee: 'Desi Ghee',
      honey: 'Organic Honey',
      pickles: 'Traditional Pickles',
      oils: 'Natural Oils',
      spices: 'Organic Spices'
    };

    const parsedPrice = Number(newProdPrice) || 1000;
    const parsedOldPrice = Number(newProdOldPrice) > parsedPrice 
      ? Number(newProdOldPrice) 
      : Math.round(parsedPrice * 1.2);

    const sizeVal = newProdSize.trim() || '500g';
    const availableSizes = [sizeVal];
    if (sizeVal === '500g') availableSizes.push('1kg');
    else if (sizeVal === '450g') availableSizes.push('900g');
    else if (sizeVal === '1kg') availableSizes.push('2kg');

    const newProduct: Product = {
      id,
      name: newProdName.trim(),
      slug: slug || `product-${Date.now()}`,
      category: newProdCategory,
      categoryLabel: categoryLabels[newProdCategory] || 'Traditional Food',
      description: newProdDesc.trim() || 'Authentic pure Pakistani traditional recipe prepared with fresh ingredients.',
      longDescription: newProdDesc.trim() || 'Crafted with traditional methods and pristine quality. 100% natural, chemical-free and unadulterated.',
      price: parsedPrice,
      oldPrice: parsedOldPrice,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'NEW ARRIVAL',
      image: newProdImage || '/src/assets/images/product_pure_desi_ghee_1793354317123.jpg',
      sizes: availableSizes,
      defaultSize: sizeVal,
      origin: newProdOrigin.trim() || 'Khanewal, Punjab',
      ingredients: ['100% Pure Natural Ingredients', 'Handcrafted Village Recipe'],
      nutritionalHighlights: ['Rich in Natural Nutrients', 'Chemical & Preservative Free'],
      inStock: true,
      featured: true,
      isBestSeller: false
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    setProductSuccessMsg(`"${newProduct.name}" permanently added to store catalog!`);
    setTimeout(() => setProductSuccessMsg(''), 4000);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price);
    setEditStock(p.inStock);
    setEditImage(p.image);
  };

  const saveProductEdit = (product: Product) => {
    const updated: Product = {
      ...product,
      price: editPrice,
      inStock: editStock,
      image: editImage || product.image
    };
    onUpdateProduct(updated);
    setEditingProductId(null);
  };

  // Statistics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F6F0] flex flex-col overflow-y-auto animate-in fade-in duration-200">
      
      {/* Full-Page Admin Top Bar */}
      <header className="sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#10392E] text-white flex items-center justify-between border-b border-[#174B3B] shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
            title="Return to Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>
          
          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#174B3B] border border-[#C99A43] flex items-center justify-center text-[#DCA83F]">
              <Settings className="w-4 h-4 text-[#DCA83F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-bold tracking-wide">
                  DESSIS RASSIO
                </h2>
                <span className="text-[10px] bg-[#C99A43] text-[#10392E] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <span className="text-[11px] text-[#DCA83F] font-medium block">
                {isAuthenticated ? `Signed in: ${adminEmail}` : 'Store Configuration & Order Management'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-3 text-xs text-white/80 pr-2">
                <span className="bg-white/10 px-2.5 py-1 rounded">
                  Revenue: <strong className="text-[#DCA83F]">Rs. {totalRevenue.toLocaleString()}</strong>
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded">
                  Orders: <strong className="text-white">{totalOrders}</strong>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Exit Full Page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Conditional View: Login Screen or Admin Controls */}
      {!isAuthenticated ? (
        /* FULL-PAGE LOGIN SCREEN */
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#F8F6F0] to-[#EFE9DF]">
          <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED0] shadow-xl animate-in zoom-in-95 duration-200">
                
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#174B3B] text-[#DCA83F] flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#174B3B]">
                    Admin Login
                  </h3>
                  <p className="text-xs text-[#777168] mt-1">
                    Enter your authorized administrator credentials to manage store catalog, orders, and settings.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#25231F] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#777168] absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#25231F] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#777168] absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#777168] hover:text-[#25231F]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 shadow-md mt-2"
                  >
                    Login to Admin Dashboard
                  </button>
                </form>

                {/* 1-Click Quick Fill Button */}
                <div className="mt-5 pt-4 border-t border-[#E8DED0] text-center">
                  <span className="text-[11px] text-[#777168] block mb-2">
                    Authorized Credentials Configured:
                  </span>
                  <div className="p-2.5 bg-[#FBF7EF] rounded-lg border border-[#E8DED0] text-[11px] font-mono text-[#174B3B] space-y-0.5 text-left mb-3">
                    <div>Email: <strong>{adminEmail}</strong></div>
                    <div>Password: <strong>{adminPassword}</strong></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoCredentials}
                    className="text-xs text-[#174B3B] font-bold hover:underline"
                  >
                    Auto-Fill These Credentials
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* FULL-PAGE LOGGED IN DASHBOARD */
            <div className="flex-1 flex flex-col bg-[#F8F6F0]">
              {/* Real-time Order Alert Banner */}
              {pendingOrdersCount > 0 && (
                <div className="bg-rose-600 text-white px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
                    <span className="font-bold">🔔 NEW ORDER RECEIVED:</span>
                    <span>You have <strong>{pendingOrdersCount}</strong> new customer order(s) waiting for confirmation and dispatch!</span>
                  </div>
                  {activeTab !== 'orders' && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3.5 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Tabs Bar */}
              <div className="bg-white border-b border-[#E8DED0] shadow-xs sticky top-[65px] z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-8 text-xs sm:text-sm font-bold uppercase tracking-wider overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`py-3.5 px-2 sm:px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === 'products'
                        ? 'border-[#174B3B] text-[#174B3B]'
                        : 'border-transparent text-[#777168] hover:text-[#25231F]'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Products ({products.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-3.5 px-2 sm:px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === 'orders'
                        ? 'border-[#174B3B] text-[#174B3B]'
                        : 'border-transparent text-[#777168] hover:text-[#25231F]'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Orders ({orders.length})</span>
                    {pendingOrdersCount > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                        {pendingOrdersCount} New
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-3.5 px-2 sm:px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === 'settings'
                        ? 'border-[#174B3B] text-[#174B3B]'
                        : 'border-transparent text-[#777168] hover:text-[#25231F]'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`py-3.5 px-2 sm:px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === 'stats'
                        ? 'border-[#174B3B] text-[#174B3B]'
                        : 'border-transparent text-[#777168] hover:text-[#25231F]'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>

              {/* Tab Content Container */}
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
                
                {/* 1. PRODUCTS MANAGEMENT (ADD, EDIT, DELETE) */}
                {activeTab === 'products' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#777168] font-semibold">
                        Manage catalog items: Add, edit prices, or delete products.
                      </span>
                      <button
                        onClick={() => setIsAddingProduct(!isAddingProduct)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingProduct ? 'Cancel' : 'Add Product'}</span>
                      </button>
                    </div>

                    {/* Inline Add Product Form */}
                    {isAddingProduct && (
                      <form onSubmit={handleCreateProduct} className="p-4 sm:p-5 bg-[#FBF7EF] rounded-xl border border-[#C99A43] space-y-4 animate-in zoom-in-95 shadow-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E8DED0]">
                          <div className="font-serif font-bold text-sm text-[#174B3B] flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[#C99A43]" />
                            <span>Add New Traditional Product (نیا پروڈکٹ شامل کریں)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAddingProduct(false)}
                            className="text-xs text-[#777168] hover:text-rose-600 font-semibold"
                          >
                            Close
                          </button>
                        </div>

                        {/* Image Upload Area */}
                        <div className="p-3.5 bg-white rounded-xl border border-[#E8DED0] space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <label className="font-bold text-xs text-[#174B3B] flex items-center gap-1.5">
                              <Upload className="w-4 h-4 text-[#C99A43]" />
                              <span>Upload Product Image (تصویر اپلوڈ کریں) *</span>
                            </label>
                            <span className="text-[11px] text-[#777168]">
                              Upload from Mobile, PC or tablet
                            </span>
                          </div>

                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, false)}
                            className="hidden"
                          />

                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Preview thumbnail */}
                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-[#C99A43] overflow-hidden bg-[#FBF7EF] flex flex-col items-center justify-center shrink-0 cursor-pointer group hover:border-[#174B3B] transition-colors"
                              title="Click to choose or change image"
                            >
                              {newProdImage ? (
                                <>
                                  <img
                                    src={newProdImage}
                                    alt="Product Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-semibold gap-1">
                                    <Camera className="w-5 h-5 text-[#DCA83F]" />
                                    <span>Change Photo</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center p-2 text-[#777168]">
                                  <ImageIcon className="w-6 h-6 mx-auto text-[#C99A43] mb-1" />
                                  <span className="text-[10px] block font-medium">Select Image</span>
                                </div>
                              )}
                            </div>

                            {/* Upload controls */}
                            <div className="flex-1 space-y-2.5 w-full">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-4 py-2 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Upload className="w-4 h-4 text-[#DCA83F]" />
                                  <span>Choose File From Device (موبائل سے تصویر منتخب کریں)</span>
                                </button>

                                {newProdImage && (
                                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 font-semibold">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    Image Selected
                                  </span>
                                )}
                              </div>

                              <div>
                                <label className="block text-[11px] text-[#777168] mb-0.5 font-medium">
                                  Or use existing image URL / file path:
                                </label>
                                <input
                                  type="text"
                                  value={newProdImage}
                                  onChange={(e) => setNewProdImage(e.target.value)}
                                  placeholder="https://... or /src/assets/images/..."
                                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8DED0] bg-[#FBF7EF]/30 text-xs text-[#25231F]"
                                />
                              </div>

                              {/* Quick stock image presets */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-[10px] text-[#777168] font-semibold">Quick Presets:</span>
                                <button
                                  type="button"
                                  onClick={() => setNewProdImage('/src/assets/images/product_pure_desi_ghee_1793354317123.jpg')}
                                  className="text-[10px] px-2 py-0.5 bg-[#FBF7EF] border border-[#E8DED0] rounded hover:border-[#174B3B] text-[#174B3B]"
                                >
                                  Desi Ghee
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewProdImage('/src/assets/images/product_organic_honey_user.png')}
                                  className="text-[10px] px-2 py-0.5 bg-[#FBF7EF] border border-[#E8DED0] rounded hover:border-[#174B3B] text-[#174B3B]"
                                >
                                  Pure Honey
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewProdImage('/src/assets/images/product_traditional_achar_1793354318721.jpg')}
                                  className="text-[10px] px-2 py-0.5 bg-[#FBF7EF] border border-[#E8DED0] rounded hover:border-[#174B3B] text-[#174B3B]"
                                >
                                  Mix Achar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewProdImage('/src/assets/images/product_sarson_oil_1793354320491.jpg')}
                                  className="text-[10px] px-2 py-0.5 bg-[#FBF7EF] border border-[#E8DED0] rounded hover:border-[#174B3B] text-[#174B3B]"
                                >
                                  Sarson Oil
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Product Name *</label>
                            <input
                              type="text"
                              required
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              placeholder="e.g. Pure Desi Buffalo Makhan"
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Category *</label>
                            <select
                              value={newProdCategory}
                              onChange={(e) => setNewProdCategory(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            >
                              <option value="ghee">Desi Ghee</option>
                              <option value="honey">Organic Honey</option>
                              <option value="pickles">Traditional Pickles</option>
                              <option value="oils">Natural Oils</option>
                              <option value="spices">Organic Spices</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Selling Price (Rs.) *</label>
                            <input
                              type="number"
                              required
                              value={newProdPrice}
                              onChange={(e) => setNewProdPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Old Price (Rs.)</label>
                            <input
                              type="number"
                              value={newProdOldPrice}
                              onChange={(e) => setNewProdOldPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Package Size</label>
                            <input
                              type="text"
                              value={newProdSize}
                              onChange={(e) => setNewProdSize(e.target.value)}
                              placeholder="500g or 1kg"
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#25231F] mb-1">Region / Origin</label>
                            <input
                              type="text"
                              value={newProdOrigin}
                              onChange={(e) => setNewProdOrigin(e.target.value)}
                              placeholder="e.g. Khanewal / Sahiwal, Punjab"
                              className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-xs text-[#25231F] mb-1">Short Description</label>
                          <textarea
                            rows={2}
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            placeholder="A brief description of this pure product..."
                            className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] bg-white text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1 border-t border-[#E8DED0]">
                          <button
                            type="button"
                            onClick={() => setIsAddingProduct(false)}
                            className="px-3.5 py-1.5 bg-white border border-[#E8DED0] rounded-lg text-xs font-semibold hover:bg-[#FBF7EF] transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                          >
                            Save Product (پروڈکٹ شامل کریں)
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Products List */}
                    <div className="space-y-3">
                      {products.map((p) => {
                        const isEditing = editingProductId === p.id;
                        return (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl border border-[#E8DED0] bg-[#FBF7EF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBF7EF]/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Product Thumbnail with edit photo option */}
                              <div className="relative group shrink-0">
                                <img
                                  src={isEditing ? (editImage || p.image) : p.image}
                                  alt={p.name}
                                  className="w-16 h-16 object-cover rounded-lg border border-[#E8DED0] shadow-2xs"
                                />
                                {isEditing && (
                                  <>
                                    <input
                                      type="file"
                                      ref={editFileInputRef}
                                      accept="image/*"
                                      onChange={(e) => handleImageFileUpload(e, true)}
                                      className="hidden"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => editFileInputRef.current?.click()}
                                      className="absolute inset-0 bg-black/60 text-white rounded-lg flex flex-col items-center justify-center text-[9px] font-bold transition-opacity cursor-pointer"
                                      title="Change Photo from device"
                                    >
                                      <Camera className="w-4 h-4 text-[#DCA83F] mb-0.5" />
                                      Change
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-sm font-bold text-[#25231F] truncate">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#C99A43] font-semibold uppercase">
                                    {p.categoryLabel}
                                  </span>
                                  <span className="text-[10px] text-[#777168]">
                                    ({p.defaultSize || p.sizes?.[0] || '1 Pack'})
                                  </span>
                                </div>

                                {isEditing ? (
                                  <div className="mt-2 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs text-[#25231F] font-semibold">Price (Rs.):</span>
                                      <input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(Number(e.target.value))}
                                        className="w-24 px-2 py-1 text-xs border rounded bg-white"
                                      />
                                      <label className="flex items-center gap-1 text-[11px] text-[#25231F] cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={editStock}
                                          onChange={(e) => setEditStock(e.target.checked)}
                                          className="text-[#174B3B] focus:ring-[#174B3B]"
                                        />
                                        <span>In Stock</span>
                                      </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="text-[11px] text-[#174B3B] bg-white px-2 py-0.5 rounded border border-[#E8DED0] hover:bg-[#FBF7EF] flex items-center gap-1 font-medium"
                                      >
                                        <Upload className="w-3 h-3 text-[#C99A43]" />
                                        Upload New Photo (نئی تصویر لگائیں)
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-bold text-[#174B3B] tabular-nums">
                                      Rs. {p.price.toLocaleString()}
                                    </span>
                                    {p.oldPrice && (
                                      <span className="text-[11px] text-[#777168] line-through">
                                        Rs. {p.oldPrice.toLocaleString()}
                                      </span>
                                    )}
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                      p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => saveProductEdit(p)}
                                    className="px-3 py-1.5 bg-[#174B3B] text-white rounded text-xs font-semibold hover:bg-[#10392E] flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingProductId(null)}
                                    className="px-2.5 py-1.5 bg-white border border-[#E8DED0] rounded text-xs text-[#777168]"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => startEditProduct(p)}
                                  className="p-1.5 text-[#174B3B] hover:bg-white rounded-md border border-[#E8DED0]"
                                  title="Edit Price, Stock & Image"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-[#777168] hover:text-rose-600 hover:bg-white rounded-md border border-[#E8DED0]"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. ORDERS MANAGEMENT */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DED0]">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#174B3B] flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5 text-[#C99A43]" />
                          <span>Customer Orders & Dispatch (گاہکوں کے آرڈرز)</span>
                        </h3>
                        <p className="text-xs text-[#777168] mt-0.5">
                          Real-time orders received from customers. Review delivery details, contact via WhatsApp, and manage shipment status.
                        </p>
                      </div>

                      {/* Orders filter pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['all', 'Confirmed', 'Processing', 'Delivered'] as const).map((filter) => {
                          const count = filter === 'all' 
                            ? orders.length 
                            : orders.filter((o) => o.status === filter).length;
                          return (
                            <button
                              key={filter}
                              onClick={() => setOrderFilter(filter)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                orderFilter === filter
                                  ? 'bg-[#174B3B] text-white'
                                  : 'bg-white border border-[#E8DED0] text-[#777168] hover:text-[#25231F]'
                              }`}
                            >
                              {filter === 'all' ? 'All' : filter} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-16 text-xs text-[#777168] bg-[#FBF7EF] rounded-xl border border-dashed border-[#E8DED0] space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#174B3B]/10 text-[#174B3B] flex items-center justify-center mx-auto">
                          <ShoppingCart className="w-6 h-6 text-[#174B3B]" />
                        </div>
                        <div className="font-serif font-bold text-sm text-[#174B3B]">No Orders Placed Yet</div>
                        <p className="max-w-md mx-auto">
                          When a customer orders an item via "Buy Now" or "Checkout", their full delivery info, items, and payment proof will appear here immediately!
                        </p>
                      </div>
                    ) : (
                      orders
                        .filter((o) => orderFilter === 'all' || o.status === orderFilter)
                        .map((o) => {
                          const cleanPhone = o.customer.phone.replace(/[^0-9]/g, '');
                          const waPhone = cleanPhone.startsWith('92') 
                            ? cleanPhone 
                            : cleanPhone.startsWith('0') 
                            ? `92${cleanPhone.slice(1)}` 
                            : `92${cleanPhone}`;
                          const waMsg = encodeURIComponent(
                            `Assalam-o-Alaikum ${o.customer.fullName}, DESSIS RASSIO se aapka order #${o.orderNumber} (Total Rs. ${o.total.toLocaleString()}) receive ho chuka hai. Hamari team dispatch process kar rahi hai.`
                          );

                          return (
                            <div
                              key={o.id}
                              className="p-4 sm:p-5 rounded-xl border border-[#E8DED0] bg-white space-y-4 text-xs shadow-xs hover:border-[#C99A43] transition-colors"
                            >
                              {/* Order Card Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DED0]">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-[#174B3B] text-[#DCA83F] flex items-center justify-center font-bold font-mono text-xs shrink-0">
                                    #{o.orderNumber.slice(-4)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-sm text-[#174B3B]">{o.orderNumber}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                        o.status === 'Confirmed'
                                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                          : o.status === 'Processing'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                          : o.status === 'In Transit'
                                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      }`}>
                                        {o.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-[#777168] mt-0.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Order Date: {o.date}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  {/* Status Selector */}
                                  <div className="flex items-center gap-1.5 bg-[#FBF7EF] px-2.5 py-1 rounded-lg border border-[#E8DED0]">
                                    <span className="text-[11px] font-semibold text-[#777168]">Status:</span>
                                    <select
                                      value={o.status}
                                      onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as PlacedOrder['status'])}
                                      className="text-xs font-bold bg-transparent text-[#174B3B] focus:outline-none cursor-pointer"
                                    >
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Processing">Processing</option>
                                      <option value="In Transit">In Transit</option>
                                      <option value="Delivered">Delivered</option>
                                    </select>
                                  </div>

                                  {/* Delete Order Button */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete order ${o.orderNumber}?`)) {
                                        onDeleteOrder(o.id);
                                      }
                                    }}
                                    className="p-1.5 text-[#777168] hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-[#E8DED0] transition-colors"
                                    title="Delete Order Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Customer and Delivery Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF7EF]/50 p-3.5 rounded-xl border border-[#E8DED0]">
                                <div className="space-y-1.5">
                                  <div className="font-bold text-[#174B3B] flex items-center gap-1.5 text-xs">
                                    <Users className="w-3.5 h-3.5 text-[#C99A43]" />
                                    <span>Customer Information:</span>
                                  </div>
                                  <div className="text-[#25231F] font-semibold text-sm">{o.customer.fullName}</div>
                                  <div className="flex items-center gap-2 text-[11px] text-[#777168]">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{o.customer.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#174B3B]">
                                    <Phone className="w-3.5 h-3.5" />
                                    <strong>{o.customer.phone}</strong>
                                  </div>

                                  {/* Customer Contact Actions */}
                                  <div className="flex items-center gap-2 pt-1.5">
                                    <a
                                      href={`https://wa.me/${waPhone}?text=${waMsg}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>WhatsApp Customer</span>
                                    </a>
                                    <a
                                      href={`tel:${o.customer.phone}`}
                                      className="px-3 py-1.5 bg-white hover:bg-[#FBF7EF] text-[#174B3B] border border-[#174B3B] rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      <span>Call</span>
                                    </a>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="font-bold text-[#174B3B] flex items-center gap-1.5 text-xs">
                                    <Truck className="w-3.5 h-3.5 text-[#C99A43]" />
                                    <span>Shipping & Payment Method:</span>
                                  </div>
                                  <div className="text-[#25231F] text-xs">
                                    <strong>City:</strong> <span className="text-[#174B3B] font-bold">{o.customer.city}</span>
                                  </div>
                                  <div className="text-[#25231F] text-xs leading-relaxed">
                                    <strong>Delivery Address:</strong> {o.customer.address}
                                  </div>
                                  {o.customer.notes && (
                                    <div className="text-[11px] text-[#777168] bg-white p-2 rounded border border-[#E8DED0]">
                                      <strong>Special Notes:</strong> {o.customer.notes}
                                    </div>
                                  )}

                                  {/* Payment Mode Highlight */}
                                  <div className="pt-1">
                                    {o.customer.paymentMethod === 'cod' && (
                                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-md font-semibold text-[11px]">
                                        <span>Cash on Delivery (COD)</span>
                                        <span className="text-amber-700">· Collect Rs. {o.total.toLocaleString()}</span>
                                      </div>
                                    )}
                                    {o.customer.paymentMethod === 'jazzcash' && (
                                      <div className="inline-flex flex-col gap-0.5 p-2 bg-rose-50 text-rose-900 border border-rose-300 rounded-md text-[11px]">
                                        <div className="font-bold flex items-center gap-1">
                                          <span>JazzCash (03007257010 - Aqib Sohail)</span>
                                        </div>
                                        {o.customer.transactionRef ? (
                                          <div>Provided TID/Ref: <strong>{o.customer.transactionRef}</strong></div>
                                        ) : (
                                          <div className="text-rose-700">Verification screenshot sent via WhatsApp</div>
                                        )}
                                      </div>
                                    )}
                                    {(o.customer.paymentMethod === 'meezan' || o.customer.paymentMethod === 'bank_transfer') && (
                                      <div className="inline-flex flex-col gap-0.5 p-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-md text-[11px]">
                                        <div className="font-bold flex items-center gap-1">
                                          <span>Meezan Bank (77010111173735 - MAQBOOL HUSSAIN)</span>
                                        </div>
                                        {o.customer.transactionRef ? (
                                          <div>Provided Bank Ref: <strong>{o.customer.transactionRef}</strong></div>
                                        ) : (
                                          <div className="text-emerald-700">Payment receipt sent via WhatsApp</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Itemized Order Breakdown */}
                              <div className="bg-[#FBF7EF] p-3 rounded-xl border border-[#E8DED0] space-y-2">
                                <div className="text-[11px] font-bold text-[#174B3B] uppercase tracking-wider">
                                  Items Ordered ({o.items.reduce((s, i) => s + i.quantity, 0)} Items):
                                </div>
                                <div className="space-y-1.5">
                                  {o.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-[#E8DED0]/60">
                                      <div className="flex items-center gap-2.5">
                                        <img
                                          src={item.product.image}
                                          alt={item.product.name}
                                          className="w-10 h-10 object-cover rounded-md border border-[#E8DED0]"
                                        />
                                        <div>
                                          <span className="font-bold text-[#25231F]">{item.product.name}</span>
                                          <span className="text-[#777168] ml-1.5 text-[11px]">({item.size})</span>
                                          <span className="text-[11px] text-[#174B3B] ml-2 font-semibold">Qty: {item.quantity}</span>
                                        </div>
                                      </div>
                                      <span className="font-bold text-[#174B3B] tabular-nums">
                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-2 border-t border-[#E8DED0] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#777168] gap-1">
                                  <div className="flex items-center gap-3">
                                    <span>Subtotal: Rs. {o.subtotal.toLocaleString()}</span>
                                    <span>Shipping: {o.shippingFee === 0 ? 'FREE' : `Rs. ${o.shippingFee}`}</span>
                                  </div>
                                  <div className="font-bold text-sm text-[#174B3B]">
                                    Total Payable: <span className="tabular-nums">Rs. {o.total.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                )}

                {/* 3. SETTINGS */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#174B3B] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#C99A43]" />
                        <span>Administrator Account Settings</span>
                      </h4>
                      
                      <div className="text-xs space-y-1.5 text-[#25231F]">
                        <div><strong>Active Admin Email:</strong> {adminEmail}</div>
                        <div><strong>Role:</strong> Super Administrator</div>
                        <div><strong>Store:</strong> DESSIS RASSIO (Pure Traditional Heritage)</div>
                      </div>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleSavePasswordChange} className="p-4 bg-white rounded-xl border border-[#E8DED0] space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#174B3B] flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#C99A43]" />
                        <span>Update Admin Password</span>
                      </h4>

                      {passwordUpdateMsg && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                          {passwordUpdateMsg}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[#25231F] mb-1">New Password</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new strong password"
                          className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Update Password
                      </button>
                    </form>

                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-rose-900 block">End Admin Session</strong>
                        <span className="text-rose-700 text-[11px]">Logout from this device</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold uppercase tracking-wider text-[11px]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ANALYTICS & STATS */}
                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-[#FBF7EF] border border-[#E8DED0] rounded-xl">
                        <span className="text-[11px] font-semibold text-[#777168] uppercase block">Total Sales (Session)</span>
                        <span className="font-serif text-2xl font-bold text-[#174B3B] tabular-nums">
                          Rs. {totalRevenue.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-4 bg-[#FBF7EF] border border-[#E8DED0] rounded-xl">
                        <span className="text-[11px] font-semibold text-[#777168] uppercase block">Orders Placed</span>
                        <span className="font-serif text-2xl font-bold text-[#174B3B] tabular-nums">
                          {totalOrders}
                        </span>
                      </div>

                      <div className="p-4 bg-[#FBF7EF] border border-[#E8DED0] rounded-xl">
                        <span className="text-[11px] font-semibold text-[#777168] uppercase block">Products in Store</span>
                        <span className="font-serif text-2xl font-bold text-[#174B3B] tabular-nums">
                          {products.length}
                        </span>
                      </div>

                      <div className="p-4 bg-[#FBF7EF] border border-[#E8DED0] rounded-xl">
                        <span className="text-[11px] font-semibold text-[#777168] uppercase block">Free Delivery Min</span>
                        <span className="font-serif text-2xl font-bold text-[#C99A43] tabular-nums">
                          Rs. 3,000
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

    </div>
  );
};
