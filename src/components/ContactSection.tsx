import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GCCCurrencyCode } from '../types';

export const ContactSection: React.FC = () => {
  const { packages, storeSettings, formatPrice } = useStore();
  const contactTexts = storeSettings.sectionContents?.contact;

  const [selectedPkgId, setSelectedPkgId] = useState(packages[5]?.id || packages[0]?.id);
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const priceInfo = formatPrice(selectedPkg.priceSAR);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = `NJM-${Math.floor(10000 + Math.random() * 90000)}`;

    const message = `السلام عليكم ورحمة الله وبركاته،
أرغب بطلب حزمة تقييمات Google Maps من متجر نجمة 🌟

📌 تفاصيل الطلب:
- رقم الطلب: ${orderNumber}
- الحزمة المختارة: ${selectedPkg.reviewsCount} تقييم (${priceInfo.full})
- اسم العميل: ${customerName || 'لم يُحدد'}
- اسم النشاط التجاري: ${businessName || 'لم يُحدد'}
- رابط النشاط على الخريطة: ${mapsUrl || 'غير متوفر'}
- رقم الهاتف: ${phone || 'لم يُحدد'}
- الملاحظات والجدولة: ${notes || 'الجدولة الافتراضية الطبيعية'}

يرجى تأكيد البدء وتزويدي برابط الدفع المناسب. شكراً لكم.`;

    const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Instructions & Assurance */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{contactTexts?.badge || 'طرق الطلب والتواصل المباشر'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
              {contactTexts?.title || 'إتمام الطلب والتواصل الفوري عبر WhatsApp'}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {contactTexts?.description ||
                'لأننا نقدر وقتك ونحرص على التخصيص الكامل لطلبك، يتم تأكيد ومتابعة كافة الطلبات بشكل مباشر عبر واتساب مع مستشارين متخصصين جاهزين للرد عليك فوراً.'}
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-800 font-medium">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>إصدار رقم طلب مميز ومتابعة حية لمراحل تنفيذ التقييمات أولاً بأول.</span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>إمكانية تعديل الجدولة واختيار الكلمات المفتاحية بما يناسب نشاطك.</span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{contactTexts?.guaranteeNote || 'طرق دفع خليجية متعددة وآمنة تناسب عملائنا في جميع دول مجلس التعاون مع ضمان مدى الحياة.'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">رقم واتساب المباشر:</span>
              <span className="font-mono font-bold text-slate-900 dir-ltr">{storeSettings.whatsappNumber}</span>
            </div>
          </div>

          {/* Left Column: WhatsApp Direct Order Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-5 text-right">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-950">تجهيز طلبك السريع</h3>
                <p className="text-xs text-slate-500 mt-1">
                  املأ البيانات وسيقوم النموذج بفتح محادثة واتساب موثقة تلقائياً بطلبك.
                </p>
              </div>

              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                {/* Select Package */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    اختر الحزمة المطلوبة
                  </label>
                  <select
                    value={selectedPkgId}
                    onChange={(e) => setSelectedPkgId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  >
                    {packages.map((pkg) => {
                      const p = formatPrice(pkg.priceSAR);
                      return (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.reviewsCount} تقييم — {p.amount} {p.symbol} {pkg.isMostPopular ? '(الأكثر طلباً)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Customer Name & Business Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      اسمك الكريم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: عبدالله الراجحي"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      اسم النشاط التجاري <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="مثال: كافيه أروما"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Google Maps URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    رابط النشاط على Google Maps
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-left dir-ltr"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    رقم الواتساب للتواصل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX أو +966..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-left dir-ltr"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    ملاحظات أو وتيرة جدولة معينة (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: أرغب بجدولة 10 تقييمات يومياً مع التركيز على جودة القهوة..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال وتأكيد الطلب عبر واتساب الآن</span>
                </button>

                <p className="text-[11px] text-center text-slate-600">
                  ⚡ الرد فوري عبر واتساب لتأكيد التفاصيل وتزويدك برابط الدفع الرسمي
                </p>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
