import React, { useState } from 'react'
import { 
  Settings, 
  ChefHat, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  MessageCircle, 
  CheckCircle2, 
  Clock,
  Eye,
  LogOut,
  Calendar,
  MapPin,
  ExternalLink,
  Upload,
  Download,
  X
} from 'lucide-react'
import { compressImage } from '../utils/imageHelper'

export default function AdminPage({ 
  store, 
  onUpdateStore, 
  menus, 
  onDeleteMenu, 
  onOpenAddMenu, 
  orders, 
  onTogglePayment,
  onExitToBuyer,
  onLogout
}) {
  const [activeSubTab, setActiveSubTab] = useState('setting') // 'setting' | 'rekap'
  const [orderFilter, setOrderFilter] = useState('all') // 'all' | 'unpaid' | 'paid'
  const [copiedBroadcast, setCopiedBroadcast] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [uploadingQris, setUploadingQris] = useState(false)
  const [selectedProofOrder, setSelectedProofOrder] = useState(null)

  const handleQrisUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingQris(true)
      const compressedDataUrl = await compressImage(file, 600, 600, 0.85)
      onUpdateStore({
        ...store,
        qrisImage: compressedDataUrl,
        qrisNmid: compressedDataUrl
      })
      alert("✅ Foto QRIS berhasil diunggah! Sekarang pembeli bisa langsung scan QRIS saat checkout.")
    } catch (err) {
      alert("Gagal mengunggah foto: " + (err.message || 'Format tidak didukung'))
    } finally {
      setUploadingQris(false)
      e.target.value = ''
    }
  }

  const handleRemoveQris = () => {
    if (confirm("Hapus foto QRIS dari lapak ini?")) {
      onUpdateStore({
        ...store,
        qrisImage: null,
        qrisNmid: ''
      })
    }
  }

  // Filter menus & orders only for THIS store
  const storeMenus = menus.filter(m => m.storeId === store.id)
  const storeOrders = orders.filter(o => o.storeId === store.id)

  // Calculations for Rekap
  let totalRevenue = 0
  let totalPaid = 0
  let totalUnpaid = 0
  let totalPortions = 0
  let paidCount = 0
  let portionMap = {}

  storeOrders.forEach(order => {
    totalRevenue += order.total
    if (order.isPaid) {
      totalPaid += order.total
      paidCount++
    } else {
      totalUnpaid += order.total
    }

    order.items.forEach(it => {
      totalPortions += it.qty
      portionMap[it.name] = (portionMap[it.name] || 0) + it.qty
    })
  })

  const paymentRatioPct = storeOrders.length > 0 ? (paidCount / storeOrders.length) * 100 : 0

  // Filtered orders
  let displayOrders = storeOrders
  if (orderFilter === 'paid') displayOrders = storeOrders.filter(o => o.isPaid)
  if (orderFilter === 'unpaid') displayOrders = storeOrders.filter(o => !o.isPaid)

  // Direct link to this store
  const storeDirectUrl = `${window.location.origin}/#/toko/${store.slug || store.id}`

  // Copy Broadcast WhatsApp text
  const handleCopyBroadcast = () => {
    const menuListText = storeMenus.map(m => `${m.icon} *${m.name}* - Rp ${m.price.toLocaleString('id-ID')}`).join('\n')

    const text = `📢 *OPEN PO JASTIP ${store.name.toUpperCase()}!* ✨\n\nHalo temen-temen! ${store.ownerName} mau open jastip nih:\n\n📅 *Untuk Kedatangan:* ${store.deliveryDate}\n⏰ *Jam Tiba:* ${store.deliveryTime}\n📍 *Lokasi Ambil:* ${store.pickupLocation}\n⏳ *Batas Pesan:* ${store.cutoffTime}\n💳 *Pembayaran:* Bisa QRIS / Transfer ${store.bankName}\n\n🍛 *Pilihan Menu:*\n${menuListText || '(Menu sedang disiapkan)'}\n\n👇 *Biar gak lupa & praktis, klik link lapak ini buat langsung pilih menu & bayar:*\n${storeDirectUrl}\n\n_Pesan lewat link di atas yaa biar otomatis terdata & gak kehabisan slot!_`

    navigator.clipboard.writeText(text)
    setCopiedBroadcast(true)
    setTimeout(() => setCopiedBroadcast(false), 2500)
  }

  const handleCopyLinkOnly = () => {
    navigator.clipboard.writeText(storeDirectUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Remind unpaid order
  const handleRemindPayment = (name, total) => {
    const text = `Halo ${name}! Mau ngingetin pesanan jastip makan siang besok yaa di ${store.name} (Total: Rp ${total.toLocaleString('id-ID')}). Kalau belum transfer / scan QRIS, monggo bisa dikirim bukti transfernya yaa, makasii! 🙏✨`
    navigator.clipboard.writeText(text)
    alert(`Pesan pengingat tagihan untuk ${name} berhasil disalin! Tinggal paste di WA.`)
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Admin Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {store.icon || '🍲'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base md:text-lg text-slate-900">
                {store.name}
              </h2>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                Dashboard Lapak
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Pemilik: <strong className="text-slate-800">{store.ownerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={onExitToBuyer}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition-all bouncy-tap"
          >
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>Lihat Menu Pembeli</span>
          </button>

          <button 
            onClick={onLogout}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-xl transition-all bouncy-tap"
            title="Keluar / Kunci"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kunci Lapak</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200/60 max-w-md mx-auto">
        <button 
          onClick={() => setActiveSubTab('setting')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'setting' 
              ? 'bg-white text-brand-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Atur Lapak & Menu</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('rekap')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'rekap' 
              ? 'bg-white text-brand-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Rekap Dapur ({storeOrders.length})</span>
        </button>
      </div>

      {/* ==================== SUB-TAB 1: SETTING PO, MENU & QRIS ==================== */}
      {activeSubTab === 'setting' && (
        <div className="space-y-5">
          
          {/* Card Direct Link Share */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-5 md:p-6 rounded-3xl text-white shadow-xl shadow-orange-100/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Link Khusus Lapakmu
                </span>
                <h3 className="font-extrabold text-sm md:text-base">
                  Sebarkan Link Ini ke WhatsApp Teman-Teman
                </h3>
              </div>
              <button 
                onClick={handleCopyLinkOnly}
                className="self-start sm:self-auto text-xs bg-white text-orange-950 font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 bouncy-tap shadow-md"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Link Lapak'}</span>
              </button>
            </div>
            
            <p className="text-xs font-mono text-orange-50 truncate bg-black/20 p-3 rounded-2xl border border-white/10">
              {storeDirectUrl}
            </p>
            <p className="text-xs text-white/80">
              * Ketika teman mengklik link ini, mereka langsung masuk ke lapakmu tanpa harus mencari-cari lagi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Setting Jadwal & Titik Ambil */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Jadwal PO & Lokasi Ambil</span>
                </h4>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Langsung Aktif
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Lapak Jastip</label>
                  <input 
                    type="text" 
                    value={store.name} 
                    onChange={(e) => onUpdateStore({ ...store, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Makanan Datang</label>
                    <input 
                      type="text" 
                      value={store.deliveryDate} 
                      onChange={(e) => onUpdateStore({ ...store, deliveryDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Jam Tiba</label>
                    <input 
                      type="text" 
                      value={store.deliveryTime} 
                      onChange={(e) => onUpdateStore({ ...store, deliveryTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tutup PO (Cut-Off)</label>
                    <input 
                      type="text" 
                      value={store.cutoffTime} 
                      onChange={(e) => onUpdateStore({ ...store, cutoffTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Titik Ambil Makanan</label>
                    <input 
                      type="text" 
                      value={store.pickupLocation} 
                      onChange={(e) => onUpdateStore({ ...store, pickupLocation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">No. WhatsApp Kamu</label>
                  <input 
                    type="text" 
                    value={store.sellerPhone} 
                    onChange={(e) => onUpdateStore({ ...store, sellerPhone: e.target.value })}
                    placeholder="6281234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <label className="block text-slate-600 font-semibold text-xs">PIN Masuk Lapak</label>
                    <span className="text-[10px] text-slate-400">Dipakai untuk membuka lapak ini</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={store.adminPin || "1234"} 
                    onChange={(e) => onUpdateStore({ ...store, adminPin: e.target.value })}
                    className="w-20 text-center font-mono font-bold bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-800 focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Setting Rekening & QRIS */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Data Rekening & QRIS Lapak</span>
                </h4>
                <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  Siap Terima Bayar
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Pemilik Rekening / QRIS</label>
                  <input 
                    type="text" 
                    value={store.paymentName || store.ownerName} 
                    onChange={(e) => onUpdateStore({ ...store, paymentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Bank</label>
                    <input 
                      type="text" 
                      value={store.bankName} 
                      onChange={(e) => onUpdateStore({ ...store, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nomor Rekening</label>
                    <input 
                      type="text" 
                      value={store.bankNumber} 
                      onChange={(e) => onUpdateStore({ ...store, bankNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </div>
                </div>

                {/* QRIS Upload Box */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Foto Barcode QRIS Lapak
                    </span>
                    {store.qrisImage ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        QRIS Aktif ✅
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Belum Ada QRIS
                      </span>
                    )}
                  </div>

                  {store.qrisImage ? (
                    <div className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-emerald-200">
                      <div className="w-20 h-20 bg-white rounded-xl border-2 border-emerald-400 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                        <img 
                          src={store.qrisImage} 
                          alt="QRIS Preview" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1 text-left">
                        <p className="text-[11px] text-slate-600 leading-snug">
                          QRIS ini akan langsung ditampilkan saat pembeli memilih pembayaran QRIS di checkout.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <label 
                            htmlFor="qris-file-input"
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl cursor-pointer inline-flex items-center gap-1 bouncy-tap"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ganti Foto</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleRemoveQris}
                            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 bouncy-tap"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-emerald-300 text-center space-y-2">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {uploadingQris ? 'Sedang memproses gambar...' : 'Unggah Barcode QRIS Lapak'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Screenshot QRIS dari GoPay, BCA, Mandiri, OVO, atau ShopeePay
                        </p>
                      </div>
                      <div>
                        <label 
                          htmlFor="qris-file-input"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-200 cursor-pointer bouncy-tap"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Pilih Foto QRIS</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <input 
                    type="file" 
                    id="qris-file-input" 
                    accept="image/*" 
                    onChange={handleQrisUpload} 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kelola Menu Lapak Ini */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  Daftar Menu {store.name} ({storeMenus.length})
                </h4>
                <p className="text-xs text-slate-400">Menu yang bisa dipilih pembeli saat ini</p>
              </div>
              <button 
                onClick={onOpenAddMenu} 
                className="text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl shadow-sm shadow-brand-200 flex items-center gap-1.5 bouncy-tap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {storeMenus.length === 0 ? (
                <div className="col-span-full text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
                  <p>Lapakmu belum punya menu makanan.</p>
                  <button
                    onClick={onOpenAddMenu}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    + Klik untuk Tambah Menu Sekarang
                  </button>
                </div>
              ) : (
                storeMenus.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">{item.name}</span>
                        <span className="text-[11px] text-slate-500">
                          Rp {item.price.toLocaleString('id-ID')} • Kuota: {item.quota} porsi
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteMenu(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1.5 rounded-lg hover:bg-rose-50 shrink-0 bouncy-tap"
                      title="Hapus Menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 1-Klik Broadcast ke Grup WhatsApp */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-3xl text-white shadow-md shadow-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Siap Ditawarkan ke Grup WA!</span>
              </h4>
              <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">1 Klik Copas</span>
            </div>
            <p className="text-xs text-emerald-50 leading-relaxed">
              Teks pengumuman rapi sudah otomatis terbuat beserta link langsung ke lapakmu.
            </p>
            <button 
              onClick={handleCopyBroadcast}
              className="w-full bg-white text-emerald-800 font-extrabold text-xs md:text-sm py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 bouncy-tap mt-2"
            >
              {copiedBroadcast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBroadcast ? 'Tersalin ke Clipboard! ✅' : 'Salin Teks Broadcast WA'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 2: REKAP DAPUR & STATUS BAYAR ==================== */}
      {activeSubTab === 'rekap' && (
        <div className="space-y-5">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Pemesan</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{storeOrders.length} Orang</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Porsi Masak</span>
              <span className="text-xl font-black text-brand-700 mt-1 block">{totalPortions} Porsi</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Omset</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Sudah Masuk</span>
              <span className="text-base font-black text-emerald-600 mt-1 block">
                Rp {totalPaid.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Status Progress */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs md:text-sm text-slate-800">
                Progress Pembayaran ({paidCount} dari {storeOrders.length} Lunas)
              </h4>
              <span className="text-xs font-bold text-emerald-600">
                {Math.round(paymentRatioPct)}% Terbayar
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${paymentRatioPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Sudah Lunas: <strong>Rp {totalPaid.toLocaleString('id-ID')}</strong>
              </span>
              <span className="text-amber-700 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Belum Lunas: <strong>Rp {totalUnpaid.toLocaleString('id-ID')}</strong>
              </span>
            </div>
          </div>

          {/* Rekapan Yang Harus Dimasak */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-brand-600" />
                <span>Rekapan Masak / Siapin Besok:</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Auto-calculated</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(portionMap).length === 0 ? (
                <p className="text-slate-400 py-3 text-xs col-span-full text-center">Belum ada pesanan masuk</p>
              ) : (
                Object.entries(portionMap).map(([name, qty]) => (
                  <div key={name} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-700 font-semibold">{name}</span>
                    <span className="font-extrabold text-brand-700 bg-brand-100/70 px-3 py-1 rounded-xl text-xs">
                      {qty} porsi
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* List Pemesan & Deteksi Lunas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <h4 className="font-extrabold text-xs md:text-sm text-slate-800">
                Daftar Pemesan di {store.name}
              </h4>
              
              {/* Filter Chips */}
              <div className="flex gap-1.5 text-xs font-bold">
                <button 
                  onClick={() => setOrderFilter('all')} 
                  className={`px-3 py-1 rounded-xl transition-all ${
                    orderFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Semua ({storeOrders.length})
                </button>
                <button 
                  onClick={() => setOrderFilter('unpaid')} 
                  className={`px-3 py-1 rounded-xl transition-all ${
                    orderFilter === 'unpaid' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-amber-700'
                  }`}
                >
                  Belum Lunas ({storeOrders.filter(o => !o.isPaid).length})
                </button>
                <button 
                  onClick={() => setOrderFilter('paid')} 
                  className={`px-3 py-1 rounded-xl transition-all ${
                    orderFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700'
                  }`}
                >
                  Lunas ({storeOrders.filter(o => o.isPaid).length})
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 text-xs pt-1">
              {displayOrders.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-xs">Belum ada pesanan masuk di kategori ini</p>
              ) : (
                displayOrders.map(ord => (
                  <div 
                    key={ord.id} 
                    className={`bg-slate-50 p-4 rounded-2xl border space-y-2.5 transition-all ${
                      ord.isPaid ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs md:text-sm">{ord.name}</span>
                        <span className="text-[11px] text-slate-400 block">{ord.time} • via {ord.method}</span>
                      </div>
                      
                      <button 
                        onClick={() => onTogglePayment(ord.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all bouncy-tap ${
                          ord.isPaid 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span>{ord.isPaid ? '🟢 Lunas' : '🟡 Belum Lunas'}</span>
                        <span className="text-[10px] opacity-60">⇄</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-600 bg-white/90 p-3 rounded-2xl border border-slate-100 space-y-1">
                      {ord.items.map(i => (
                        <div key={i.id} className="py-0.5">• {i.qty}x {i.name}</div>
                      ))}
                      {ord.notes && ord.notes !== '-' && (
                        <div className="text-[11px] text-amber-800 mt-1.5 p-1.5 bg-amber-50 rounded-lg italic">
                          Catatan: "{ord.notes}"
                        </div>
                      )}
                    </div>

                    {/* Struk Bukti Transfer Section */}
                    {ord.proofImage ? (
                      <div 
                        onClick={() => setSelectedProofOrder(ord)}
                        className="flex items-center justify-between p-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={ord.proofImage} 
                            alt="Bukti" 
                            className="w-9 h-9 object-cover rounded-lg border border-emerald-300 shadow-xs" 
                          />
                          <div>
                            <span className="font-extrabold text-emerald-950 text-xs block">
                              📸 Bukti Transfer Terlampir
                            </span>
                            <span className="text-[10px] text-emerald-700 block">
                              Klik untuk periksa foto struk asli
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                          Cek Struk →
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic px-1">
                        * Pembeli belum melampirkan foto bukti transfer
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 font-medium">
                        Total Tagihan: <strong className="text-slate-900 text-sm">Rp {ord.total.toLocaleString('id-ID')}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {ord.proofImage && (
                          <button
                            onClick={() => setSelectedProofOrder(ord)}
                            className="text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 rounded-xl flex items-center gap-1 bouncy-tap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Struk</span>
                          </button>
                        )}
                        {!ord.isPaid ? (
                          <button 
                            onClick={() => handleRemindPayment(ord.name, ord.total)}
                            className="text-xs font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 bouncy-tap"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Colek WA</span>
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Lunas</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* ==================== MODAL CEK BUKTI STRUK TRANSFER ==================== */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 text-center relative">
            <button 
              onClick={() => setSelectedProofOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-left pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Verifikasi Bukti Transfer
              </span>
              <h4 className="font-extrabold text-base text-slate-900">
                {selectedProofOrder.name}
              </h4>
              <p className="text-xs text-slate-500">
                Total: <strong>Rp {selectedProofOrder.total.toLocaleString('id-ID')}</strong> • {selectedProofOrder.method} ({selectedProofOrder.time})
              </p>
            </div>

            {/* Receipt Preview */}
            <div className="w-full max-h-[50vh] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner">
              <img 
                src={selectedProofOrder.proofImage} 
                alt={`Struk ${selectedProofOrder.name}`} 
                className="max-h-[50vh] w-full object-contain p-1"
              />
            </div>

            {/* Actions */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onTogglePayment(selectedProofOrder.id)
                  setSelectedProofOrder(null)
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md bouncy-tap ${
                  selectedProofOrder.isPaid
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedProofOrder.isPaid ? 'Batal Lunas' : 'Konfirmasi Lunas ✅'}</span>
              </button>

              <a
                href={selectedProofOrder.proofImage}
                download={`struk-${selectedProofOrder.name}.jpg`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 bouncy-tap"
                title="Unduh foto struk"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
