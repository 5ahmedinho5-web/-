import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, ArrowUpRight, TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PackageItem, PlatformCategory } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
  badge?: string;
}

export const SmartBot: React.FC = () => {
  const { botSettings, packages, storeSettings, formatPrice } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  // Platform-based packages grouping
  const platformPackages = useMemo(() => {
    const map: Record<string, PackageItem[]> = {
      'google-maps': [],
      instagram: [],
      snapchat: [],
      tiktok: [],
      facebook: [],
      other: [],
    };

    packages.forEach((pkg) => {
      const plat = pkg.platform || 'google-maps';
      if (map[plat]) {
        map[plat].push(pkg);
      } else {
        map.other.push(pkg);
      }
    });

    // Sort packages in each platform descending by price/reviewsCount
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (b.reviewsCount || b.priceSAR) - (a.reviewsCount || a.priceSAR));
    });

    return map;
  }, [packages]);

  // Find top VIP packages
  const getTopPackageForPlatform = (platform: PlatformCategory): PackageItem | undefined => {
    const list = platformPackages[platform];
    if (!list || list.length === 0) return undefined;
    return list[0]; // highest tier
  };

  const globalTopPackage = useMemo(() => {
    if (packages.length === 0) return null;
    const sorted = [...packages].sort((a, b) => b.priceSAR - a.priceSAR);
    return sorted[0];
  }, [packages]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text:
        botSettings.welcomeMessage ||
        'مرحباً بك في متجر نجمة 🌟 أنا مستشارك الذكي للتسويق الرقمي وبناء العلامات التجارية. أساعدك في اختيار أقوى باقات خرائط Google، انستقرام، سناب شات، تيك توك وفيسبوك لمضاعفة مبيعاتك وتصدر السوق فوراً. كيف أخدمك اليوم؟',
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getPackageName = (pkg?: PackageItem, fallback: string = 'الباقة الكبرى'): string => {
    if (!pkg) return fallback;
    if (pkg.countLabel) return pkg.countLabel;
    const isMaps = !pkg.platform || pkg.platform === 'google-maps';
    return `باقة ${pkg.reviewsCount} ${isMaps ? 'تقييم' : 'متابع'}`;
  };

  // Elite Marketing Genius Reasoning Engine
  const generateBotResponse = (
    userInput: string
  ): { text: string; actionUrl?: string; actionLabel?: string; badge?: string } => {
    const text = userInput.toLowerCase();

    // 1. Strict Privacy: Never expose admin/system internals
    if (
      text.includes('ادارة') ||
      text.includes('إدارة') ||
      text.includes('لوحة') ||
      text.includes('دخول') ||
      text.includes('باسوورد') ||
      text.includes('كلمة المرور') ||
      text.includes('سر') ||
      text.includes('ادمن') ||
      text.includes('admin') ||
      text.includes('داشبورد') ||
      text.includes('تحكم')
    ) {
      return {
        text: `أنا مستشارك التسويقي المعتمد في متجر نجمة 🌟 مهمتي هي مساعدة رواد الأعمال وأصحاب المتاجر في انتقاء أقوى الحزم الإعلانية والتسويقية لاكتساح المنافسين. هل ترغب في ترشيح الباقة الذهبية الأقوى لنشاطك التجاري؟`,
      };
    }

    // 2. Business Audit / Competitors Analysis / فحص النشاط
    if (
      text.includes('فحص') ||
      text.includes('تحليل') ||
      text.includes('منافس') ||
      text.includes('رادار') ||
      text.includes('وضعي') ||
      text.includes('موقعي') ||
      text.includes('تقييمي') ||
      text.includes('audit')
    ) {
      return {
        text: `🔍 أداة الفحص والتحليل الراداري للأنشطة جاهزة الآن في متجر نجمة!
نظامنا الذكي يقوم بتحليل حضورك الجغرافي وخوارزميات الظهور المحلي لخرائط Google ومنصات التواصل فوراً، ويقيس الفجوة بينك وبين أقوى 5 منافسين في منطقتك.

💡 الحقيقة التسويقية الصادمة:
أكثر من 73% من الزبائن يذهبون للمنافس الأول لمجرد امتلاكه رصيد تقييمات وتفاعل أعلى بـ 3 إلى 5 أضعاف. جرب أداة الفحص الآن مجاناً 100% لمعرفة خطة انتزاع المركز #1!`,
        actionLabel: 'تشغيل أداة الفحص والتحليل المجاني الآن',
        actionUrl: '#business-audit',
        badge: 'فحص فوري مجاناً ⚡',
      };
    }

    // 2.5 Specific Tier Detection & Elite +2 to +3 Tier UPSELLING
    const isMapsContext = text.includes('خرائط') || text.includes('تقييم') || text.includes('جوجل') || text.includes('قوقل') || text.includes('maps');
    
    // If user mentions 10 or 25 reviews (Tier 1/2): UPSELL to 50 or 100 or 200 reviews
    if (text.includes('10') || text.includes('عشرة') || text.includes('25') || text.includes('خمسة وعشرين') || text.includes('صغيرة') || text.includes('تجربة')) {
      const mapsPkgs = platformPackages['google-maps'];
      const targetUpsell = mapsPkgs.find(p => p.reviewsCount >= 100) || mapsPkgs[0];
      const pInfo = targetUpsell ? formatPrice(targetUpsell.priceSAR).full : '';
      const pName = getPackageName(targetUpsell, 'باقة 100 تقييم 5 نجوم');

      return {
        text: `🧠 تحليل استراتيجي ذكي من خبير التسويق:
اختيار باقة صغيرة (10 أو 25 تقييم) هو خطوة تجريبية خجولة لن تُحدث الانفجار المطلوب في مبيعاتك؛ لأن خوارزميات جوجل تمنح صدارة الـ Local 3-Pack فقط للأنشطة التي تحقق "عتبة الزخم العالي" (Momentum Threshold).

المنافسون في محيطك يتحركون أسرع، والبدء بباقة صغيرة يُبقيك متأرجحاً في الصفوف الخلفية!

👑 التوصية الاحترافية القاطعة (القفز بمستويين إلى ثلاثة):
أنصحك بالاستثمار مباشرة في: ${pName} ${pInfo ? `(${pInfo})` : ''}

🎯 لماذا هذه الباقة هي الأذكى تجارياً لزيادة أرباحك؟
1. 📈 تحقق لك زيادة في عدد الطلبات المتوقعة على نشاطك تتجاوز +280% في التدفق اليومي للعملاء.
2. 💰 تكلفة التقييم الواحد فيها أوفر بنسبة 40% مقارنة بالباقات الصغرى.
3. ⚡ تكسر حاجز الخوارزمية وتضع اسم محلك/عيادتك/مطعمك في أول 3 اقتراحات بجوجل في منطقتك!`,
        actionLabel: `طلب ${pName} لتصدر المركز الأول`,
        actionUrl: '#packages',
        badge: 'قفزة تسويقية ذكية 🚀',
      };
    }

    // If user mentions 1000 or 2500 followers on social media: UPSELL to 5,000 or 10,000 VIP
    if (text.includes('1000') || text.includes('الف') || text.includes('ألف') || text.includes('2500') || text.includes('الفين')) {
      return {
        text: `💡 نصيحة سيكولوجيا المستهلك (Consumer Psychology):
في التجارة الإلكترونية والسوشيال ميديا، الحساب الذي يمتلك 1,000 أو 2,500 متابع يظهر للعميل كـ "مشروع مبتدئ وغير مجرب"، مما يجعل الزبون يتردد في الشراء أو يساوم على الأسعار!

بينما الحساب الذي يمتلك 5,000 إلى 10,000 متابع يفرض هيبة فورية (Instant Authority) ويشعر المشتري بالأمان الكامل للدفع فوراً بدون سؤال!

👑 قفزتك الاستراتيجية للأمام:
استثمر فوراً في باقة 5,000 أو 10,000 متابع VIP:
- مضاعفة معدل التحويل (Conversion Rate) لإعلاناتك الممولة بأكثر من 3 أضعاف.
- ضمان عدم النقص مدى الحياة واستقرار الحساب.
- فتح خانات التعاون وتصدر صفحات الإكسبلور!`,
        actionLabel: 'عرض باقات الـ VIP الكبرى',
        actionUrl: '#packages',
        badge: 'سيكولوجية البراند 👑',
      };
    }

    // 2.6 Custom Knowledge Cards defined by Store Admin
    const cards = botSettings.knowledgeCards || [];
    const matchedCard = cards.find((card) => {
      const titleWords = card.title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const contentWords = card.content.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const titleMatch = titleWords.some((word) => text.includes(word));
      const contentMatch = contentWords.filter((w) => text.includes(w)).length >= 2;
      return titleMatch || contentMatch;
    });

    if (matchedCard) {
      return {
        text: matchedCard.content,
        actionLabel: 'تواصل مع مستشار التسويق عبر واتساب',
        actionUrl: `https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`,
      };
    }

    // 3. Instagram Strategy & Packages
    if (text.includes('انستقرام') || text.includes('انستا') || text.includes('instagram') || text.includes('insta')) {
      const topPkg = getTopPackageForPlatform('instagram') || platformPackages.instagram[0];
      const count = getPackageName(topPkg, 'باقة 10,000 متابع انستقرام');
      const price = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `📸 استراتيجية التسويق لـ Instagram وبناء البراند:
في علم سيكولوجية المستهلك (Consumer Psychology)، الزائر يتخذ قرار الشراء أو متابعة الحساب خلال 3 ثوانٍ فقط بناءً على الـ Social Proof (قوة المظهر وعدد المتابعين).

إذا كنت تريد بناء براند راسخ لا يُنسى، فإنني أنصحك مباشرةً بـ:
👑 ${count} ${price ? `بسعر ${price}` : ''}

💡 لماذا الباقة الأعلى هي الخيار الذكي تجارياً؟
1. أوفر تكلفة لكل متابع مقارنة بالباقات الصغيرة (توفير يتجاوز 40%).
2. خوارزميات Explore تعتبر الحساب ذا القاعدة الجماهيرية الكبيرة كـ Authority Account وتقترح منشوراتك للمزيد من الزوار.
3. تكسر حاجز الشك لدى عميلك وتضاعف نسبة التحويل (Conversion Rate) لمبيعات مباشرة فورية!`,
        actionLabel: 'طلب باقة انستقرام الذهبية',
        actionUrl: '#packages',
        badge: 'توصية الخبير 🔥',
      };
    }

    // 4. Snapchat Strategy & Packages
    if (text.includes('سناب') || text.includes('snapchat') || text.includes('snap')) {
      const topPkg = getTopPackageForPlatform('snapchat') || platformPackages.snapchat[0];
      const count = getPackageName(topPkg, 'باقة 10,000 متابع سناب شات');
      const price = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `👻 استراتيجية Snapchat للسوق الخليجي والسعودي:
المستهلك السعودي والخليجي يمتلك أعلى قوة شرائية، وسناب شات هو المحرك الأول لقرارات الشراء اليومية.

لتحقيق أقصى عائد على الاستثمار (ROI)، استثمارك في:
👑 ${count} ${price ? `بسعر ${price}` : ''} هو قرار المحترفين!

🎯 السر التسويقي:
الحساب الذي يمتلك آلاف الإضافات والمشاهدات يمنح متجرك هيبة "البراند الأكثر موثوقية"، ويجعل قصصك اليومية تتصدر، ويشجع الزبائن الجدد على الدفع فوراً بدون تردد. التكلفة في الباقة الكبرى اقتصادية جداً ومردودها المالي سريع وملموس!`,
        actionLabel: 'طلب باقة سناب شات الكبرى',
        actionUrl: '#packages',
        badge: 'الأعلى مبيعاً ⚡',
      };
    }

    // 5. TikTok Strategy & Packages
    if (text.includes('تيك توك') || text.includes('تكتوك') || text.includes('tiktok') || text.includes('tik tok')) {
      const topPkg = getTopPackageForPlatform('tiktok') || platformPackages.tiktok[0];
      const count = getPackageName(topPkg, 'باقة 10,000 متابع تيك توك');
      const price = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `🎵 استراتيجية الانتشار الفيروسي (Virality) على TikTok:
خوارزمية تيك توك تعتمد على نظام العتبات الذكية (Authority Thresholds). الحساب الذي يمتلك قاعدة ضخمة تدفعه الخوارزمية مباشرة إلى صفحات الـ FYP (لك) بمرات ظهور مضاعفة.

نصيحتي التسويقية لك هي عدم إضاعة الوقت في التجربة المحدودة والانطلاق فوراً بـ:
👑 ${count} ${price ? `بسعر ${price}` : ''}

🚀 القيمة المضافة:
- هيبة فورية وموثوقية أمام ملايين المستخدمين.
- استعداد الحساب للتعاون مع المؤثرين وجلب مبيعات خيالية.
- باقة متكاملة بضمان ذهبي وتعويض مجاني مدى الحياة!`,
        actionLabel: 'طلب باقة تيك توك الشاملة',
        actionUrl: '#packages',
        badge: 'انتشار سريع 🚀',
      };
    }

    // 6. Facebook Strategy & Packages
    if (text.includes('فيسبوك') || text.includes('فيس بوك') || text.includes('facebook') || text.includes('fb')) {
      const topPkg = getTopPackageForPlatform('facebook') || platformPackages.facebook[0];
      const count = getPackageName(topPkg, 'باقة 10,000 متابع فيسبوك');
      const price = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `👥 استراتيجية فيسبوك والإعلانات الممولة:
أي حملة إعلانية ممولة تطلقها على فيسبوك تخسر أكثر من 60% من عائدها إذا كانت صفحتك تحتوي على بضعة متابعين، لأن الزائر يشكك في مصداقية المتجر قبل الشراء.

لذلك، فإن الخطوة التسويقية الذكية الأولى هي:
👑 حجز ${count} ${price ? `بسعر ${price}` : ''}

💎 النتيجة المباشرة:
صفحة ضخمة ذات وزن تسويقي عالي، ترفع معدل التحويل الإعلاني (ROAS)، وتضمن بقاء عملائك بعيداً عن المنافسين!`,
        actionLabel: 'طلب باقة فيسبوك الآن',
        actionUrl: '#packages',
        badge: 'ثقة مطلقة 💎',
      };
    }

    // 7. Google Maps Strategy (تقييمات خرائط Google)
    if (
      text.includes('خرائط') ||
      text.includes('جوجل') ||
      text.includes('قوقل') ||
      text.includes('google') ||
      text.includes('maps') ||
      text.includes('خريطة') ||
      text.includes('تقييم') ||
      text.includes('ريفيو')
    ) {
      const topPkg = getTopPackageForPlatform('google-maps') || platformPackages['google-maps'][0];
      const count = getPackageName(topPkg, 'باقة 100 تقييم خرائط Google');
      const price = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `📍 استراتيجية اكتساح خرائط Google وتصدر الـ Local 3-Pack:
أكثر من 85% من العملاء يبحثون عن الأنشطة التجارية القريبة عبر خرائط Google، وخوارزمية جوجل تعطي الأولوية المطلقة للأنشطة التي تملك تقييمات 5 نجوم كثيفة ومتتالية من مرشدين محليين موثوقين.

إذا كنت تريد أن يظهر محلك أو عيادتك أو متجرك في النتيجة رقم #1 دائماً، فإن خيارك الأقوى هو:
👑 ${count} ${price ? `بسعر ${price}` : ''}

🌟 لماذا الباقة الأعلى هي الاستثمار الأكثر ربحاً؟
1. ترفع نشاطك للمراتب الثلاث الأولى فوراً، مما يجلب لك عشرات الاتصالات والزيارات اليومية مجاناً دون الحاجة لدفع إعلانات.
2. تغطي تكلفة الباقة من أرباح أول أسبوع عمل.
3. تقييمات حقيقية بأيدي مرشدين محليين مع جدولة متوازنة وضمان ذهبي دائم!`,
        actionLabel: 'طلب باقة خرائط Google الأعلى',
        actionUrl: '#packages',
        badge: 'تصدر المركز الأول 🥇',
      };
    }

    // 8. General Package Recommendation / "أي باقة أختار؟" / Upselling Advisor
    if (
      text.includes('انصحني') ||
      text.includes('تنصحني') ||
      text.includes('افضل') ||
      text.includes('أفضل') ||
      text.includes('احسن') ||
      text.includes('اختار') ||
      text.includes('مناسب') ||
      text.includes('ابدا ب ايه') ||
      text.includes('ابيع اكتر') ||
      text.includes('مبيعات') ||
      text.includes('منافس') ||
      text.includes('تسويق') ||
      text.includes('براند')
    ) {
      const topPkg = globalTopPackage || packages[0];
      const count = getPackageName(topPkg, 'الباقة الملكية الكبرى');
      const pInfo = topPkg ? formatPrice(topPkg.priceSAR).full : '';

      return {
        text: `🧠 من منطلق التحليل التسويقي لأكثر من 500 براند ناجح:
المتاجر الناجحة لا تبدأ بالحد الأدنى لأن الحد الأدنى يُعطي انطباعاً خجولاً ويأخذ وقتاً طويلاً ليُثمر. في المقابل، الانطلاق بـ الباقة الأعلى هو "الضربة التسويقية القاضية" التي تصنع الفرق بين متجر عادي ومتجر رائد في مجاله.

أوصيك بقوة باختيار:
👑 الباقة الملكية الأعلى لنشاطك (${count} ${pInfo ? `بسعر ${pInfo}` : ''})

🎯 4 مكاسب استراتيجية فورية:
1. أعلى عائد على الاستثمار (ROI): تكلفة الوحدة تكون هي الأقل مقارنة بكل الباقات.
2. دفعة خوارزمية عنيفة: المنصات ومحركات البحث تضعك في صدارة المقترحات والـ SEO.
3. هيبة لا تُقارن: الزبائن يدفعون للبراند الكبير بدون تردد أو مماطلة في السعر.
4. أولوية التنفيذ VIP والمتابعة المستمرة مع ضمان دائم لعدم النقص.`,
        actionLabel: 'ابدأ بالباقة الأقوى الآن',
        actionUrl: '#packages',
        badge: 'استراتيجية الخبراء 👑',
      };
    }

    // 9. Pricing & General Packages Overview
    if (
      text.includes('سعر') ||
      text.includes('اسعار') ||
      text.includes('باقات') ||
      text.includes('حزم') ||
      text.includes('بكام') ||
      text.includes('كم يكلف') ||
      text.includes('تكلفة') ||
      text.includes('عرض') ||
      text.includes('عروض')
    ) {
      const gMapsTop = getTopPackageForPlatform('google-maps');
      const instaTop = getTopPackageForPlatform('instagram');
      const snapTop = getTopPackageForPlatform('snapchat');

      return {
        text: `💎 متجر نجمة يوفر منظومة متكاملة لجميع المنصات بأسعار تنافسية وضمان مدى الحياة:

📍 خرائط Google: تبدأ من أسعار مميزة وصولاً للباقة الكبرى الملكية (${gMapsTop ? formatPrice(gMapsTop.priceSAR).full : ''}).
📸 Instagram: باقات متابعين وتفاعل حقيقي لرفع موثوقية الحساب (${instaTop ? formatPrice(instaTop.priceSAR).full : ''}).
👻 Snapchat: باقات جمهور خليجي وسعودي نشط لزيادة المشاهدات (${snapTop ? formatPrice(snapTop.priceSAR).full : ''}).
🎵 TikTok & Facebook: باقات انتشار سريع وتصدر الخوارزميات.

💡 نصيحة تسويقية ذكية:
الباقات الكبرى دائماً تقدم أفضل خصم ممكن وتمنحك أسبقية ساحقة أمام منافسيك في السوق!`,
        actionLabel: 'تصفح كل الباقات والعروض',
        actionUrl: '#packages',
        badge: 'خصومات حصرية 🏷️',
      };
    }

    // 10. Guarantees & Safety Questions
    if (
      text.includes('امان') ||
      text.includes('أمان') ||
      text.includes('مضمون') ||
      text.includes('ضمان') ||
      text.includes('خطر') ||
      text.includes('اغلاق') ||
      text.includes('باند') ||
      text.includes('حظر') ||
      text.includes('نقص')
    ) {
      return {
        text: `🛡️ سياسة الأمان والضمان الذهبي 100%:
نحن في متجر نجمة نعتمد منهجية بيضاء نقية (White-Hat Strategy):
- لا نستخدم أي روبوتات أو برامج آلية إطلاقاً.
- التقييمات والمتابعات تتم عبر حسابات حقيقية ونشطة مع جدولة زمنية طبيعية متوافقة مع شروط منصات التواصل وGoogle.
- نمنحك ضماناً ذهبياً مدى الحياة مع تعويض مجاني وفوري في حال حدوث أي نقص.
نشاطك وأرقامك في أيدٍ أمينة وخبيرة وموثوقة تماماً!`,
        actionLabel: 'تواصل للاستفسار عبر واتساب',
        actionUrl: `https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`,
        badge: 'ضمان ذهبي مدى الحياة 🛡️',
      };
    }

    // 11. Payment Methods
    if (
      text.includes('دفع') ||
      text.includes('طرق الدفع') ||
      text.includes('فيزا') ||
      text.includes('مدى') ||
      text.includes('ابل باي') ||
      text.includes('apple pay') ||
      text.includes('تحويل') ||
      text.includes('stc')
    ) {
      return {
        text: `💳 جميع وسائل الدفع الآمنة والمعتمدة متوفرة:
- مدى (Mada)
- Apple Pay
- البطاقات الائتمانية (Visa / MasterCard)
- التحويلات البنكية الفورية
يتم إتمام الطلب وتزويدك برابط السداد وتأكيد تفاصيل الباقة فورياً وبكل سهولة.`,
        actionLabel: 'طلب مباشر الآن',
        actionUrl: '#packages',
      };
    }

    // 12. Execution Duration & Speed
    if (
      text.includes('وقت') ||
      text.includes('مدة') ||
      text.includes('متى') ||
      text.includes('سرعة') ||
      text.includes('جدولة') ||
      text.includes('تنفيذ') ||
      text.includes('ساعات')
    ) {
      return {
        text:
          botSettings.executionDuration ||
          `⏱️ سرعة البدء والجدولة الذكية:
- يبدأ العمل والتجهيز خلال 2 إلى 24 ساعة من تأكيد الطلب.
- يتم التوزيع بجدولة مدروسة وطبيعية لتبدو التقييمات والتفاعلات عضوية وتكسب ثقة الخوارزميات دون إثارة أي شكوك، مع إشعارك فور اكتمال الخدمة.`,
      };
    }

    // 13. General Contact & WhatsApp
    if (
      text.includes('تواصل') ||
      text.includes('واتس') ||
      text.includes('رقم') ||
      text.includes('هاتف') ||
      text.includes('دعم') ||
      text.includes('خدمة العملاء')
    ) {
      return {
        text:
          botSettings.contactInfo ||
          `مستشارو التسويق الرقمي في متجر نجمة جاهزون للرد عليك مباشرة وتقديم استشارة مخصصة تناسب نوع نشاطك التجاري بدقة. تواصل معنا في أي وقت!`,
        actionLabel: 'محادثة مستشار نجمة عبر واتساب',
        actionUrl: `https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`,
        badge: 'متاح الآن 🟢',
      };
    }

    // 14. Fallback Knowledge Base if configured
    if (botSettings.knowledgeBase && botSettings.knowledgeBase.length > 20) {
      return {
        text: botSettings.knowledgeBase,
        actionLabel: 'تحدث مع المستشار عبر واتساب',
        actionUrl: `https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`,
      };
    }

    // 15. Einstein Marketing Genius Default Response
    return {
      text: `أهلاً بك! بصفتي مستشارك للتسويق والنمو الرقمي، أؤكد لك أن تعزيز حضورك في خرائط Google ومنصات التواصل (انستقرام، سناب شات، تيك توك، فيسبوك) هو أسرع وأقوى استثمار لمضاعفة مبيعاتك اليوم.

هل ترغب في أن أرشح لك الباقة الأكثر فاعلية لنشاطك والتي تمنحك تفوقاً ساحقاً على منافسيك؟`,
      actionLabel: 'عرض أقوى الباقات الموصى بها',
      actionUrl: '#packages',
      badge: 'استشارة مجانية 🌟',
    };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputVal;
    setInputVal('');

    // Simulate smart thinking delay
    setTimeout(() => {
      const response = generateBotResponse(currentInput);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        actionLabel: response.actionLabel,
        actionUrl: response.actionUrl,
        badge: response.badge,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleQuickQuestion = (q: string) => {
    setInputVal(q);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Bot Chat Window */}
      {isOpen ? (
        <div className="w-[calc(100vw-3rem)] sm:w-[390px] max-w-[390px] h-[540px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden text-right animate-in fade-in slide-in-from-bottom-5 duration-200 origin-bottom-right">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="font-black text-sm text-white flex items-center gap-1.5 justify-end">
                  <span>مستشار نجمة الذكي</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1 justify-end">
                  <span>خبير التسويق وبناء العلامات التجارية</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Marketing Suggestions Chips */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-slate-500 font-bold shrink-0">اختر موضوعاً:</span>
            <button
              onClick={() => handleQuickQuestion('فحص وتحليل نشاطي التجاري ومقارنته بالمنافسين')}
              className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 shrink-0 font-black cursor-pointer transition-colors"
            >
              ⚡ فحص وتحليل نشاطي
            </button>
            <button
              onClick={() => handleQuickQuestion('ما هي الباقة الأفضل لنشاطي واكتساح المنافسين؟')}
              className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 shrink-0 font-bold cursor-pointer transition-colors"
            >
              👑 الباقة الأعلى لنشاطي
            </button>
            <button
              onClick={() => handleQuickQuestion('ما هي باقات واستراتيجية خرائط Google؟')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
            >
              📍 خرائط Google
            </button>
            <button
              onClick={() => handleQuickQuestion('ما هي باقات واستراتيجية انستقرام وسناب شات؟')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
            >
              📸 انستقرام وسناب
            </button>
            <button
              onClick={() => handleQuickQuestion('ما هي باقات تيك توك وفيسبوك؟')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
            >
              🎵 تيك توك وفيسبوك
            </button>
            <button
              onClick={() => handleQuickQuestion('ما هي سياسة الأمان والضمان الذهبي؟')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
            >
              🛡️ الضمان والأمان
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none text-right'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none text-right'
                  }`}
                >
                  {m.badge && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 text-[10px] font-black mb-2">
                      <span>{m.badge}</span>
                    </div>
                  )}

                  <div>{m.text}</div>

                  {m.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href={m.actionUrl}
                        target={m.actionUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006644] hover:bg-[#005538] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <span>{m.actionLabel || 'عرض التفاصيل'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="اسأل مستشار التسويق عن أي باقة أو منصة..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006644] focus:bg-white text-right transition-all"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#006644] hover:bg-[#005538] text-white shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>

        </div>
      ) : (
        /* Cute Floating Bot Launcher */
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-13 h-13 rounded-full bg-[#006644] hover:bg-[#005538] text-white shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95"
          aria-label="مستشار التسويق الذكي"
          title="مستشار نجمة الذكي للتسويق"
        >
          {/* Bot Icon with Sparkle */}
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
          
          {/* Green Online Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        </button>
      )}
    </div>
  );
};
