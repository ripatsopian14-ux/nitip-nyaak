import React from 'react'
import { Home, Search, Plus, ChefHat, HelpCircle } from 'lucide-react'

export default function BottomNav({ 
  viewMode, 
  onGoHome, 
  onFocusSearch, 
  onOpenRegisterStore, 
  onOpenAdmin, 
  onOpenFeedback 
}) {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Beranda */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all bouncy-tap ${
            viewMode === 'directory' 
              ? 'text-brand-600 font-extrabold' 
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${viewMode === 'directory' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Beranda</span>
        </button>

        {/* 2. Cari / Kategori */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all bouncy-tap text-slate-400 hover:text-slate-600 font-medium"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Cari</span>
        </button>

        {/* 3. Center Elevated Action: Buka Lapak */}
        <div className="relative -mt-6 flex flex-col items-center">
          <button
            onClick={onOpenRegisterStore}
            aria-label="Buka Lapak Baru"
            className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 border-4 border-[#FAFAF7] bouncy-tap hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[10px] font-bold text-slate-700 mt-1">Buka Lapak</span>
        </div>

        {/* 4. Lapak Saya (Dapur Penjual) */}
        <button
          onClick={onOpenAdmin}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all bouncy-tap ${
            viewMode === 'admin' 
              ? 'text-brand-600 font-extrabold' 
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <ChefHat className={`w-5 h-5 transition-transform ${viewMode === 'admin' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Lapak Saya</span>
        </button>

        {/* 5. Bantuan / Feedback */}
        <button
          onClick={onOpenFeedback}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all bouncy-tap text-slate-400 hover:text-slate-600 font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Bantuan</span>
        </button>

      </div>
    </nav>
  )
}
