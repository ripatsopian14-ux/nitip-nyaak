import React, { useState } from 'react'
import { X, Store, Sparkles, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function RegisterStoreModal({ isOpen, onClose, onRegisterSuccess }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [category, setCategory] = useState('Masakan Rumahan 🍲')
  const [sellerPhone, setSellerPhone] = useState('')
  const [bankName, setBankName] = useState('BCA')
  const [bankNumber, setBankNumber] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [icon, setIcon] = useState('🍲')

  if (!isOpen) return null

  // Auto-slug generator from store name
  const handleNameChange = (val) => {
    setName(val)
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30)
    setSlug(generatedSlug)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !ownerName.trim() || !adminPin.trim()) {
      alert("Mohon lengkapi nama lapak, nama penjual, dan PIN 4-digit yaa!")
      return
    }

    if (adminPin.length !== 4) {
      alert("PIN harus berupa 4 digit angka!")
      return
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `lapak-${Date.now()}`

    const newStore = {
      id: cleanSlug,
      slug: cleanSlug,
      name: name.trim(),
      ownerName: ownerName.trim(),
      category: category.trim(),
      deliveryDate: "Besok Siang",
      deliveryTime: "11:45 WIB",
      cutoffTime: "Malam ini, jam 21:00",
      pickupLocation: "Pantry Lantai 3",
      sellerPhone: sellerPhone.trim() || "6281234567890",
      paymentName: ownerName.trim(),
      bankName: bankName.trim(),
      bankNumber: bankNumber.trim() || "123456789",
      qrisNmid: "ID" + Math.floor(10000000000 + Math.random() * 90000000000),
      adminPin: adminPin.trim(),
      icon: icon || '🍲',
      badge: "Lapak Baru ✨",
      isOpen: true
    }

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
    } catch (_) {}

    onRegisterSuccess(newStore)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[34px] max-w-sm w-full p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-base">
              🏪
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Buka Lapak Jastip Baru</h3>
              <p className="text-[10px] text-slate-400">Gratis & dapat link khusus lapakmu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center text-sm bouncy-tap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nama Lapak Jastip</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Pempek Asli Mamah Latif"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              required
            />
            {slug && (
              <span className="text-[10px] text-brand-600 block mt-1 font-mono">
                🔗 Link Lapak: .../#/toko/{slug}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nama Pemilik / Chef</label>
              <input 
                type="text" 
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Contoh: Mamah Latif"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pilih Icon Emoji</label>
              <select 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500 text-xs font-medium"
              >
                <option value="🍲">🍲 Masakan / Sup</option>
                <option value="🥟">🥟 Pempek / Dimsum</option>
                <option value="🍗">🍗 Ayam / Daging</option>
                <option value="🍱">🍱 Bento / Nasi</option>
                <option value="🍰">🍰 Kue / Dessert</option>
                <option value="🥤">🥤 Minuman Segar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">No. WhatsApp Kamu</label>
            <input 
              type="text" 
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              placeholder="Contoh: 6281234567890"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nama Bank</label>
              <input 
                type="text" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="BCA / Mandiri / Jago"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nomor Rekening</label>
              <input 
                type="text" 
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
                placeholder="Contoh: 5210984421"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-1">
            <label className="block text-amber-950 font-bold text-xs">Buat PIN 4-Digit Lapakmu</label>
            <span className="text-[10px] text-amber-800 block">
              PIN ini dipakai saat kamu mau atur menu atau melihat rekap pesanan pembeli.
            </span>
            <input 
              type="text" 
              maxLength={4}
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 1234"
              className="w-full text-center font-mono font-black text-sm tracking-widest bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-200 bouncy-tap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buka Lapak Sekarang 🎉</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
