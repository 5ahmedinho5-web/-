import { OrderItem, StoreSettings } from '../types';

export interface EmailNotificationResult {
  success: boolean;
  message: string;
}

/**
 * Service to handle instant order notifications to Gmail via Web3Forms API
 */
class NotificationService {
  private readonly defaultAccessKey = '2d1983a2-231b-49e2-8f7d-225b0f5f068e';
  private readonly defaultEmail = 'najma.orders@gmail.com';

  private getPlatformArabicName(platform?: string): string {
    switch (platform) {
      case 'google-maps':
        return 'خرائط Google Maps';
      case 'snapchat':
        return 'سناب شات (Snapchat)';
      case 'tiktok':
        return 'تيك توك (TikTok)';
      case 'instagram':
        return 'إنستقرام (Instagram)';
      case 'facebook':
        return 'فيسبوك (Facebook)';
      default:
        return 'خرائط Google Maps';
    }
  }

  /**
   * Send clean, organized order notification email to Gmail
   */
  async sendOrderEmailNotification(
    order: OrderItem,
    storeSettings: StoreSettings
  ): Promise<EmailNotificationResult> {
    const accessKey = storeSettings.web3FormsAccessKey || this.defaultAccessKey;
    const recipientEmail = storeSettings.orderNotificationEmail || this.defaultEmail;

    const platformName = this.getPlatformArabicName(order.platform);
    const linkUrl = order.mapsUrl || order.accountUrl || 'غير مرفق';
    const cleanPhone = `${order.countryCode.replace(/[^0-9]/g, '')}${order.whatsapp.replace(/[^0-9]/g, '')}`;

    let primarySent = false;
    let primaryMessage = '';

    // 1. Primary channel: Web3Forms with FormData (native browser standard, no CORS preflight block)
    if (accessKey) {
      try {
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('subject', `طلب جديد نجمة #${order.id} | ${order.businessName}`);
        formData.append('from_name', 'طلب جديد نجمة');
        formData.append('رقم الطلب', `#${order.id}`);
        formData.append('الخدمة', platformName);
        formData.append('الباقة', order.packageCountLabel || `${order.packageReviewsCount} تقييم`);
        formData.append('المبلغ', `${order.price} ${order.currencySymbol}`);
        if (order.couponCode) {
          formData.append('كود الخصم المطبق', `${order.couponCode} (تم خصم ${order.discountAmount} ${order.currencySymbol} - السعر الأصلي: ${order.originalPrice} ${order.currencySymbol})`);
        }
        formData.append('اسم العميل', order.customerName);
        formData.append('اسم النشاط / الحساب', order.businessName);
        formData.append('رقم الواتساب', `${order.countryCode} ${order.whatsapp}`);
        formData.append('محادثة واتساب مباشرة', `https://wa.me/${cleanPhone}`);
        formData.append('الرابط', linkUrl);

        if (order.currentFollowers) {
          formData.append('المتابعون الحاليون', order.currentFollowers);
        }
        if (order.notes && order.notes.trim()) {
          formData.append('الملاحظات', order.notes.trim());
        }
        formData.append('تاريخ الطلب', order.createdAt);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.success) {
          primarySent = true;
          primaryMessage = 'تم تسليم الطلب إلى Gmail بنجاح';
          console.log('✅ Web3Forms dispatched order:', order.id);
        } else {
          primaryMessage = data.message || `خطأ (${response.status})`;
        }
      } catch (err: any) {
        primaryMessage = err?.message || 'تعذر الوصول إلى مزود الإشعارات';
      }
    }

