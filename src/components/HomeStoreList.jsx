import React, { useState } from 'react'
import { 
  Store, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Search, 
  PlusCircle, 
  Lock,
  Sparkles,
  HelpCircle,
  Share2,
  QrCode,
  ChefHat,
  CheckCircle2
} from 'lucide-react'

export default function HomeStoreList({ 
  stores, 
  menus, 
  onSelectStore, 
  onOpenRegisterStore, 
  onOpenAdminLogin 
}) {
  const [search, setSearch] = useState('')
  const [showGuide, setShowGuide] = useState(true)

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    store.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      
      {/* Hero Header Bersih & Luas */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-100/60 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>PLATFORM JASTIP MAKANAN KANTOR & KOMUNITAS</span>
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            Nitip Makanan Anti-Ribet, Langsung Bayar QRIS 🍲
          </h2>
          <p className="text-sm text-orange-50 mt-2 leading-relaxed">
            Gak perlu lagi ngetik list panjang di grup WhatsApp. Pesan lewat link, rekap otomatis, bayar sat-set!
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenRegisterStore}
              className="bg-white hover:bg-amber-50 text-orange-950 font-extrabold text-xs md:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-black/10 flex items-center gap-2 bouncy-tap"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Buka Lapak Jastip Baru</span>
            </button>

            {stores.length > 0 && (
              <button
                onClick={onOpenAdminLogin}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-2 backdrop-blur-md bouncy-tap"
              >
                <Lock className="w-4 h-4 text-white/80" />
                <span>Masuk Lapak Saya</span>
              </button>
            )}

            <a
              href="/download"
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-2 backdrop-blur-md bouncy-tap"
              title="Download APK Langsung untuk Android"
            >
              <span>📲</span>
              <span>Download APK</span>
            </a>
          </div>
        </div>

        {/* Logo Card Display */}
        <div className="hidden sm:flex shrink-0 relative z-10 items-center justify-center">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 rotate-3 hover:rotate-0 transition-transform">
            <img src="/logo.jpg" alt="Logo Nitip Nyaak" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* PANDUAN AWAL (ONBOARDING GUIDE) */}
      {showGuide && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Panduan Cara Pakai Nitip Nyaak!
                </h3>
                <p className="text-xs text-slate-400">Hanya 3 langkah gampang buat mulai</p>
              </div>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Tutup ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">
                1
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Penjual Buka Lapak</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Klik tombol "Buka Lapak", atur menu makanan, pasang nomor QRIS/bank, dan tentukan jam tutup pesan.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                2
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Sebar Link ke WhatsApp</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Salin link lapakmu yang otomatis terbuat, lalu kirim ke grup WA kantor/kampus. Teman-teman tinggal klik linknya!
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                3
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Rekap Masak Otomatis</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pembeli bayar via QRIS. Dashboard penjual langsung merekap total porsi yang harus dimasak & status bayar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KONDISI EMPTY STATE (MULAI DARI 0) */}
      {stores.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 md:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🍲
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-extrabold text-base md:text-lg text-slate-900">
              Belum Ada Lapak Jastip yang Buka
            </h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
              Mulai tes aplikasi dari 0 sekarang! Bikin lapak jastip pertamamu (misal: jastip masakan Mamah, jajan pasar, atau kopi) dalam 30 detik.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenRegisterStore}
              className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-brand-200 inline-flex items-center gap-2 bouncy-tap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Lapak Jastip Pertamamu Sekarang</span>
            </button>
          </div>
        </div>
      ) : (
        /* KONDISI JIKA SUDAH ADA LAPAK */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-600" />
                <span>Daftar Lapak Jastip yang Lagi Buka ({filteredStores.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Pilih salah satu lapak untuk jajan</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lapak jastip..."
                className="w-full bg-white border border-slate-200 text-xs rounded-2xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map(store => {
              const storeMenus = menus.filter(m => m.storeId === store.id)

              return (
                <div 
                  key={store.id}
                  onClick={() => onSelectStore(store)}
                  className="bg-white border border-slate-200/90 hover:border-brand-400 rounded-3xl p-5 transition-all shadow-sm hover:shadow-md cursor-pointer group bouncy-tap flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          {store.icon || '🍲'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">
                            {store.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            oleh <strong className="text-slate-700">{store.ownerName}</strong>
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Buka PO</span>
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span className="truncate">Sampai: <strong>{store.deliveryDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">Tutup: <strong>{store.cutoffTime}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {storeMenus.length} Menu Tersedia
                    </span>
                    <div className="flex items-center gap-1 text-brand-700 font-extrabold group-hover:translate-x-1 transition-transform text-xs">
                      <span>Buka Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
