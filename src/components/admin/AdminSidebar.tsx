import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Settings,
  Store,
  DollarSign,
  HelpCircle,
  Bot,
  Layers,
  LogOut,
  RotateCcw,
  ExternalLink,
  FileEdit,
  Activity,
  BarChart3,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { NajmaLogo } from '../NajmaLogo';

export type AdminTab =
  | 'overview'
  | 'analytics'
  | 'orders'
  | 'coupons'
  | 'packages'
  | 'section-texts'
  | 'reviews'
  | 'store'
  | 'currencies'
  | 'faqs'
  | 'bot'
  | 'sections'
  | 'pixels';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  ordersCount: number;
  packagesCount: number;
  reviewsCount: number;
  couponsCount?: number;
  onLogout: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  packagesCount,
  reviewsCount,
  couponsCount,
  onLogout,
  onReset,
  onClose,
}) => {
  const menuItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    highlight?: boolean;
  }[] = [
    {
      id: 'overview',
      label: 'نظرة عامة وإحصائيات',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'إدارة الطلبات',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
    {
      id: 'coupons',
      label: 'أكواد وقسائم الخصم',
      icon: Ticket,
      badge: couponsCount !== undefined && couponsCount > 0 ? couponsCount : 'جديد 🔥',
    },
    {
      id: 'store',
      label: 'إعدادات المتجر والأمان (2FA)',
      icon: Settings,
      badge: 'الأمان 🔒',
      highlight: true,
    },
    {
      id: 'packages',
      label: 'الحزم والأسعار وتخصيص الكروت',
      icon: Package,
      badge: packagesCount,
    },
    {
      id: 'analytics',
      label: 'الزيارات اليومية والمنصات والفورم',
      icon: BarChart3,
      badge: 'محدث ⚡',
    },
    {
      id: 'section-texts',
      label: 'تعديل نصوص أقسام المتجر',
      icon: FileEdit,
    },
    {
      id: 'reviews',
      label: 'آراء وتقييمات العملاء',
      icon: Star,
      badge: reviewsCount,
    },
    {
      id: 'currencies',
      label: 'أسعار الصرف والعملات',
      icon: DollarSign,
    },
    {
      id: 'bot',
      label: 'المساعد الذكي للبوت',
      icon: Bot,
    },
    {
      id: 'sections',
      label: 'أقسام المتجر المرئية',
      icon: Layers,
    },
    {
      id: 'faqs',
      label: 'الأسئلة الشائعة',
      icon: HelpCircle,
    },
    {
      id: 'pixels',
      label: 'تتبع الإعلانات والبكسل (Pixels)',
      icon: Activity,
    },
  ];

  return (
    <aside className="w-64 sm:w-72 h-full max-h-screen bg-white text-slate-800 flex flex-col shrink-0 border-l border-slate-200/90 shadow-sm select-none overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#edf8f3] border border-emerald-100 text-[#006644]">
            <NajmaLogo className="w-7 h-7 text-[#006644]" />
          </div>
          <div className="text-right">
            <h2 className="font-black text-sm text-slate-900">لوحة تحكم نجمة</h2>
            <span className="text-[11px] text-[#006644] font-bold">مدير النظام</span>
          </div>
        </div>
      </div>

      {/* Navigation List with smooth scrolling */}
      <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto overscroll-contain">
        <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 text-right">
          أقسام الإدارة
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#006644] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#edf8f3] hover:text-[#006644]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-white text-[#006644]'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/70">
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-950 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>عرض المتجر</span>
          </div>
          <span className="text-[10px] text-slate-400">إغلاق النافذة</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-100/60 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span>استعادة البيانات الافتراضية</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
