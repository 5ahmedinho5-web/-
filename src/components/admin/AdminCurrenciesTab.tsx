import React, { useState } from 'react';
import {
  DollarSign,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GCCCurrencyCode } from '../../types';

export const AdminCurrenciesTab: React.FC = () => {
  const { storeSettings, updateCurrencyRate, currentCurrency, setCurrentCurrency } = useStore();
  const [rates, setRates] = useState<Record<GCCCurrencyCode, number>>({
    SAR: storeSettings.currencies.SAR.rateAgainstSAR,
    AED: storeSettings.currencies.AED.rateAgainstSAR,
    KWD: storeSettings.currencies.KWD.rateAgainstSAR,
    QAR: storeSettings.currencies.QAR.rateAgainstSAR,
    BHD: storeSettings.currencies.BHD.rateAgainstSAR,
    OMR: storeSettings.currencies.OMR.rateAgainstSAR,
  });

  const [savedCode, setSavedCode] = useState<string | null>(null);

  const handleRateChange = (code: GCCCurrencyCode, val: number) => {
    setRates((prev) => ({ ...prev, [code]: val }));
  };

  const handleSaveRate = (code: GCCCurrencyCode) => {
    updateCurrencyRate(code, Number(rates[code]));
    setSavedCode(code);
    setTimeout(() => setSavedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base text-slate-900">أسعار الصرف وعملات الخليج</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          تعديل سعر الصرف بالنسبة للريال السعودي (1 SAR = كم بالعملة المستهدفة) لتحديث تحويل الأسعار تلقائياً
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(storeSettings.currencies) as GCCCurrencyCode[]).map((code) => {
          const curr = storeSettings.currencies[code];
          return (
            <div
              key={code}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{curr.flag}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{curr.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      رمز: {curr.symbol} ({code})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentCurrency(code)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    currentCurrency === code
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {currentCurrency === code ? 'العملة المعروضة حالياً ✓' : 'معاينة بالمتجر'}
                </button>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <label className="font-bold text-slate-700 block">
                  معامل التحويل (كم يعادل 1 ريال سعودي؟):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={rates[code]}
                    onChange={(e) => handleRateChange(code, parseFloat(e.target.value) || 0)}
                    disabled={code === 'SAR'}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-50"
                  />
                  {code !== 'SAR' && (
                    <button
                      type="button"
                      onClick={() => handleSaveRate(code)}
                      className="px-4 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold transition-colors cursor-pointer shrink-0"
                    >
                      {savedCode === code ? 'تم الحفظ ✓' : 'حفظ'}
                    </button>
                  )}
                </div>
                {code === 'SAR' && (
                  <span className="text-[10px] text-slate-400 block">
                    الريال السعودي هو العملة الأساسية للمتجر (1.000).
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
