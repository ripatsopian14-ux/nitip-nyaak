import React, { useState, useEffect, useRef } from 'react'
import HomeStoreList from './components/HomeStoreList'
import BuyerPage from './components/BuyerPage'
import AdminPage from './components/AdminPage'
import CheckoutModal from './components/CheckoutModal'
import AddMenuModal from './components/AddMenuModal'
import AdminLoginModal from './components/AdminLoginModal'
import RegisterStoreModal from './components/RegisterStoreModal'
import CloudConfigModal from './components/CloudConfigModal'
import { PlusCircle, Lock, Cloud, CloudOff } from 'lucide-react'
import { 
  apiGetStores,
  apiSaveStore,
  apiGetMenus,
  apiSaveMenu,
  apiDeleteMenu,
  apiGetOrders,
  apiCreateOrder,
  apiTogglePayment,
  getLoggedAdminStoreId,
  setLoggedAdminStoreId,
  supabase,
  isSupabaseConfigured
} from './services/storage'

export default function App() {
  const [stores, setStores] = useState([])
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Navigation State: 'directory' | 'buyer' | 'admin'
  const [viewMode, setViewMode] = useState('directory')
  const [activeStore, setActiveStore] = useState(null)
  const [adminStore, setAdminStore] = useState(null)
  const adminStoreRef = useRef(null)

  useEffect(() => {
    adminStoreRef.current = adminStore
  }, [adminStore])

  // Modals & Cart
  const [cart, setCart] = useState({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  // Load Data on Mount
  useEffect(() => {
    async function init() {
      setLoading(true)
      const [sList, mList, oList] = await Promise.all([
        apiGetStores(),
        apiGetMenus(),
        apiGetOrders()
      ])
      setStores(sList)
      setMenus(mList)
      setOrders(oList)

      const savedAdminId = getLoggedAdminStoreId()
      const foundAdmin = sList.find(s => s.id === savedAdminId) || null
      if (foundAdmin) {
        adminStoreRef.current = foundAdmin
        setAdminStore(foundAdmin)
      }

      handleRoute(sList, foundAdmin)
      setLoading(false)
    }
    init()

    const onHashChange = () => {
      apiGetStores().then(sList => {
        const savedAdminId = getLoggedAdminStoreId()
        const current = adminStoreRef.current || (savedAdminId ? sList.find(s => s.id === savedAdminId) : null)
        handleRoute(sList, current)
      })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Route Parser
  const handleRoute = (storeList, currentAdmin) => {
    const hash = window.location.hash.toLowerCase()
    const path = window.location.pathname.toLowerCase()

    // 1. Direct Store Link (e.g. #/toko/warung-mama-latif)
    const storeMatch = hash.match(/#\/?toko\/([\w-]+)/) || path.match(/\/toko\/([\w-]+)/)
    if (storeMatch && storeMatch[1]) {
      const slug = storeMatch[1]
      const targetStore = storeList.find(s => s.slug === slug || s.id === slug)
      if (targetStore) {
        setActiveStore(targetStore)
        setViewMode('buyer')
        setIsAdminLoginOpen(false)
        return
      }
    }

    // 2. Admin Link
    if (hash.includes('admin') || path.includes('admin')) {
      const savedAdminId = getLoggedAdminStoreId()
      const adminObj = currentAdmin || adminStoreRef.current || (savedAdminId ? storeList.find(s => s.id === savedAdminId) : null)
      if (adminObj) {
        adminStoreRef.current = adminObj
        setAdminStore(adminObj)
        setViewMode('admin')
        setIsAdminLoginOpen(false)
      } else {
        setIsAdminLoginOpen(true)
      }
      return
    }

    // 3. Default to Directory
    setViewMode('directory')
    setActiveStore(null)
  }

  // Realtime Supabase Listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    const channel = supabase
      .channel('realtime-multi-store')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          const latestOrders = await apiGetOrders()
          setOrders(latestOrders)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stores' },
        async () => {
          const latestStores = await apiGetStores()
          setStores(latestStores)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Cart Operations
  const handleUpdateQty = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0
      const next = current + delta
      if (next <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: next }
    })
  }

  // Submit Order
  const handleSubmitOrder = async (orderData) => {
    const updated = await apiCreateOrder(orderData)
    setOrders(updated)
    setCart({})
  }

  // Admin Store Updates
  const handleUpdateStore = async (updatedStore) => {
    setAdminStore(updatedStore)
    const updatedList = await apiSaveStore(updatedStore)
    setStores(updatedList)
  }

  // Add / Delete Menu
  const handleAddMenu = async (newMenu) => {
    const updated = await apiSaveMenu(newMenu)
    setMenus(updated)
  }

  const handleDeleteMenu = async (id) => {
    if (confirm("Hapus menu ini dari lapakmu?")) {
      const updated = await apiDeleteMenu(id)
      setMenus(updated)
      setCart(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    }
  }

  const handleTogglePayment = async (orderId) => {
    const target = orders.find(o => o.id === orderId)
    if (!target) return
    const updated = await apiTogglePayment(orderId, !target.isPaid)
    setOrders(updated)
  }

  // Navigation handlers
  const handleSelectStore = (store) => {
    setActiveStore(store)
    setViewMode('buyer')
    setCart({})
    window.location.hash = `#/toko/${store.slug || store.id}`
  }

  const handleBackToDirectory = () => {
    setViewMode('directory')
    setActiveStore(null)
    setCart({})
    window.location.hash = ''
  }

  const handleAdminLoginSuccess = (store) => {
    adminStoreRef.current = store
    setAdminStore(store)
    setLoggedAdminStoreId(store.id)
    setIsAdminLoginOpen(false)
    setViewMode('admin')
    window.location.hash = '#/admin'
  }

  const handleLogoutAdmin = () => {
    adminStoreRef.current = null
    setAdminStore(null)
    setLoggedAdminStoreId(null)
    setIsAdminLoginOpen(false)
    setViewMode('directory')
    window.location.hash = ''
  }

  const handleRegisterSuccess = async (newStore) => {
    const updatedList = await apiSaveStore(newStore)
    setStores(updatedList)
    setAdminStore(newStore)
    setLoggedAdminStoreId(newStore.id)
    setActiveStore(newStore)
    setViewMode('admin')
    window.location.hash = `#/toko/${newStore.slug}`
    alert(`🎉 Lapak "${newStore.name}" berhasil dibuat! Link lapakmu: ${window.location.origin}/#/toko/${newStore.slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-14 h-14 rounded-3xl bg-brand-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-200 animate-bounce">
          🍲
        </div>
        <p className="text-sm font-bold text-slate-700 mt-3">Memuat Nitip Nyaak!...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col font-sans antialiased">
      
      {/* NAVBAR MODERN & BERSIH */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 sm:px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={handleBackToDirectory}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-xl shadow-md shadow-orange-200 shrink-0 group-hover:scale-105 transition-transform">
              🍲
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight leading-none">
                  Nitip Nyaak!
                </h1>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.2 rounded-full">
                  Komunitas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden sm:block">
                Jastip makanan kantor & kampus anti-ribet
              </p>
            </div>
          </div>

          {/* Quick Actions in Navbar */}
          <div className="flex items-center gap-2">
            {/* Supabase Status Indicator */}
            {isSupabaseConfigured ? (
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Aktif
              </span>
            ) : (
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-xl transition-colors"
                title="Klik untuk menghubungkan Supabase"
              >
                <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Koneksi Cloud</span>
                <span className="sm:hidden">Cloud</span>
              </button>
            )}

            {viewMode === 'directory' ? (
              <>
                <button
                  onClick={() => setIsRegisterStoreOpen(true)}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm shadow-brand-200 flex items-center gap-1.5 bouncy-tap"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka Lapak</span>
                  <span className="sm:hidden">+ Lapak</span>
                </button>

                {stores.length > 0 && (
                  <button
                    onClick={() => setIsAdminLoginOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 bouncy-tap"
                    title="Masuk ke Lapak Saya"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Kelola Lapak</span>
                  </button>
                )}
              </>
            ) : viewMode === 'buyer' ? (
              <button
                onClick={handleBackToDirectory}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 bouncy-tap"
              >
                <span>← Semua Lapak</span>
              </button>
            ) : (
              <button
                onClick={handleLogoutAdmin}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 bouncy-tap"
              >
                <span>Keluar Admin</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* CLOUD DATABASE STATUS WARNING (IF NOT CONFIGURED YET ON VERCEL) */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-800">
          <span className="font-bold">⚠️ Catatan Sinkronisasi:</span> Cloud database Supabase belum terhubung di Vercel. Lapak yang dibuat saat ini baru tersimpan di browser perangkat ini. (Hubungkan variabel Supabase di Vercel agar otomatis tersinkron ke HP & teman-teman).
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
        
        {viewMode === 'admin' && adminStore ? (
          <AdminPage 
            store={adminStore}
            onUpdateStore={handleUpdateStore}
            menus={menus}
            onDeleteMenu={handleDeleteMenu}
            onOpenAddMenu={() => setIsAddMenuOpen(true)}
            orders={orders}
            onTogglePayment={handleTogglePayment}
            onExitToBuyer={() => handleSelectStore(adminStore)}
            onLogout={handleLogoutAdmin}
          />
        ) : viewMode === 'buyer' && activeStore ? (
          <BuyerPage 
            store={activeStore}
            menus={menus}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onBackToDirectory={handleBackToDirectory}
          />
        ) : (
          <HomeStoreList 
            stores={stores}
            menus={menus}
            onSelectStore={handleSelectStore}
            onOpenRegisterStore={() => setIsRegisterStoreOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 py-6 px-4 bg-white/50 text-center text-xs text-slate-400">
        <p>🍲 <strong>Nitip Nyaak!</strong> — Solusi titip makan siang kantor & komunitas tanpa pusing rekap.</p>
      </footer>

      {/* MODALS */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        menus={menus}
        store={activeStore}
        onSubmitOrder={handleSubmitOrder}
      />

      <AddMenuModal 
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        store={adminStore}
        onAddMenu={handleAddMenu}
      />

      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        stores={stores}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <RegisterStoreModal 
        isOpen={isRegisterStoreOpen}
        onClose={() => setIsRegisterStoreOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <CloudConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

    </div>
  )
}
