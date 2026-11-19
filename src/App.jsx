import React, { useState, useEffect } from 'react'
import BuyerPage from './components/BuyerPage'
import AdminPage from './components/AdminPage'
import CheckoutModal from './components/CheckoutModal'
import AddMenuModal from './components/AddMenuModal'
import { 
  loadLocalData, 
  saveLocalSettings, 
  saveLocalMenus, 
  saveLocalOrders 
} from './services/storage'

export default function App() {
  // Load initial data
  const initial = loadLocalData()
  const [settings, setSettings] = useState(initial.settings)
  const [menus, setMenus] = useState(initial.menus)
  const [orders, setOrders] = useState(initial.orders)
  
  // App UI State
  const [role, setRole] = useState('buyer') // 'buyer' | 'seller'
  const [cart, setCart] = useState({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)

  // Sync state to local storage
  useEffect(() => {
    saveLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    saveLocalMenus(menus)
  }, [menus])

  useEffect(() => {
    saveLocalOrders(orders)
  }, [orders])

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

  // Order Submit
  const handleSubmitOrder = (orderData) => {
    const newOrder = {
      id: "PO-" + Math.floor(100 + Math.random() * 900),
      name: orderData.name,
      items: orderData.items,
      notes: orderData.notes || "-",
      total: orderData.total,
      time: "Baru saja",
      method: orderData.method,
      isPaid: orderData.isPaid
    }

    setOrders(prev => [newOrder, ...prev])
    setCart({})
  }

  // Menu Handlers
  const handleAddMenu = (newMenu) => {
    const created = {
      id: Date.now(),
      ...newMenu
    }
    setMenus(prev => [...prev, created])
  }

  const handleDeleteMenu = (id) => {
    if (confirm("Yakin mau hapus menu ini dari jastip?")) {
      setMenus(prev => prev.filter(m => m.id !== id))
      setCart(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    }
  }

  // Toggle Payment Status
  const handleTogglePayment = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, isPaid: !ord.isPaid }
      }
      return ord
    }))
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col items-center p-3 md:p-6 font-sans">
      
      {/* Top Bar Branding & Role Switcher */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-3xl p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-xl shadow-md shadow-orange-200 shrink-0">
            🍲
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
              Nitip Nyaak! ✨
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Jastip makanan anti-ribet
            </p>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold shrink-0">
          <button 
            onClick={() => setRole('buyer')}
            className={`px-3 py-1.5 rounded-xl transition-all bouncy-tap ${
              role === 'buyer' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pembeli
          </button>
          <button 
            onClick={() => setRole('seller')}
            className={`px-3 py-1.5 rounded-xl transition-all bouncy-tap ${
              role === 'seller' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Penjual
          </button>
        </div>
      </div>

      {/* Main Mobile App Card Frame */}
      <div className="w-full max-w-md bg-white border-4 border-slate-900/10 rounded-[38px] shadow-2xl shadow-slate-200/60 overflow-hidden relative flex flex-col min-h-[680px] max-h-[850px]">
        
        {/* Status Bar iPhone Mockup */}
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

        {/* Dynamic Role Views */}
        {role === 'buyer' ? (
          <BuyerPage 
            settings={settings}
            menus={menus}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        ) : (
          <AdminPage 
            settings={settings}
            onUpdateSettings={setSettings}
            menus={menus}
            onDeleteMenu={handleDeleteMenu}
            onOpenAddMenu={() => setIsAddMenuOpen(true)}
            orders={orders}
            onTogglePayment={handleTogglePayment}
          />
        )}

      </div>

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

    </div>
  )
}
