import React, { useState } from 'react'
import { X, QrCode, Building2, CheckCircle2, Send, Copy, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  menus, 
  settings, 
  onSubmitOrder 
}) {
  const [buyerName, setBuyerName] = useState('')
  const [buyerNotes, setBuyerNotes] = useState('')
  const [payMethod, setPayMethod] = useState('qris') // 'qris' | 'bank'
  const [isPaid, setIsPaid] = useState(true)
  const [copiedBank, setCopiedBank] = useState(false)

  if (!isOpen) return null

  // Calculate items and total
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
    navigator.clipboard.writeText(settings.bankNumber)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!buyerName.trim()) {
      alert("Isi nama kamu dulu yaa!")
      return
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })
    } catch (_) {}

    onSubmitOrder({
      name: buyerName.trim(),
      notes: buyerNotes.trim(),
      method: payMethod === 'qris' ? 'QRIS' : `Transfer ${settings.bankName}`,
      isPaid,
      items,
      total
    })

    // Format WhatsApp message
    const itemsLines = items.map(i => `• ${i.qty}x ${i.name} (Rp ${i.subtotal.toLocaleString('id-ID')})`).join('\n')
    let text = `Halo! Mau konfirmasi pesanan jastip *${settings.storeTitle}* yaa ✨\n\n`
    text += `📅 *Pengantaran:* ${settings.deliveryDate} (${settings.deliveryTime})\n`
    text += `📍 *Ambil di:* ${settings.pickupLocation}\n\n`
    text += `👤 *Nama:* ${buyerName.trim()}\n`
    text += `📋 *Pesanan:* \n${itemsLines}\n\n`
    if (buyerNotes.trim()) {
      text += `📝 *Catatan:* ${buyerNotes.trim()}\n\n`
    }
    text += `💵 *Total:* Rp ${total.toLocaleString('id-ID')}\n`
    text += `💳 *Status Bayar:* ${isPaid ? 'SUDAH BAYAR VIA QRIS / TRANSFER ✅' : 'Belum Bayar (Segera Transfer)'}\n\n`
    text += `Mohon dicatat yaa, terima kasih banyak! 🙏`

    // Open WhatsApp URL
    const waUrl = `https://wa.me/${settings.sellerPhone}?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[34px] max-w-sm w-full p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <span>🛍️</span>
            <span>Selesaikan Pesanan & Bayar</span>
          </h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center text-sm bouncy-tap"
          >
            <X className="w-4 h-4" />
          </button>
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
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Scan QRIS: <strong className="text-slate-800">{settings.paymentName}</strong></span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">All E-Wallet</span>
              </div>
              
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shadow-inner">
                <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-white text-center">
                  <QrCode className="w-10 h-10 mb-1 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-wider">QRIS STANDAR</span>
                  <span className="text-[8px] opacity-75 font-mono">{settings.qrisNmid}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
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
                  <span className="font-bold text-slate-800 block">{settings.bankName} • {settings.bankNumber}</span>
                  <span className="text-[10px] text-slate-500">a/n {settings.paymentName}</span>
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
            <span>Kirim Pesanan ke WhatsApp Penjual</span>
          </button>
        </div>

      </div>
    </div>
  )
}
