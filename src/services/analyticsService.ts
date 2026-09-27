import { DayTrafficStats, PlatformCategory, StoreAnalyticsData, VisitorDeviceLog } from '../types';

const STORAGE_KEY = 'najma_store_analytics_real_v2';

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatArabicTime = (date: Date = new Date()): string => {
  try {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return date.toTimeString().split(' ')[0];
  }
};

const createEmptyDayStats = (date: string): DayTrafficStats => {
  return {
    date,
    totalVisits: 0,
    uniqueVisitorsCount: 0,
    deviceStats: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
    platformVisits: {
      'google-maps': 0,
      'snapchat': 0,
      'facebook': 0,
      'instagram': 0,
      'tiktok': 0,
    },
    formStarts: 0,
    formCompletes: 0,
    ordersCount: 0,
    uniqueIps: [],
  };
};

export interface DeviceInfo {
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  deviceModel: string;
  browser: string;
  os: string;
}

export const detectDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop',
      deviceModel: 'Desktop PC',
      browser: 'Web Browser',
      os: 'Unknown',
    };
  }

  const ua = navigator.userAgent || '';
  let os = 'Unknown OS';
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  let browser = 'Chrome';
  let deviceModel = 'كمبيوتر شخصي';

  // Detect OS
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS';
    deviceModel = /iPad/.test(ua) ? 'iPad' : 'iPhone';
    deviceType = /iPad/.test(ua) ? 'Tablet' : 'Mobile';
  } else if (/Android/.test(ua)) {
    os = 'Android';
    deviceType = /Mobile/.test(ua) ? 'Mobile' : 'Tablet';
    deviceModel = deviceType === 'Tablet' ? 'جهاز لوحي (Android)' : 'هاتف أندرويد (Android)';
  } else if (/Windows NT 10.0/.test(ua)) {
    os = 'Windows 10/11';
    deviceModel = 'كمبيوتر ويندوز (PC)';
  } else if (/Windows/.test(ua)) {
    os = 'Windows';
    deviceModel = 'كمبيوتر ويندوز';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macOS';
    deviceModel = 'كمبيوتر ماك (Apple)';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
    deviceModel = 'كمبيوتر لينكس';
  }

  // Detect Tablet fallback by screen size / touch
  if (deviceType === 'Desktop' && ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 1024 && window.innerWidth >= 600) {
    deviceType = 'Tablet';
    deviceModel = 'جهاز لوحي (Tablet)';
  } else if (deviceType === 'Desktop' && window.innerWidth <= 640) {
    deviceType = 'Mobile';
    deviceModel = 'هاتف ذكي (Mobile)';
  }

  // Detect Browser
  if (/Edg\//.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/OPR\/|Opera/.test(ua)) {
    browser = 'Opera';
  } else if (/SamsungBrowser/.test(ua)) {
    browser = 'Samsung Internet';
  } else if (/Chrome\//.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  return {
    deviceType,
    deviceModel,
    browser,
    os,
  };
};

let cachedIpInfo: { ip: string; country?: string; city?: string } | null = null;
let isFetchingIp = false;

export const fetchClientIp = async (): Promise<{ ip: string; country?: string; city?: string }> => {
  if (cachedIpInfo) return cachedIpInfo;
  if (isFetchingIp) {
    // Wait briefly if already in flight
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (cachedIpInfo) return cachedIpInfo;
  }

  isFetchingIp = true;

  try {
    // Attempt 1: Fetch detailed IP info from freeipapi or ipapi.co
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json && json.ip) {
          cachedIpInfo = {
            ip: json.ip,
            country: json.country_name || json.country || 'السعودية',
            city: json.city || '',
          };
          isFetchingIp = false;
          return cachedIpInfo;
        }
      }
    } catch {
      // Fallback below
    }

    // Attempt 2: Fast ipify fallback
    const resIpify = await fetch('https://api.ipify.org?format=json');
    if (resIpify.ok) {
      const data = await resIpify.json();
      if (data && data.ip) {
        cachedIpInfo = {
          ip: data.ip,
          country: 'زائر مباشر',
          city: '',
        };
        isFetchingIp = false;
        return cachedIpInfo;
      }
    }
  } catch (err) {
    console.debug('[AnalyticsService] IP detection fallback to local');
  }

  isFetchingIp = false;
  // If offline or blocked by browser extensions, generate a unique local address
  const localId = '192.168.1.' + Math.floor(Math.random() * 200 + 10);
  cachedIpInfo = {
    ip: localId,
    country: 'شبكة محلية',
    city: '',
  };
  return cachedIpInfo;
};

