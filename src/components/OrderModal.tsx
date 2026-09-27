import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Headphones,
  User,
  MapPin,
  Link as LinkIcon,
  Phone,
  FileText,
  Star,
  CheckCircle2,
  Flame,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Users,
  AtSign,
  Mail,
  AlertCircle,
  Ticket,
  Tag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CouponItem, OrderItem } from '../types';
import { PlatformIcon } from './PlatformIcon';
import { CardCountdownTimer } from './CardCountdownTimer';
import { pixelService } from '../services/pixelService';
import { analyticsService } from '../services/analyticsService';
import { notificationService } from '../services/notificationService';

export const OrderModal: React.FC = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    selectedPackageForOrder,
    setSelectedPackageForOrder,
    packages,
    formatPrice,
    createOrder,
    validateCoupon,
    storeSettings,
    refreshAnalytics,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  
  // Social media fields
  const [accountUrl, setAccountUrl] = useState('');
  const [currentFollowers, setCurrentFollowers] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [countryCode, setCountryCode] = useState('+966');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);
  const [isChangingPackage, setIsChangingPackage] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailStatusMsg, setEmailStatusMsg] = useState('');

  // Discount Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [discountAmountSAR, setDiscountAmountSAR] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined);
  const [finalPriceSAR, setFinalPriceSAR] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Track when a user opens the form after selecting a package
  useEffect(() => {
    if (isOrderModalOpen && selectedPackageForOrder) {
      analyticsService.recordFormStart(
        selectedPackageForOrder.platform || 'google-maps',
        selectedPackageForOrder.countLabel || `باقة ${selectedPackageForOrder.reviewsCount}`
      ).then(() => {
        refreshAnalytics();
      }).catch(console.warn);
    }
  }, [isOrderModalOpen, selectedPackageForOrder?.id]);

  if (!isOrderModalOpen || !selectedPackageForOrder) return null;

  const platform = selectedPackageForOrder.platform || 'google-maps';
  const isGoogleMaps = platform === 'google-maps';

  // Calculate pricing considering optional applied coupon
  const currentPriceSAR = appliedCoupon ? finalPriceSAR : selectedPackageForOrder.priceSAR;
  const priceInfo = formatPrice(currentPriceSAR);
  const originalPriceInfo = appliedCoupon ? formatPrice(selectedPackageForOrder.priceSAR) : null;
  const discountInfo = appliedCoupon ? formatPrice(discountAmountSAR) : null;

  // Revalidate coupon if package changes
  useEffect(() => {
    if (appliedCoupon && selectedPackageForOrder) {
      const res = validateCoupon(appliedCoupon.code, selectedPackageForOrder.priceSAR, platform);
      if (res.isValid && res.coupon) {
        setDiscountAmountSAR(res.discountAmount);
        setDiscountPercentage(res.discountPercentage);
        setFinalPriceSAR(res.finalPrice);
      } else {
        setAppliedCoupon(null);
        setDiscountAmountSAR(0);
        setDiscountPercentage(undefined);
        setFinalPriceSAR(selectedPackageForOrder.priceSAR);
        setCouponError(res.errorMessage || 'كود الخصم غير متوافق مع هذه الباقة');
      }
    } else if (selectedPackageForOrder) {
      setFinalPriceSAR(selectedPackageForOrder.priceSAR);
    }
  }, [selectedPackageForOrder?.id]);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('يرجى إدخال رمز كود الخصم أولاً');
      return;
    }
    setCouponError('');
    setCouponSuccess('');
    const res = validateCoupon(couponInput, selectedPackageForOrder.priceSAR, platform);
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setDiscountAmountSAR(res.discountAmount);
      setDiscountPercentage(res.discountPercentage);
      setFinalPriceSAR(res.finalPrice);
      setCouponSuccess(
        res.discountPercentage
          ? `تم تطبيق الخصم بنجاح! (-${res.discountPercentage}%)`
          : `تم تطبيق الخصم بنجاح! وفرت ${formatPrice(res.discountAmount).full}`
      );
    } else {
      setCouponError(res.errorMessage || 'كود الخصم غير صحيح أو غير متوافق');
      setAppliedCoupon(null);
      setDiscountAmountSAR(0);
      setDiscountPercentage(undefined);
      setFinalPriceSAR(selectedPackageForOrder.priceSAR);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
    setDiscountAmountSAR(0);
    setDiscountPercentage(undefined);
    setFinalPriceSAR(selectedPackageForOrder ? selectedPackageForOrder.priceSAR : 0);
  };

  const countryCodes = [
    { code: '+966', name: 'السعودية', flag: '🇸🇦' },
    { code: '+971', name: 'الإمارات', flag: '🇦🇪' },
    { code: '+965', name: 'الكويت', flag: '🇰🇼' },
    { code: '+974', name: 'قطر', flag: '🇶🇦' },
    { code: '+973', name: 'البحرين', flag: '🇧🇭' },
    { code: '+968', name: 'عمان', flag: '🇴🇲' },
    { code: '+20', name: 'مصر', flag: '🇪🇬' },
    { code: '+962', name: 'الأردن', flag: '🇯🇴' },
  ];

  const getPlatformLabel = () => {
    switch (platform) {
      case 'google-maps':
        return 'خرائط جوجل';
      case 'snapchat':
        return 'سناب شات';
      case 'facebook':
        return 'فيسبوك';
      case 'instagram':
        return 'انستقرام';
      case 'tiktok':
        return 'تيك توك';
      default:
        return 'الخدمة';
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview('');
    setScreenshotFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !whatsapp) return;

    const order = createOrder({
      customerName: customerName || businessName,
      businessName,
      mapsUrl: isGoogleMaps ? mapsUrl : undefined,
      accountUrl: !isGoogleMaps ? accountUrl : undefined,
      currentFollowers: !isGoogleMaps ? currentFollowers : undefined,
      screenshotUrl: screenshotPreview || undefined,
      whatsapp,
      countryCode,
      notes,
      packageId: selectedPackageForOrder.id,
      platform,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmountSAR: appliedCoupon ? discountAmountSAR : undefined,
      finalPriceSAR: appliedCoupon ? finalPriceSAR : undefined,
    });

    pixelService.trackLead({
      customerName,
      businessName,
      platform,
      whatsapp,
      packageId: selectedPackageForOrder.id,
    });

    // Send instant email notification to Gmail via Web3Forms
    setEmailStatus('sending');
    setEmailStatusMsg('');
    notificationService
      .sendOrderEmailNotification(order, storeSettings)
      .then((res) => {
        if (res.success) {
          setEmailStatus('success');
          setEmailStatusMsg(res.message);
        } else {
          setEmailStatus('error');
          setEmailStatusMsg(res.message);
        }
      })
      .catch((err) => {
        console.warn('Notification error:', err);
        setEmailStatus('error');
        setEmailStatusMsg('تعذر الاتصال بخدمة الإشعارات');
      });

    setCreatedOrder(order);
  };

  const handleRetryEmail = () => {
    if (!createdOrder) return;
    setEmailStatus('sending');
    setEmailStatusMsg('');
    notificationService
      .sendOrderEmailNotification(createdOrder, storeSettings)
      .then((res) => {
        if (res.success) {
          setEmailStatus('success');
          setEmailStatusMsg(res.message);
        } else {
          setEmailStatus('error');
          setEmailStatusMsg(res.message);
        }
      })
      .catch(() => {
        setEmailStatus('error');
        setEmailStatusMsg('تعذر الاتصال بخدمة الإشعارات');
      });
  };

  const handleOpenWhatsApp = () => {
    if (!createdOrder) return;
    const cleanStoreNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const couponLine = createdOrder.couponCode
      ? `\n• كود الخصم: ${createdOrder.couponCode} (وفر ${createdOrder.discountAmount} ${createdOrder.currencySymbol})`
      : '';

    let message = '';
    if (isGoogleMaps) {
      message = `طلب جديد #${createdOrder.id}
• الخدمة: خرائط Google (${createdOrder.packageReviewsCount} تقييم)
• المبلغ: ${createdOrder.price} ${createdOrder.currencySymbol}${couponLine}
• العميل: ${createdOrder.customerName}
• النشاط: ${createdOrder.businessName}
• الواتساب: ${createdOrder.countryCode} ${createdOrder.whatsapp}
• الرابط: ${createdOrder.mapsUrl || 'مرفق'}${createdOrder.notes ? `\n• ملاحظات: ${createdOrder.notes}` : ''}`;
    } else {
      const platformName = getPlatformLabel();
      message = `طلب جديد #${createdOrder.id}
• الخدمة: ${platformName} (${selectedPackageForOrder.countLabel || `${createdOrder.packageReviewsCount} متابع`})
• المبلغ: ${createdOrder.price} ${createdOrder.currencySymbol}${couponLine}
• العميل: ${createdOrder.customerName}
• الحساب: ${createdOrder.businessName}
• الواتساب: ${createdOrder.countryCode} ${createdOrder.whatsapp}
• الرابط: ${createdOrder.accountUrl || 'مرفق'}${createdOrder.currentFollowers ? `\n• المتابعون: ${createdOrder.currentFollowers}` : ''}${createdOrder.notes ? `\n• ملاحظات: ${createdOrder.notes}` : ''}`;
    }

    const url = `https://wa.me/${cleanStoreNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setIsOrderModalOpen(false);
    setCreatedOrder(null);
    setCustomerName('');
    setBusinessName('');
    setMapsUrl('');
    setAccountUrl('');
    setCurrentFollowers('');
    setScreenshotPreview('');
    setScreenshotFileName('');
    setWhatsapp('');
    setNotes('');
    setIsChangingPackage(false);
    setEmailStatus('idle');
    setEmailStatusMsg('');
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
    setDiscountAmountSAR(0);
    setDiscountPercentage(undefined);
    setFinalPriceSAR(0);
  };

  // Filter packages for quick changer by current platform
  const platformPackages = packages.filter(
    (p) => (p.platform || 'google-maps') === platform && !p.isHidden
  );

  const renderCouponSection = () => (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>هل لديك كود خصم؟ (حقل اختياري)</span>
        </span>
        {appliedCoupon && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <span>تم تفعيل الخصم</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          </span>
        )}
      </div>

      {!appliedCoupon ? (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                  setCouponError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder="أدخل رمز الكود (مثال: NAJMA10 أو VIP20)"
                className="w-full pr-3.5 pl-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-bold tracking-wider placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006644] uppercase"
                dir="ltr"
              />
              <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2.5 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs transition-colors cursor-pointer shrink-0 active:scale-95 shadow-xs flex items-center gap-1"
            >
              <span>تطبيق</span>
            </button>
          </div>

          {couponError && (
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{couponError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="font-mono text-[#006644] font-black tracking-wider">{appliedCoupon.code}</span>
                {discountPercentage ? (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold border border-emerald-200">
                    خصم {discountPercentage}%
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold border border-emerald-200">
                    خصم {appliedCoupon.discountValue} ر.س
                  </span>
                )}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                تم خصم {formatPrice(discountAmountSAR).full} من إجمالي الطلب 🎉
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="text-[11px] text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            إلغاء ✕
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg rounded-[32px] bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-7 space-y-5 text-right my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Return Button at top right (أعلى يمين الشاشة) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الرجوع للخلف</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Security & Confidentiality Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-l from-[#edf8f3] to-[#e4f5ed] border border-[#c1e8d4] flex items-center justify-between gap-3">
          <div className="text-right">
            <h4 className="font-bold text-sm text-[#006644]">معلوماتك آمنة وسرية</h4>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              {isGoogleMaps
                ? 'نستخدم بياناتك فقط لتنفيذ التقييمات الآمنة'
                : 'بدون طلب كلمة المرور إطلاقاً - نحتاج الرابط فقط'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#006644]/10 flex items-center justify-center text-[#006644] shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* 2. Selected Package Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f8faf9] border border-slate-200/90 relative">
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Official Platform Icon */}
            <div className="relative shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-2">
                <PlatformIcon platform={platform} size="lg" className="w-9 h-9" />
              </div>
            </div>

            {/* Middle: Title once and Clean Change Button */}
            <div className="flex-1 text-right">
              <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                {selectedPackageForOrder.countLabel ||
                  (isGoogleMaps
                    ? `باقة ${selectedPackageForOrder.reviewsCount} تقييم`
                    : `باقة ${selectedPackageForOrder.reviewsCount} متابع`)}
              </h3>

              {/* Clean Button: تغيير الباقة */}
              <button
                type="button"
                onClick={() => setIsChangingPackage(!isChangingPackage)}
                className="mt-1 text-[11px] font-bold text-[#006644] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{isChangingPackage ? 'إلغاء التغيير' : 'تغيير الباقة ↻'}</span>
              </button>
            </div>

            {/* Right: Badge & Boxed Price */}
            <div className="text-left shrink-0">
              {selectedPackageForOrder.isMostPopular && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#edf8f3] text-[#006644] text-[10px] font-bold mb-1">
                  <span>الأكثر طلباً</span>
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
              )}
              {appliedCoupon ? (
                <div className="p-2 rounded-xl bg-white border border-emerald-300 shadow-2xs text-center min-w-[75px]">
                  <div className="text-[10px] text-slate-400 line-through font-mono leading-none">
                    {originalPriceInfo?.amount} {originalPriceInfo?.symbol}
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-600 font-mono leading-tight mt-0.5">
                    {priceInfo.amount}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                    {priceInfo.symbol}
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-center min-w-[70px]">
                  <div className="text-base sm:text-lg font-black text-slate-950 font-mono leading-none">
                    {priceInfo.amount}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                    {priceInfo.symbol}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Active Limited-Time Discount Banner with Coordinated Compact Countdown */}
          {((selectedPackageForOrder.discountPercent && selectedPackageForOrder.discountPercent > 0) ||
            (selectedPackageForOrder.originalPriceSAR &&
              selectedPackageForOrder.originalPriceSAR > selectedPackageForOrder.priceSAR)) &&
            storeSettings.packagesSectionTexts?.countdownEnabled !== false && (
              <div className="mt-2.5">
                <CardCountdownTimer
                  enabled={true}
                  compact={true}
                  days={storeSettings.packagesSectionTexts?.countdownDays}
                  hours={storeSettings.packagesSectionTexts?.countdownHours}
                  minutes={storeSettings.packagesSectionTexts?.countdownMinutes}
                  label={storeSettings.packagesSectionTexts?.countdownLabel || 'عرض لفترة محدودة'}
                />
              </div>
          )}

          {/* Quick Package Switcher */}
          {isChangingPackage && (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 animate-in fade-in">
              {platformPackages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageForOrder.id;
                const p = formatPrice(pkg.priceSAR);
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackageForOrder(pkg);
                      setIsChangingPackage(false);
                    }}
                    className={`p-2 rounded-xl text-center transition-all duration-200 border cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-[#006644] font-black ring-2 ring-emerald-400/40 shadow-xs animate-option-selected'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700 text-xs'
                    }`}
                  >
                    <div className="font-bold text-xs">
                      {pkg.countLabel ? pkg.countLabel.split(' ')[0] : pkg.reviewsCount}{' '}
                      {isGoogleMaps ? 'تقييم' : 'متابع'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {p.amount} {p.symbol}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Success Screen or Form */}
        {createdOrder ? (
          <div className="space-y-4 py-3 text-center animate-in fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">تم تسجيل طلبك بنجاح!</h4>
              <p className="text-xs text-slate-600">
                رقم طلبك: <span className="font-mono font-bold text-[#006644]">#{createdOrder.id}</span>
              </p>
            </div>

            {/* Clean, organized order info card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-right space-y-2 text-xs shadow-2xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">الخدمة:</span>
                <span className="font-bold text-slate-800">
                  {isGoogleMaps
                    ? `خرائط Google (${createdOrder.packageReviewsCount} تقييم)`
                    : `${getPlatformLabel()} (${selectedPackageForOrder?.countLabel || `${createdOrder.packageReviewsCount} متابع`})`}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">اسم النشاط / الحساب:</span>
                <span className="font-bold text-slate-800">{createdOrder.businessName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">المبلغ:</span>
                <div className="text-left font-mono">
                  {createdOrder.originalPrice && (
                    <span className="text-slate-400 line-through text-[11px] ml-2">
                      {createdOrder.originalPrice} {createdOrder.currencySymbol}
                    </span>
                  )}
                  <span className="font-black text-[#006644]">
                    {createdOrder.price} {createdOrder.currencySymbol}
                  </span>
                </div>
              </div>
              {createdOrder.couponCode && (
                <div className="flex justify-between items-center py-1 border-b border-slate-100 bg-emerald-50/60 px-2 rounded-lg">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                    <span>كود الخصم:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {createdOrder.couponCode} (وفرت {createdOrder.discountAmount} {createdOrder.currencySymbol})
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">رقم التواصل:</span>
                <span className="font-bold text-slate-800 font-mono" dir="ltr">
                  {createdOrder.countryCode} {createdOrder.whatsapp}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed px-2">
              اضغط على الزر أدناه لإكمال وتأكيد الطلب مباشرة عبر محادثة واتساب الرسمية:
            </p>

            {(() => {
              const cleanStoreNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
              const couponText = createdOrder.couponCode
                ? `\n• كود الخصم: ${createdOrder.couponCode} (وفرت ${createdOrder.discountAmount} ${createdOrder.currencySymbol} - السعر الأصلي: ${createdOrder.originalPrice} ${createdOrder.currencySymbol})`
                : '';
              const waMsg = isGoogleMaps
                ? `طلب جديد نجمة #${createdOrder.id}\n• الخدمة: خرائط Google (${createdOrder.packageReviewsCount} تقييم)\n• المبلغ: ${createdOrder.price} ${createdOrder.currencySymbol}${couponText}\n• العميل: ${createdOrder.customerName}\n• النشاط: ${createdOrder.businessName}\n• الواتساب: ${createdOrder.countryCode} ${createdOrder.whatsapp}\n• الرابط: ${createdOrder.mapsUrl || 'مرفق'}${createdOrder.notes ? `\n• ملاحظات: ${createdOrder.notes}` : ''}`
                : `طلب جديد نجمة #${createdOrder.id}\n• الخدمة: ${getPlatformLabel()} (${selectedPackageForOrder?.countLabel || `${createdOrder.packageReviewsCount} متابع`})\n• المبلغ: ${createdOrder.price} ${createdOrder.currencySymbol}${couponText}\n• العميل: ${createdOrder.customerName}\n• الحساب: ${createdOrder.businessName}\n• الواتساب: ${createdOrder.countryCode} ${createdOrder.whatsapp}\n• الرابط: ${createdOrder.accountUrl || 'مرفق'}${createdOrder.currentFollowers ? `\n• المتابعون: ${createdOrder.currentFollowers}` : ''}${createdOrder.notes ? `\n• ملاحظات: ${createdOrder.notes}` : ''}`;
              const waUrl = `https://wa.me/${cleanStoreNumber}?text=${encodeURIComponent(waMsg)}`;

              return (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-full bg-[#006644] hover:bg-[#005538] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>إكمال الطلب عبر واتساب</span>
                </a>
              );
            })()}
          </div>
        ) : isGoogleMaps ? (
          /* =========================================================
             FORM 1: Google Maps (الفورم الحالي لخرائط جوجل)
             ========================================================= */
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            
            {/* Field 1: الاسم الكريم */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block text-right">
                الاسم الكريم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسمك أو اسم المسؤول"
                  className="w-full pr-10 pl-3.5 py-3 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right"
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: اسم النشاط التجاري على Google Maps */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block text-right">
                اسم النشاط التجاري على Google Maps <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="كما هو مسجل في الخريطة"
                  className="w-full pr-10 pl-3.5 py-3 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right"
                />
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              </div>
            </div>

            {/* Field 3: رابط النشاط على Google Maps */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block text-right">
                رابط النشاط على Google Maps <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full pr-10 pl-3.5 py-3 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right ltr:text-left"
                />
                <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              </div>
            </div>

            {/* Field 4 & 5: Two columns row: WhatsApp and Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* WhatsApp Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رقم الواتساب للتواصل</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200/90 bg-[#f8faf9] overflow-hidden focus-within:ring-2 focus-within:ring-[#006644] focus-within:bg-white">
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="5xxxxxxxx"
                    className="flex-1 px-3 py-3 bg-transparent text-slate-900 text-xs sm:text-sm focus:outline-none text-right font-mono"
                  />
                  <div className="px-2.5 py-1.5 flex items-center gap-1 border-r border-slate-200 bg-white/70 text-xs font-bold text-slate-700">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent focus:outline-none cursor-pointer text-xs"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} {c.flag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ملاحظات خاصة (اختياري)</span>
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي تفاصيل ترغب بالتركيز عليها..."
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right resize-none"
                  />
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-slate-400">
                    {notes.length}/500
                  </span>
                </div>
              </div>

            </div>

            {/* Optional Coupon Code Box */}
            {renderCouponSection()}

            {/* Bottom CTA Submit Button: "اطلب هذه الخدمة" */}
            <div className="pt-3 relative group/btnbox">
              {/* Subtle Ambient Glow around the box */}
              <div className="absolute -inset-1 rounded-full bg-emerald-500/20 opacity-40 blur-md animate-cta-glow pointer-events-none group-hover/btnbox:opacity-75 transition-opacity duration-300" />

              {/* Clean & Sleek Gradient Border Ring */}
              <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 animate-cta-flow shadow-xs group-hover/btnbox:shadow-md transition-all duration-300">
                <button
                  type="submit"
                  className="relative w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-l from-[#005a3c] via-[#006644] to-[#007850] hover:from-[#006644] hover:via-[#007850] hover:to-[#008f5f] text-white font-black text-sm sm:text-base transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_3px_12px_rgba(0,102,68,0.25)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 group/btn overflow-hidden"
                >
                  {/* Soft Subtle Shimmer Light Sweep */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-cta-shimmer" />

                  {/* Sparkle Icon */}
                  <Sparkles className="w-4 h-4 text-emerald-200/90 fill-emerald-200/40 group-hover/btn:rotate-12 transition-transform duration-200 shrink-0 relative z-10" />

                  <span className="relative z-10 font-black tracking-wide">اطلب هذه الخدمة</span>

                  {/* Arrow Icon */}
                  <ArrowLeft className="w-4 h-4 text-white/90 group-hover/btn:-translate-x-1 transition-all duration-200 shrink-0 relative z-10" />
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* =========================================================
             FORM 2: Social Media Platforms (سناب شات، فيسبوك، انستقرام، تيك توك)
             حسب طلب المستخدم بدقة:
             1. اسم الصفحة أو الحساب
             2. رابط الصفحة أو الحساب
             3. عدد المتابعين الحالي مع زر إضافة لقطة شاشة من الحساب
             4. رقم الواتس اب
             5. ملاحظة اختياري
             6. زر "اطلب هذه الخدمة"
             ========================================================= */
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            
            {/* Field 1: اسم الصفحة أو الحساب */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block text-right">
                اسم الصفحة أو الحساب <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={`اسم حساب ${getPlatformLabel()} أو اسم المستخدم (@username)`}
                  className="w-full pr-10 pl-3.5 py-3 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right"
                />
                <AtSign className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: رابط الصفحة أو الحساب */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block text-right">
                رابط الصفحة أو الحساب <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={accountUrl}
                  onChange={(e) => setAccountUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pr-10 pl-3.5 py-3 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right ltr:text-left"
                />
                <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              </div>
            </div>

            {/* Field 3: عدد المتابعين الحالي مع زر إضافة لقطة شاشة من الحساب */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block text-right">
                عدد المتابعين الحالي وإثبات الحساب
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Followers count input */}
                <div className="relative">
                  <input
                    type="text"
                    value={currentFollowers}
                    onChange={(e) => setCurrentFollowers(e.target.value)}
                    placeholder="مثال: 1,450 متابع"
                    className="w-full pr-9 pl-3 py-2.5 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right font-mono"
                  />
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
                </div>

                {/* Screenshot Upload Button */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                    id="account-screenshot-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      screenshotPreview
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-dashed border-slate-300 bg-[#f8faf9] hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {screenshotPreview ? (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-[130px]">{screenshotFileName || 'تم إرفاق اللقطة'}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveScreenshot();
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs px-1"
                          title="حذف الصورة"
                        >
                          ✕
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#006644]" />
                        <span>إضافة لقطة شاشة من الحساب</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Thumbnail preview if uploaded */}
              {screenshotPreview && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <img
                    src={screenshotPreview}
                    alt="لقطة الحساب"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="flex-1 text-right">
                    <span className="font-bold text-slate-800 block text-[11px]">تم تجهيز لقطة الشاشة</span>
                    <span className="text-[10px] text-slate-400">ستُرسل لتأكيد عدد المتابعين قبل البدء</span>
                  </div>
                </div>
              )}
            </div>

            {/* Field 4 & 5: Two columns row: WhatsApp and Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* WhatsApp Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رقم الواتساب</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200/90 bg-[#f8faf9] overflow-hidden focus-within:ring-2 focus-within:ring-[#006644] focus-within:bg-white">
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="5xxxxxxxx"
                    className="flex-1 px-3 py-3 bg-transparent text-slate-900 text-xs sm:text-sm focus:outline-none text-right font-mono"
                  />
                  <div className="px-2.5 py-1.5 flex items-center gap-1 border-r border-slate-200 bg-white/70 text-xs font-bold text-slate-700">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent focus:outline-none cursor-pointer text-xs"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} {c.flag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes Textarea (اختياري) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ملاحظة (اختياري)</span>
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي توصيات بشأن الحساب..."
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200/90 bg-[#f8faf9] text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white transition-all text-right resize-none"
                  />
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-slate-400">
                    {notes.length}/500
                  </span>
                </div>
              </div>

            </div>

            {/* Optional Coupon Code Box */}
            {renderCouponSection()}

            {/* Bottom CTA Submit Button: "اطلب هذه الخدمة" */}
            <div className="pt-3 relative group/btnbox">
              {/* Subtle Ambient Glow around the box */}
              <div className="absolute -inset-1 rounded-full bg-emerald-500/20 opacity-40 blur-md animate-cta-glow pointer-events-none group-hover/btnbox:opacity-75 transition-opacity duration-300" />

              {/* Clean & Sleek Gradient Border Ring */}
              <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 animate-cta-flow shadow-xs group-hover/btnbox:shadow-md transition-all duration-300">
                <button
                  type="submit"
                  className="relative w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-l from-[#005a3c] via-[#006644] to-[#007850] hover:from-[#006644] hover:via-[#007850] hover:to-[#008f5f] text-white font-black text-sm sm:text-base transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_3px_12px_rgba(0,102,68,0.25)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 group/btn overflow-hidden"
                >
                  {/* Soft Subtle Shimmer Light Sweep */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-cta-shimmer" />

                  {/* Sparkle Icon */}
                  <Sparkles className="w-4 h-4 text-emerald-200/90 fill-emerald-200/40 group-hover/btn:rotate-12 transition-transform duration-200 shrink-0 relative z-10" />

                  <span className="relative z-10 font-black tracking-wide">اطلب هذه الخدمة</span>

                  {/* Arrow Icon */}
                  <ArrowLeft className="w-4 h-4 text-white/90 group-hover/btn:-translate-x-1 transition-all duration-200 shrink-0 relative z-10" />
                </button>
              </div>
            </div>

          </form>
        )}

        {/* 4. Bottom Trust Features Strip */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-slate-200/80">
          <div className="grid grid-cols-3 gap-2 text-center items-center divide-x divide-x-reverse divide-slate-200">
            
            {/* Trust 1: جودة عالية */}
            <div className="flex flex-col items-center gap-1 px-1">
              <ShieldCheck className="w-4 h-4 text-[#006644]" />
              <div className="text-[11px] font-bold text-slate-900 leading-tight">
                {isGoogleMaps ? 'جودة عالية' : 'متابعين عرب 100%'}
              </div>
              <div className="text-[10px] text-slate-500">ونتائج مضمونة</div>
            </div>

            {/* Trust 2: تنفيذ سريع */}
            <div className="flex flex-col items-center gap-1 px-1">
              <Zap className="w-4 h-4 text-[#006644]" />
              <div className="text-[11px] font-bold text-slate-900 leading-tight">تنفيذ فوري</div>
              <div className="text-[10px] text-slate-500">خلال دقائق إلى 24 ساعة</div>
            </div>

            {/* Trust 3: دعم متواصل */}
            <div className="flex flex-col items-center gap-1 px-1">
              <Headphones className="w-4 h-4 text-[#006644]" />
              <div className="text-[11px] font-bold text-slate-900 leading-tight">دعم متواصل</div>
              <div className="text-[10px] text-slate-500">عبر الواتساب</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
