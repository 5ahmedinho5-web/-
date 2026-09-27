export type GCCCurrencyCode = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR';

export type PlatformCategory = 'google-maps' | 'snapchat' | 'facebook' | 'instagram' | 'tiktok';

export interface CurrencyConfig {
  code: GCCCurrencyCode;
  name: string;
  nameAr: string;
  symbol: string;
  rateAgainstSAR: number; // 1 SAR = rateAgainstSAR Currency
  flag: string;
}

export interface PackageItem {
  id: string;
  platform?: PlatformCategory;
  unitType?: 'reviews' | 'followers' | 'likes' | 'views';
  reviewsCount: number;
  countLabel?: string;
  badgeText?: string; // نص شارة الطلبات مثلاً: "طلبها +142 عميل"
  popularBadgeText?: string; // نص شريط الأكثر طلباً مثلاً: "الأكثر طلباً" أو "عرض خاص"
  discountBadgeText?: string; // نص شارة الخصم مثلاً: "وفر 33%"
  guaranteeText?: string; // نص الضمان أسفل الكرت مثلاً: "حسابات خليجية حقيقية 100% مع ضمان التعويض"
  orderButtonText?: string; // نص زر الطلب مثلاً: "اطلب هذه الحزمة"
  priceSAR: number;
  originalPriceSAR?: number;
  discountPercent?: number;
  features: string[];
  ordersCount: number;
  isMostPopular: boolean;
  isHidden: boolean;
  orderIndex: number;
  description?: string;
  expectedRoiPercent?: number; // نسبة الزيادة في عدد الطلبات المتوقعة على نشاطك (مثلاً: 40 لـ +40%)
  expectedBenefitTitle?: string; // عنوان الميزة بالكرت: ماذا ستحصل بعد اختيار هذه الحزمة؟
  expectedBenefitAnswer?: string; // نص الميزة بالكرت: زيادة في عدد الطلبات المتوقعة على نشاطك 40%
  expectedProfitGrowthText?: string;
  customPrices?: Partial<Record<GCCCurrencyCode, number>>;
}

export interface VisitorDeviceLog {
  id: string;
  ip: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  deviceModel?: string; // e.g. iPhone, Android, Windows, Mac
  browser: string;
  os: string;
  country?: string;
  city?: string;
  platformVisited: PlatformCategory;
  action: 'visit' | 'form_start' | 'form_complete';
  packageName?: string;
  timestamp: string; // ISO string
  timeFormatted: string; // e.g. "12:35 م"
}

export interface DayTrafficStats {
  date: string; // YYYY-MM-DD
  totalVisits: number;
  uniqueVisitorsCount: number;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  platformVisits: {
    'google-maps': number;
    'snapchat': number;
    'facebook': number;
    'instagram': number;
    'tiktok': number;
  };
  formStarts: number; // كم واحد دخل يكتب الفورم بعد ما اختار الباقة
  formCompletes: number; // كم واحد أكمل الفورم بنجاح
  ordersCount: number;
  uniqueIps?: string[]; // قائمة عناوين الـ IP المسجلة لليوم لمنع التكرار
}

export interface StoreAnalyticsData {
  todayStats: DayTrafficStats;
  historicalDays: DayTrafficStats[];
  visitorLogs: VisitorDeviceLog[]; // real visitors logs with IP, device, platform, time
  totalVisitsAllTime: number;
  totalFormStartsAllTime: number;
  totalFormCompletesAllTime: number;
}

export interface CustomerReview {
  id: string;
  rating: number; // 1 to 5
  reviewerName: string;
  businessType: string;
  city?: string;
  content: string;
  date: string;
}

export interface ReviewsStats {
  totalRatingsCount: number;
  averageRating: number;
  satisfiedPercentage: number;
  verifiedBadgesCount: number;
}

export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export type CouponDiscountType = 'percentage' | 'fixed';

export interface CouponItem {
  id: string;
  code: string; // e.g. "NAJMA10", "SPECIAL20" (always stored uppercase)
  discountType: CouponDiscountType; // 'percentage' or 'fixed'
  discountValue: number; // e.g. 10 (for 10%) or 50 (for 50 SAR)
  minOrderPrice?: number; // Minimum order price in SAR to apply coupon
  maxDiscount?: number; // Maximum discount cap (for percentage coupons)
  usageLimit?: number; // Maximum total usages (0 or undefined for unlimited)
  usedCount: number; // How many times this code was used
  expiresAt?: string; // YYYY-MM-DD or empty
  isActive: boolean;
  applicablePlatforms?: PlatformCategory[] | 'all';
  customerTarget?: string; // e.g. "خاص بعميل: فهد العتيبي" or notes
  createdAt: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: CouponItem;
  discountAmount: number;
  discountPercentage?: number;
  finalPrice: number;
  errorMessage?: string;
}

