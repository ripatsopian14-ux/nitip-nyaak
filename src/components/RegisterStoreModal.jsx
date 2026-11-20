import React, { useState } from 'react'
import { X, Store, Sparkles, CheckCircle2, QrCode, Upload, Calendar, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'
import { compressImage } from '../utils/imageHelper'
import { toDateInputValue, formatDateIndo, getRelativeDateValue } from '../utils/timeHelper'
import { toWhatsAppNumber } from '../utils/phoneHelper'

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
  const [qrisImage, setQrisImage] = useState(null)
  const [uploadingQris, setUploadingQris] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(() => getRelativeDateValue(1))
  const [deliveryTime, setDeliveryTime] = useState('11:45')
  const [cutoffTime, setCutoffTime] = useState('21:00')
  const [pickupLocation, setPickupLocation] = useState('Pantry Lantai 3')

  if (!isOpen) return null

  const handleQrisUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingQris(true)
      const dataUrl = await compressImage(file, 600, 600, 0.85)
      setQrisImage(dataUrl)
    } catch (err) {
      alert("Gagal membaca gambar QRIS: " + (err.message || 'File tidak didukung'))
    } finally {
      setUploadingQris(false)
      e.target.value = ''
    }
  }

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
      deliveryDate: formatDateIndo(deliveryDate),
      deliveryTime: `${deliveryTime} WIB`,
      cutoffTime: `Malam ini, jam ${cutoffTime} WIB`,
      pickupLocation: pickupLocation.trim() || "Pantry Lantai 3",
      sellerPhone: toWhatsAppNumber(sellerPhone) || "6281234567890",
      paymentName: ownerName.trim(),
      bankName: bankName.trim(),
      bankNumber: bankNumber.trim() || "123456789",
      qrisImage: qrisImage || null,
      qrisNmid: qrisImage || ("ID" + Math.floor(10000000000 + Math.random() * 90000000000)),
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold text-xs">No. WhatsApp Kamu</label>
              {sellerPhone && (
                <span className="text-[10px] text-emerald-600 font-bold font-mono">
                  WA: +{toWhatsAppNumber(sellerPhone)}
                </span>
              )}
            </div>
            <input 
              type="text" 
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              placeholder="Ketik 08xx atau 628xx..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-mono font-medium"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * Bebas ketik 08xx atau 628xx (otomatis disesuaikan ke format WhatsApp).
            </p>
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

          {/* Optional QRIS Upload */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Foto Barcode QRIS (Opsional)</span>
              </label>
              {qrisImage && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Foto Terpilih ✅
                </span>
              )}
            </div>
            
            {qrisImage ? (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-200">
                <img src={qrisImage} alt="QRIS" className="w-12 h-12 object-contain rounded-lg border border-slate-200" />
                <div className="flex-1 text-[11px] text-slate-500">
                  <span>Foto QRIS siap dipasang di kasir.</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setQrisImage(null)}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 p-1"
                >
                  Batal
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-semibold text-slate-600">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>{uploadingQris ? 'Memproses...' : '+ Unggah Foto QRIS (Bisa juga nanti)'}</span>
                <input type="file" accept="image/*" onChange={handleQrisUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Jadwal PO & Jam Tutup (Date & Time Picker) */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Jadwal Makanan & Jam Cut-Off</span>
            </span>

            <div>
              <label className="block text-slate-500 text-[10px] font-semibold mb-0.5">Tanggal Makanan Datang</label>
              <input 
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-bold focus:outline-none focus:border-brand-500 text-xs shadow-xs cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-500 text-[10px] font-semibold mb-0.5">Jam Tiba ⏰</label>
                <input 
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-bold focus:outline-none focus:border-brand-500 text-xs shadow-xs cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-semibold mb-0.5">Tutup PO (Cut-Off) ⏳</label>
                <input 
                  type="time"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-bold focus:outline-none focus:border-brand-500 text-xs shadow-xs cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-semibold mb-0.5">Titik Ambil Makanan</label>
              <input 
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Contoh: Pantry Lt. 3 / Meja Resepsionis"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs shadow-xs"
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
