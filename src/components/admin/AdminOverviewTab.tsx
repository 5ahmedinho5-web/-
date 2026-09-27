import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  Star,
  Users,
  ArrowUpRight,
  Eye,
  FileEdit,
  Activity,
  Layers,
  Settings,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const { orders, packages, reviews, coupons, formatPrice, analyticsData } = useStore();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'new').length;
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  const totalRevenueSAR = orders.reduce((sum, o) => {
    return sum + (Number(o.price) || 0);
  }, 0);

  const formattedRevenue = formatPrice(totalRevenueSAR);
  const todayVisits = analyticsData.todayStats.totalVisits;
  const todayStarts = analyticsData.todayStats.formStarts;
  const todayCompletes = analyticsData.todayStats.formCompletes;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            مرحباً بك في لوحة تحكم المتجر
          </span>
          <h2 className="text-xl sm:text-2xl font-black mb-2">
            نظام إدارة متجر نجمة لخدمات خرائط Google وباقي المنصات
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            من هنا يمكنك متابعة الطلبات المسجلة، تحليل الزيارات اليومية وتدفق الفورم، تحديث أسعار وحزم التقييمات، وتخصيص هوية المتجر بكل سهولة.
          </p>
        </div>
        <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
          <TrendingUp className="w-36 h-36" />
        </div>
      </div>

      {/* NEW: Daily Traffic & Conversion Banner */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006644] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900">
                حركة المرور والتحويل اليومية (مباشر اليوم: {analyticsData.todayStats.date})
              </h3>
              <p className="text-xs text-slate-500">
                متابعة عدد الزيارات، كم زائر بدأ كتابة الفورم، وكم واحد أتم بنجاح
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="px-4 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white text-xs font-black transition-all flex items-center gap-1.5 self-start sm:self-center shadow-xs cursor-pointer"
          >
            <span>تقرير الزيارات والمنصات المفصل</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 mini cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-700 block">زيارات المتجر اليوم</span>
              <span className="text-2xl font-black font-mono text-slate-900">{todayVisits}</span>
            </div>
            <Eye className="w-6 h-6 text-blue-500/70" />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-800 block">بدأوا كتابة الفورم</span>
              <span className="text-2xl font-black font-mono text-slate-900">{todayStarts}</span>
            </div>
            <FileEdit className="w-6 h-6 text-amber-500/70" />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#006644] block">أكملوا الفورم بنجاح</span>
              <span className="text-2xl font-black font-mono text-[#006644]">{todayCompletes}</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-500/70" />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الطلبات</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {totalOrders}
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض كل الطلبات</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طلبات قيد الانتظار</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {pendingOrders}
          </div>
          <span className="text-[11px] text-amber-600 font-medium block">
            تحتاج متابعة مع العميل
          </span>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">قيد التنفيذ والجدولة</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {inProgressOrders}
          </div>
          <span className="text-[11px] text-blue-600 font-medium block">
            جاري ضخ التقييمات
          </span>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طلبات مكتملة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {completedOrders}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block">
            تم التنفيذ بنجاح 100%
          </span>
        </div>

      </div>

      {/* Quick Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders Preview */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">أحدث الطلبات الواردة</h3>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              عرض الكل ({orders.length})
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">لا توجد طلبات مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{order.customerName} - {order.businessName}</div>
                    <div className="text-slate-500 font-mono">{order.packageReviewsCount} تقييم • {order.whatsapp}</div>
                  </div>
                  <div className="text-left font-mono font-bold text-emerald-700">
                    {order.price} {order.currencySymbol}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store Health & Quick Stats */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">محتوى المتجر الحالي</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              onClick={() => onNavigateTab('store')}
              className="p-3.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 transition-colors cursor-pointer border border-amber-200/90 col-span-2 sm:col-span-1 shadow-2xs"
            >
              <div className="flex items-center justify-between text-amber-900 mb-1">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-amber-700" />
                  <span>إعدادات المتجر</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1.5 py-0.5 rounded-md font-bold">2FA 🔒</span>
              </div>
              <div className="text-[11px] text-amber-900/80 leading-relaxed font-medium">
                التحقق بخطوتين والإشعارات
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('coupons')}
              className="p-3.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 transition-colors cursor-pointer border border-purple-200/90 shadow-2xs"
            >
              <div className="flex items-center justify-between text-purple-900 mb-1">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-purple-700" />
                  <span>أكواد الخصم</span>
                </span>
                <span className="text-[10px] bg-purple-200/80 text-purple-950 px-1.5 py-0.5 rounded-md font-bold">
                  {coupons.filter((c) => c.isActive).length} نشط
                </span>
              </div>
              <div className="text-[11px] text-purple-900/80 leading-relaxed font-medium">
                {coupons.length} كوبونات منشأة
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('packages')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
            >
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Package className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">الحزم النشطة</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {packages.filter((p) => !p.isHidden).length} حزمة
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('reviews')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
            >
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold">آراء العملاء</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {reviews.length} تقييم
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#edf8f3] border border-[#c1e8d4] text-xs space-y-1">
            <div className="font-bold text-[#006644]">نصيحة للإدارة:</div>
            <p className="text-emerald-900/80 leading-relaxed">
              جميع التعديلات التي تجريها في لوحة التحكم تُحفظ فوراً وتنعكس مباشرة على واجهة المتجر للزوار.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