export interface OrderItem {
  id: string; // e.g. "NJM-84920"
  customerName: string;
  businessName: string; // اسم النشاط التجاري أو اسم الصفحة / الحساب
  mapsUrl?: string; // رابط الخريطة (لخرائط جوجل)
  accountUrl?: string; // رابط الصفحة أو الحساب (لباقي المنصات)
  currentFollowers?: string; // عدد المتابعين الحالي
  screenshotUrl?: string; // لقطة شاشة من الحساب (Data URL)
  whatsapp: string;
  countryCode: string;
  notes: string;
  platform?: PlatformCategory;
  packageId: string;
  packageReviewsCount: number;
  packageCountLabel?: string;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  couponCode?: string;
  currencyCode: GCCCurrencyCode;
  currencySymbol: string;
  status: OrderStatus;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface BotKnowledgeCard {
  id: string;
  title: string;
  content: string;
}

export interface BotSettings {
  showPopupHint: boolean; // toggle to stop or show popup hint
  popupHintText: string;
  popupHintDelaySeconds: number;
  welcomeMessage: string;
  knowledgeBase: string;
  executionDuration: string;
  contactInfo: string;
  knowledgeCards?: BotKnowledgeCard[];
}

export interface StoreSectionsVisibility {
  hero: boolean;
  packages: boolean;
  features: boolean;
  about: boolean;
  whyUs: boolean;
  reviews: boolean;
  faq: boolean;
  contact: boolean;
}

export interface PackagesSectionTexts {
  badgeText: string;
  sectionTitle: string;
  sectionDescription: string;
  gestureHintText: string;
  guaranteeBoxTitle: string;
  guaranteeBoxDescription: string;
  guaranteePoint1: string;
  guaranteePoint2: string;
  guaranteePoint3: string;
  countdownEnabled?: boolean;
  countdownDays?: number;
  countdownHours?: number;
  countdownMinutes?: number;
  countdownLabel?: string;
  countdownBadgeText?: string;
  countdownTitle?: string;
  countdownSubtitle?: string;
}

export interface HeroSectionTexts {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  ctaButtonText: string;
  secondaryButtonText: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
}

export interface FeaturesSectionTexts {
  badge: string;
  title: string;
  description: string;
}

export interface WhyUsSectionTexts {
  badge: string;
  title: string;
  description: string;
}

export interface AboutSectionTexts {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  visionTitle: string;
  visionDesc: string;
  standardsTitle: string;
  standardsDesc: string;
  teamTitle: string;
  teamDesc: string;
}

export interface ReviewsSectionTexts {
  badge: string;
  title: string;
  description: string;
  addReviewButtonText: string;
}

export interface FaqSectionTexts {
  badge: string;
  title: string;
  description: string;
}

export interface ContactSectionTexts {
  badge: string;
  title: string;
  description: string;
  guaranteeNote: string;
}

export interface SectionContentSettings {
  packages?: PackagesSectionTexts;
  hero?: HeroSectionTexts;
  features?: FeaturesSectionTexts;
  whyUs?: WhyUsSectionTexts;
  about?: AboutSectionTexts;
  reviews?: ReviewsSectionTexts;
  faq?: FaqSectionTexts;
  contact?: ContactSectionTexts;
}

export interface PixelEventLog {
  id: string;
  event: string;
  platform: 'snapchat' | 'tiktok' | 'meta' | 'google' | 'all';
  timestamp: string;
  details?: string;
}

export interface MarketingPixelsConfig {
  enabled: boolean;
  snapchatPixelId?: string;
  tiktokPixelId?: string;
  metaPixelId?: string; // Facebook / Instagram
  googleTagId?: string; // Google Analytics / Ads (G- / AW-)
  testMode?: boolean;
  lastTestEventDate?: string;
  eventLogs?: PixelEventLog[];
}

export interface TwoFactorAuthConfig {
  enabled: boolean;
  provider?: 'web3forms' | 'formsubmit' | 'custom_webhook'; // مزود خدمة إرسال الرمز
  emailDestination: string; // البريد المستلم لرمز التحقق OTP (افتراضياً: najma.orders@gmail.com)
  accessKey?: string; // مفتاح الربط الخاص بـ 2FA (إذا رغبت في استخدام مفتاح مختلف عن مفتاح الطلبات أو تركه فارغاً لاستخدام المفتاح العام)
  backupPin: string; // رمز PIN احتياطي عند تعذر وصول الإيميل (افتراضياً: 889900)
  customWebhookUrl?: string; // رابط Webhook مخصص في حال الرغبة في الربط مع أي خدمة أو سيرفر خارجي
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  adminPassword: string;
  orderNotificationEmail?: string;
  web3FormsAccessKey?: string;
  twoFactorAuth?: TwoFactorAuthConfig;
  sectionsVisibility: StoreSectionsVisibility;
  currencies: Record<GCCCurrencyCode, CurrencyConfig>;
  packagesSectionTexts?: PackagesSectionTexts;
  sectionContents?: SectionContentSettings;
  marketingPixels?: MarketingPixelsConfig;
}

export type NavSection =
  | 'home'
  | 'packages'
  | 'features'
  | 'about'
  | 'why-us'
  | 'reviews'
  | 'faq'
  | 'contact';
