import React, { useState } from 'react';
import {
  Bot,
  Save,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BotKnowledgeCard } from '../../types';

export const AdminBotTab: React.FC = () => {
  const { botSettings, updateBotSettings } = useStore();

  const [welcome, setWelcome] = useState(botSettings.welcomeMessage);
  const [knowledge, setKnowledge] = useState(botSettings.knowledgeBase);
  const [duration, setDuration] = useState(botSettings.executionDuration);
  const [contact, setContact] = useState(botSettings.contactInfo);
  const [showHint, setShowHint] = useState(botSettings.showPopupHint ?? true);
  const [hintText, setHintText] = useState(
    botSettings.popupHintText ?? 'تحتاج مساعدة في اختيار الباقة الأنسب؟ أنا هنا 👋'
  );

  // Dynamic Knowledge Cards list
  const [cards, setCards] = useState<BotKnowledgeCard[]>(
    botSettings.knowledgeCards && botSettings.knowledgeCards.length > 0
      ? botSettings.knowledgeCards
      : [
          {
            id: 'kb-pricing',
            title: 'الأسعار والباقات',
            content: 'تبدأ أسعار خرائط جوجل من 79.99 ريال لباقة 10 تقييمات، باقة 25 تقييم بسعر 149.99 ريال، باقة 50 تقييم بسعر 249.99 ريال، باقة 100 تقييم بسعر 399.99 ريال، باقة 200 تقييم بسعر 649.99 ريال، وباقة 500 تقييم الأكثر طلباً بسعر 1300 ريال، وباقة 1000 تقييم الملكية بسعر 1999 ريال. كما تتوفر باقات سناب شات، انستقرام، تيك توك وفيسبوك بأسعار تبدأ من 49.99 ريال.',
          },
          {
            id: 'kb-guarantee',
            title: 'سياسة الضمان والأمان',
            content: 'جميع الباقات عليها ضمان ذهبي مدى الحياة لعدم النقص والسقوط. التعويض مجاني وفوري 100%. التقييمات آمنة 100% بحسابات مرشدين محليين خليجيين حقيقيين وبجدولة زمنية ذكية متوافقة تماماً مع خوارزميات جوجل والمنصات.',
          },
          {
            id: 'kb-delivery',
            title: 'طريقة التنفيذ والجدولة',
            content: 'يبدأ التنفيذ خلال 2-24 ساعة من تأكيد الطلب، ويتم توزيع المراجعات والتفاعل بتدرج طبيعي ومدروس (3 إلى 10 تقييمات يومياً) بدون أي برامج آلية أو روبوتات لضمان بقائها وثباتها للأبد.',
          },
          {
            id: 'kb-payment',
            title: 'طرق الدفع وإتمام الطلب',
            content: 'جميع طرق الدفع متاحة (مدى، Apple Pay، بطاقات ائتمانية، تحويل بنكي). يتم الطلب باختيار الباقة وتعبئة النموذج ثم استكمال التأكيد والبدء الفوري عبر محادثة واتساب الرسمية.',
          },
        ]
  );

  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddCard = () => {
    if (!newCardTitle.trim() || !newCardContent.trim()) return;
    const newCard: BotKnowledgeCard = {
      id: `kb-${Date.now()}`,
      title: newCardTitle.trim(),
      content: newCardContent.trim(),
    };
    setCards([...cards, newCard]);
    setNewCardTitle('');
    setNewCardContent('');
    setIsAddingCard(false);
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleUpdateCard = (id: string, field: 'title' | 'content', value: string) => {
    setCards(
      cards.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotSettings({
      welcomeMessage: welcome,
      knowledgeBase: knowledge,
      executionDuration: duration,
      contactInfo: contact,
      showPopupHint: showHint,
      popupHintText: hintText,
      popupHintDelaySeconds: botSettings.popupHintDelaySeconds || 4,
      knowledgeCards: cards,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">إعدادات مساعد نجمة الذكي (SmartBot)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            تخصيص رسالة الترحيب، تلميحة الزر العائم، وقاعدة المعرفة والبطاقات الذكية التي يستند إليها البوت في الرد على الزوار
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ إعدادات البوت بنجاح!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Floating Popup Hint Toggle & Text */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>التلميحة المنبثقة التلقائية بجانب أيقونة البوت</span>
          </h4>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showHintCheckbox"
              checked={showHint}
              onChange={(e) => setShowHint(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="showHintCheckbox" className="font-bold text-slate-800 cursor-pointer">
              تفعيل ظهور رسالة منبثقة صغيرة تلفت انتباه الزائر فوق زر البوت
            </label>
          </div>

          {showHint && (
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-slate-700 block">نص التلميحة المنبثقة:</label>
              <input
                type="text"
                value={hintText}
                onChange={(e) => setHintText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>رسالة الترحيب الأولى للعميل</span>
          </h4>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">نص الترحيب التلقائي عند فتح الشات:</label>
            <textarea
              rows={3}
              value={welcome}
              onChange={(e) => setWelcome(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Dynamic Knowledge Cards Section */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  بطاقات المعرفة المخصصة للبوت (Knowledge Base Cards)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  أضف مواضيع وأجوبة مخصصة يقرأها البوت الذكي ويجيب بها فوراً عند سؤال العميل
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingCard(!isAddingCard)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCard ? 'إلغاء' : 'إضافة بطاقة جديدة'}</span>
            </button>
          </div>

          {/* New Card Input Form */}
          {isAddingCard && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 animate-in fade-in">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>إضافة بطاقة معرفة جديدة للبوت</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="عنوان الموضوع أو السؤال (مثال: سياسة الاسترجاع، الشحن، طريقة الطلب)"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-bold"
                />
                <textarea
                  rows={3}
                  placeholder="تفاصيل الإجابة والمعلومات التي يشرحها البوت للعميل بالتفصيل..."
                  value={newCardContent}
                  onChange={(e) => setNewCardContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={!newCardTitle.trim() || !newCardContent.trim()}
                  className="px-4 py-1.5 rounded-xl bg-[#006644] text-white font-bold text-xs hover:bg-[#005538] transition-colors disabled:opacity-50"
                >
                  تأكيد وإضافة البطاقة
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-3">
            {cards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 relative group hover:bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(card.id, 'title', e.target.value)}
                      className="font-bold text-slate-900 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:px-2 focus:py-1 rounded outline-none w-full max-w-sm transition-all"
                      placeholder="عنوان البطاقة"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="حذف هذه البطاقة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={card.content}
                  onChange={(e) => handleUpdateCard(card.id, 'content', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 leading-relaxed resize-none"
                  placeholder="محتوى الإجابة..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* General Knowledge Base & Basic Settings */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>التعليمات والمعلومات العامة الاحتياطية</span>
          </h4>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              نص المعلومات الاحتياطية للبوت:
            </label>
            <textarea
              rows={3}
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">مدة التنفيذ المعتمدة:</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">معلومات الدعم والتواصل:</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ إعدادات المساعد الذكي والبطاقات</span>
          </button>
        </div>

      </form>
    </div>
  );
};
