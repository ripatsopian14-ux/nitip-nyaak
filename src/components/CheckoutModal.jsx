import React, { useState, useEffect } from 'react'
import { X, QrCode, Building2, CheckCircle2, Send, Copy, Check, Download, Upload, Clock, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { compressImage } from '../utils/imageHelper'

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  menus, 
  store, 
  onSubmitOrder 
}) {
  const [buyerName, setBuyerName] = useState('')
  const [buyerNotes, setBuyerNotes] = useState('')
  const [payMethod, setPayMethod] = useState('qris') // 'qris' | 'bank'
  const [isPaid, setIsPaid] = useState(true)
  const [copiedBank, setCopiedBank] = useState(false)
  const [proofImage, setProofImage] = useState(null)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 mins countdown

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(900)
      setProofImage(null)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen || !store) return null

  // Calculate items and total for this store
  const items = []
  let total = 0
  for (const [id, qty] of Object.entries(cart)) {
    const m = menus.find(menu => menu.id === parseInt(id))
    if (m && qty > 0) {
      const subtotal = m.price * qty
      total += subtotal
      items.push({ id: m.id, name: m.name, qty, price: m.price, subtotal })
    }
  }

  const handleCopyBank = () => {
    navigator.clipboard.writeText(store.bankNumber)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2000)
  }

  const handleProofUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingProof(true)
      const dataUrl = await compressImage(file, 700, 700, 0.85)
      setProofImage(dataUrl)
      setIsPaid(true)
    } catch (err) {
      alert("Gagal membaca bukti pembayaran: " + (err.message || 'Format tidak didukung'))
    } finally {
      setUploadingProof(false)
      e.target.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!buyerName.trim()) {
      alert("Isi nama kamu dulu yaa!")
      return
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })
    } catch (_) {}

    onSubmitOrder({
      storeId: store.id,
      name: buyerName.trim(),
      notes: buyerNotes.trim(),
      method: payMethod === 'qris' ? 'QRIS' : `Transfer ${store.bankName}`,
      isPaid,
      proofImage,
      items,
      total
    })

    // Format WhatsApp message to THIS seller
    const itemsLines = items.map(i => `• ${i.qty}x ${i.name} (Rp ${i.subtotal.toLocaleString('id-ID')})`).join('\n')
    let text = `Halo! Mau konfirmasi pesanan jastip *${store.name}* yaa ✨\n\n`
    text += `📅 *Pengantaran:* ${store.deliveryDate} (${store.deliveryTime})\n`
    text += `📍 *Ambil di:* ${store.pickupLocation}\n\n`
    text += `👤 *Nama:* ${buyerName.trim()}\n`
    text += `📋 *Pesanan:* \n${itemsLines}\n\n`
    if (buyerNotes.trim()) {
      text += `📝 *Catatan:* ${buyerNotes.trim()}\n\n`
    }
    text += `💵 *Total:* Rp ${total.toLocaleString('id-ID')}\n`
    text += `💳 *Status Bayar:* ${isPaid ? 'SUDAH BAYAR VIA QRIS / TRANSFER ✅' : 'Belum Bayar (Segera Transfer)'}\n`
    if (proofImage) {
      text += `📸 *Bukti Struk Transfer:* Sudah diunggah di web & saya lampirkan di sini yaa 🙏\n\n`
    } else {
      text += `\n`
    }
    text += `Mohon dicatat yaa, terima kasih banyak! 🙏`

    const waUrl = `https://wa.me/${store.sellerPhone}?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[34px] max-w-sm w-full p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🛍️</span>
              <span>Selesaikan Pesanan & Bayar</span>
            </h3>
            <span className="text-[10px] text-slate-400">Jastip di {store.name}</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center text-sm bouncy-tap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Countdown Timer Bar */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Selesaikan Bayar Dalam:</span>
          </div>
          <div className="font-mono font-black text-amber-950 bg-white px-2 py-0.5 rounded-lg border border-amber-300 shadow-sm text-xs">
            {formatTimer(timeLeft)}
          </div>
        </div>

        {/* Order Summary */}
        <div className="max-h-28 overflow-y-auto space-y-1 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-slate-700 py-0.5">
              <span>{item.qty}x {item.name}</span>
              <span className="font-bold text-slate-900">Rp {item.subtotal.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nama Kamu / Panggilan</label>
            <input 
              type="text" 
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Misal: Ripat (Lantai 2)" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Catatan Makanan (Opsional)</label>
            <input 
              type="text" 
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="Misal: Sambel dipisah, tanpa cabe" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs"
            />
          </div>
        </div>

        {/* Payment Method Switcher */}
        <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
          <span className="block text-slate-700 font-extrabold text-[11px]">Pilih Metode Pembayaran:</span>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => setPayMethod('qris')}
              className={`p-2.5 rounded-2xl border-2 font-bold text-center flex flex-col items-center gap-1 transition-all bouncy-tap ${
                payMethod === 'qris' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span className="text-[11px]">QRIS (Scan Langsung)</span>
            </button>

            <button 
              type="button"
              onClick={() => setPayMethod('bank')}
              className={`p-2.5 rounded-2xl border-2 font-bold text-center flex flex-col items-center gap-1 transition-all bouncy-tap ${
                payMethod === 'bank' 
                  ? 'border-brand-500 bg-brand-50 text-brand-900' 
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <Building2 className="w-5 h-5 text-brand-600" />
              <span className="text-[11px]">Transfer Bank</span>
            </button>
          </div>

          {/* QRIS Display Box */}
          {payMethod === 'qris' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Scan QRIS: <strong className="text-slate-800">{store.paymentName || store.ownerName}</strong></span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">All E-Wallet & M-Banking</span>
              </div>
              
              {store.qrisImage ? (
                <div className="space-y-2">
                  <div className="w-48 h-48 mx-auto bg-white p-2.5 rounded-2xl border-2 border-emerald-400 shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={store.qrisImage} 
                      alt={`QRIS ${store.name}`} 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-0.5">
                    <a 
                      href={store.qrisImage} 
                      download={`qris-${store.slug || 'lapak'}.jpg`}
                      className="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 bouncy-tap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Simpan Foto QRIS</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Buka di HP? Simpan foto di atas, lalu buka BCA / GoPay / ShopeePay & bayar dari galeri foto.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-center space-y-1.5">
                  <QrCode className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-amber-900">Penjual Belum Mengunggah QRIS</p>
                  <p className="text-[11px] text-amber-700 leading-snug">
                    Silakan pilih metode <strong>Transfer Bank</strong> di atas, atau minta QRIS langsung ke penjual via WhatsApp yaa!
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                Total pas: <strong className="text-slate-900 text-xs font-black">Rp {total.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          )}

          {/* Bank Display Box */}
          {payMethod === 'bank' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <span className="text-slate-400 text-[10px] block">Transfer ke Rekening:</span>
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">{store.bankName} • {store.bankNumber}</span>
                  <span className="text-[10px] text-slate-500">a/n {store.paymentName || store.ownerName}</span>
                </div>
                <button 
                  type="button"
                  onClick={handleCopyBank} 
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 bouncy-tap"
                >
                  {copiedBank ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-500 text-center pt-1">
                Total pas: <strong className="text-slate-900 font-black">Rp {total.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          )}

          {/* Upload Proof of Payment Box */}
          <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>Unggah Bukti Transfer / Struk QRIS:</span>
              </span>
              {proofImage ? (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Struk Terlampir ✅
                </span>
              ) : (
                <span className="text-[9px] text-slate-400">
                  Opsional tapi disarankan
                </span>
              )}
            </div>

            {proofImage ? (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                <img 
                  src={proofImage} 
                  alt="Bukti Transfer" 
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                />
                <div className="flex-1 text-left">
                  <span className="text-xs font-bold text-emerald-900 block leading-tight">Bukti Siap Dicek Penjual!</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Penjual bisa verifikasi langsung di dashboard.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProofImage(null)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  title="Hapus foto struk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-100/80 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition-colors bouncy-tap">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>{uploadingProof ? 'Mengunggah struk...' : 'Pilih Foto / Screenshot Struk'}</span>
                <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Checkbox Confirmed */}
          <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-700 font-medium cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isPaid} 
              onChange={(e) => setIsPaid(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600" 
            />
            <span>Saya sudah bayar / scan QRIS sekarang</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2 border-t border-slate-100">
          <button 
            type="button"
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 bouncy-tap"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Pesanan ke WhatsApp {store.ownerName}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
