import React from 'react'
import { Calendar, MapPin, Clock, ArrowRight, Plus, Minus, QrCode, ArrowLeft, Store, AlertTriangle } from 'lucide-react'
import { getStoreStatus, getMenuAvailableQuota } from '../utils/storeHelper'

export default function BuyerPage({ 
  store, 
  menus, 
  cart, 
  orders = [],
  onUpdateQty, 
  onOpenCheckout,
  onBackToDirectory 
}) {
  const storeMenus = menus.filter(m => m.storeId === store.id)
  const storeStatus = getStoreStatus(store)

  // Calculate cart totals for this store
  let totalQty = 0
  let totalPrice = 0
  for (const [id, qty] of Object.entries(cart)) {
    const item = storeMenus.find(m => m.id === parseInt(id))
    if (item && qty > 0) {
      totalQty += qty
      totalPrice += item.price * qty
    }
  }

  return (
    <div className="space-y-6 pb-28">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-sm transition-all bouncy-tap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Lapak</span>
        </button>

        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${storeStatus.badgeClass}`}>
          <span className={`w-2 h-2 rounded-full ${storeStatus.dotClass}`}></span>
          <span>{storeStatus.label}</span>
        </span>
      </div>

      {/* BANNER NOTIFIKASI JIKA PO TUTUP ATAU LEWAT CUT-OFF */}
      {!storeStatus.canOrder && (
        <div className={`p-4 md:p-5 rounded-3xl border flex items-start gap-3.5 shadow-sm ${
          storeStatus.isClosedManually 
            ? 'bg-rose-50 border-rose-200/90 text-rose-900' 
            : 'bg-amber-50 border-amber-200/90 text-amber-900'
        }`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
            storeStatus.isClosedManually ? 'bg-rose-200/80 text-rose-800' : 'bg-amber-200/80 text-amber-800'
          }`}>
            {storeStatus.isClosedManually ? '🔒' : '⏳'}
          </div>
          <div>
            <h4 className="font-extrabold text-sm">
              {storeStatus.isClosedManually 
                ? 'Pemesanan Ditutup Sementara oleh Penjual' 
                : 'Waktu Pemesanan Sudah Melewati Batas Cut-Off'}
            </h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {storeStatus.isClosedManually
                ? `Penjual (${store.ownerName}) sedang menutup pesanan untuk lapak ini. Kamu masih bisa melihat daftar menu, tetapi belum bisa memesan saat ini.`
                : `Batas tutup pesanan (${store.cutoffTime}) untuk jadwal ini sudah lewat. Lapak sudah tidak menerima pesanan baru.`}
            </p>
          </div>
        </div>
      )}

      {/* Store Banner Luas & Bernapas (Bukan Frame HP) */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-100/60 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {store.icon || '🍲'}
              </div>
              <div className="min-w-0">
                <span className="text-xs text-orange-100 font-semibold block">
                  {store.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {store.name}
                </h2>
                <p className="text-xs md:text-sm text-white/90 mt-0.5">
                  oleh <strong className="text-white">{store.ownerName}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Schedule & Pickup Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <span className="text-white/70 block text-[10px]">Makanan Datang</span>
                <span className="font-bold text-white text-xs block truncate">
                  {store.deliveryDate} ({store.deliveryTime})
                </span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <span className="text-white/70 block text-[10px]">Tutup Pesanan (Cut-Off)</span>
                <span className="font-bold text-white text-xs block truncate">
                  {store.cutoffTime}
                </span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-300 shrink-0" />
              <div className="min-w-0">
                <span className="text-white/70 block text-[10px]">Titik Ambil</span>
                <span className="font-bold text-white text-xs block truncate">
                  {store.pickupLocation}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Info QRIS & Pembayaran */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <QrCode className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-slate-800 block text-xs">
            Pembayaran Mudah Langsung ke Penjual
          </span>
          <span className="text-[11px] text-emerald-800">
            Bisa scan <strong>QRIS</strong> atau transfer <strong>{store.bankName}</strong> ({store.bankNumber}) pas checkout.
          </span>
        </div>
      </div>

      {/* Daftar Menu List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-base text-slate-900">
            Daftar Menu {store.name}
          </h3>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            {storeMenus.length} Menu
          </span>
        </div>

        {storeMenus.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <span className="text-3xl block">🍽️</span>
            <h4 className="font-bold text-sm text-slate-700">Belum ada menu yang di-open di lapak ini</h4>
            <p className="text-xs text-slate-400">
              Penjual ({store.ownerName}) belum menambahkan menu untuk hari ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {storeMenus.map(item => {
              const qty = cart[item.id] || 0
              const available = getMenuAvailableQuota(item, orders, store.id)
              const isSoldOut = available <= 0
              const isMaxInCart = qty >= available

              return (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-3xl p-4 transition-all shadow-sm flex items-center justify-between gap-3 ${
                    isSoldOut 
                      ? 'border-slate-200/60 opacity-80 bg-slate-50/50' 
                      : 'border-slate-200/90 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-3xl shrink-0 shadow-inner relative">
                      {item.icon}
                      {isSoldOut && (
                        <span className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center text-xs">
                          ❌
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`font-bold text-xs md:text-sm truncate ${isSoldOut ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {item.name}
                        </h4>
                        {isSoldOut ? (
                          <span className="text-[9px] bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            🔴 Habis / Sold Out
                          </span>
                        ) : item.badge ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs md:text-sm font-extrabold text-brand-700">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {isSoldOut ? (
                            '• Porsi habis'
                          ) : (
                            `• Sisa ${available} porsi`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl">
                    {qty > 0 && (
                      <>
                        <button 
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-7 h-7 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center text-sm shadow-sm hover:bg-slate-100 bouncy-tap"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-800 w-5 text-center">
                          {qty}
                        </span>
                      </>
                    )}
                    <button 
                      disabled={!storeStatus.canOrder || isSoldOut || isMaxInCart}
                      onClick={() => onUpdateQty(item.id, 1)}
                      title={
                        !storeStatus.canOrder 
                          ? 'Pemesanan sedang ditutup' 
                          : isSoldOut 
                            ? 'Menu ini sudah habis' 
                            : isMaxInCart 
                              ? 'Mencapai batas kuota yang tersedia' 
                              : 'Tambah menu'
                      }
                      className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-sm shadow-sm transition-all ${
                        !storeStatus.canOrder || isSoldOut || isMaxInCart
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-200 bouncy-tap'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-2xl z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {totalQty} menu dipilih dari {store.name}
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            {storeStatus.canOrder ? (
              <button 
                onClick={onOpenCheckout}
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 flex items-center gap-2 bouncy-tap"
              >
                <span>Bayar & Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                disabled
                className="bg-slate-300 text-slate-500 font-bold text-xs md:text-sm px-5 py-3 rounded-2xl cursor-not-allowed flex items-center gap-2"
              >
                <span>PO Sedang Ditutup</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
