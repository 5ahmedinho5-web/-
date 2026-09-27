import React, { useState } from 'react';
import {
  Search,
  Filter,
  MessageCircle,
  Eye,
  Trash2,
  Calendar,
  Phone,
  Building,
  User,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  Image as ImageIcon,
  Mail,
  Ticket,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderItem, OrderStatus } from '../../types';
import { PlatformIcon } from '../PlatformIcon';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, storeSettings } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.businessName.toLowerCase().includes(search.toLowerCase()) ||
      o.whatsapp.includes(search);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>طلب جديد</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3 h-3" />
            <span>جاري التنفيذ</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>مكتمل</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>ملغي</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenWhatsAppClient = (order: OrderItem) => {
    const cleanNumber = (order.countryCode + order.whatsapp).replace(/[^0-9]/g, '');
    const msg = `مرحباً أستاذ ${order.customerName}،
نتواصل معك من إدارة متجر نجمة لخدمات Google Maps بشأن طلبك رقم (${order.id}) لحزمة ${order.packageReviewsCount} تقييم لنشاط (${order.businessName}).
يسعدنا خدمتكم والإجابة على أي استفسار.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Gmail Notification Status Alert */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-bold">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span>إشعارات الطلبات الفورية إلى Gmail:</span>
          <span className="font-mono text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
            {storeSettings.orderNotificationEmail || 'najma.orders@gmail.com'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>مربوط ومفعّل 100%</span>
        </div>
      </div>

      {/* Header & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب، اسم العميل، النشاط أو الهاتف..."
            className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-right"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'new', label: 'طلبات جديدة' },
            { id: 'in_progress', label: 'جاري التنفيذ' },
            { id: 'completed', label: 'مكتمل' },
            { id: 'cancelled', label: 'ملغي' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد طلبات تطابق هذا البحث أو التصفية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم الطلب</th>
                  <th className="p-3.5">العميل والنشاط</th>
                  <th className="p-3.5">الحزمة والسعر</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Order ID */}
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{order.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.id, order.id)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="نسخ رقم الطلب"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedId === order.id && (
                          <span className="text-[10px] text-emerald-600 font-sans">تم!</span>
                        )}
                      </div>
                    </td>

                    {/* Customer & Business */}
                    <td className="p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        {order.platform && <PlatformIcon platform={order.platform} size="sm" />}
                        <span>{order.customerName}</span>
                      </div>
                      <div className="text-slate-500">{order.businessName}</div>
                      {order.currentFollowers && (
                        <div className="text-[11px] text-emerald-700 font-medium">
                          المتابعون الحاليون: {order.currentFollowers}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                        {order.countryCode} {order.whatsapp}
                      </div>
                    </td>

                    {/* Package & Price */}
                    <td className="p-3.5 space-y-1">
                      <div className="font-bold text-emerald-800">
                        {order.packageCountLabel ||
                          (order.platform === 'google-maps' || !order.platform
                            ? `حزمة ${order.packageReviewsCount} تقييم`
                            : `حزمة ${order.packageReviewsCount} متابع`)}
                      </div>
                      <div className="font-mono font-bold flex items-center gap-1.5">
                        {order.originalPrice && (
                          <span className="text-slate-400 line-through text-[11px]">
                            {order.originalPrice}
                          </span>
                        )}
                        <span className="text-[#006644] text-xs">
                          {order.price} {order.currencySymbol}
                        </span>
                      </div>
                      {order.couponCode && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold border border-emerald-200">
                          <Ticket className="w-3 h-3 text-emerald-600" />
                          <span>كود: {order.couponCode}</span>
                          {order.discountAmount ? (
                            <span className="text-emerald-700">(-{order.discountAmount} {order.currencySymbol})</span>
                          ) : null}
                        </div>
                      )}
                      {order.screenshotUrl && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">
                            <ImageIcon className="w-3 h-3" />
                            <span>مرفق لقطة</span>
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 font-mono">
                      {order.createdAt.slice(0, 10)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="new">طلب جديد</option>
                        <option value="in_progress">جاري التنفيذ</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View details */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppClient(order)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="مراسلة العميل واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900">تفاصيل الطلب {selectedOrder.id}</h4>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">اسم العميل:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">
                  {selectedOrder.platform && selectedOrder.platform !== 'google-maps'
                    ? 'اسم الحساب / الصفحة:'
                    : 'النشاط التجاري:'}
                </span>
                <span className="font-bold text-slate-900 text-sm">{selectedOrder.businessName}</span>
              </div>

              {selectedOrder.platform && (
                <div>
                  <span className="text-slate-400 block mb-0.5">المنصة:</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
                    <PlatformIcon platform={selectedOrder.platform} size="sm" />
                    <span>
                      {selectedOrder.platform === 'google-maps'
                        ? 'خرائط جوجل'
                        : selectedOrder.platform === 'snapchat'
                        ? 'سناب شات'
                        : selectedOrder.platform === 'facebook'
                        ? 'فيسبوك'
                        : selectedOrder.platform === 'instagram'
                        ? 'انستقرام'
                        : 'تيك توك'}
                    </span>
                  </div>
                </div>
              )}

              {selectedOrder.mapsUrl && (
                <div>
                  <span className="text-slate-400 block mb-0.5">رابط الخريطة:</span>
                  <a
                    href={selectedOrder.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline break-all inline-flex items-center gap-1 font-mono text-xs"
                  >
                    <span>{selectedOrder.mapsUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {selectedOrder.accountUrl && (
                <div>
                  <span className="text-slate-400 block mb-0.5">رابط الحساب / الصفحة:</span>
                  <a
                    href={selectedOrder.accountUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline break-all inline-flex items-center gap-1 font-mono text-xs"
                  >
                    <span>{selectedOrder.accountUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {selectedOrder.currentFollowers && (
                <div>
                  <span className="text-slate-400 block mb-0.5">عدد المتابعين الحالي:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {selectedOrder.currentFollowers}
                  </span>
                </div>
              )}

              {selectedOrder.screenshotUrl && (
                <div>
                  <span className="text-slate-400 block mb-1">لقطة شاشة من الحساب:</span>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 flex items-center justify-center bg-slate-50">
                    <img
                      src={selectedOrder.screenshotUrl}
                      alt="لقطة الشاشة للحساب"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <span className="text-slate-400 block mb-0.5">رقم الواتساب:</span>
                <span className="font-mono font-bold text-slate-800 text-sm" dir="ltr">
                  {selectedOrder.countryCode} {selectedOrder.whatsapp}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">الحزمة المطلوبة والسعر:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-800">
                    {selectedOrder.packageReviewsCount} تقييم
                  </span>
                  {selectedOrder.originalPrice && (
                    <span className="text-slate-400 line-through text-xs font-mono">
                      {selectedOrder.originalPrice} {selectedOrder.currencySymbol}
                    </span>
                  )}
                  <span className="font-black text-[#006644] font-mono text-sm">
                    {selectedOrder.price} {selectedOrder.currencySymbol}
                  </span>
                </div>
                {selectedOrder.couponCode && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-emerald-600" />
                      <span>كود الخصم:</span>
                      <span className="font-mono font-black text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                        {selectedOrder.couponCode}
                      </span>
                    </span>
                    {selectedOrder.discountAmount ? (
                      <span className="text-emerald-700 font-bold font-mono">
                        وفرت: {selectedOrder.discountAmount} {selectedOrder.currencySymbol}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {selectedOrder.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">ملاحظات العميل:</span>
                  <p className="text-slate-800 leading-relaxed">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => handleOpenWhatsAppClient(selectedOrder)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