export class AnalyticsService {
  private static instance: AnalyticsService;

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Get raw saved data without any artificial mock seeding
  public getData(): StoreAnalyticsData {
    const today = getTodayDateString();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // STRICTLY ZERO: No mock numbers!
        const initialZeroData: StoreAnalyticsData = {
          todayStats: createEmptyDayStats(today),
          historicalDays: [],
          visitorLogs: [],
          totalVisitsAllTime: 0,
          totalFormStartsAllTime: 0,
          totalFormCompletesAllTime: 0,
        };
        this.saveData(initialZeroData);
        return initialZeroData;
      }

      const parsed: StoreAnalyticsData = JSON.parse(raw);

      // Verify structure exists
      if (!parsed.todayStats || !parsed.todayStats.deviceStats) {
        parsed.todayStats = createEmptyDayStats(today);
      }
      if (!Array.isArray(parsed.todayStats.uniqueIps)) {
        parsed.todayStats.uniqueIps = [];
      }
      if (!Array.isArray(parsed.visitorLogs)) {
        parsed.visitorLogs = [];
      }
      if (!Array.isArray(parsed.historicalDays)) {
        parsed.historicalDays = [];
      }

      // Check if day rolled over to a new day
      if (parsed.todayStats.date !== today) {
        // If the previous day had real visits, preserve it in historicalDays
        if (parsed.todayStats.totalVisits > 0) {
          parsed.historicalDays = [parsed.todayStats, ...parsed.historicalDays].slice(0, 30);
        }
        parsed.todayStats = createEmptyDayStats(today);
        this.saveData(parsed);
      }

