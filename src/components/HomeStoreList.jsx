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
  Sparkles
} from 'lucide-react'

export default function HomeStoreList({ 
  stores, 
  menus, 
  onSelectStore, 
  onOpenRegisterStore, 
  onOpenAdminLogin 
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const categories = ['Semua', 'Masakan Rumahan', 'Khas Palembang', 'Camilan']

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                          store.category.toLowerCase().includes(search.toLowerCase()) ||
                          store.ownerName.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'Semua' || store.category.includes(selectedCategory)
    return matchesSearch && matchesCat
  })

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="px-5 pt-4 pb-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white rounded-b-[32px] shadow-lg shadow-indigo-100 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none pointer-events-none">🍲</div>
        
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-2.5">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>JASTIP MAKANAN KANTOR & KOMUNITAS</span>
        </span>

        <h2 className="text-xl font-extrabold tracking-tight">Mau Nitip Makan Apa? 😋</h2>
        <p className="text-xs text-purple-100 mt-1 leading-relaxed">
          Pilih lapak yang lagi buka PO di bawah, pesan sat-set & bayar QRIS!
        </p>

        {/* Search Bar Input */}
        <div className="mt-4 relative">
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nasi bakar, pempek, dimsum..."
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-purple-200 text-xs rounded-2xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white/30 focus:border-white transition-all"
          />
          <Search className="w-4 h-4 text-purple-200 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-5 pt-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bouncy-tap ${
              selectedCategory === cat 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Store List Directory */}
      <div className="px-4 py-2 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-brand-600" />
            <span>Lapak Jastip yang Lagi Buka:</span>
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            {filteredStores.length} Lapak
          </span>
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-3xl border border-slate-200/80 p-5">
            <span className="text-3xl block mb-2">🔍</span>
            <p className="font-bold text-xs text-slate-700">Lapak tidak ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-1">Coba cari dengan kata kunci lain yaa</p>
          </div>
        ) : (
          filteredStores.map(store => {
            const storeMenus = menus.filter(m => m.storeId === store.id)

            return (
              <div 
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="bg-white border border-slate-200/90 hover:border-brand-300 rounded-3xl p-4 transition-all shadow-sm hover:shadow-md cursor-pointer group bouncy-tap relative space-y-3"
              >
                {/* Store Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-3xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {store.icon || '🍲'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">
                          {store.name}
                        </h4>
                        {store.badge && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                            {store.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        oleh <strong className="text-slate-700">{store.ownerName}</strong> • {store.category}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Open PO</span>
                  </span>
                </div>

                {/* Info Bar PO Schedule */}
                <div className="bg-slate-50 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-[10px] text-slate-600 border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="truncate">Sampai: <strong>{store.deliveryDate} ({store.deliveryTime})</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Tutup PO: <strong>{store.cutoffTime}</strong></span>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {storeMenus.length} Menu Pilihan
                  </span>
                  <div className="flex items-center gap-1 text-brand-700 font-extrabold group-hover:translate-x-1 transition-transform text-xs">
                    <span>Lihat Menu & Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Seller Onboarding Card in Bottom */}
      <div className="px-4 pt-3">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-orange-200">
              👩‍🍳
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-orange-950">
                Punya Masakan Enak? Buka Jastip Sendiri!
              </h4>
              <p className="text-[11px] text-orange-800/80 leading-tight mt-0.5">
                Bikin lapak jastipmu gratis dalam 30 detik. Dapat link khusus lapak buat di-share ke WA!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onOpenRegisterStore}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-md shadow-orange-200 flex items-center justify-center gap-1.5 bouncy-tap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka Lapak Baru</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="bg-white hover:bg-orange-50 text-slate-700 border border-orange-200 font-bold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 bouncy-tap"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Kelola Lapak Saya</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
