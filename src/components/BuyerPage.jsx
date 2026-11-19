import React from 'react'
import { Calendar, MapPin, Clock, ArrowRight, Plus, Minus, QrCode } from 'lucide-react'

export default function BuyerPage({ 
  settings, 
  menus, 
  cart, 
  onUpdateQty, 
  onOpenCheckout 
}) {
  // Calculate cart totals
  let totalQty = 0
  let totalPrice = 0
  for (const [id, qty] of Object.entries(cart)) {
    const item = menus.find(m => m.id === parseInt(id))
    if (item && qty > 0) {
      totalQty += qty
      totalPrice += item.price * qty
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative pb-28">
      
      {/* Banner Hero Jago Vibes */}
      <div className="px-5 pt-4 pb-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white rounded-b-[32px] shadow-lg shadow-indigo-100 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none pointer-events-none">🍲</div>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>OPEN PO BUAT BESOK</span>
          </span>
          <span className="text-[11px] font-medium text-white/90 bg-black/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>Tutup: <strong className="text-amber-300">{settings.cutoffTime}</strong></span>
          </span>
        </div>

        {/* Store Title */}
        <h2 className="text-xl font-extrabold tracking-tight">{settings.storeTitle} 👩‍🍳</h2>
        <p className="text-xs text-purple-100 mt-1 leading-relaxed">
          Pesan langsung lewat link ini yaa, bayar sat-set via QRIS!
        </p>

        {/* Schedule & Pickup Point Card */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-white/70 block text-[10px]">Makanan Datang</span>
              <span className="font-bold text-white text-xs block truncate">
                {settings.deliveryDate} ({settings.deliveryTime})
              </span>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-white/70 block text-[10px]">Titik Ambil</span>
              <span className="font-bold text-white text-xs block truncate">
                {settings.pickupLocation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner QRIS */}
      <div className="px-5 pt-4 pb-1">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-2.5 flex items-center gap-2.5 text-xs text-emerald-900 shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium leading-tight">
            Langsung bayar via <strong>QRIS</strong> atau <strong>{settings.bankName}</strong> pas checkout biar gak kelupaan!
          </span>
        </div>
      </div>

      {/* Menu Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm">Pilihan Menu Hari Ini</h3>
        <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
          {menus.length} Menu Tersedia
        </span>
      </div>

      {/* Menu Food Cards */}
      <div className="px-4 space-y-3">
        {menus.map(item => {
          const qty = cart[item.id] || 0
          const sisa = item.quota - qty

          return (
            <div 
              key={item.id} 
              className="bg-white border border-slate-200/90 hover:border-brand-300 rounded-3xl p-3.5 transition-all shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{item.name}</h4>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-extrabold text-brand-700">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      • Sisa {sisa} porsi
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200/80 p-1 rounded-2xl">
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
                  onClick={() => onUpdateQty(item.id, 1)}
                  className="w-7 h-7 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-brand-200 bouncy-tap"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-2xl transition-all duration-300 z-40">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">
                {totalQty} menu masuk keranjang
              </span>
              <span className="text-base font-extrabold text-slate-900">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <button 
              onClick={onOpenCheckout}
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-200 flex items-center gap-2 bouncy-tap"
            >
              <span>Bayar & Pesan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
