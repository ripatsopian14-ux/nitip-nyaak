import React, { useState } from 'react'
import { Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react'

export default function AdminPinModal({ isOpen, onClose, onAuthSuccess, correctPin = "1234" }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const next = pin + num
      setPin(next)
      setError(false)
      if (next.length === 4) {
        verifyPin(next)
      }
    }
  }

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1))
    setError(false)
  }

  const verifyPin = (entered) => {
    if (entered === correctPin) {
      onAuthSuccess()
    } else {
      setError(true)
      setTimeout(() => {
        setPin('')
      }, 600)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[38px] max-w-xs w-full p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
        
        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-inner mt-2">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
            Akses Penjual (Mamah)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan PIN 4-digit untuk kelola menu & rekap pesanan
          </p>
        </div>

        {/* PIN Indicators (4 Dots) */}
        <div className="flex gap-3 justify-center py-2">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > i 
                  ? (error ? 'bg-rose-500 scale-110' : 'bg-brand-600 scale-110 shadow-sm shadow-brand-200') 
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold animate-bounce">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>PIN salah, coba lagi!</span>
          </div>
        )}

        <div className="text-[10px] text-slate-400">
          PIN default: <span className="font-bold text-slate-600">{correctPin}</span>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num.toString())}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-base transition-all bouncy-tap border border-slate-200/60"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 font-bold text-xs transition-all bouncy-tap flex items-center justify-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-base transition-all bouncy-tap border border-slate-200/60"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-all bouncy-tap flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

      </div>
    </div>
  )
}
