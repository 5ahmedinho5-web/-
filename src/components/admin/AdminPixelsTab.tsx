import React, { useState } from 'react';
import {
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  Zap,
  Play,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MarketingPixelsConfig, PixelEventLog } from '../../types';
import { pixelService } from '../../services/pixelService';

export const AdminPixelsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();

  const currentPixels: MarketingPixelsConfig = storeSettings.marketingPixels || {
    enabled: true,
    snapchatPixelId: '',
    tiktokPixelId: '',
    metaPixelId: '',
    googleTagId: '',
    eventLogs: [],
  };

  const [enabled, setEnabled] = useState(currentPixels.enabled ?? true);
  const [snapchatId, setSnapchatId] = useState(currentPixels.snapchatPixelId || '');
  const [tiktokId, setTiktokId] = useState(currentPixels.tiktokPixelId || '');
  const [metaId, setMetaId] = useState(currentPixels.metaPixelId || '');
  const [googleId, setGoogleId] = useState(currentPixels.googleTagId || '');
  const [eventLogs, setEventLogs] = useState<PixelEventLog[]>(currentPixels.eventLogs || []);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedConfig: MarketingPixelsConfig = {
      enabled,
      snapchatPixelId: snapchatId.trim(),
      tiktokPixelId: tiktokId.trim(),
      metaPixelId: metaId.trim(),
      googleTagId: googleId.trim(),
      eventLogs,
    };

    updateStoreSettings({
      ...storeSettings,
      marketingPixels: updatedConfig,
    });

    // Re-initialize pixels live
    pixelService.initPixels(updatedConfig);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFireTestEvent = () => {
    const testLogs = pixelService.trackPurchase({
      orderId: `TEST-ORDER-${Math.floor(1000 + Math.random() * 9000)}`,
      amountSAR: 399.99,
      packageName: 'باقة 100 تقييم خرائط Google (تجريبي)',
      platform: 'google-maps',
    });

    const newLogs = [
      ...testLogs,
      ...(eventLogs || []),
    ].slice(0, 30);

    setEventLogs(newLogs);

    // Save logs into state
    updateStoreSettings({
      ...storeSettings,
      marketingPixels: {
        ...currentPixels,
        enabled,
        snapchatPixelId: snapchatId.trim(),
        tiktokPixelId: tiktokId.trim(),
        metaPixelId: metaId.trim(),
        googleTagId: googleId.trim(),
        eventLogs: newLogs,
        lastTestEventDate: new Date().toISOString(),
      },
    });

    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const handleClearLogs = () => {
    setEventLogs([]);
    updateStoreSettings({
      ...storeSettings,
      marketingPixels: {
        ...currentPixels,
        eventLogs: [],
      },
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006644] to-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                إدارة وربط بكسل الإعلانات (Marketing Pixels)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                حقول حقيقية ومربوطة لحقن وتفعيل بكسل تتبع الحملات الإعلانية ومعدل الشراء (Conversion Tracking)
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-700">تفعيل التتبع الإعلاني:</span>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-[#006644]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-black ${enabled ? 'text-[#006644]' : 'text-slate-400'}`}>
              {enabled ? 'نشط' : 'معطّل'}
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم حفظ وربط إعدادات البكسل بنجاح، الأكواد جاهزة وتعمل في المتجر الآن!</span>
          </div>
        )}
      </div>

      {/* Pixels Grid Configuration */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Snapchat Pixel */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                👻
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Snapchat Pixel</h3>
                <span className="text-[10px] text-slate-400 font-mono">سناب شات بكسل</span>
              </div>
            </div>
            {snapchatId.trim() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>مربوط ونشط</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                غير معرّف
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            يتم إرسال أحداث الزيارة (<code className="text-amber-700 font-mono">PAGE_VIEW</code>)، وتسجيل الاهتمام (<code className="text-amber-700 font-mono">SIGN_UP</code>)، وعمليات الشراء المؤكدة (<code className="text-amber-700 font-mono">PURCHASE</code>) مباشرة لسناب شات.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Snapchat Pixel ID:</label>
            <input
              type="text"
              value={snapchatId}
              onChange={(e) => setSnapchatId(e.target.value)}
              placeholder="مثال: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* 2. TikTok Pixel */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
                🎵
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">TikTok Pixel</h3>
                <span className="text-[10px] text-slate-400 font-mono">تيك توك بكسل</span>
              </div>
            </div>
            {tiktokId.trim() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>مربوط ونشط</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                غير معرّف
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            يتبع الحملات الإعلانية على TikTok ويرسل أحداث (<code className="text-slate-800 font-mono">PageView</code>)، وتأكيد الاهتمام (<code className="text-slate-800 font-mono">SubmitForm</code>)، والطلبات (<code className="text-slate-800 font-mono">PlaceAnOrder</code>).
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">TikTok Pixel ID:</label>
            <input
              type="text"
              value={tiktokId}
              onChange={(e) => setTiktokId(e.target.value)}
              placeholder="مثال: C90ABCDEF1234567890"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* 3. Meta (Facebook & Instagram) Pixel */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white font-black flex items-center justify-center text-sm shadow-xs">
                ♾️
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Meta Pixel (Facebook / Instagram)</h3>
                <span className="text-[10px] text-slate-400 font-mono">بكسل ميتا</span>
              </div>
            </div>
            {metaId.trim() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>مربوط ونشط</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                غير معرّف
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            يدعم إعلانات فيسبوك وانستقرام مع تتبع المبيعات والليدز بدقة (<code className="text-blue-700 font-mono">PageView</code>, <code className="text-blue-700 font-mono">Lead</code>, <code className="text-blue-700 font-mono">Purchase</code>).
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Meta Pixel ID:</label>
            <input
              type="text"
              value={metaId}
              onChange={(e) => setMetaId(e.target.value)}
              placeholder="مثال: 987654321012345"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* 4. Google Tag (GA4 / Google Ads) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                📊
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Google Tag (GA4 & Google Ads)</h3>
                <span className="text-[10px] text-slate-400 font-mono">إحصائيات وإعلانات قوقل</span>
              </div>
            </div>
            {googleId.trim() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>مربوط ونشط</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                غير معرّف
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            ربط إحصائيات Google Analytics أو إعلانات قوقل (<code className="text-amber-700 font-mono">page_view</code>, <code className="text-amber-700 font-mono">generate_lead</code>, <code className="text-amber-700 font-mono">purchase</code>).
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Google Measurement ID (G- / AW-):</label>
            <input
              type="text"
              value={googleId}
              onChange={(e) => setGoogleId(e.target.value)}
              placeholder="مثال: G-ABC123XYZ4 أو AW-123456789"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* Save Button for Settings */}
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتفعيل أكواد التتبع</span>
          </button>
        </div>

      </form>

      {/* Live Test & Firing Verification Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-base text-white">فحص وإطلاق حدث تجريبي (Live Pixel Test)</h3>
            </div>
            <p className="text-xs text-slate-300">
              اضغط على الزر أدناه لإرسال حدث شراء تجريبي (<code className="font-mono text-amber-300">PURCHASE</code>) لجميع منصات البكسل المفعلة للتأكد من وصول البيانات وفحصها في الـ Console والـ Events Manager.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFireTestEvent}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>إرسال حدث شراء تجريبي الآن</span>
          </button>
        </div>

        {testSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم إطلاق حدث الشراء التجريبي بنجاح وتسجيله في سجل الأحداث بالأسفل!</span>
          </div>
        )}
      </div>

      {/* Live Event Stream / Log */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-slate-900">سجل أحداث التتبع الحية (Recent Event Logs)</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {eventLogs.length} حدث
            </span>
          </div>

          {eventLogs.length > 0 && (
            <button
              type="button"
              onClick={handleClearLogs}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          )}
        </div>

        {eventLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            لا توجد أحداث مسجلة حتى الآن. عند قيام الزوار بطلب باقة أو إرسال حدث تجريبي ستظهر الأحداث هنا فوراً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="pb-2.5 font-bold">الوقت</th>
                  <th className="pb-2.5 font-bold">المنصة</th>
                  <th className="pb-2.5 font-bold">اسم الحدث (Event)</th>
                  <th className="pb-2.5 font-bold">التفاصيل والبيانات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {eventLogs.slice(0, 15).map((log) => {
                  const platformBadge =
                    log.platform === 'snapchat'
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : log.platform === 'tiktok'
                      ? 'bg-slate-900 text-white border-slate-700'
                      : log.platform === 'meta'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-200';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${platformBadge}`}>
                          {log.platform.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-slate-900">{log.event}</td>
                      <td className="py-2.5 text-slate-600 font-sans text-[11px]">{log.details}</td>
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
