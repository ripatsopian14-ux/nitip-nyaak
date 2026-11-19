import React, { useState, useEffect } from 'react'
import HomeStoreList from './components/HomeStoreList'
import BuyerPage from './components/BuyerPage'
import AdminPage from './components/AdminPage'
import CheckoutModal from './components/CheckoutModal'
import AddMenuModal from './components/AddMenuModal'
import AdminLoginModal from './components/AdminLoginModal'
import RegisterStoreModal from './components/RegisterStoreModal'
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

  // Navigation State
  // viewMode: 'directory' | 'buyer' | 'admin'
  const [viewMode, setViewMode] = useState('directory')
  const [activeStore, setActiveStore] = useState(null)
  const [adminStore, setAdminStore] = useState(null)

  // Cart & Modals
  const [cart, setCart] = useState({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false)

  // Load Data and Route on Mount
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

      // Check Saved Admin Session
      const savedAdminId = getLoggedAdminStoreId()
      const foundAdmin = sList.find(s => s.id === savedAdminId)
      if (foundAdmin) {
        setAdminStore(foundAdmin)
      }

      // Route handling via URL Hash or Path
      handleRoute(sList, foundAdmin)
      setLoading(false)
    }
    init()

    // Listen to hash changes
    const onHashChange = () => {
      apiGetStores().then(sList => {
        handleRoute(sList, adminStore)
      })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Route Parser
  const handleRoute = (storeList, currentAdmin) => {
    const hash = window.location.hash.toLowerCase()
    const path = window.location.pathname.toLowerCase()

    // 1. Direct Store Link (e.g. #/toko/mamah-latif or /toko/mamah-latif)
    const storeMatch = hash.match(/#\/?toko\/([\w-]+)/) || path.match(/\/toko\/([\w-]+)/)
    if (storeMatch && storeMatch[1]) {
      const slug = storeMatch[1]
      const targetStore = storeList.find(s => s.slug === slug || s.id === slug)
      if (targetStore) {
        setActiveStore(targetStore)
        setViewMode('buyer')
        return
      }
    }

    // 2. Admin Link (e.g. #/admin or /admin)
    if (hash.includes('admin') || path.includes('admin')) {
      if (currentAdmin) {
        setAdminStore(currentAdmin)
        setViewMode('admin')
      } else {
        setIsAdminLoginOpen(true)
      }
      return
    }

    // 3. Default to Directory
    setViewMode('directory')
    setActiveStore(null)
  }

  // Setup Supabase Realtime Listener
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

  // Cart Handlers
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

  // Admin Add / Delete Menu
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
    setAdminStore(store)
    setLoggedAdminStoreId(store.id)
    setViewMode('admin')
    window.location.hash = '#/admin'
  }

  const handleLogoutAdmin = () => {
    setAdminStore(null)
    setLoggedAdminStoreId(null)
    setViewMode('directory')
    window.location.hash = ''
  }

  const handleRegisterSuccess = async (newStore) => {
    const updatedList = await apiSaveStore(newStore)
    setStores(updatedList)
    setAdminStore(newStore)
    setLoggedAdminStoreId(newStore.id)
    setViewMode('admin')
    window.location.hash = '#/admin'
    alert(`🎉 Selamat! Lapak "${newStore.name}" sudah aktif! Kamu bisa langsung atur menu dan sebarkan link tokomu ke WhatsApp.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-2xl animate-bounce">
          🍲
        </div>
        <p className="text-xs font-bold text-slate-500 mt-3">Memuat Nitip Nyaak!...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col items-center p-3 md:p-6 font-sans">
      
      {/* Top Navbar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-3xl p-3 shadow-sm">
        <div 
          onClick={handleBackToDirectory}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-lg shadow-md shadow-orange-200 shrink-0 group-hover:scale-105 transition-transform">
            🍲
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none flex items-center gap-1">
              <span>Nitip Nyaak!</span>
              <span className="text-[10px] text-amber-500">✨</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Jastip makanan kantor & komunitas
            </p>
          </div>
        </div>

        {/* View Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full text-slate-600 font-bold">
          {viewMode === 'admin' ? (
            <span className="text-brand-700">👨‍🍳 Kelola Lapak</span>
          ) : viewMode === 'buyer' ? (
            <span className="text-emerald-700">😋 Mau Jajan</span>
          ) : (
            <span className="text-slate-700">🏪 {stores.length} Lapak Buka</span>
          )}
        </div>
      </div>

      {/* Main Mobile App Card Frame */}
      <div className="w-full max-w-md bg-white border-4 border-slate-900/10 rounded-[38px] shadow-2xl shadow-slate-200/60 overflow-hidden relative flex flex-col min-h-[680px] max-h-[850px]">
        
        {/* Status Bar Mobile Mockup */}
        <div className="bg-white px-7 pt-3.5 pb-2 flex justify-between items-center text-[11px] text-slate-700 font-semibold select-none">
          <span>09:41</span>
          <div className="w-24 h-4 bg-slate-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>5G</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Dynamic Views */}
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

      </div>

      {/* Modals */}
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

    </div>
  )
}
