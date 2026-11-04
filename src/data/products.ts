import { Product, Testimonial } from '../types';

import heroBannerImg from '../assets/images/hero_desi_ghee_banner_1793354316422.jpg';
import desiGheeImg from '../assets/images/product_pure_desi_ghee_1793354317123.jpg';
import honeyImg from '../assets/images/product_organic_honey_user.png';
import mixAcharImg from '../assets/images/product_mix_achar_1793354318513.jpg';
import cowGheeImg from '../assets/images/product_khalis_cow_ghee_1793359292362.jpg';

export const HERO_IMAGE = heroBannerImg || '/images/hero_banner.jpg';
export const BRAND_STORY_IMAGE = heroBannerImg;

export const INITIAL_PRODUCTS: Product[] = [
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
    image: desiGheeImg || '/images/pure_desi_ghee.jpg',
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
    image: honeyImg || '/images/organic_honey.jpg',
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
    image: mixAcharImg || '/images/traditional_mix_achar.jpg',
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
    image: cowGheeImg || '/images/khalis_cow_ghee.jpg',
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
    image: mixAcharImg || '/images/shahi_garam_masala.jpg',
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

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Begum Yasmin Tariq',
    city: 'Lahore (Gulberg)',
    rating: 5,
    productPurchased: 'Pure Desi Ghee (1kg)',
    comment: 'The aroma when I heated this ghee for my morning parathas brought back memories of my grandmother’s village home. Absolutely authentic, granular texture (daanedaar), and pure golden color.',
    verified: true
  },
  {
    id: 'test-2',
    name: 'Dr. Kamran Siddiqui',
    city: 'Islamabad (F-7)',
    rating: 5,
    productPurchased: 'Organic Pure Honey & Sidr Honey',
    comment: 'I test raw honey carefully for my family. Pure Harvest’s honey is completely unadulterated, rich in floral aroma with zero sugar crystallization. Fast delivery and safe glass jar packaging.',
    verified: true
  },
  {
    id: 'test-3',
    name: 'Farah Naveed',
    city: 'Karachi (DHA)',
    rating: 5,
    productPurchased: 'Traditional Mix Achar',
    comment: 'Finding genuine mustard oil mix achar in Karachi that isn’t soaked in artificial vinegar is nearly impossible. This pickle is crispy, tangy, spicy, and perfectly matured. Ordering our 3rd jar!',
    verified: true
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: '/src/assets/images/hero_desi_ghee_banner_1793354316422.jpg',
    caption: 'The morning simmer: golden bilona ghee slow-clarifying to daanedaar perfection.',
    likes: 842,
    tag: '#PureHarvest #DesiGhee'
  },
  {
    id: 'ig-2',
    image: '/src/assets/images/product_organic_honey_1793354317119.jpg',
    caption: 'Nature’s sweet elixir: raw, unfiltered honeycomb harvest from northern valleys.',
    likes: 615,
    tag: '#RawHoney #OrganicPakistan'
  },
  {
    id: 'ig-3',
    image: '/src/assets/images/product_mix_achar_1793354318513.jpg',
    caption: 'Sun-cured raw mango & lemon achar resting under the afternoon warmth.',
    likes: 529,
    tag: '#TraditionalAchar #DesiFood'
  },
  {
    id: 'ig-4',
    image: '/src/assets/images/brand_story_heritage_1793354318640.jpg',
    caption: 'Ancestral copper cauldrons honoring centuries-old food traditions.',
    likes: 734,
    tag: '#SlowFood #Handcrafted'
  },
  {
    id: 'ig-5',
    image: '/src/assets/images/product_pure_desi_ghee_1793354317123.jpg',
    caption: 'Fresh batch jarred and sealed for delivery across Pakistan.',
    likes: 911,
    tag: '#FarmToTable #PurityFirst'
  },
  {
    id: 'ig-6',
    image: '/src/assets/images/hero_desi_ghee_banner_1793354316422.jpg',
    caption: 'Nothing compares to warm makhan turned into golden nectar.',
    likes: 678,
    tag: '#AuthenticTaste #DesiHeritage'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 5 },
  { id: 'ghee', name: 'Desi Ghee', count: 2 },
  { id: 'honey', name: 'Organic Honey', count: 1 },
  { id: 'pickles', name: 'Traditional Pickles', count: 1 },
  { id: 'spices', name: 'Organic Spices', count: 1 }
];
