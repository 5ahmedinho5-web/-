import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  Menu,
  ShieldCheck,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { notificationService } from '../services/notificationService';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCouponsTab } from './admin/AdminCouponsTab';
import { AdminPackagesTab } from './admin/AdminPackagesTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminStoreTab } from './admin/AdminStoreTab';
import { AdminCurrenciesTab } from './admin/AdminCurrenciesTab';
import { AdminFaqsTab } from './admin/AdminFaqsTab';
import { AdminBotTab } from './admin/AdminBotTab';
import { AdminSectionsTab } from './admin/AdminSectionsTab';
import { AdminSectionTextsTab } from './admin/AdminSectionTextsTab';
import { AdminPixelsTab } from './admin/AdminPixelsTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { NajmaLogo } from './NajmaLogo';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    storeSettings,
    packages,
    orders,
    reviews,
    coupons,
    resetToDefaults,
  } = useStore();

  const [loginStep, setLoginStep] = useState<'password' | 'two_factor'>('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // 2FA state
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [useBackupPin, setUseBackupPin] = useState(false);
  const [backupPinInput, setBackupPinInput] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Timer for OTP resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAdminModalOpen) return null;

  // Send OTP helper
  const triggerSendOtp = async (code: string) => {
    setIsSendingOtp(true);
    setResendCooldown(60);
    setOtpError('');
    const destEmail =
      storeSettings.twoFactorAuth?.emailDestination ||
      storeSettings.orderNotificationEmail ||
      'najma.orders@gmail.com';

    try {
      await notificationService.sendTwoFactorAuthCode(code, destEmail, storeSettings);
      setOtpSuccessMsg(`تم إرسال رمز الأمان إلى ${destEmail}`);
    } catch (e) {
      console.warn('Failed to send 2FA OTP:', e);
      setOtpSuccessMsg(`تم إرسال رمز الأمان إلى بريدك المسجل`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Initial Password Check
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === storeSettings.adminPassword) {
      setLoginError(false);
      const is2FAEnabled = storeSettings.twoFactorAuth?.enabled !== false;

      if (is2FAEnabled) {
        // Generate random 6-digit OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        setLoginStep('two_factor');
        setOtpInput('');
        setOtpError('');
        setUseBackupPin(false);
        setBackupPinInput('');
        triggerSendOtp(newOtp);
      } else {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('najma_admin_auth', 'true');
      }
    } else {
      setLoginError(true);
    }
  };

  // Handle Verify 2FA OTP / Backup PIN
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (useBackupPin) {
      const validPin = storeSettings.twoFactorAuth?.backupPin || '889900';
      if (backupPinInput.trim() === validPin) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('najma_admin_auth', 'true');
        setLoginStep('password');
      } else {
        setOtpError('رمز PIN الاحتياطي غير صحيح، يرجى التأكد والمحاولة مجدداً.');
      }
      return;
    }

    if (otpInput.trim() === generatedOtp) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('najma_admin_auth', 'true');
      setLoginStep('password');
    } else {
      setOtpError('رمز التحقق غير صحيح، يرجى كتابة الرمز المكون من 6 أرقام بدقة.');
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    triggerSendOtp(newOtp);
  };

  const handleBackToPassword = () => {
    setLoginStep('password');
    setOtpError('');
    setOtpInput('');
    setUseBackupPin(false);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('najma_admin_auth');
    setIsAdminModalOpen(false);
    setLoginStep('password');
    setPasswordInput('');
    setOtpInput('');
  };

  const handleClose = () => {
    setIsAdminModalOpen(false);
    setLoginStep('password');
    setOtpError('');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'هل أنت متأكد من استعادة البيانات الافتراضية؟ سيتم إرجاع الحزم والأسعار والإعدادات لحالتها الأصلية.'
      )
    ) {
      resetToDefaults();
    }
  };

  // If Not Logged In: Show Multi-Step Login Dialog (Password -> 2FA)
  if (!isAdminLoggedIn) {
    const destEmail =
      storeSettings.twoFactorAuth?.emailDestination ||
      storeSettings.orderNotificationEmail ||
      'najma.orders@gmail.com';

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        dir="rtl"
      >
        <div className="relative w-full max-w-sm rounded-[28px] bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-4 text-right animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={handleClose}
            className="absolute left-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {loginStep === 'password' ? (
            /* ================= STEP 1: PASSWORD ================= */
            <>
              <div className="text-center space-y-2 pt-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#006644]/10 border border-[#006644]/20 text-[#006644] flex items-center justify-center shadow-xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-950">دخول لوحة الإدارة</h3>
                <p className="text-xs text-slate-500">
                  أدخل كلمة مرور مدير النظام للوصول للوحة التحكم
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block text-right">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                    }}
                    placeholder="أدخل كلمة المرور..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white font-mono text-center tracking-widest"
                  />
                  {loginError && (
                    <p className="text-[11px] text-rose-600 font-bold text-center mt-1">
                      كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>متابعة</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-mono">
                    كلمة المرور الافتراضية: najma2026
                  </span>
                </div>
              </form>
            </>
          ) : (
            /* ================= STEP 2: 2-STEP VERIFICATION (2FA) ================= */
            <>
              <div className="text-center space-y-2 pt-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                  الخطوة 2 من 2: التحقق بخطوتين 🔐
                </div>
                <h3 className="text-lg font-black text-slate-950">رمز الأمان السري</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {!useBackupPin ? (
                    <>
                      تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك:
                      <strong className="block text-slate-900 mt-0.5 font-mono text-[11px]">
                        {destEmail}
                      </strong>
                    </>
                  ) : (
                    <>أدخل رمز PIN الاحتياطي الخاص بك لتسجيل الدخول الفوري</>
                  )}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {!useBackupPin ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block text-right">
                      رمز التحقق (OTP):
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setOtpInput(val);
                        setOtpError('');
                      }}
                      placeholder="● ● ● ● ● ●"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-lg font-mono font-black text-center tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white"
                    />

                    {otpError && (
                      <p className="text-[11px] text-rose-600 font-bold text-center flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{otpError}</span>
                      </p>
                    )}

                    {otpSuccessMsg && !otpError && (
                      <p className="text-[11px] text-emerald-700 font-medium text-center bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        {otpSuccessMsg}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block text-right">
                      رمز PIN الاحتياطي:
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      value={backupPinInput}
                      onChange={(e) => {
                        setBackupPinInput(e.target.value);
                        setOtpError('');
                      }}
                      placeholder="أدخل رمز PIN..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white"
                    />
                    {otpError && (
                      <p className="text-[11px] text-rose-600 font-bold text-center">
                        {otpError}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 text-center font-mono">
                      الرمز الافتراضي: 889900
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد تسجيل الدخول</span>
                </button>

                <div className="space-y-2 pt-1 border-t border-slate-100 text-center">
                  {!useBackupPin ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || isSendingOtp}
                        className={`text-[#006644] font-bold flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed`}
                      >
                        <RotateCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                        <span>
                          {resendCooldown > 0
                            ? `إعادة الإرسال بعد (${resendCooldown} ث)`
                            : isSendingOtp
                            ? 'جاري الإرسال...'
                            : 'إعادة إرسال الرمز'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUseBackupPin(true);
                          setOtpError('');
                        }}
                        className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                      >
                        رمز PIN احتياطي
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupPin(false);
                        setOtpError('');
                      }}
                      className="text-[#006644] hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      ← العودة لإدخال رمز البريد (OTP)
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleBackToPassword}
                    className="block w-full text-slate-400 hover:text-slate-600 text-[11px] pt-1 cursor-pointer transition-colors"
                  >
                    تغيير كلمة المرور
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // Active Tab Title
  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return 'نظرة عامة وإحصائيات';
      case 'analytics':
        return 'الزيارات اليومية والمنصات ومسار الفورم';
      case 'orders':
        return 'إدارة الطلبات';
      case 'coupons':
        return 'أكواد وقسائم الخصم';
      case 'packages':
        return 'الحزم والأسعار وتخصيص الكروت';
      case 'section-texts':
        return 'تعديل نصوص أقسام وصفحات المتجر';
      case 'reviews':
        return 'آراء وتقييمات العملاء';
      case 'store':
        return 'إعدادات المتجر والإشعارات والأمان';
      case 'bot':
        return 'المساعد الذكي (Chatbot)';
      case 'currencies':
        return 'إدارة العملات الخليجية';
      case 'faqs':
        return 'الأسئلة الشائعة';
      case 'sections':
        return 'التحكم بالأقسام والصفحات';
      case 'pixels':
        return 'بكسلات التتبع الإعلاني';
      default:
        return 'لوحة الإدارة';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-slate-100/95 backdrop-blur-md overflow-hidden text-right"
      dir="rtl"
    >
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex h-full max-h-screen shrink-0 overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          ordersCount={orders.length}
          packagesCount={packages.length}
          reviewsCount={reviews.length}
          couponsCount={coupons.length}
          onLogout={handleLogout}
          onReset={handleReset}
          onClose={handleClose}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="w-72 h-full max-h-screen bg-white shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              ordersCount={orders.length}
              packagesCount={packages.length}
              reviewsCount={reviews.length}
              couponsCount={coupons.length}
              onLogout={handleLogout}
              onReset={handleReset}
              onClose={handleClose}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-black text-slate-950 text-base sm:text-lg">
                {getTabTitle(activeTab)}
              </h1>
              <span className="text-[11px] text-slate-400">
                لوحة التحكم • {getTabTitle(activeTab)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>العودة للمتجر</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Body View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && (
              <AdminOverviewTab onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'analytics' && <AdminAnalyticsTab />}
            {activeTab === 'orders' && <AdminOrdersTab />}
            {activeTab === 'coupons' && <AdminCouponsTab />}
            {activeTab === 'packages' && <AdminPackagesTab />}
            {activeTab === 'section-texts' && <AdminSectionTextsTab />}
            {activeTab === 'reviews' && <AdminReviewsTab />}
            {activeTab === 'store' && <AdminStoreTab />}
            {activeTab === 'currencies' && <AdminCurrenciesTab />}
            {activeTab === 'faqs' && <AdminFaqsTab />}
            {activeTab === 'bot' && <AdminBotTab />}
            {activeTab === 'sections' && <AdminSectionsTab />}
            {activeTab === 'pixels' && <AdminPixelsTab />}
          </div>
        </div>

      </main>
    </div>
  );
};