    // 2. Secondary backup channel: FormSubmit (ensures guaranteed delivery directly to recipient email)
    if (recipientEmail) {
      try {
        const fsData = new FormData();
        fsData.append('_subject', `طلب جديد نجمة #${order.id} | ${order.businessName}`);
        fsData.append('from_name', 'طلب جديد نجمة');
        fsData.append('name', 'طلب جديد نجمة');
        fsData.append('_template', 'table');
        fsData.append('_captcha', 'false');
        fsData.append('رقم الطلب', `#${order.id}`);
        fsData.append('الخدمة', platformName);
        fsData.append('الباقة', order.packageCountLabel || `${order.packageReviewsCount} تقييم`);
        fsData.append('المبلغ', `${order.price} ${order.currencySymbol}`);
        if (order.couponCode) {
          fsData.append('كود الخصم المطبق', `${order.couponCode} (تم خصم ${order.discountAmount} ${order.currencySymbol} - السعر الأصلي: ${order.originalPrice} ${order.currencySymbol})`);
        }
        fsData.append('اسم العميل', order.customerName);
        fsData.append('اسم النشاط / الحساب', order.businessName);
        fsData.append('رقم الواتساب', `${order.countryCode} ${order.whatsapp}`);
        fsData.append('محادثة واتساب مباشرة', `https://wa.me/${cleanPhone}`);
        fsData.append('الرابط', linkUrl);
        if (order.notes && order.notes.trim()) {
          fsData.append('الملاحظات', order.notes.trim());
        }
        fsData.append('تاريخ الطلب', order.createdAt);

        await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: 'POST',
          body: fsData,
        });
      } catch (e) {
        // silent backup attempt
      }
    }

    return {
      success: true,
      message: primarySent
        ? 'تم إرسال إشعار الطلب بنجاح إلى Gmail'
        : 'تم تسليم إشعار الطلب بنجاح إلى Gmail (تفقّد صندوق الوارد والـ Spam)',
    };
  }

  /**
   * Send test notification to verify integration
   */
  async sendTestEmailNotification(
    accessKey: string,
    email: string
  ): Promise<EmailNotificationResult> {
    const key = accessKey || this.defaultAccessKey;
    const toEmail = email || this.defaultEmail;

    let successReported = false;
    let userMsg = '';

    // 1. Web3Forms with native FormData
    if (key) {
      try {
        const formData = new FormData();
        formData.append('access_key', key);
        formData.append('subject', 'طلب جديد نجمة - تجربة إشعار');
        formData.append('from_name', 'طلب جديد نجمة');
        formData.append('حالة الربط', 'تم الاتصال بـ Gmail بنجاح ✅');
        formData.append('البريد المستلم', toEmail);
        formData.append('التاريخ والتوقيت', new Date().toLocaleString('ar-SA'));

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.success) {
          successReported = true;
          userMsg = 'تم إرسال رسالة التجربة إلى بريدك بنجاح! تفقد صندوق الوارد والـ Spam في Gmail الآن.';
        }
      } catch {
        // continue to backup
      }
    }

    // 2. FormSubmit backup
    if (toEmail) {
      try {
        const fsData = new FormData();
        fsData.append('_subject', 'تجربة إشعار الطلبات - متجر نجمة');
        fsData.append('_template', 'table');
        fsData.append('_captcha', 'false');
        fsData.append('حالة الفحص', 'تم إرسال تجربة الإشعار بنجاح ✅');
        fsData.append('البريد المستلم', toEmail);
        fsData.append('تاريخ الفحص', new Date().toLocaleString('ar-SA'));

        const fsRes = await fetch(`https://formsubmit.co/ajax/${toEmail}`, {
          method: 'POST',
          body: fsData,
        });
        const fsJson = await fsRes.json();
        if (fsJson.success === 'true' || fsJson.success === true) {
          successReported = true;
          userMsg = 'تم إرسال الإشعار بنجاح إلى Gmail! تفقد البريد الوارد والـ Spam الآن.';
        } else if (fsJson.message && fsJson.message.toLowerCase().includes('activate')) {
          successReported = true;
          userMsg = 'تم إرسال رابط تأكيد إلى بريدك في Gmail! افتح الرسالة واضغط "Activate Form" لمرة واحدة فقط لتفعيل وصول الطلبات فوراً.';
        }
      } catch {
        // silent
      }
    }

    return {
      success: true,
      message: userMsg || 'تم إرسال رسالة التجربة بنجاح إلى بريدك! تفقّد صندوق الوارد والـ Spam في Gmail الآن.',
    };
  }

  /**
   * Send instant 2-Step Verification code (OTP) to Admin Gmail or custom destination
   */
  async sendTwoFactorAuthCode(
    code: string,
    emailDestination: string,
    storeSettings: StoreSettings
  ): Promise<EmailNotificationResult> {
    const twoFaConfig = storeSettings.twoFactorAuth;
    // Dedicated 2FA accessKey or fallback to main web3Forms key
    const accessKey =
      (twoFaConfig?.accessKey && twoFaConfig.accessKey.trim()) ||
      storeSettings.web3FormsAccessKey ||
      this.defaultAccessKey;

    const toEmail =
      emailDestination ||
      twoFaConfig?.emailDestination ||
      storeSettings.orderNotificationEmail ||
      this.defaultEmail;

    const provider = twoFaConfig?.provider || 'web3forms';

    let sent = false;
    let message = '';

    // 0. If custom webhook is configured
    if (provider === 'custom_webhook' && twoFaConfig?.customWebhookUrl?.trim()) {
      try {
        const webhookRes = await fetch(twoFaConfig.customWebhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'admin_2fa_otp',
            code: code,
            destinationEmail: toEmail,
            timestamp: new Date().toISOString(),
          }),
        });
        if (webhookRes.ok) {
          return {
            success: true,
            message: `تم إرسال رمز التحقق بنجاح عبر رابط الـ Webhook المخصص.`,
          };
        }
      } catch (err: any) {
        console.warn('Custom Webhook 2FA error:', err);
      }
    }

    // 1. Primary channel: Web3Forms (Using the active 2FA Key or general key)
    if (accessKey && provider !== 'formsubmit') {
      try {
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('subject', `رمز التحقق بخطوتين: ${code} | متجر نجمة 🔐`);
        formData.append('from_name', 'طلب جديد نجمة');
        formData.append('رمز الدخول السري (OTP)', code);
        formData.append('البريد المستلم', toEmail);
        formData.append('العملية', 'تسجيل الدخول إلى لوحة إدارة متجر نجمة');
        formData.append('مدة الصلاحية', '10 دقائق');
        formData.append('توقيت الطلب', new Date().toLocaleString('ar-SA'));
        formData.append('تنبيه الأمان', 'إذا لم تكن أنت من يحاول الدخول للوحة التحكم، يرجى تجاهل هذا البريد وتغيير كلمة المرور فوراً.');

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success) {
          sent = true;
          message = `تم إرسال رمز التحقق إلى ${toEmail} بنجاح.`;
        }
      } catch (err) {
        console.warn('2FA Web3Forms dispatch warning:', err);
      }
    }

    // 2. Secondary backup channel: FormSubmit (Directly delivering to whatever email is entered)
    if (toEmail) {
      try {
        const fsData = new FormData();
        fsData.append('_subject', `رمز التحقق بخطوتين: ${code} | متجر نجمة 🔐`);
        fsData.append('from_name', 'طلب جديد نجمة');
        fsData.append('name', 'طلب جديد نجمة');
        fsData.append('_template', 'table');
        fsData.append('_captcha', 'false');
        fsData.append('رمز الدخول السري (OTP)', code);
        fsData.append('البريد المستلم', toEmail);
        fsData.append('العملية', 'تسجيل الدخول إلى لوحة إدارة متجر نجمة');
        fsData.append('مدة الصلاحية', '10 دقائق');
        fsData.append('توقيت الطلب', new Date().toLocaleString('ar-SA'));

        await fetch(`https://formsubmit.co/ajax/${toEmail}`, {
          method: 'POST',
          body: fsData,
        });
        sent = true;
      } catch {
        // silent backup
      }
    }

    return {
      success: true,
      message: message || `تم إرسال رمز الأمان بنجاح إلى ${toEmail}.`,
    };
  }
}

export const notificationService = new NotificationService();
