import { MarketingPixelsConfig, PixelEventLog } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
    snaptr?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

class PixelService {
  private config: MarketingPixelsConfig | null = null;
  private initializedPixels = new Set<string>();

  public initPixels(config?: MarketingPixelsConfig): void {
    if (!config || !config.enabled) {
      this.config = config || null;
      return;
    }

    this.config = config;

    // 1. Meta (Facebook / Instagram) Pixel
    if (config.metaPixelId && config.metaPixelId.trim()) {
      this.loadMetaPixel(config.metaPixelId.trim());
    }

    // 2. TikTok Pixel
    if (config.tiktokPixelId && config.tiktokPixelId.trim()) {
      this.loadTikTokPixel(config.tiktokPixelId.trim());
    }

    // 3. Snapchat Pixel
    if (config.snapchatPixelId && config.snapchatPixelId.trim()) {
      this.loadSnapchatPixel(config.snapchatPixelId.trim());
    }

    // 4. Google Tag (GA4 / Google Ads)
    if (config.googleTagId && config.googleTagId.trim()) {
      this.loadGoogleTag(config.googleTagId.trim());
    }

    // Trigger Initial Page View
    this.trackPageView();
  }

  private loadMetaPixel(pixelId: string) {
    if (this.initializedPixels.has(`meta_${pixelId}`)) return;

    try {
      if (!window.fbq) {
        const n: any = (window.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        s?.parentNode?.insertBefore(t, s);
      }

      window.fbq('init', pixelId);
      this.initializedPixels.add(`meta_${pixelId}`);
      console.log(`[PixelService] Meta Pixel initialized (${pixelId})`);
    } catch (err) {
      console.warn('[PixelService] Failed loading Meta Pixel:', err);
    }
  }

  private loadTikTokPixel(pixelId: string) {
    if (this.initializedPixels.has(`tiktok_${pixelId}`)) return;

    try {
      if (!window.ttq) {
        const ttq: any = (window.ttq = []);
        ttq.methods = [
          'page',
          'track',
          'identify',
          'instances',
          'debug',
          'on',
          'off',
          'once',
          'ready',
          'alias',
          'group',
          'enableCookie',
          'disableCookie',
        ];
        ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.instance = function (t: any) {
          const e = ttq._i[t] || [];
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        ttq.load = function (e: any, n: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = i;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          const o = document.createElement('script');
          o.type = 'text/javascript';
          o.async = true;
          o.src = i + '?sdkid=' + e + '&lib=ttq';
          const a = document.getElementsByTagName('script')[0];
          a?.parentNode?.insertBefore(o, a);
        };
      }

      window.ttq.load(pixelId);
      this.initializedPixels.add(`tiktok_${pixelId}`);
      console.log(`[PixelService] TikTok Pixel initialized (${pixelId})`);
    } catch (err) {
      console.warn('[PixelService] Failed loading TikTok Pixel:', err);
    }
  }

  private loadSnapchatPixel(pixelId: string) {
    if (this.initializedPixels.has(`snap_${pixelId}`)) return;

    try {
      if (!window.snaptr) {
        const a: any = (window.snaptr = function () {
          a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
        });
        a.queue = [];
        const s = 'script';
        const r = document.createElement(s);
        r.async = true;
        r.src = 'https://sc-static.net/scevent.min.js';
        const u = document.getElementsByTagName(s)[0];
        u?.parentNode?.insertBefore(r, u);
      }

      window.snaptr('init', pixelId);
      this.initializedPixels.add(`snap_${pixelId}`);
      console.log(`[PixelService] Snapchat Pixel initialized (${pixelId})`);
    } catch (err) {
      console.warn('[PixelService] Failed loading Snapchat Pixel:', err);
    }
  }

  private loadGoogleTag(tagId: string) {
    if (this.initializedPixels.has(`gtag_${tagId}`)) return;

    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);

      window.gtag('config', tagId);
      this.initializedPixels.add(`gtag_${tagId}`);
      console.log(`[PixelService] Google Tag initialized (${tagId})`);
    } catch (err) {
      console.warn('[PixelService] Failed loading Google Tag:', err);
    }
  }

  public trackPageView(): void {
    if (!this.config?.enabled) return;

    try {
      if (this.config.metaPixelId && window.fbq) {
        window.fbq('track', 'PageView');
      }
      if (this.config.tiktokPixelId && window.ttq) {
        window.ttq.page();
      }
      if (this.config.snapchatPixelId && window.snaptr) {
        window.snaptr('track', 'PAGE_VIEW');
      }
      if (this.config.googleTagId && window.gtag) {
        window.gtag('event', 'page_view');
      }
    } catch (err) {
      console.warn('[PixelService] PageView track error:', err);
    }
  }

