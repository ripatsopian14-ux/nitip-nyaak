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
  ExternalLink
} from 'lucide-react'

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

    const text = `📢 *OPEN PO JASTIP ${store.name.toUpperCase()}!* ✨\n\nHalo temen-temen! Mamah mau open jastip makan siang nih:\n\n📅 *Untuk Kedatangan:* ${store.deliveryDate}\n⏰ *Jam Tiba:* ${store.deliveryTime}\n📍 *Lokasi Ambil:* ${store.pickupLocation}\n⏳ *Batas Pesan:* ${store.cutoffTime}\n💳 *Pembayaran:* Bisa QRIS / Transfer ${store.bankName}\n\n🍛 *Pilihan Menu:*\n${menuListText}\n\n👇 *Biar gak lupa & praktis, klik link lapak ini buat langsung pilih menu & bayar:*\n${storeDirectUrl}\n\n_Pesan lewat link di atas yaa biar otomatis terdata & gak kehabisan slot!_`

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
    const text = `Halo ${name}! Mau ngingetin pesanan jastip makan siang besok yaa (Total: Rp ${total.toLocaleString('id-ID')}). Kalau belum transfer / scan QRIS, monggo bisa dikirim bukti transfernya yaa, makasii! 🙏✨`
    navigator.clipboard.writeText(text)
    alert(`Pesan pengingat tagihan untuk ${name} berhasil disalin! Tinggal paste di WA.`)
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 pb-20">
      
      {/* Top Admin Action Bar */}
      <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800">
        <button 
          onClick={onExitToBuyer}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium bouncy-tap"
        >
          <Eye className="w-3.5 h-3.5 text-brand-400" />
          <span>Lihat Toko</span>
        </button>

        <span className="text-[11px] font-bold text-amber-300 truncate max-w-[150px]">
          {store.name}
        </span>

        <button 
          onClick={onLogout}
          className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold bouncy-tap"
          title="Keluar / Kunci"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Kunci</span>
        </button>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="p-3 bg-white border-b border-slate-200/80 sticky top-0 z-10 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
          <button 
            onClick={() => setActiveSubTab('setting')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'setting' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Atur Lapak & Menu</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('rekap')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'rekap' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Rekap Pesanan ({storeOrders.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== SUB-TAB 1: SETTING PO, MENU & QRIS ==================== */}
      {activeSubTab === 'setting' && (
        <div className="p-4 space-y-4">
          
          {/* Card Direct Link Share */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-3xl text-white shadow-md shadow-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Link Khusus Lapakmu
              </span>
              <button 
                onClick={handleCopyLinkOnly}
                className="text-[10px] bg-white text-violet-900 font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 bouncy-tap"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-purple-100 truncate bg-black/20 p-2 rounded-xl">
              {storeDirectUrl}
            </p>
            <p className="text-[10px] text-purple-200">
              * Bagikan link ini ke grup WA agar teman-teman langsung masuk ke lapakmu!
            </p>
          </div>

          {/* Card 1: Setting Jadwal & Titik Ambil */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span>📅</span>
                <span>Jadwal PO & Lokasi Ambil</span>
              </h4>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Aktif
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
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
                  className="w-20 text-center font-mono font-bold bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 text-slate-800 focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Setting Rekening & QRIS */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span>💳</span>
                <span>Data Rekening & QRIS</span>
              </h4>
              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                QRIS Aktif
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
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
            </div>
          </div>

          {/* Card 3: Kelola Menu Lapak Ini */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span>🍛</span>
                <span>Menu {store.name}</span>
              </h4>
              <button 
                onClick={onOpenAddMenu} 
                className="text-[11px] font-bold bg-brand-600 hover:bg-brand-500 text-white px-3 py-1 rounded-xl shadow-sm shadow-brand-200 flex items-center gap-1 bouncy-tap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Menu</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {storeMenus.length === 0 ? (
                <p className="text-slate-400 text-center py-3 text-xs">Belum ada menu di lapak ini</p>
              ) : (
                storeMenus.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-500">
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

          {/* Card 4: 1-Klik Broadcast ke Grup WhatsApp */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-md shadow-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span>Siap Ditawarkan ke Grup WA!</span>
              </h4>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">1 Klik Copas</span>
            </div>
            <p className="text-[11px] text-emerald-50 leading-relaxed">
              Teks pengumuman rapi sudah otomatis terbuat beserta link langsung ke lapakmu.
            </p>
            <button 
              onClick={handleCopyBroadcast}
              className="w-full bg-white text-emerald-800 font-extrabold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 bouncy-tap mt-1"
            >
              {copiedBroadcast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBroadcast ? 'Tersalin ke Clipboard! ✅' : 'Salin Teks Broadcast WA'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 2: REKAP DAPUR & STATUS BAYAR ==================== */}
      {activeSubTab === 'rekap' && (
        <div className="p-4 space-y-4">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Porsi Masak</span>
              <span className="text-xl font-black text-brand-700">{totalPortions} Porsi</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Omset</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Status Progress */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-800">Status Pembayaran Uang Masuk</h4>
              <span className="text-[11px] font-bold text-emerald-600">
                {paidCount} dari {storeOrders.length} Lunas
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${paymentRatioPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Sudah Masuk: <strong>Rp {totalPaid.toLocaleString('id-ID')}</strong>
              </span>
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Belum Lunas: <strong>Rp {totalUnpaid.toLocaleString('id-ID')}</strong>
              </span>
            </div>
          </div>

          {/* Rekapan Yang Harus Dimasak Mamah */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span>🍳</span>
                <span>Belanja & Masak Besok:</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Auto-calculated</span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              {Object.entries(portionMap).length === 0 ? (
                <p className="text-slate-400 text-center py-2 text-xs">Belum ada pesanan masuk</p>
              ) : (
                Object.entries(portionMap).map(([name, qty]) => (
                  <div key={name} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-slate-700 font-semibold">{name}</span>
                    <span className="font-extrabold text-brand-700 bg-brand-100/70 px-2.5 py-0.5 rounded-xl text-xs">
                      {qty} porsi
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* List Pemesan & Deteksi Lunas */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span>👥</span>
                <span>Daftar Pemesan di Lapak Ini</span>
              </h4>
              <span className="text-[10px] text-slate-400">Klik tombol buat ubah status</span>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 text-[11px] font-bold">
              <button 
                onClick={() => setOrderFilter('all')} 
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  orderFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Semua ({storeOrders.length})
              </button>
              <button 
                onClick={() => setOrderFilter('unpaid')} 
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  orderFilter === 'unpaid' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-amber-700'
                }`}
              >
                Belum Lunas ({storeOrders.filter(o => !o.isPaid).length})
              </button>
              <button 
                onClick={() => setOrderFilter('paid')} 
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  orderFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700'
                }`}
              >
                Sudah Lunas ({storeOrders.filter(o => o.isPaid).length})
              </button>
            </div>

            {/* Order Items */}
            <div className="space-y-2.5 text-xs pt-1">
              {displayOrders.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-xs">Tidak ada data orderan</p>
              ) : (
                displayOrders.map(ord => (
                  <div 
                    key={ord.id} 
                    className={`bg-slate-50 p-3.5 rounded-2xl border space-y-2 transition-all ${
                      ord.isPaid ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs">{ord.name}</span>
                        <span className="text-[10px] text-slate-400 block">{ord.time} • via {ord.method}</span>
                      </div>
                      
                      <button 
                        onClick={() => onTogglePayment(ord.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all bouncy-tap ${
                          ord.isPaid 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span>{ord.isPaid ? '🟢 Lunas' : '🟡 Belum Lunas'}</span>
                        <span className="text-[9px] opacity-60">⇄</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                      {ord.items.map(i => (
                        <div key={i.id} className="py-0.5">• {i.qty}x {i.name}</div>
                      ))}
                      {ord.notes && ord.notes !== '-' && (
                        <div className="text-[10px] text-amber-700 mt-1 italic">
                          Catatan: "{ord.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500 font-medium">
                        Tagihan: <strong className="text-slate-900">Rp {ord.total.toLocaleString('id-ID')}</strong>
                      </span>
                      {!ord.isPaid ? (
                        <button 
                          onClick={() => handleRemindPayment(ord.name, ord.total)}
                          className="text-[10px] font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 px-2 py-0.5 rounded-lg flex items-center gap-1 bouncy-tap"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Colek Tagihan WA</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Uang Sudah Masuk</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
