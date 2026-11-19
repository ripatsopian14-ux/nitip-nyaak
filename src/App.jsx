import React, { useState, useEffect } from 'react'
import BuyerPage from './components/BuyerPage'
import AdminPage from './components/AdminPage'
import CheckoutModal from './components/CheckoutModal'
import AddMenuModal from './components/AddMenuModal'
import AdminPinModal from './components/AdminPinModal'
import { Lock, ShieldCheck } from 'lucide-react'
import { 
  apiGetSettings,
  apiSaveSettings,
  apiGetMenus,
  apiSaveMenu,
  apiDeleteMenu,
  apiGetOrders,
  apiCreateOrder,
  apiTogglePayment,
  getAdminAuth,
  setAdminAuth,
  supabase,
  isSupabaseConfigured
} from './services/storage'

export default function App() {
  const [settings, setSettings] = useState(null)
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Navigation & Role State
  const [isAdminView, setIsAdminView] = useState(false)
  const [isAdminAuth, setIsAdminAuthState] = useState(getAdminAuth())
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)

  // Cart & Modals
  const [cart, setCart] = useState({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)

  // Load Initial Data from API/LocalStorage
  useEffect(() => {
    async function init() {
      setLoading(true)
      const [s, m, o] = await Promise.all([
        apiGetSettings(),
        apiGetMenus(),
        apiGetOrders()
      ])
      setSettings(s)
      setMenus(m)
      setOrders(o)
      setLoading(false)
    }
    init()

    // Check if URL directly points to /admin or #admin
    const path = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    if (path.includes('admin') || hash.includes('admin')) {
      if (getAdminAuth()) {
        setIsAdminView(true)
      } else {
        setIsPinModalOpen(true)
      }
    }
  }, [])

  // Setup Supabase Realtime Listener (Jika Supabase aktif)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          const latestOrders = await apiGetOrders()
          setOrders(latestOrders)
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

  // Submit Order from Buyer
  const handleSubmitOrder = async (orderData) => {
    const updated = await apiCreateOrder(orderData)
    setOrders(updated)
    setCart({})
  }

  // Admin Actions
  const handleUpdateSettings = async (newSettings) => {
    setSettings(newSettings)
    await apiSaveSettings(newSettings)
  }

  const handleAddMenu = async (newMenu) => {
    const updated = await apiSaveMenu(newMenu)
    setMenus(updated)
  }

  const handleDeleteMenu = async (id) => {
    if (confirm("Yakin mau hapus menu ini dari jastip?")) {
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

  // PIN Authentication Success
  const handlePinSuccess = () => {
    setAdminAuth(true)
    setIsAdminAuthState(true)
    setIsPinModalOpen(false)
    setIsAdminView(true)
    window.location.hash = '#admin'
  }

  const handleExitToBuyer = () => {
    setIsAdminView(false)
    window.location.hash = ''
  }

  const handleLogoutAdmin = () => {
    setAdminAuth(false)
    setIsAdminAuthState(false)
    setIsAdminView(false)
    window.location.hash = ''
  }

  if (loading || !settings) {
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
      
      {/* Top Header */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-3xl p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-lg shadow-md shadow-orange-200 shrink-0">
            🍲
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
              Nitip Nyaak! ✨
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Jastip makanan anti-ribet
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full text-slate-600 font-medium">
          {isAdminView ? (
            <span className="flex items-center gap-1 text-brand-700 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Mode</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Menu Buka</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Container Card */}
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

        {/* View Switcher: Admin vs Buyer */}
        {isAdminView ? (
          <AdminPage 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            menus={menus}
            onDeleteMenu={handleDeleteMenu}
            onOpenAddMenu={() => setIsAddMenuOpen(true)}
            orders={orders}
            onTogglePayment={handleTogglePayment}
            onExitToBuyer={handleExitToBuyer}
            onLogout={handleLogoutAdmin}
          />
        ) : (
          <BuyerPage 
            settings={settings}
            menus={menus}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

      </div>

      {/* Discreet Footer Link for Seller Access */}
      {!isAdminView && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              if (isAdminAuth) {
                setIsAdminView(true)
                window.location.hash = '#admin'
              } else {
                setIsPinModalOpen(true)
              }
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-brand-600 py-1 px-3 rounded-full hover:bg-white transition-all bouncy-tap"
          >
            <Lock className="w-3 h-3" />
            <span>Akses Khusus Mamah (Penjual)</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        menus={menus}
        settings={settings}
        onSubmitOrder={handleSubmitOrder}
      />

      <AddMenuModal 
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onAddMenu={handleAddMenu}
      />

      <AdminPinModal 
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onAuthSuccess={handlePinSuccess}
        correctPin={settings.adminPin || "1234"}
      />

    </div>
  )
}