      return parsed;
    } catch {
      const initialZeroData: StoreAnalyticsData = {
        todayStats: createEmptyDayStats(today),
        historicalDays: [],
        visitorLogs: [],
        totalVisitsAllTime: 0,
        totalFormStartsAllTime: 0,
        totalFormCompletesAllTime: 0,
      };
      this.saveData(initialZeroData);
      return initialZeroData;
    }
  }

  private saveData(data: StoreAnalyticsData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[AnalyticsService] Failed to save analytics data', e);
    }
  }

  // Reset all analytics strictly to 0
  public resetAll(): StoreAnalyticsData {
    const today = getTodayDateString();
    const zeroData: StoreAnalyticsData = {
      todayStats: createEmptyDayStats(today),
      historicalDays: [],
      visitorLogs: [],
      totalVisitsAllTime: 0,
      totalFormStartsAllTime: 0,
      totalFormCompletesAllTime: 0,
    };
    this.saveData(zeroData);
    sessionStorage.removeItem('najma_visited_session_id');
    return zeroData;
  }

  // Record a real store visit with real IP & device: Exactly 1 visit counted per IP address per day
  public async recordRealStoreVisit(platform: PlatformCategory = 'google-maps'): Promise<StoreAnalyticsData> {
    const data = this.getData();
    const device = detectDeviceInfo();
    const ipInfo = await fetchClientIp();
    const clientIp = (ipInfo.ip || '').trim();

    if (!Array.isArray(data.todayStats.uniqueIps)) {
      data.todayStats.uniqueIps = [];
    }

    const isIpAlreadyRecorded = clientIp && data.todayStats.uniqueIps.includes(clientIp);

    // If this IP has NOT visited yet today: count exactly 1 visit
    if (!isIpAlreadyRecorded && clientIp) {
      data.todayStats.uniqueIps.push(clientIp);

      // Increment counts strictly for new unique IP
      data.todayStats.totalVisits += 1;
      data.totalVisitsAllTime += 1;
      data.todayStats.uniqueVisitorsCount = data.todayStats.uniqueIps.length;

      // Increment device breakdown
      if (device.deviceType === 'Mobile') {
        data.todayStats.deviceStats.mobile += 1;
      } else if (device.deviceType === 'Tablet') {
        data.todayStats.deviceStats.tablet += 1;
      } else {
        data.todayStats.deviceStats.desktop += 1;
      }

      // Increment platform visit
      if (data.todayStats.platformVisits[platform] !== undefined) {
        data.todayStats.platformVisits[platform] += 1;
      }

      // Create Real Visitor Log Entry
      const logEntry: VisitorDeviceLog = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        ip: clientIp,
        deviceType: device.deviceType,
        deviceModel: device.deviceModel,
        browser: device.browser,
        os: device.os,
        country: ipInfo.country,
        city: ipInfo.city,
        platformVisited: platform,
        action: 'visit',
        timestamp: new Date().toISOString(),
        timeFormatted: formatArabicTime(),
      };

      data.visitorLogs = [logEntry, ...(data.visitorLogs || [])].slice(0, 100);
      this.saveData(data);
    } else {
      // Repeat visit from the same IP: DO NOT increment totalVisits or deviceStats!
      // (Counts remain 1 per IP)
    }

    return data;
  }

  // Record platform navigation click
  public async recordPlatformClick(platform: PlatformCategory): Promise<StoreAnalyticsData> {
    const data = this.getData();
    if (data.todayStats.platformVisits[platform] !== undefined) {
      data.todayStats.platformVisits[platform] += 1;
    }

    const device = detectDeviceInfo();
    const ipInfo = await fetchClientIp();

    // Log platform interest
    const logEntry: VisitorDeviceLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ip: ipInfo.ip,
      deviceType: device.deviceType,
      deviceModel: device.deviceModel,
      browser: device.browser,
      os: device.os,
      country: ipInfo.country,
      city: ipInfo.city,
      platformVisited: platform,
      action: 'visit',
      timestamp: new Date().toISOString(),
      timeFormatted: formatArabicTime(),
    };

    data.visitorLogs = [logEntry, ...(data.visitorLogs || [])].slice(0, 100);
    this.saveData(data);
    return data;
  }

  // Record when a user opens the order modal for a specific platform/package
  public async recordFormStart(platform: PlatformCategory = 'google-maps', packageName?: string): Promise<StoreAnalyticsData> {
    const data = this.getData();
    data.todayStats.formStarts += 1;
    data.totalFormStartsAllTime += 1;

    const device = detectDeviceInfo();
    const ipInfo = await fetchClientIp();

    const logEntry: VisitorDeviceLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ip: ipInfo.ip,
      deviceType: device.deviceType,
      deviceModel: device.deviceModel,
      browser: device.browser,
      os: device.os,
      country: ipInfo.country,
      city: ipInfo.city,
      platformVisited: platform,
      action: 'form_start',
      packageName: packageName || 'باقة محددة',
      timestamp: new Date().toISOString(),
      timeFormatted: formatArabicTime(),
    };

    data.visitorLogs = [logEntry, ...(data.visitorLogs || [])].slice(0, 100);
    this.saveData(data);
    return data;
  }

  // Record when a user successfully submits the order form
  public async recordFormComplete(platform: PlatformCategory = 'google-maps', packageName?: string): Promise<StoreAnalyticsData> {
    const data = this.getData();
    data.todayStats.formCompletes += 1;
    data.todayStats.ordersCount += 1;
    data.totalFormCompletesAllTime += 1;

    const device = detectDeviceInfo();
    const ipInfo = await fetchClientIp();

    const logEntry: VisitorDeviceLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ip: ipInfo.ip,
      deviceType: device.deviceType,
      deviceModel: device.deviceModel,
      browser: device.browser,
      os: device.os,
      country: ipInfo.country,
      city: ipInfo.city,
      platformVisited: platform,
      action: 'form_complete',
      packageName: packageName || 'طلب مكتمل',
      timestamp: new Date().toISOString(),
      timeFormatted: formatArabicTime(),
    };

    data.visitorLogs = [logEntry, ...(data.visitorLogs || [])].slice(0, 100);
    this.saveData(data);
    return data;
  }
}

export const analyticsService = AnalyticsService.getInstance();
