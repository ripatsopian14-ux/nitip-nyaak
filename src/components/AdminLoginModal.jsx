import React, { useState } from 'react'
import { X, Lock, Store, AlertCircle, Phone, ArrowLeft, CheckCircle2, KeyRound, MessageCircle, RefreshCw } from 'lucide-react'
import { buildWhatsAppUrl, toLocalPhone } from '../utils/phoneHelper'

// Helper: Mask phone number for security clue (e.g. 0812••••7890)
function maskPhone(p) {
  if (!p) return 'Nomor tidak terdaftar'
  const clean = toLocalPhone(p)
  if (clean.length < 8) return clean
  return clean.slice(0, 4) + '••••' + clean.slice(-4)
}

export default function AdminLoginModal({ isOpen, onClose, stores, onLoginSuccess, onUpdateStore }) {
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  // Forgot PIN State
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [isUpdatingPin, setIsUpdatingPin] = useState(false)
  const [showCurrentPin, setShowCurrentPin] = useState(false)

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
    setIsForgotMode(false)
    setPhoneInput('')
    setPhoneError('')
    setIsVerified(false)
    setNewPin('')
    setShowCurrentPin(false)
    onClose()
  }

  const verifyPin = (entered) => {
    if (currentStore && entered === (currentStore.adminPin || "1234")) {
      setPin('')
      setError(false)
      onLoginSuccess(currentStore)
      handleClose()
    } else {
      setError(true)
      setTimeout(() => {
        setPin('')
      }, 600)
    }
  }

  // Handle WhatsApp Verification for Forgot PIN
  const handleVerifyPhone = (e) => {
    e.preventDefault()
    setPhoneError('')

    const cleanInput = toLocalPhone(phoneInput)
    const cleanStorePhone = toLocalPhone(currentStore?.sellerPhone)

    if (!cleanInput) {
      setPhoneError("Mohon masukkan nomor WhatsApp kamu.")
      return
    }

    if (cleanInput === cleanStorePhone) {
      setIsVerified(true)
      setPhoneError('')
    } else {
      setPhoneError("Nomor WhatsApp tidak cocok dengan nomor pemilik lapak ini!")
    }
  }

  // Handle Save New PIN
  const handleSaveNewPin = async (e) => {
    e.preventDefault()
    if (newPin.length !== 4) {
      alert("PIN baru harus 4 digit angka!")
      return
    }

    try {
      setIsUpdatingPin(true)
      const updated = {
        ...currentStore,
        adminPin: newPin
      }
      if (onUpdateStore) {
        await onUpdateStore(updated)
      }
      alert(`🎉 PIN lapak "${currentStore.name}" berhasil diubah menjadi: ${newPin}`)
      onLoginSuccess(updated)
      handleClose()
    } catch (err) {
      alert("Gagal mengubah PIN: " + err.message)
    } finally {
      setIsUpdatingPin(false)
    }
  }

  // Send PIN to WhatsApp
  const handleSendPinToWhatsApp = () => {
    const text = `Halo ${currentStore.ownerName}! 👋\n\nPengingat PIN untuk lapak *${currentStore.name}* adalah: *${currentStore.adminPin || '1234'}*\n\nJangan bagikan PIN ini ke orang yang tidak berkepentingan yaa! ✨`
    const waUrl = buildWhatsAppUrl(currentStore.sellerPhone, text)
    if (waUrl && waUrl !== '#') {
      window.open(waUrl, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[36px] max-w-sm w-full p-6 shadow-2xl flex flex-col items-center text-center space-y-4 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ===================== VIEW 1: NORMAL PIN KEYPAD ===================== */}
        {!isForgotMode ? (
          <>
            {/* Header Icon */}
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-inner mt-1">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Masuk ke Lapak Kamu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih lapakmu & masukkan PIN 4-digit
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

            {/* Forgot PIN Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true)
                  setPhoneError('')
                  setIsVerified(false)
                }}
                className="text-xs text-brand-600 hover:text-brand-700 font-bold hover:underline inline-flex items-center gap-1 bouncy-tap"
              >
                <KeyRound className="w-3 h-3" />
                <span>Lupa PIN Lapak?</span>
              </button>
            </div>
          </>
        ) : (
          /* ===================== VIEW 2: FORGOT PIN & WHATSAPP VERIFICATION ===================== */
          <div className="w-full space-y-4 text-left">
            
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <button 
                type="button"
                onClick={() => setIsForgotMode(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Pemulihan PIN Lapak
                </h4>
                <p className="text-[11px] text-slate-400">
                  {currentStore?.name} ({currentStore?.ownerName})
                </p>
              </div>
            </div>

            {!isVerified ? (
              /* Step 1: Input WhatsApp Number to Verify Ownership */
              <form onSubmit={handleVerifyPhone} className="space-y-3.5">
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-950">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    Verifikasi Nomor Pemilik
                  </p>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Untuk keamanan lapak, masukkan nomor WhatsApp yang kamu daftarkan saat membuka lapak ini.
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-amber-700">
                    Petunjuk nomor: <strong>{maskPhone(currentStore?.sellerPhone)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Kamu:
                  </label>
                  <input 
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                {phoneError && (
                  <div className="text-rose-600 text-xs font-semibold flex items-center gap-1 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-brand-200 flex items-center justify-center gap-1.5 bouncy-tap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verifikasi Nomor WhatsApp</span>
                </button>
              </form>
            ) : (
              /* Step 2: Ownership Verified! Show Options to Reset or View PIN */
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Nomor Terverifikasi! 🎉
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kamu terbukti pemilik resmi lapak <strong>{currentStore?.name}</strong>.
                  </p>
                </div>

                {/* Show Current PIN */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[11px] text-slate-500 block">PIN Lapak Kamu Saat Ini:</span>
                  <div className="text-lg font-black font-mono tracking-widest text-slate-900">
                    {showCurrentPin ? currentStore?.adminPin || '1234' : '••••'}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg bouncy-tap"
                    >
                      {showCurrentPin ? 'Sembunyikan' : 'Tampilkan PIN'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendPinToWhatsApp}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 bouncy-tap"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Kirim ke WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Or Set New 4-Digit PIN */}
                <form onSubmit={handleSaveNewPin} className="space-y-2.5 pt-1 text-left">
                  <label className="block text-xs font-bold text-slate-700">
                    Atau Buat PIN 4-Digit Baru:
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="PIN Baru"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      disabled={newPin.length !== 4 || isUpdatingPin}
                      className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl bouncy-tap"
                    >
                      {isUpdatingPin ? 'Menyimpan...' : 'Ganti PIN'}
                    </button>
                  </div>
                </form>

                {/* Direct Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess(currentStore)
                    handleClose()
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-md bouncy-tap"
                >
                  Langsung Masuk ke Lapak Sekarang →
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
