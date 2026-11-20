import React from 'react'
import { Sparkles, Download, X, CheckCircle, ArrowRight } from 'lucide-react'

export default function UpdateModal({ 
  isOpen, 
  onClose, 
  updateInfo 
}) {
  if (!isOpen || !updateInfo) return null

  const handleDownload = () => {
    if (updateInfo.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_blank')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[32px] max-w-sm w-full p-6 shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                v{updateInfo.version}
              </span>
              <span className="text-[10px] text-slate-400">
                {updateInfo.releaseDate || 'Terbaru'}
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
              Update Baru Tersedia!
            </h3>
          </div>
        </div>

        {/* Changelog Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
          <p className="text-xs font-bold text-slate-700">
            ✨ Yang Baru di Versi Ini:
          </p>
          <ul className="space-y-1.5">
            {updateInfo.changelog?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 bouncy-tap"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Update APK Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1.5"
          >
            Nanti Saja
          </button>
        </div>

      </div>
    </div>
  )
}
