import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Copy,
  Edit2,
  Trash2,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CouponItem, CouponDiscountType, PlatformCategory } from '../../types';

export const AdminCouponsTab: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, formatPrice } =
    useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formDiscountType, setFormDiscountType] = useState<CouponDiscountType>('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(10);
  const [formMinOrderPrice, setFormMinOrderPrice] = useState<string>('0');
  const [formMaxDiscount, setFormMaxDiscount] = useState<string>('');
  const [formUsageLimit, setFormUsageLimit] = useState<string>('');
  const [formExpiresAt, setFormExpiresAt] = useState<string>('');
  const [formPlatform, setFormPlatform] = useState<string>('all');
  const [formCustomerTarget, setFormCustomerTarget] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>('');

  // Stats calculation
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);

  // Filtered coupons
  const today = new Date().toISOString().split('T')[0];
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.customerTarget || '').toLowerCase().includes(search.toLowerCase());

    const isExpired = c.expiresAt && c.expiresAt < today;

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = c.isActive && !isExpired;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !c.isActive;
    } else if (statusFilter === 'expired') {
      matchesStatus = Boolean(isExpired);
    }

    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormDiscountType('percentage');
    setFormDiscountValue(10);
    setFormMinOrderPrice('0');
    setFormMaxDiscount('');
    setFormUsageLimit('');
    setFormExpiresAt('');
    setFormPlatform('all');
    setFormCustomerTarget('');
    setFormIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDiscountType(coupon.discountType);
    setFormDiscountValue(coupon.discountValue);
    setFormMinOrderPrice(coupon.minOrderPrice ? String(coupon.minOrderPrice) : '0');
    setFormMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : '');
    setFormUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : '');
    setFormExpiresAt(coupon.expiresAt || '');
    setFormPlatform(
      coupon.applicablePlatforms === 'all'
        ? 'all'
        : Array.isArray(coupon.applicablePlatforms) && coupon.applicablePlatforms.length > 0
        ? coupon.applicablePlatforms[0]
        : 'all'
    );
    setFormCustomerTarget(coupon.customerTarget || '');
    setFormIsActive(coupon.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['NAJMA', 'VIP', 'OFFER', 'SAVE', 'DEAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setFormCode(`${randomPrefix}${randomNum}`);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) {
      setFormError('يرجى إدخال رمز الكود');
      return;
    }

    // Check duplicate code if adding
    if (!editingCoupon) {
      const exists = coupons.some((c) => c.code.toUpperCase() === cleanCode);
      if (exists) {
        setFormError('رمز كود الخصم هذا موجود بالفعل، اختر رمزاً مختلفاً');
        return;
      }
    } else {
      const exists = coupons.some(
        (c) => c.id !== editingCoupon.id && c.code.toUpperCase() === cleanCode
      );
      if (exists) {
        setFormError('رمز كود الخصم هذا مستخدم في كود آخر');
        return;
      }
    }

    if (formDiscountValue <= 0) {
      setFormError('قيمة الخصم يجب أن تكون أكبر من صفر');
      return;
    }

    if (formDiscountType === 'percentage' && formDiscountValue > 100) {
      setFormError('النسبة المئوية لا يمكن أن تتجاوز 100%');
      return;
    }

    const minPrice = parseFloat(formMinOrderPrice) || 0;
    const maxDiscount = formMaxDiscount ? parseFloat(formMaxDiscount) : undefined;
    const usageLimit = formUsageLimit ? parseInt(formUsageLimit, 10) : undefined;
    const applicablePlatforms: PlatformCategory[] | 'all' =
      formPlatform === 'all' ? 'all' : [formPlatform as PlatformCategory];

    if (editingCoupon) {
      updateCoupon({
        ...editingCoupon,
        code: cleanCode,
        discountType: formDiscountType,
        discountValue: formDiscountValue,
        minOrderPrice: minPrice,
        maxDiscount,
        usageLimit,
        expiresAt: formExpiresAt || undefined,
        applicablePlatforms,
        customerTarget: formCustomerTarget.trim() || undefined,
        isActive: formIsActive,
      });
    } else {
      addCoupon({
        code: cleanCode,
        discountType: formDiscountType,
        discountValue: formDiscountValue,
        minOrderPrice: minPrice,
        maxDiscount,
        usageLimit,
        expiresAt: formExpiresAt || undefined,
        applicablePlatforms,
        customerTarget: formCustomerTarget.trim() || undefined,
        isActive: formIsActive,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`هل أنت متأكد من حذف كود الخصم (${code})؟ لن يتمكن العملاء من استخدامه بعد الآن.`)) {
      deleteCoupon(id);
    }
  };

  const getPlatformName = (platforms?: PlatformCategory[] | 'all') => {
    if (!platforms || platforms === 'all') return 'جميع الخدمات';
    if (platforms.includes('google-maps')) return 'خرائط Google';
    if (platforms.includes('snapchat')) return 'سناب شات';
    if (platforms.includes('facebook')) return 'فيسبوك';
    if (platforms.includes('instagram')) return 'انستقرام';
    if (platforms.includes('tiktok')) return 'تيك توك';
    return 'خدمات محددة';
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-l from-[#edf8f3] via-white to-amber-50/40 border border-[#c1e8d4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006644]/10 text-[#006644] text-xs font-bold border border-[#006644]/20">
            <Ticket className="w-3.5 h-3.5" />
            <span>نظام كوبونات وأكواد الخصم</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            إدارة أكواد وقسائم الخصم للعملاء
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            أنشئ أكواد خصم بنسبة مئوية أو مبالغ نقدية محددة لأي عميل أو عامة للجميع، مع التحكم بالحد الأقصى للاستخدام وتاريخ الانتهاء.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ إنشاء كود خصم جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">إجمالي الأكواد</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalCoupons}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">منشأة ومسجلة بالنظام</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">الأكواد الفعّالة الآن</div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{activeCoupons}</div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">جاهزة للاستخدام من العملاء</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">إجمالي مرات الاستخدام</div>
            <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">{totalUses}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">مرة في طلبات العملاء</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود الخصم أو اسم العميل..."
            className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#006644] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({coupons.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-[#006644] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            النشطة ({activeCoupons})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-[#006644] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المعطلة ({coupons.filter((c) => !c.isActive).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'expired'
                ? 'bg-[#006644] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المنتهية ({coupons.filter((c) => c.expiresAt && c.expiresAt < today).length})
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {filteredCoupons.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">لا توجد أكواد خصم تطابق البحث</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            يمكنك إنشاء كود خصم جديد الآن وتعيينه لأي عميل أو لجميع المنصات بنقرة واحدة.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#006644] text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-[#005538] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء أول كود خصم</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoupons.map((coupon) => {
            const isExpired = coupon.expiresAt && coupon.expiresAt < today;
            const isLimitReached =
              coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;

            return (
              <div
                key={coupon.id}
                className={`p-5 rounded-3xl border transition-all duration-200 space-y-4 ${
                  coupon.isActive && !isExpired && !isLimitReached
                    ? 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-80'
                }`}
              >
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-sm tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <span>{coupon.code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="نسخ الكود"
                      >
                        {copiedCode === coupon.code ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        coupon.discountType === 'percentage'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {coupon.discountType === 'percentage'
                        ? `خصم ${coupon.discountValue}%`
                        : `خصم ${coupon.discountValue} ر.س`}
                    </span>
                  </div>

                  {/* Status Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={coupon.isActive}
                        onChange={() => toggleCouponStatus(coupon.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006644]"></div>
                    </label>
                  </div>
                </div>

                {/* Description or Target Customer */}
                <div className="text-xs text-slate-700">
                  <div className="font-bold text-slate-900">
                    {coupon.customerTarget || 'كود عام متاح لجميع العملاء'}
                  </div>
                  {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      أقصى خصم: {coupon.maxDiscount} ر.س
                    </div>
                  )}
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      الاستخدام: <strong>{coupon.usedCount}</strong>
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (غير محدود)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{getPlatformName(coupon.applicablePlatforms)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {coupon.minOrderPrice && coupon.minOrderPrice > 0
                        ? `الحد الأدنى: ${coupon.minOrderPrice} ر.س`
                        : 'بدون حد أدنى'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {coupon.expiresAt ? (
                        <span className={isExpired ? 'text-rose-600 font-bold' : ''}>
                          {isExpired ? `منتهي (${coupon.expiresAt})` : `ينتهي: ${coupon.expiresAt}`}
                        </span>
                      ) : (
                        'صالح دائماً'
                      )}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    أُنشئ: {coupon.createdAt}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(coupon)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="حذف الكود"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg rounded-[28px] bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-7 space-y-4 text-right animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute left-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Ticket className="w-4 h-4 text-[#006644]" />
                <span>{editingCoupon ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}</span>
              </div>
              <h3 className="text-lg font-black text-slate-950">
                {editingCoupon ? `تعديل الكود: ${editingCoupon.code}` : 'إضافة كود وقسيمة خصم'}
              </h3>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              {/* Field 1: Coupon Code + Random Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    رمز كود الخصم (Coupon Code) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[11px] text-[#006644] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>توليد كود تلقائي 🎲</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => {
                    setFormCode(e.target.value.toUpperCase().replace(/\s+/g, ''));
                    setFormError('');
                  }}
                  placeholder="مثال: NAJMA20 أو VIPCLIENT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono font-bold tracking-widest text-sm text-left uppercase"
                  dir="ltr"
                />
              </div>

              {/* Field 2 & 3: Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">نوع الخصم</label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as CouponDiscountType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ نقدي ثابت (ر.س)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    قيمة الخصم {formDiscountType === 'percentage' ? '(%)' : '(ر.س)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max={formDiscountType === 'percentage' ? 100 : 9999}
                    required
                    value={formDiscountValue}
                    onChange={(e) => setFormDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={formDiscountType === 'percentage' ? 'مثال: 15' : 'مثال: 50'}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono font-bold"
                  />
                </div>
              </div>

              {/* Field 4 & 5: Min Order Price & Max Discount Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    الحد الأدنى لقيمة الطلب (ر.س)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMinOrderPrice}
                    onChange={(e) => setFormMinOrderPrice(e.target.value)}
                    placeholder="0 = بدون حد أدنى"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    لن يُطبق الكود إذا كانت الباقة أقل من هذا المبلغ.
                  </span>
                </div>

                {formDiscountType === 'percentage' ? (
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">
                      سقف أقصى للخصم (ر.س) - اختياري
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value)}
                      placeholder="اتركه فارغاً لبدون سقف"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      أقصى مبلغ يمكن خصمه مهما بلغت قيمة الباقة.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">
                      حد مرات الاستخدام - اختياري
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formUsageLimit}
                      onChange={(e) => setFormUsageLimit(e.target.value)}
                      placeholder="1 لعميل محدد، أو اتركه فارغاً"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      عدد المرات الإجمالية المسموحة للكود.
                    </span>
                  </div>
                )}
              </div>

              {/* Field 6 & 7: Expiration Date & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    تاريخ انتهاء الصلاحية (اختياري)
                  </label>
                  <input
                    type="date"
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    اتركه فارغاً ليكون الكود صالحاً بدون وقت محدد.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">يسري على الخدمة</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                  >
                    <option value="all">جميع المنصات والخدمات</option>
                    <option value="google-maps">خرائط جوجل فقط</option>
                    <option value="snapchat">سناب شات فقط</option>
                    <option value="instagram">انستقرام فقط</option>
                    <option value="tiktok">تيك توك فقط</option>
                    <option value="facebook">فيسبوك فقط</option>
                  </select>
                </div>
              </div>

              {/* Field 8: Customer Target / Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  مخصص لعميل محدد أو ملاحظات للإدارة (اختياري)
                </label>
                <input
                  type="text"
                  value={formCustomerTarget}
                  onChange={(e) => setFormCustomerTarget(e.target.value)}
                  placeholder="مثال: خاص بالعميل فهد العتيبي (كافيه لافندر) أو كود حملة اليوم الوطني"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                />
                <span className="text-[10px] text-slate-400 block">
                  يساعدك على معرفة لمن أُعطي هذا الكود والغرض منه.
                </span>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="font-bold text-slate-800 block">تفعيل الكود فوراً</span>
                  <span className="text-[10px] text-slate-500">
                    يمكن للعملاء إدخال الكود والاستفادة من الخصم مباشرة
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006644]"></div>
                </label>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {editingCoupon ? 'حفظ التعديلات' : 'إنشاء الكود الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
