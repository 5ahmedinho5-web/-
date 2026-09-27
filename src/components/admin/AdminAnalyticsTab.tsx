import React, { useState } from 'react';
import {
  Users,
  Eye,
  FileEdit,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  Trash2,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PlatformCategory, VisitorDeviceLog } from '../../types';
import { PlatformIcon } from '../PlatformIcon';

export const AdminAnalyticsTab: React.FC = () => {
  const { analyticsData, refreshAnalytics, resetAnalytics } = useStore();
  const [selectedDayView, setSelectedDayView] = useState<'today' | string>('today');
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | PlatformCategory>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const today = analyticsData.todayStats;
  const historical = analyticsData.historicalDays || [];
  const allDays = [today, ...historical];

  const currentStats =
    selectedDayView === 'today'
      ? today
      : allDays.find((d) => d.date === selectedDayView) || today;

  const logs = analyticsData.visitorLogs || [];
  const filteredLogs =
    activePlatformFilter === 'all'
      ? logs
      : logs.filter((l) => l.platformVisited === activePlatformFilter);

  // Platform breakdown info
  const platformsConfig: {
    id: PlatformCategory;
    name: string;
    themeBg: string;
    textColor: string;
    border: string;
    barColor: string;
  }[] = [
    {
      id: 'google-maps',
      name: 'خرائط جوجل (Google Maps)',
      themeBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      border: 'border-emerald-200',
      barColor: 'bg-[#006644]',
    },
    {
      id: 'snapchat',
      name: 'سناب شات (Snapchat)',
      themeBg: 'bg-amber-50',
      textColor: 'text-amber-800',
      border: 'border-amber-200',
      barColor: 'bg-amber-400',
    },
    {
      id: 'instagram',
      name: 'انستقرام (Instagram)',
      themeBg: 'bg-rose-50',
      textColor: 'text-rose-700',
      border: 'border-rose-200',
      barColor: 'bg-gradient-to-r from-rose-500 to-purple-600',
    },
    {
      id: 'tiktok',
      name: 'تيك توك (TikTok)',
      themeBg: 'bg-slate-100',
      textColor: 'text-slate-900',
      border: 'border-slate-300',
      barColor: 'bg-slate-900',
    },
    {
      id: 'facebook',
      name: 'فيسبوك (Facebook)',
      themeBg: 'bg-blue-50',
      textColor: 'text-blue-700',
      border: 'border-blue-200',
      barColor: 'bg-blue-600',
    },
  ];

  // Pure Real Calculations: strictly 0 if no visits
  const visits = currentStats.totalVisits;
  const formStarts = currentStats.formStarts;
  const formCompletes = currentStats.formCompletes;
  const ordersCount = currentStats.ordersCount;

  const formStartRate = visits > 0 ? ((formStarts / visits) * 100).toFixed(1) : '0.0';
  const formCompleteRate = formStarts > 0 ? ((formCompletes / formStarts) * 100).toFixed(1) : '0.0';
  const overallConversion = visits > 0 ? ((formCompletes / visits) * 100).toFixed(1) : '0.0';

  // Device stats
  const mobileCount = currentStats.deviceStats?.mobile || 0;
  const desktopCount = currentStats.deviceStats?.desktop || 0;
  const tabletCount = currentStats.deviceStats?.tablet || 0;
  const totalDevices = mobileCount + desktopCount + tabletCount || (visits > 0 ? visits : 1);

  const mobilePct = visits > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;
  const desktopPct = visits > 0 ? Math.round((desktopCount / totalDevices) * 100) : 0;
  const tabletPct = visits > 0 ? Math.round((tabletCount / totalDevices) * 100) : 0;

  const handleReset = () => {
    resetAnalytics();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-950 via-slate-900 to-[#052116] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>نظام التتبع الحي الدقيق (Real-Time Zero-Mock Traffic)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            تحليل حركة المرور الحقيقية، عناوين الـ IP، وتدفق الفورم
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            بيانات فعلية 100% بدون أي أرقام عشوائية أو افتراضية: يتم تسجيل عنوان IP الزائر الحقيقي، نوع الجهاز (هاتف/كمبيوتر)، المنصة التي يتصفحها، متى فتح فورم الباقة، ومتى أكمل الطلب.
          </p>
        </div>

        {/* Controls: Date Filter, Refresh, Reset */}
        <div className="z-10 flex flex-wrap items-center gap-2 self-start md:self-center">
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-2xl">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedDayView}
              onChange={(e) => setSelectedDayView(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="today" className="bg-slate-800 text-white">
                اليوم ({today.date}) - مباشر
              </option>
              {historical.map((d) => (
                <option key={d.date} value={d.date} className="bg-slate-800 text-white">
                  يوم {d.date} ({d.totalVisits} زيارة)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={refreshAnalytics}
            title="تحديث البيانات اللحظية"
            className="p-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            title="تصفير العدادات إلى 0"
            className="p-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">تصفير (0)</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-2 text-rose-900 text-xs sm:text-sm font-bold">
            <Trash2 className="w-5 h-5 text-rose-600 shrink-0" />
            <span>هل تريد بالتأكيد تصفير كافة إحصائيات الزيارات وعناوين الـ IP لتبدأ من صفر (0) نظيف تماماً؟</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              نعم، صفّر الإحصائيات لـ 0
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* IP De-duplication Rule Confirmation Badge */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#006644]">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#006644]" />
          <span>
            نظام عدم تكرار الزيارات: كل شخص له عنوان IP يحسب مرة واحدة فقط — إذا دخل الزائر مرتين أو حدّث الصفحة لا يُحسب الدخول مرتين ويظل مسجلاً كزيارة واحدة.
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-center bg-white px-2.5 py-1 rounded-xl border border-emerald-200 font-mono text-[11px] font-black text-[#006644] shadow-2xs">
          <span>عناوين الـ IP الفريدة اليوم:</span>
          <span className="text-xs">{currentStats.uniqueIps?.length || visits}</span>
        </div>
      </div>

      {/* 4 Main Funnel Metrics: Strictly Real */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Daily Visits (Unique IP) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">الزيارات الحقيقية بالـ IP</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {visits}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-bold text-blue-600 font-mono">{visits}</span>
            <span>{visits === 1 ? 'عنوان IP فريد' : 'عناوين IP فريدة'} (بدون تكرار)</span>
          </div>
        </div>

        {/* 2. Form Starts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">بدأوا كتابة الفورم</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
            {formStarts}
          </div>
          <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
            <span className="font-mono">{formStartRate}%</span>
            <span className="text-slate-400 font-normal">من الزوار ضغطوا لاختيار باقة وبدأوا الفورم</span>
          </div>
        </div>

        {/* 3. Form Completes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">أكملوا الفورم بنجاح</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#006644] font-mono">
            {formCompletes}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span className="font-mono">{formCompleteRate}%</span>
            <span className="text-slate-400 font-normal">نسبة إنجاز من بدأوا كتابة الفورم</span>
          </div>
        </div>

        {/* 4. Conversion Rate (CVR) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">معدل التحويل الحقيقي (CVR)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 font-mono">
            {overallConversion}%
          </div>
          <div className="text-[11px] text-purple-700 font-bold flex items-center gap-1">
            <span className="font-mono">{ordersCount} طلب مكتمل</span>
            <span className="text-slate-400 font-normal">من أصل {visits} زيارة</span>
          </div>
        </div>

      </div>

      {/* Real Device Breakdown: كم جهاز جوال، كم كمبيوتر، كم تابلت */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>توزيع أجهزة الزوار الحقيقية (Device Type Breakdown)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              فحص تلقائي حقيقي لنوع الجهاز ونظام التشغيل لكل زائر يدخل المتجر
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
            رصد تلقائي للـ User-Agent
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Mobile */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>الهواتف الذكية (Mobile)</span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-700">{mobilePct}%</span>
            </div>
            <div className="text-xl font-black font-mono text-slate-950">
              {mobileCount} <span className="text-[11px] text-slate-400 font-normal">جهاز</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${mobilePct}%` }} />
            </div>
          </div>

          {/* Desktop */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span>أجهزة الكمبيوتر (Desktop)</span>
              </div>
              <span className="text-xs font-mono font-black text-blue-700">{desktopPct}%</span>
            </div>
            <div className="text-xl font-black font-mono text-slate-950">
              {desktopCount} <span className="text-[11px] text-slate-400 font-normal">جهاز</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${desktopPct}%` }} />
            </div>
          </div>

          {/* Tablet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Tablet className="w-4 h-4 text-purple-600" />
                <span>الأجهزة اللوحية (Tablet)</span>
              </div>
              <span className="text-xs font-mono font-black text-purple-700">{tabletPct}%</span>
            </div>
            <div className="text-xl font-black font-mono text-slate-950">
              {tabletCount} <span className="text-[11px] text-slate-400 font-normal">جهاز</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${tabletPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Funnel Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>قمع التحويل والاهتمام الفعلي (Conversion Funnel)</span>
            </h3>
            <p className="text-xs text-slate-500">
              تسلسل تجربة العميل الفعلية من أول زيارة للمتجر حتى تأكيد وحجز الباقة
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            التاريخ: {currentStats.date}
          </span>
        </div>

        {/* Step-by-Step Funnel Bars */}
        <div className="space-y-3 pt-2">
          {/* Step 1: Visit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">1</span>
                1. زيارة المتجر وتصفح الأقسام والباقات
              </span>
              <span className="font-mono font-black text-slate-900">{visits} زائر ({visits > 0 ? 100 : 0}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${visits > 0 ? 100 : 0}%` }} />
            </div>
          </div>

          {/* Step 2: Form Start */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center">2</span>
                2. فتح الفورم بعد اختيار الباقة والبدء في تعبئة البيانات
              </span>
              <span className="font-mono font-black text-amber-900">{formStarts} عميل ({formStartRate}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Number(formStartRate))}%` }}
              />
            </div>
          </div>

          {/* Step 3: Form Complete */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#006644] text-[10px] font-black flex items-center justify-center">3</span>
                3. إتمام الفورم بنجاح والانتقال لتأكيد الطلب
              </span>
              <span className="font-mono font-black text-[#006644]">{formCompletes} عميل ({overallConversion}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#006644] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Number(overallConversion))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown: كم واحد دخل على المنصة دي ودي ودي */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>تفاصيل حركة المرور حسب المنصات (Platform Breakdown)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إحصائية توضح كم شخص دخل وتفاعل مع باقات كل منصة في متجرك
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/80">
              تتبع بالنقرات الحقيقية ⚡
            </span>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformsConfig.map((p) => {
            const count = currentStats.platformVisits[p.id] || 0;
            const percentage = visits > 0 ? ((count / visits) * 100).toFixed(1) : '0.0';

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border ${p.border} ${p.themeBg} flex flex-col justify-between gap-3 shadow-2xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <PlatformIcon platform={p.id} size="sm" />
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">تفاعل واهتمام بالباقات</span>
                    </div>
                  </div>

                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-white ${p.textColor} shadow-2xs border border-slate-200/60`}>
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 font-medium">عدد الزوار:</span>
                    <span className="font-black font-mono text-base text-slate-950">
                      {count} <span className="text-[10px] font-normal text-slate-500">زائر</span>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full ${p.barColor} rounded-full`}
                      style={{ width: `${Math.min(100, Number(percentage))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: Real-Time Visitor IP & Device Log Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>سجل عناوين الـ IP الحقيقية والأجهزة النشطة (Live IP & Device Logs)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تفاصيل دقيقة لكل جلسة: عنوان الـ IP الفعلي، نوع وموديل الجهاز، المتصفح، المنصة المستهدفة، والوقت
            </p>
          </div>

          {/* Filter by platform */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={activePlatformFilter}
              onChange={(e) => setActivePlatformFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] cursor-pointer"
            >
              <option value="all">كل المنصات ({logs.length})</option>
              <option value="google-maps">خرائط جوجل</option>
              <option value="snapchat">سناب شات</option>
              <option value="instagram">انستقرام</option>
              <option value="tiktok">تيك توك</option>
              <option value="facebook">فيسبوك</option>
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Globe className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-black text-sm text-slate-700">لا توجد زيارات مسجلة حتى الآن (0 زيارة)</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              بمجرد دخول أي زائر جديد للمتجر، سيتم رصد عنوان الـ IP الفعلي الخاص به، نوع جهازه، والمنصة التي تصفحها وإظهارها هنا فورياً.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">عنوان IP الحقيقي</th>
                  <th className="py-2.5 px-3">نوع الجهاز والموديل</th>
                  <th className="py-2.5 px-3">نظام التشغيل والمتصفح</th>
                  <th className="py-2.5 px-3">المنصة المستهدفة</th>
                  <th className="py-2.5 px-3">الإجراء / التفاعل</th>
                  <th className="py-2.5 px-3">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      {/* IP */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {log.ip}
                          </span>
                          {log.country && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {log.country}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Device */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          {log.deviceType === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          ) : log.deviceType === 'Tablet' ? (
                            <Tablet className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{log.deviceModel || log.deviceType}</span>
                        </div>
                      </td>

                      {/* OS & Browser */}
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {log.os} • {log.browser}
                      </td>

                      {/* Platform */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold">
                          <PlatformIcon platform={log.platformVisited} size="sm" className="w-3.5 h-3.5" />
                          <span>
                            {log.platformVisited === 'google-maps'
                              ? 'خرائط جوجل'
                              : log.platformVisited === 'snapchat'
                              ? 'سناب شات'
                              : log.platformVisited === 'instagram'
                              ? 'انستقرام'
                              : log.platformVisited === 'tiktok'
                              ? 'تيك توك'
                              : 'فيسبوك'}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3">
                        {log.action === 'visit' && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                            زيارة وتصفح الباقات
                          </span>
                        )}
                        {log.action === 'form_start' && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
                            فتح الفورم ({log.packageName || 'باقة'})
                          </span>
                        )}
                        {log.action === 'form_complete' && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#006644] text-[10px] font-black border border-emerald-200">
                            أتم الطلب بنجاح ⚡
                          </span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {log.timeFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
