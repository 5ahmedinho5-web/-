import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Type,
  FileText,
  ShieldCheck,
  Send,
  Bell,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { notificationService } from '../../services/notificationService';

export const AdminStoreTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();

  const [name, setName] = useState(storeSettings.storeName);
  const [tagline, setTagline] = useState(storeSettings.tagline);
  const [whatsapp, setWhatsapp] = useState(storeSettings.whatsappNumber);
  const [email, setEmail] = useState(storeSettings.email);
  const [password, setPassword] = useState(storeSettings.adminPassword);

  // Gmail Order Notifications
  const [orderEmail, setOrderEmail] = useState(
    storeSettings.orderNotificationEmail || 'najma.orders@gmail.com'
  );
  const [web3Key, setWeb3Key] = useState(
    storeSettings.web3FormsAccessKey || '2d1983a2-231b-49e2-8f7d-225b0f5f068e'
  );
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Two-Factor Authentication (2FA) State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    storeSettings.twoFactorAuth?.enabled !== false
  );
  const [twoFactorProvider, setTwoFactorProvider] = useState<'web3forms' | 'formsubmit' | 'custom_webhook'>(
    storeSettings.twoFactorAuth?.provider || 'web3forms'
  );
  const [twoFactorEmail, setTwoFactorEmail] = useState(
    storeSettings.twoFactorAuth?.emailDestination ||
      storeSettings.orderNotificationEmail ||
      'najma.orders@gmail.com'
  );
  const [twoFactorAccessKey, setTwoFactorAccessKey] = useState(
    storeSettings.twoFactorAuth?.accessKey || ''
  );
  const [twoFactorPin, setTwoFactorPin] = useState(
    storeSettings.twoFactorAuth?.backupPin || '889900'
  );
  const [twoFactorWebhook, setTwoFactorWebhook] = useState(
    storeSettings.twoFactorAuth?.customWebhookUrl || ''
  );
  const [twoFactorTestSending, setTwoFactorTestSending] = useState(false);
  const [twoFactorTestResult, setTwoFactorTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      storeName: name,
      tagline: tagline,
      whatsappNumber: whatsapp,
      email: email,
      adminPassword: password,
      orderNotificationEmail: orderEmail,
      web3FormsAccessKey: web3Key,
      twoFactorAuth: {
        enabled: twoFactorEnabled,
        provider: twoFactorProvider,
        emailDestination: twoFactorEmail,
        accessKey: twoFactorAccessKey,
        backupPin: twoFactorPin,
        customWebhookUrl: twoFactorWebhook,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTest2FA = async () => {
    setTwoFactorTestSending(true);
    setTwoFactorTestResult(null);
    try {
      const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
      // Temporarily use current tab form values for test
      const tempSettings = {
        ...storeSettings,
        web3FormsAccessKey: web3Key,
        twoFactorAuth: {
          enabled: twoFactorEnabled,
          provider: twoFactorProvider,
          emailDestination: twoFactorEmail,
          accessKey: twoFactorAccessKey,
          backupPin: twoFactorPin,
          customWebhookUrl: twoFactorWebhook,
        },
      };
      const res = await notificationService.sendTwoFactorAuthCode(
        sampleOtp,
        twoFactorEmail,
        tempSettings
      );
      setTwoFactorTestResult({
        success: true,
        message: `تم إرسال رمز تجريبي (${sampleOtp}) بنجاح إلى ${twoFactorEmail}! تفقد صندوق الوارد أو الـ Spam.`,
      });
    } catch {
      setTwoFactorTestResult({
        success: false,
        message: 'حدث خطأ في الاتصال بالخدمة',
      });
    } finally {
      setTwoFactorTestSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await notificationService.sendTestEmailNotification(web3Key, orderEmail);
      setTestResult(res);
    } catch (e) {
      setTestResult({ success: false, message: 'حدث خطأ في الاتصال بالخدمة' });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">هوية ونصوص المتجر وإشعارات الطلبات</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            تعديل اسم المتجر، رقم الواتساب، مفتاح إشعارات الطلبات إلى Gmail، وكلمة المرور
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        
        {/* Instant Gmail Order Alerts Section */}
        <div className="p-5 rounded-3xl bg-gradient-to-l from-emerald-50/70 via-teal-50/30 to-white border border-emerald-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <span>إشعارات الطلبات الفورية إلى بريدك في Gmail</span>
            </h4>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>مفعّل وتلقائي 100%</span>
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            فور إتمام أي زائر لطلبه في المتجر، يقوم النظام بإرسال رسالة تفصيلية فورية إلى بريدك في Gmail تحتوي على كافة بيانات العميل ونشاطه ورقم الواتساب الخاص به.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">بريد استلام الطلبات (Gmail):</label>
              <input
                type="email"
                required
                value={orderEmail}
                onChange={(e) => setOrderEmail(e.target.value)}
                placeholder="najma.orders@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left font-bold text-slate-800"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-500 block">
                البريد المعتمد الذي ترده رسائل الطلبات وتنبيهات العملاء.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">مفتاح الربط (Web3Forms Access Key):</label>
              <input
                type="text"
                required
                value={web3Key}
                onChange={(e) => setWeb3Key(e.target.value)}
                placeholder="2d1983a2-231b-49e2-8f7d-225b0f5f068e"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-500 block">
                مفتاح الربط الآمن لإرسال الإيميلات الفورية دون الحاجة لسيرفر.
              </span>
            </div>
          </div>

          {/* Test Email Button & Result */}
          <div className="pt-2 border-t border-emerald-100/80 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={testSending}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>{testSending ? 'جاري إرسال التجربة...' : '🧪 إرسال بريد تجريبي الآن إلى Gmail'}</span>
            </button>

            {testResult && (
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
                  testResult.success
                    ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {testResult && testResult.success && (
              <div className="w-full text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/90 leading-relaxed">
                💡 <strong>تم تسليم الرسالة بنجاح:</strong> إذا لم تظهر فوراً في صندوق الوارد، تفقّد مجلد <strong>الرسائل غير المرغوب فيها (Spam)</strong>، وتأكد أيضاً من بريدك الذي سجلت به في Web3Forms (إذا كان بريدك الأساسي أو بريد المتجر).
              </div>
            )}
          </div>

          {/* Clean Email Structure Preview Card */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>معاينة شكل رسالة الطلب التي ستصلك في Gmail (مربعات منظمة واحترافية)</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                مرسلة من: متجر نجمة ⭐
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-800" dir="rtl">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
                طلب جديد #1024 | مطعم الأصالة (280 ر.س)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-300">
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">رقم الطلب:</span> #1024
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">نوع الخدمة:</span> خرائط Google Maps
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">الباقة المحددة:</span> 20 تقييم
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">المبلغ الإجمالي:</span> 280 ر.س
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">اسم العميل:</span> فهد الشمري
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">اسم النشاط أو الحساب:</span> مطعم الأصالة
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">رقم الواتساب:</span> +966501234567
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold">محادثة واتساب مباشرة:</span> https://wa.me/966501234567
                </div>
              </div>
            </div>
          </div>

          {/* Logo on Gmail Explanation Card */}
          <div className="mt-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between gap-2 text-amber-950 font-bold text-xs">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <span>كيف تظهر أيقونة نجمة واسم "طلب جديد نجمة" كصورة للميل في Gmail؟</span>
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                سهلة ومضمونة 100%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-3.5 rounded-2xl border border-amber-200/60">
              <div className="flex items-center gap-3 shrink-0">
                <img
                  src="/najma-icon.jpg"
                  alt="أيقونة متجر نجمة"
                  className="w-14 h-14 rounded-full border-2 border-amber-400 shadow-md object-cover"
                />
                <div className="text-right">
                  <div className="font-black text-slate-900 text-xs">طلب جديد نجمة</div>
                  <div className="text-[10px] text-slate-500">أيقونة الشعار الدائرية لـ Gmail</div>
                </div>
              </div>

              <div className="sm:mr-auto flex gap-2">
                <a
                  href="/najma-icon.jpg"
                  download="najma-gmail-icon.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⬇️ تحميل أيقونة نجمة</span>
                </a>
              </div>
            </div>

            <p className="text-slate-700 text-[11px] leading-relaxed">
              خدمة Gmail تعرض اسم وصورة المرسل الدائرية من خلال قائمة <strong>جهات اتصال Google (Google Contacts)</strong> الخاصة بحسابك:
            </p>

            <ol className="list-decimal list-inside text-[11px] text-slate-800 space-y-1.5 font-medium bg-white/70 p-3 rounded-xl border border-amber-200/50">
              <li>
                افتح <strong>جهات اتصال Google</strong> بحسابك:
                <a
                  href="https://contacts.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-blue-600 underline font-bold mx-1.5"
                >
                  contacts.google.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>اضغط على <strong>"إنشاء جهة اتصال" (Create contact)</strong>.</li>
              <li>في خانة الاسم اكتب: <strong>طلب جديد نجمة</strong></li>
              <li>في خانة البريد أضف: <strong>notifications@web3forms.com</strong> (وكذلك <strong>submissions@formsubmit.co</strong>).</li>
              <li>اضغط على <strong>صورة جهة الاتصال</strong> وارفع <strong>أيقونة نجمة</strong> التي حملتها من الزر أعلاه ثم اضغط حفظ.</li>
            </ol>

            <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>مبروك! ستظهر لك صورة أيقونة نجمة واسم "طلب جديد نجمة" مباشرة في قائمة إيميلات Gmail ومن برّا على الهاتف والكمبيوتر!</span>
            </p>
          </div>
        </div>

        {/* Basic Brand Info */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Type className="w-4 h-4 text-emerald-600" />
            <span>البيانات الأساسية للمتجر</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">اسم المتجر / البراند:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">شعار المتجر (Slogan):</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>معلومات التواصل والطلبات</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                رقم الواتساب الرسمي (لاستقبال تأكيدات الطلبات):
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+9665xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-400 block">
                ملاحظة: هذا الرقم الذي يُفتح للعميل مباشرة عند الضغط على تأكيد الطلب.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">البريد الإلكتروني للدعم العام:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@najma-maps.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Security / Admin Password & 2FA */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>أمان وحماية لوحة التحكم (التحقق بخطوتين - 2FA)</span>
            </h4>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                twoFactorEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {twoFactorEnabled ? '🛡️ ميزة التحقق بخطوتين مفعّلة' : '⚠️ التحقق بخطوتين معطّل'}
            </span>
          </div>

          {/* Password Input */}
          <div className="max-w-xs space-y-1.5">
            <label className="font-bold text-slate-700 block text-xs">كلمة مرور مدير النظام (الخطوة 1):</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs sm:text-sm"
              dir="ltr"
            />
            <span className="text-[10px] text-slate-400 block">
              كلمة المرور الحالية المستخدمة كخطوة أولى لتسجيل الدخول.
            </span>
          </div>

          {/* 2FA Toggle & Box */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>تفعيل التحقق بخطوتين (2-Step Verification)</span>
                </span>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  عند التفعيل، لن يكتفي النظام بكلمة المرور، بل سيرسل رمز أمان سري مؤقت من 6 أرقام (OTP) إلى بريدك في Gmail في كل مرة تحاول فيها فتح لوحة التحكم لمنع أي محاولة دخول غير مصرح بها.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006644]"></div>
              </label>
            </div>

            {twoFactorEnabled && (
              <div className="pt-3 border-t border-amber-200/60 space-y-4">
                {/* Method / Provider Selector */}
                <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/60 space-y-2">
                  <label className="font-bold text-slate-800 block text-xs">
                    مزود خدمة إرسال الرمز (طريقة الربط الفعالة):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTwoFactorProvider('web3forms')}
                      className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                        twoFactorProvider === 'web3forms'
                          ? 'border-[#006644] bg-[#edf8f3] text-[#006644] font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold">Web3Forms (افتراضي)</div>
                      <div className="text-[10px] text-slate-500">سريع ومباشر عبر مفتاح Access Key</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTwoFactorProvider('formsubmit')}
                      className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                        twoFactorProvider === 'formsubmit'
                          ? 'border-[#006644] bg-[#edf8f3] text-[#006644] font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold">FormSubmit المباشر</div>
                      <div className="text-[10px] text-slate-500">يرسل لأي إيميل دون الحاجة لمفتاح</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTwoFactorProvider('custom_webhook')}
                      className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                        twoFactorProvider === 'custom_webhook'
                          ? 'border-[#006644] bg-[#edf8f3] text-[#006644] font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold">Webhook مخصص / سيرفر</div>
                      <div className="text-[10px] text-slate-500">Zapier, Make, أو سيرفرك الخاص</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination Email */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">
                      بريد استلام رمز التحقق (OTP):
                    </label>
                    <input
                      type="email"
                      required={twoFactorEnabled}
                      value={twoFactorEmail}
                      onChange={(e) => setTwoFactorEmail(e.target.value)}
                      placeholder="najma.orders@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs"
                      dir="ltr"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      يمكنك تغييره لأي بريد Gmail آخر في أي وقت.
                    </span>
                  </div>

                  {/* Backup PIN */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">
                      رمز PIN الاحتياطي (Backup PIN):
                    </label>
                    <input
                      type="text"
                      required={twoFactorEnabled}
                      value={twoFactorPin}
                      onChange={(e) => setTwoFactorPin(e.target.value)}
                      placeholder="889900"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs tracking-widest"
                      dir="ltr"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      للدخول الفوري في حال عدم توفر الإيميل أو تأخر الشبكة.
                    </span>
                  </div>

                  {/* Custom 2FA Access Key (if web3forms) */}
                  {twoFactorProvider === 'web3forms' && (
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold text-slate-700 block text-xs">
                        مفتاح ربط خاص بالتحقق بخطوتين (اختياري - 2FA Access Key):
                      </label>
                      <input
                        type="text"
                        value={twoFactorAccessKey}
                        onChange={(e) => setTwoFactorAccessKey(e.target.value)}
                        placeholder={`اتركه فارغاً لاستخدام المفتاح الرئيسي (${web3Key ? web3Key.slice(0, 10) + '...' : ''}) أو ضع مفتاحاً مستقلاً`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs"
                        dir="ltr"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        إذا رغبت في فصل رسائل أمان التحقق عن رسائل طلبات المتجر بمفتاح مختلف، ضعه هنا. إذا تركته فارغاً سيعمل تلقائياً بالمفتاح العام الفعال.
                      </span>
                    </div>
                  )}

                  {/* Custom Webhook URL (if custom_webhook) */}
                  {twoFactorProvider === 'custom_webhook' && (
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold text-slate-700 block text-xs">
                        رابط الـ Webhook المخصص (Custom Webhook URL):
                      </label>
                      <input
                        type="url"
                        value={twoFactorWebhook}
                        onChange={(e) => setTwoFactorWebhook(e.target.value)}
                        placeholder="https://hook.eu1.make.com/... أو https://api.yourdomain.com/2fa"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-left text-xs"
                        dir="ltr"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        يقوم النظام بإرسال طلب POST فوري يحمل كود الـ OTP ورقم البريد والوقت للربط مع SMS أو WhatsApp أو أي خدمة خارجية.
                      </span>
                    </div>
                  )}
                </div>

                {/* Test 2FA button */}
                <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleSendTest2FA}
                    disabled={twoFactorTestSending}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {twoFactorTestSending
                        ? 'جاري إرسال رمز التجربة...'
                        : '🧪 إرسال رمز تحقق تجريبي إلى Gmail الآن'}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-500">
                    اضغط لفحص استلام كود الأمان وتجربة المفاتيح والإيميل الفعلي فوراً
                  </span>
                </div>

                {twoFactorTestResult && (
                  <div
                    className={`p-3 rounded-xl text-xs border leading-relaxed ${
                      twoFactorTestResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {twoFactorTestResult.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع إعدادات المتجر</span>
          </button>
        </div>

      </form>
    </div>
  );
};
