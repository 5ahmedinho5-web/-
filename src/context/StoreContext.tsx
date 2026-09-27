import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  BotSettings,
  CouponItem,
  CouponValidationResult,
  CustomerReview,
  FAQItem,
  GCCCurrencyCode,
  NavSection,
  OrderItem,
  OrderStatus,
  PackageItem,
  PlatformCategory,
  ReviewsStats,
  StoreSettings,
  StoreAnalyticsData,
} from '../types';
import {
  DEFAULT_BOT_SETTINGS,
  DEFAULT_COUPONS,
  DEFAULT_CURRENCIES,
  DEFAULT_FAQS,
  DEFAULT_PACKAGES,
  DEFAULT_REVIEWS,
  DEFAULT_REVIEWS_STATS,
  DEFAULT_STORE_SETTINGS,
} from '../data/defaultData';
import { pixelService } from '../services/pixelService';
import { analyticsService } from '../services/analyticsService';

interface StoreContextType {
  // Navigation & View
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  selectedPlatform: PlatformCategory;
  setSelectedPlatform: (platform: PlatformCategory) => void;
  navigateToPlatformPackages: (platform: PlatformCategory) => void;
  isHeaderHidden: boolean;
  setIsHeaderHidden: (hidden: boolean) => void;
  isPageLoading: boolean;
  selectedPackageForOrder: PackageItem | null;
  setSelectedPackageForOrder: (pkg: PackageItem | null) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;

  // Currencies
  currentCurrency: GCCCurrencyCode;
  setCurrentCurrency: (currency: GCCCurrencyCode) => void;
  formatPrice: (priceSAR: number) => { amount: string; symbol: string; full: string };
  convertPrice: (priceSAR: number) => number;
  updateCurrencyRate: (code: GCCCurrencyCode, rate: number) => void;

  // Data
  packages: PackageItem[];
  reviews: CustomerReview[];
  reviewsStats: ReviewsStats;
  faqs: FAQItem[];
  orders: OrderItem[];
  botSettings: BotSettings;
  storeSettings: StoreSettings;
  analyticsData: StoreAnalyticsData;
  refreshAnalytics: () => void;
  resetAnalytics: () => void;
  trackPlatformVisit: (platform: PlatformCategory) => void;

  // Actions on Packages
  updatePackage: (pkg: PackageItem) => void;
  addPackage: (pkg: Omit<PackageItem, 'id'>) => void;
  deletePackage: (id: string) => void;
  setMostPopularPackage: (id: string) => void;
  togglePackageVisibility: (id: string) => void;

  // Actions on Reviews & Stats
  updateReviewsStats: (stats: ReviewsStats) => void;
  addReview: (review: Omit<CustomerReview, 'id'>) => void;
  updateReview: (review: CustomerReview) => void;
  deleteReview: (id: string) => void;

  // Coupons & Discounts
  coupons: CouponItem[];
  addCoupon: (coupon: Omit<CouponItem, 'id' | 'usedCount' | 'createdAt'>) => void;
  updateCoupon: (coupon: CouponItem) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (
    code: string,
    packagePriceSAR: number,
    platform?: PlatformCategory
  ) => CouponValidationResult;

  // Actions on Orders
  createOrder: (orderData: {
    customerName: string;
    businessName: string;
    mapsUrl?: string;
    accountUrl?: string;
    currentFollowers?: string;
    screenshotUrl?: string;
    whatsapp: string;
    countryCode: string;
    notes: string;
    packageId: string;
    platform?: PlatformCategory;
    couponCode?: string;
    discountAmountSAR?: number;
    finalPriceSAR?: number;
  }) => OrderItem;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Actions on FAQs
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (faq: FAQItem) => void;
  deleteFAQ: (id: string) => void;

  // Actions on Bot & Store Settings
  updateBotSettings: (settings: BotSettings) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
  resetToDefaults: () => void;

  // Admin Auth & Modal
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
}

