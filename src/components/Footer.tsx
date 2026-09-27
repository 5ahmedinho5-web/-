import React, { useRef } from 'react';
import { MessageCircle, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NajmaLogo } from './NajmaLogo';

export const Footer: React.FC = () => {
  const { storeSettings, setIsAdminModalOpen } = useStore();
  const footerClickTimesRef = useRef<number[]>([]);

  // Secret 3-clicks handler on "نجمة" in Footer for Admin Dashboard
  const handleFooterLogoTripleClick = () => {
    const now = Date.now();
    footerClickTimesRef.current = [
      ...footerClickTimesRef.current.filter((t) => now - t < 1500),
      now,
    ];

    if (footerClickTimesRef.current.length >= 3) {
      footerClickTimesRef.current = [];
      setIsAdminModalOpen(true);
    }
  };

  return (
    <footer className="bg-slate-900/95 text-slate-300 border-t border-slate-800/80 py-4 sm:py-5" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3.5">
        
        {/* Payment Banner: جميع طرق الدفع متاحه */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-xs">جميع طرق الدفع متاحة</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">(مدى، فيزا، ماستركارد، Apple Pay، تحويل بنكي فوري)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>دفع آمن 100% مع ضمان مدى الحياة</span>
          </div>
        </div>

        {/* Compact Single-Row Layout: Brand & WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 pb-2 border-b border-slate-800/60">
          
          {/* Right: Brand Name with Secret Triple Click */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-right">
            <button
              type="button"
              onClick={handleFooterLogoTripleClick}
              className="select-none focus:outline-none cursor-pointer group"
              aria-label="نجمة"
            >
              <NajmaLogo size="sm" color="#34d399" />
            </button>

            <span className="text-[11px] text-slate-400 font-normal max-w-sm sm:border-r sm:border-slate-800 sm:pr-3">
              منصة تعزيز حضور الأنشطة التجارية على Google Maps بمراجعات معتمدة وضمان مدى الحياة.
            </span>
          </div>

          {/* Left: Compact WhatsApp Contact Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>محادثة واتساب مباشرة</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright Strip - Compact with No Admin Clues */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمتجر {storeSettings.storeName || 'نجمة'}.
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>حسابات مرشدين محليين موثقة في السعودية والخليج العربي</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
