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
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Smartphone,
  ChevronDown
} from 'lucide-react'
import { getStoreStatus } from '../utils/storeHelper'

export default function LandingPageHybrid({
  stores,
  menus,
  onSelectStore,
  onOpenRegisterStore,
  onOpenAdminLogin,
  onOpenFeedback,
  onSkipLanding
}) {
  const [search, setSearch] = useState('')

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    store.category?.toLowerCase().includes(search.toLowerCase())
  )

  const sortedFilteredStores = [...filteredStores].sort((a, b) => {
    const statusA = getStoreStatus(a)
    const statusB = getStoreStatus(b)
    if (statusA.canOrder && !statusB.canOrder) return -1
    if (!statusA.canOrder && statusB.canOrder) return 1
    return 0
  })

  return (
    <div className="space-y-12 md:space-y-16">
      
      {/* 1. HERO SECTION (Ringkas, Padat, & Bernafas) */}
      <section className="text-center pt-4 md:pt-8 pb-4 space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 text-orange-800 text-[11px] font-extrabold uppercase tracking-wide shadow-2xs">
          <span>🔥</span> Jastip Makanan Kantor & Komunitas
        </div>

        {/* Simplified Punchy Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          Jastip Makan Siang Kantor Tanpa Drama.
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Buka link lapak temanmu, langsung bayar QRIS di awal. Penjual terima rekap porsi otomatis tanpa pusing nagih hutang!
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a 
            href="#lapak-tersedia" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-sm transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>Pesan Makan Siang</span>
            <span>👇</span>
          </a>

          <button 
            onClick={onOpenRegisterStore}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Buka Lapak Gratis</span>
          </button>

          {onSkipLanding && (
            <button
              onClick={onSkipLanding}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-2xl shadow-2xs transition-transform active:scale-95 flex items-center gap-1.5"
              title="Lewati landing page dan tampilkan daftar lapak langsung"
            >
              <span>Langsung ke Menu Lapak</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>

        {/* 4 Value Props Grid (4 Kolom Desktop / 2 Kolom Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 text-left max-w-2xl mx-auto">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span className="text-xl">🚫</span>
            <div>
              <div className="font-extrabold text-[11px] text-slate-900">Bebas Spam WA</div>
              <div className="text-[9px] text-slate-500">Cukup sebar 1 link</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span className="text-xl">💳</span>
            <div>
              <div className="font-extrabold text-[11px] text-slate-900">Bayar di Awal</div>
              <div className="text-[9px] text-slate-500">QRIS / Transfer BCA</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span className="text-xl">🍳</span>
            <div>
              <div className="font-extrabold text-[11px] text-slate-900">Rekap Dapur</div>
              <div className="text-[9px] text-slate-500">Auto-hitung porsi</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span className="text-xl">💰</span>
            <div>
              <div className="font-extrabold text-[11px] text-slate-900">100% Gratis</div>
              <div className="text-[9px] text-slate-500">Tanpa potongan admin</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION DAFTAR LAPAK (3 Kolom Gagah di Desktop, 1 Kolom Rapi di Mobile) */}
      <section id="lapak-tersedia" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Siap Dipesan</div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <span>🏪</span> Lapak Jastip yang Lagi Buka ({filteredStores.length})
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lapak atau menu..."
              className="w-full bg-white border border-slate-200 text-xs rounded-2xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Store Grid */}
        {sortedFilteredStores.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3">
            <div className="text-3xl">🍲</div>
            <h4 className="font-bold text-sm text-slate-800">Tidak ada lapak yang cocok dengan pencarian</h4>
            <p className="text-xs text-slate-400">Coba kata kunci lain atau buka lapak jastip baru!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sortedFilteredStores.map(store => {
              const storeMenus = menus.filter(m => m.storeId === store.id)
              const status = getStoreStatus(store)

              return (
                <div 
                  key={store.id}
                  onClick={() => onSelectStore(store)}
                  className={`bg-white rounded-3xl p-5 border transition-all shadow-xs hover:shadow-lg cursor-pointer flex flex-col justify-between space-y-4 group bouncy-tap ${
                    status.canOrder ? 'border-slate-200/90 hover:border-emerald-400' : 'border-slate-200/60 opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {store.icon || '🍲'}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${status.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`}></span>
                        <span>{status.label}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        oleh <strong className="text-slate-700">{store.ownerName || 'Penjual'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Jam Antar:
                        </span>
                        <strong className="text-slate-800">{store.deliveryTime || store.deliveryDate}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> Ambil di:
                        </span>
                        <strong className="text-slate-800 truncate max-w-[140px] text-right">{store.pickupLocation || 'Kantor'}</strong>
                      </div>
                    </div>

                    <button className="w-full bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-2xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5">
                      <span>Pilih Menu ({storeMenus.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. SECTION PERBANDINGAN: CARA LAMA VS CARA BARU (Spacious & Clean) */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perbandingan Langsung</div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Kenapa Pindah dari List WhatsApp ke Nitip Nyaak?
          </h2>
          <p className="text-xs text-slate-500">
            Dibuat khusus untuk menyelesaikan masalah jastip makan siang kantor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Card Cara Lama */}
          <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-red-900 text-sm">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>Cara Lama: Manual List WhatsApp</span>
            </div>
            <ul className="space-y-2 text-slate-600 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Chat grup banjir spam panjang puluhan baris reply.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Pesanan ketimpa obrolan penting pekerjaan dan pesan bos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Pembeli sering lupa bayar, penjual sungkan nagih satu-satu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Penjual pusing menghitung manual porsi yang harus dimasak.</span>
              </li>
            </ul>
          </div>

          {/* Card Cara Baru */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-emerald-900 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Cara Baru: Nitip Nyaak! (Serba Otomatis)</span>
            </div>
            <ul className="space-y-2 text-slate-700 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Cukup 1 link rapi</strong> dibagikan ke grup WA, grup tetap bersih.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Wajib bayar di awal</strong> pakai QRIS / Transfer BCA, bebas hutang!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Rekap dapur instan</strong>: otomatis tahu harus masak berapa porsi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Setting menu sat-set</strong>: penjual bisa edit harga dan kuota porsi kapan saja.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. SECTION FAQ & BANNER APK */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="font-extrabold text-base text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          <p className="text-xs text-slate-400">Hal penting seputar Nitip Nyaak</p>
        </div>

        <div className="space-y-2.5 text-xs">
          <details className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs cursor-pointer group">
            <summary className="font-bold text-slate-800 flex items-center justify-between">
              <span>Apakah ada potongan biaya admin?</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-slate-600 pt-2 text-xs leading-relaxed">
              Sama sekali tidak ada! Nitip Nyaak 100% gratis. Uang pesanan pembeli langsung ditransfer ke rekening pribadi atau discan lewat barcode QRIS milik penjual sendiri tanpa perantara.
            </p>
          </details>

          <details className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs cursor-pointer group">
            <summary className="font-bold text-slate-800 flex items-center justify-between">
              <span>Apakah pembeli wajib install aplikasi?</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-slate-600 pt-2 text-xs leading-relaxed">
              Tidak wajib. Pembeli cukup klik link toko lewat browser HP apa saja. Namun tersedia juga aplikasi APK Android yang bisa diunduh gratis langsung dari web.
            </p>
          </details>

          <details className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs cursor-pointer group">
            <summary className="font-bold text-slate-800 flex items-center justify-between">
              <span>Bagaimana cara penjual login ke dashboard lapak?</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-slate-600 pt-2 text-xs leading-relaxed">
              Cukup klik tombol "Masuk Lapak" di pojok kanan atas, pilih nama lapakmu, dan masukkan 4-digit PIN rahasia yang kamu buat saat mendaftar.
            </p>
          </details>
        </div>

        {/* Banner Unduh APK Android */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xl border border-emerald-500/30">
              🤖
            </div>
            <div>
              <div className="font-extrabold text-sm">Download Aplikasi Android Nitip Nyaak</div>
              <p className="text-xs text-slate-400">Versi 1.2.0 • Gratis & Ringan Langsung dari Web</p>
            </div>
          </div>
          <a
            href="/download"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 shrink-0"
          >
            Download APK Gratis
          </a>
        </div>
      </section>

    </div>
  )
}