  public trackLead(leadData: {
    customerName?: string;
    businessName?: string;
    platform?: string;
    whatsapp?: string;
    packageId?: string;
  }): PixelEventLog[] {
    const logs: PixelEventLog[] = [];
    if (!this.config?.enabled) return logs;

    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Meta Lead
    if (this.config.metaPixelId && window.fbq) {
      try {
        window.fbq('track', 'Lead', {
          content_name: leadData.businessName || 'عميل محتمل',
          content_category: leadData.platform || 'Google Maps',
        });
        logs.push({
          id: `log-${Date.now()}-meta-lead`,
          event: 'Lead',
          platform: 'meta',
          timestamp: time,
          details: `تسجيل عميل محتمل: ${leadData.businessName || 'بدون اسم'}`,
        });
      } catch {}
    }

    // TikTok SubmitForm
    if (this.config.tiktokPixelId && window.ttq) {
      try {
        window.ttq.track('SubmitForm', {
          content_name: leadData.businessName || 'عميل محتمل',
        });
        logs.push({
          id: `log-${Date.now()}-tt-lead`,
          event: 'SubmitForm (Lead)',
          platform: 'tiktok',
          timestamp: time,
          details: `تأكيد اهتمام: ${leadData.businessName || 'بدون اسم'}`,
        });
      } catch {}
    }

    // Snapchat SIGN_UP
    if (this.config.snapchatPixelId && window.snaptr) {
      try {
        window.snaptr('track', 'SIGN_UP', {
          sign_up_method: 'WhatsApp Form',
        });
        logs.push({
          id: `log-${Date.now()}-snap-lead`,
          event: 'SIGN_UP (Lead)',
          platform: 'snapchat',
          timestamp: time,
          details: `طلب اتصال عبر واتساب`,
        });
      } catch {}
    }

    // Google Tag generate_lead
    if (this.config.googleTagId && window.gtag) {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Leads',
          event_label: leadData.businessName,
        });
        logs.push({
          id: `log-${Date.now()}-gtag-lead`,
          event: 'generate_lead',
          platform: 'google',
          timestamp: time,
          details: `إرسال بيانات النشاط التجاري`,
        });
      } catch {}
    }

    return logs;
  }

  public trackPurchase(orderData: {
    orderId: string;
    amountSAR: number;
    packageName: string;
    platform?: string;
  }): PixelEventLog[] {
    const logs: PixelEventLog[] = [];
    if (!this.config?.enabled) return logs;

    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Meta Purchase
    if (this.config.metaPixelId && window.fbq) {
      try {
        window.fbq('track', 'Purchase', {
          value: orderData.amountSAR,
          currency: 'SAR',
          content_name: orderData.packageName,
          content_type: 'product',
        });
        logs.push({
          id: `log-${Date.now()}-meta-purchase`,
          event: 'Purchase',
          platform: 'meta',
          timestamp: time,
          details: `طلب ${orderData.orderId} بقيمة ${orderData.amountSAR} ر.س (${orderData.packageName})`,
        });
      } catch {}
    }

    // TikTok PlaceAnOrder
    if (this.config.tiktokPixelId && window.ttq) {
      try {
        window.ttq.track('PlaceAnOrder', {
          value: orderData.amountSAR,
          currency: 'SAR',
          content_name: orderData.packageName,
          content_id: orderData.orderId,
        });
        logs.push({
          id: `log-${Date.now()}-tt-purchase`,
          event: 'PlaceAnOrder',
          platform: 'tiktok',
          timestamp: time,
          details: `إتمام طلب ${orderData.orderId} بقيمة ${orderData.amountSAR} ر.س`,
        });
      } catch {}
    }

    // Snapchat PURCHASE
    if (this.config.snapchatPixelId && window.snaptr) {
      try {
        window.snaptr('track', 'PURCHASE', {
          currency: 'SAR',
          price: orderData.amountSAR,
          transaction_id: orderData.orderId,
          item_category: orderData.platform || 'google-maps',
        });
        logs.push({
          id: `log-${Date.now()}-snap-purchase`,
          event: 'PURCHASE',
          platform: 'snapchat',
          timestamp: time,
          details: `شراء مؤكد: ${orderData.orderId} (${orderData.amountSAR} SAR)`,
        });
      } catch {}
    }

    // Google Tag purchase
    if (this.config.googleTagId && window.gtag) {
      try {
        window.gtag('event', 'purchase', {
          transaction_id: orderData.orderId,
          value: orderData.amountSAR,
          currency: 'SAR',
          items: [
            {
              item_name: orderData.packageName,
              price: orderData.amountSAR,
              quantity: 1,
            },
          ],
        });
        logs.push({
          id: `log-${Date.now()}-gtag-purchase`,
          event: 'purchase',
          platform: 'google',
          timestamp: time,
          details: `عملية شراء مكتملة: ${orderData.orderId}`,
        });
      } catch {}
    }

    return logs;
  }
}

export const pixelService = new PixelService();