const getInitialSection = (): NavSection => {
  if (typeof window === 'undefined') return 'home';
  const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const validSections: NavSection[] = [
    'home',
    'packages',
    'features',
    'about',
    'why-us',
    'reviews',
    'faq',
    'contact',
  ];
  if (validSections.includes(cleanPath as NavSection)) {
    return cleanPath as NavSection;
  }
  return 'home';
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation with browser URL sync & loading indicator
  const [currentSection, setCurrentSectionState] = useState<NavSection>(getInitialSection);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<PackageItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const setCurrentSection = (section: NavSection) => {
    setIsPageLoading(true);
    setCurrentSectionState(section);

    const targetUrl = section === 'home' ? '/' : `/${section}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ section }, '', targetUrl);
    }

    const titles: Record<NavSection, string> = {
      home: 'متجر نجمة | تصدر خرائط Google وتقييمات حقيقية 100%',
      packages: 'متجر نجمة | باقات وحزم تقييمات خرائط Google',
      features: 'متجر نجمة | مميزات خدمة تقييمات خرائط Google',
      about: 'متجر نجمة | من نحن',
      'why-us': 'متجر نجمة | لماذا يختار أصحاب الأنشطة متجر نجمة؟',
      reviews: 'متجر نجمة | آراء وتقييمات عملائنا',
      faq: 'متجر نجمة | الأسئلة الشائعة حول الخدمة',
      contact: 'متجر نجمة | طرق الطلب والتواصل المباشر',
    };
    document.title = titles[section] || 'متجر نجمة';

    setTimeout(() => {
      setIsPageLoading(false);
    }, 240);
  };

  // Handle browser Back & Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const s = getInitialSection();
      setCurrentSectionState(s);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Currency
  const [currentCurrency, setCurrentCurrency] = useState<GCCCurrencyCode>(() => {
    const saved = localStorage.getItem('najma_currency');
    return (saved as GCCCurrencyCode) || 'SAR';
  });

  // Auto-hide Top Bars on scroll down, show on scroll up
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down past 50px
      if (currentScrollY > 50 && currentScrollY > lastScrollYRef.current + 6) {
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollYRef.current - 6 || currentScrollY <= 20) {
        setIsHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Platform selection for packages
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformCategory>('google-maps');

  // Daily Store Traffic & Conversion Funnel Analytics (Real zero-mock tracking)
  const [analyticsData, setAnalyticsData] = useState<StoreAnalyticsData>(() => {
    return analyticsService.getData();
  });

  const refreshAnalytics = () => {
    setAnalyticsData(analyticsService.getData());
  };

  const resetAnalytics = () => {
    const cleanZero = analyticsService.resetAll();
    setAnalyticsData(cleanZero);
  };

  const trackPlatformVisit = (platform: PlatformCategory) => {
    analyticsService.recordPlatformClick(platform).then((updated) => {
      setAnalyticsData(updated);
    }).catch(console.warn);
  };

  // Initial real visit count with real IP and device detection
  useEffect(() => {
    // Only record genuine visitor session when on the client store
    const recordRealVisit = async () => {
      try {
        const updated = await analyticsService.recordRealStoreVisit(selectedPlatform);
        setAnalyticsData(updated);
      } catch (e) {
        console.warn(e);
      }
    };

    recordRealVisit();
  }, []);

  const navigateToPlatformPackages = (platform: PlatformCategory) => {
    setSelectedPlatform(platform);
    trackPlatformVisit(platform);
    setCurrentSection('packages');
  };

  // Data from LocalStorage or defaults
  const [packages, setPackages] = useState<PackageItem[]>(() => {
    const saved = localStorage.getItem('najma_packages_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PackageItem[];
        // Upgrade any 60-day or 90-day guarantee references to lifetime
        return parsed.map((pkg) => ({
          ...pkg,
          features: pkg.features.map((f) =>
            f.replace('60 يوماً', 'مدى الحياة').replace('90 يوماً', 'مدى الحياة')
          ),
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PACKAGES;
  });

  useEffect(() => {
    localStorage.setItem('najma_packages_v3', JSON.stringify(packages));
  }, [packages]);

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('najma_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_REVIEWS;
  });

  const [reviewsStats, setReviewsStats] = useState<ReviewsStats>(() => {
    const saved = localStorage.getItem('najma_reviews_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_REVIEWS_STATS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('najma_faqs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_FAQS;
  });

  // Coupons & Promo Codes
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const saved = localStorage.getItem('najma_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_COUPONS;
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('najma_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'NJM-91823',
        customerName: 'فهد العتيبي',
        businessName: 'كافيه لافندر',
        mapsUrl: 'https://maps.google.com/?cid=1234567890',
        whatsapp: '501234567',
        countryCode: '+966',
        notes: 'التركيز على سرعة الخدمة وجودة البن والحلويات',
        packageId: 'pkg-500',
        packageReviewsCount: 500,
        price: 1300,
        currencyCode: 'SAR',
        currencySymbol: 'ر.س',
        status: 'in_progress',
        createdAt: '2026-09-18 14:30',
      },
      {
        id: 'NJM-87410',
        customerName: 'سارة القحطاني',
        businessName: 'صالون ستايل روز',
        mapsUrl: 'https://maps.google.com/?cid=9876543210',
        whatsapp: '559876543',
        countryCode: '+966',
        notes: 'جدولة 10 تقييمات يومياً',
        packageId: 'pkg-100',
        packageReviewsCount: 100,
        price: 399.99,
        currencyCode: 'SAR',
        currencySymbol: 'ر.س',
        status: 'completed',
        createdAt: '2026-09-17 11:15',
      },
    ];
  });

  const [botSettings, setBotSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('najma_bot_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_BOT_SETTINGS,
          ...parsed,
          knowledgeCards: parsed.knowledgeCards && parsed.knowledgeCards.length > 0
            ? parsed.knowledgeCards
            : DEFAULT_BOT_SETTINGS.knowledgeCards,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_BOT_SETTINGS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('najma_store_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_SETTINGS,
          ...parsed,
          orderNotificationEmail:
            parsed.orderNotificationEmail || DEFAULT_STORE_SETTINGS.orderNotificationEmail,
          web3FormsAccessKey:
            parsed.web3FormsAccessKey || DEFAULT_STORE_SETTINGS.web3FormsAccessKey,
          twoFactorAuth: {
            ...DEFAULT_STORE_SETTINGS.twoFactorAuth!,
            ...(parsed.twoFactorAuth || {}),
          },
          packagesSectionTexts: {
            ...DEFAULT_STORE_SETTINGS.packagesSectionTexts,
            ...(parsed.packagesSectionTexts || {}),
          },
          sectionContents: {
            ...DEFAULT_STORE_SETTINGS.sectionContents,
            ...(parsed.sectionContents || {}),
          },
        };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('najma_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('najma_currency', currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem('najma_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('najma_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('najma_reviews_stats', JSON.stringify(reviewsStats));
  }, [reviewsStats]);

  useEffect(() => {
    localStorage.setItem('najma_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('najma_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('najma_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('najma_bot_settings', JSON.stringify(botSettings));
  }, [botSettings]);

  useEffect(() => {
    localStorage.setItem('najma_store_settings', JSON.stringify(storeSettings));
    pixelService.initPixels(storeSettings.marketingPixels);
  }, [storeSettings]);

  // Currency Converter Helpers
  const convertPrice = (priceSAR: number): number => {
    const rate = storeSettings.currencies[currentCurrency]?.rateAgainstSAR ?? 1;
    const converted = priceSAR * rate;
    // Format to 2 decimals or rounded
    if (currentCurrency === 'KWD' || currentCurrency === 'BHD' || currentCurrency === 'OMR') {
      return Number(converted.toFixed(2));
    }
    return Number(converted.toFixed(2));
  };

  const formatPrice = (priceSAR: number) => {
    const currencyInfo = storeSettings.currencies[currentCurrency] || DEFAULT_CURRENCIES.SAR;
    const converted = convertPrice(priceSAR);
    const amountStr = converted.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(converted) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return {
      amount: amountStr,
      symbol: currencyInfo.symbol,
      full: `${amountStr} ${currencyInfo.symbol}`,
    };
  };

  const updateCurrencyRate = (code: GCCCurrencyCode, rate: number) => {
    setStoreSettings((prev) => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        [code]: {
          ...prev.currencies[code],
          rateAgainstSAR: rate,
        },
      },
    }));
  };

  // Package Actions
  const updatePackage = (updatedPkg: PackageItem) => {
    setPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  const addPackage = (newPkg: Omit<PackageItem, 'id'>) => {
    const id = `pkg-${Date.now()}`;
    setPackages((prev) => [...prev, { ...newPkg, id }]);
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const setMostPopularPackage = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => ({
        ...p,
        isMostPopular: p.id === id,
      }))
    );
  };

  const togglePackageVisibility = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isHidden: !p.isHidden } : p))
    );
  };

  // Reviews & Stats Actions
  const updateReviewsStats = (stats: ReviewsStats) => {
    setReviewsStats(stats);
  };

  const addReview = (review: Omit<CustomerReview, 'id'>) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
    };
    setReviews((prev) => [newRev, ...prev]);
    // increment stats
    setReviewsStats((prev) => ({
      ...prev,
      totalRatingsCount: prev.totalRatingsCount + 1,
    }));
  };

  const updateReview = (updatedReview: CustomerReview) => {
    setReviews((prev) => prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Coupons & Promo Codes Actions
  const addCoupon = (couponData: Omit<CouponItem, 'id' | 'usedCount' | 'createdAt'>) => {
    const newCoupon: CouponItem = {
      ...couponData,
      id: `cpn-${Date.now()}`,
      code: couponData.code.trim().toUpperCase(),
      usedCount: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const updateCoupon = (coupon: CouponItem) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === coupon.id
          ? { ...coupon, code: coupon.code.trim().toUpperCase() }
          : c
      )
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const validateCoupon = (
    code: string,
    packagePriceSAR: number,
    platform?: PlatformCategory
  ): CouponValidationResult => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: packagePriceSAR,
        errorMessage: 'يرجى إدخال كود الخصم',
      };
    }

    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: packagePriceSAR,
        errorMessage: 'كود الخصم غير صحيح أو غير موجود',
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: packagePriceSAR,
        errorMessage: 'كود الخصم هذا غير مفعّل حالياً',
      };
    }

    if (coupon.expiresAt && coupon.expiresAt.trim()) {
      const today = new Date().toISOString().split('T')[0];
      if (today > coupon.expiresAt) {
        return {
          isValid: false,
          discountAmount: 0,
          finalPrice: packagePriceSAR,
          errorMessage: `انتهت فترة صلاحية هذا الكود في (${coupon.expiresAt})`,
        };
      }
    }

    if (coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: packagePriceSAR,
        errorMessage: 'وصل هذا الكود للحد الأقصى المسموح به من مرات الاستخدام',
      };
    }

    if (
      coupon.applicablePlatforms &&
      coupon.applicablePlatforms !== 'all' &&
      Array.isArray(coupon.applicablePlatforms) &&
      coupon.applicablePlatforms.length > 0 &&
      platform
    ) {
      if (!coupon.applicablePlatforms.includes(platform)) {
        return {
          isValid: false,
          discountAmount: 0,
          finalPrice: packagePriceSAR,
          errorMessage: 'كود الخصم هذا مخصص لخدمات أخرى ولا يسري على هذه الخدمة',
        };
      }
    }

    if (coupon.minOrderPrice && packagePriceSAR < coupon.minOrderPrice) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: packagePriceSAR,
        errorMessage: `الحد الأدنى لقيمة الباقة لتفعيل هذا الكود هو ${coupon.minOrderPrice} ر.س`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      const calculated = (packagePriceSAR * coupon.discountValue) / 100;
      discount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
      discount = Math.round(discount * 100) / 100;
    } else {
      discount = Math.min(coupon.discountValue, packagePriceSAR);
    }

    const finalPrice = Math.max(0, Math.round((packagePriceSAR - discount) * 100) / 100);

    return {
      isValid: true,
      coupon,
      discountAmount: discount,
      discountPercentage: coupon.discountType === 'percentage' ? coupon.discountValue : undefined,
      finalPrice,
    };
  };

  // Orders Actions
  const createOrder = (orderData: {
    customerName: string;
    businessName: string;
    mapsUrl?: string;
    accountUrl?: string;
    currentFollowers?: string;
    screenshotUrl?: string;
    whatsapp: string;
    countryCode: string;
    notes: string;
    packageId: string;
    platform?: PlatformCategory;
    couponCode?: string;
    discountAmountSAR?: number;
    finalPriceSAR?: number;
  }): OrderItem => {
    const pkg = packages.find((p) => p.id === orderData.packageId) || packages[0];
    const uniqueNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NJM-${uniqueNumber}`;
    const currencyInfo = storeSettings.currencies[currentCurrency] || DEFAULT_CURRENCIES.SAR;
    const platform = orderData.platform || pkg.platform || 'google-maps';

    const originalPrice = convertPrice(pkg.priceSAR);
    let finalPrice = originalPrice;
    let discountAmount = 0;

    if (orderData.finalPriceSAR !== undefined) {
      finalPrice = convertPrice(orderData.finalPriceSAR);
      discountAmount = convertPrice(orderData.discountAmountSAR || 0);
    }

    // Increment usedCount if coupon was applied
    if (orderData.couponCode) {
      const clean = orderData.couponCode.trim().toUpperCase();
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === clean ? { ...c, usedCount: c.usedCount + 1 } : c
        )
      );
    }

    const newOrder: OrderItem = {
      id: orderId,
      customerName: orderData.customerName,
      businessName: orderData.businessName,
      mapsUrl: orderData.mapsUrl,
      accountUrl: orderData.accountUrl,
      currentFollowers: orderData.currentFollowers,
      screenshotUrl: orderData.screenshotUrl,
      whatsapp: orderData.whatsapp,
      countryCode: orderData.countryCode,
      notes: orderData.notes,
      platform,
      packageId: pkg.id,
      packageReviewsCount: pkg.reviewsCount,
      packageCountLabel: pkg.countLabel,
      price: finalPrice,
      originalPrice: orderData.couponCode ? originalPrice : undefined,
      discountAmount: orderData.couponCode ? discountAmount : undefined,
      couponCode: orderData.couponCode ? orderData.couponCode.trim().toUpperCase() : undefined,
      currencyCode: currentCurrency,
      currencySymbol: currencyInfo.symbol,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Track Form Complete in Analytics
    try {
      analyticsService.recordFormComplete(platform, pkg.countLabel).then((updated) => {
        setAnalyticsData(updated);
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }

    // Increment order count on the package
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, ordersCount: p.ordersCount + 1 } : p))
    );

    // Fire real marketing conversion pixels
    try {
      const logs = pixelService.trackPurchase({
        orderId,
        amountSAR: pkg.priceSAR,
        packageName: pkg.countLabel || `باقة ${pkg.reviewsCount}`,
        platform,
      });

      if (logs && logs.length > 0) {
        setStoreSettings((prev) => {
          const currentConfig = prev.marketingPixels || { enabled: true };
          const updatedLogs = [...logs, ...(currentConfig.eventLogs || [])].slice(0, 30);
          const updatedSettings: StoreSettings = {
            ...prev,
            marketingPixels: {
              ...currentConfig,
              eventLogs: updatedLogs,
            },
          };
          return updatedSettings;
        });
      }
    } catch (err) {
      console.warn('[PixelService] trackPurchase error:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // FAQs Actions
  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...faq, id: `faq-${Date.now()}` };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFAQ = (updatedFaq: FAQItem) => {
    setFaqs((prev) => prev.map((f) => (f.id === updatedFaq.id ? updatedFaq : f)));
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Bot & Store Settings
  const updateBotSettings = (newSettings: BotSettings) => {
    setBotSettings(newSettings);
  };

  const updateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
  };

  const resetToDefaults = () => {
    setPackages(DEFAULT_PACKAGES);
    setReviews(DEFAULT_REVIEWS);
    setReviewsStats(DEFAULT_REVIEWS_STATS);
    setFaqs(DEFAULT_FAQS);
    setCoupons(DEFAULT_COUPONS);
    setBotSettings(DEFAULT_BOT_SETTINGS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        selectedPlatform,
        setSelectedPlatform,
        navigateToPlatformPackages,
        isHeaderHidden,
        setIsHeaderHidden,
        isPageLoading,
        selectedPackageForOrder,
        setSelectedPackageForOrder,
        isOrderModalOpen,
        setIsOrderModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        currentCurrency,
        setCurrentCurrency,
        formatPrice,
        convertPrice,
        updateCurrencyRate,
        packages,
        reviews,
        reviewsStats,
        faqs,
        coupons,
        orders,
        botSettings,
        storeSettings,
        analyticsData,
        refreshAnalytics,
        resetAnalytics,
        trackPlatformVisit,
        updatePackage,
        addPackage,
        deletePackage,
        setMostPopularPackage,
        togglePackageVisibility,
        updateReviewsStats,
        addReview,
        updateReview,
        deleteReview,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        validateCoupon,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateBotSettings,
        updateStoreSettings,
        resetToDefaults,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isAdminModalOpen,
        setIsAdminModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
