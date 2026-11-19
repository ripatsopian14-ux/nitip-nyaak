import React, { useState } from 'react'
import { X, Lock, Store, AlertCircle } from 'lucide-react'

export default function AdminLoginModal({ isOpen, onClose, stores, onLoginSuccess }) {
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0]

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

  const handleClose = () => {
    setPin('')
    setError(false)
    onClose()
  }

  const verifyPin = (entered) => {
    if (currentStore && entered === (currentStore.adminPin || "1234")) {
      setPin('')
      setError(false)
      onLoginSuccess(currentStore)
      onClose()
    } else {
      setError(true)
      setTimeout(() => {
        setPin('')
      }, 600)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[38px] max-w-xs w-full p-6 shadow-2xl flex flex-col items-center text-center space-y-3.5">
        
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-inner mt-1">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
            Masuk ke Lapak Kamu
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih tokomu & masukkan PIN 4-digit
          </p>
        </div>

        {/* Store Selector */}
        <div className="w-full text-left">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Pilih Lapak Jastip:</label>
          <select 
            value={selectedStoreId} 
            onChange={(e) => {
              setSelectedStoreId(e.target.value)
              setPin('')
              setError(false)
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
          >
            {stores.map(s => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name} ({s.ownerName})
              </option>
            ))}
          </select>
        </div>

        {/* PIN Indicators */}
        <div className="flex gap-3 justify-center py-1">
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
          <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold animate-bounce">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>PIN salah untuk {currentStore?.name}!</span>
          </div>
        )}

        <div className="text-[10px] text-slate-400">
          PIN Lapak ini: <span className="font-bold text-slate-600">{currentStore?.adminPin || "1234"}</span>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num.toString())}
              className="h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-base transition-all bouncy-tap border border-slate-200/60"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClose}
            className="h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 font-bold text-xs transition-all bouncy-tap flex items-center justify-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-base transition-all bouncy-tap border border-slate-200/60"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-all bouncy-tap flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

      </div>
    </div>
  )
}
