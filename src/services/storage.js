import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const DEFAULT_SETTINGS = {
  storeTitle: "Dapur Mamah Dita",
  deliveryDate: "Besok (Jumat, 20 Nov)",
  deliveryTime: "11:45 WIB",
  cutoffTime: "Malam ini, jam 21:00",
  pickupLocation: "Pantry Lantai 3",
  sellerPhone: "6281234567890",
  paymentName: "Dita Pratiwi",
  bankName: "BCA",
  bankNumber: "5210984421",
  qrisNmid: "ID10293847592",
  adminPin: "1234"
}

export const DEFAULT_MENUS = [
  {
    id: 1,
    name: "Nasi Bakar Cumi Cabe Ijo",
    desc: "Gurih nagih, pedas pas, cumi empuk isi melimpah",
    price: 22000,
    quota: 10,
    icon: "🍱",
    badge: "Paling Laris 🔥"
  },
  {
    id: 2,
    name: "Ayam Penyet Sambel Bawang",
    desc: "Ayam bumbu ungkep rempah + lalapan fresh",
    price: 25000,
    quota: 8,
    icon: "🍗",
    badge: ""
  },
  {
    id: 3,
    name: "Risol Mayo Smoked Beef (Isi 2)",
    desc: "Kulit renyah, saus mayo lumer & telur rebus",
    price: 10000,
    quota: 15,
    icon: "🥟",
    badge: "Camilan Favorit ⭐"
  },
  {
    id: 4,
    name: "Es Kopi Susu Aren Mamah",
    desc: "Kopi susu creamy dengan gula aren asli 250ml",
    price: 12000,
    quota: 12,
    icon: "🥤",
    badge: ""
  }
]

export const DEFAULT_ORDERS = [
  {
    id: "PO-001",
    name: "Budi (Design Lt.2)",
    items: [{ id: 1, name: "Nasi Bakar Cumi Cabe Ijo", qty: 2, price: 22000 }],
    notes: "Satu pedas, satu biasa ya",
    total: 44000,
    time: "08:45",
    method: "QRIS",
    isPaid: false
  },
  {
    id: "PO-002",
    name: "Sarah (HR)",
    items: [
      { id: 2, name: "Ayam Penyet Sambel Bawang", qty: 1, price: 25000 },
      { id: 3, name: "Risol Mayo Smoked Beef (Isi 2)", qty: 1, price: 10000 }
    ],
    notes: "Sambel dipisah",
    total: 35000,
    time: "09:12",
    method: "QRIS",
    isPaid: true
  }
]

const STORAGE_KEYS = {
  SETTINGS: 'nitip_nyaak_settings_v2',
  MENUS: 'nitip_nyaak_menus_v2',
  ORDERS: 'nitip_nyaak_orders_v2',
  ADMIN_AUTH: 'nitip_nyaak_admin_auth'
}

// LOCAL STORAGE FALLBACKS
export function getLocalSettings() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return s ? JSON.parse(s) : DEFAULT_SETTINGS
  } catch (_) {
    return DEFAULT_SETTINGS
  }
}

export function saveLocalSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (_) {}
}

export function getLocalMenus() {
  try {
    const m = localStorage.getItem(STORAGE_KEYS.MENUS)
    return m ? JSON.parse(m) : DEFAULT_MENUS
  } catch (_) {
    return DEFAULT_MENUS
  }
}

export function saveLocalMenus(menus) {
  try {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus))
  } catch (_) {}
}

export function getLocalOrders() {
  try {
    const o = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return o ? JSON.parse(o) : DEFAULT_ORDERS
  } catch (_) {
    return DEFAULT_ORDERS
  }
}

export function saveLocalOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  } catch (_) {}
}

export function getAdminAuth() {
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true'
}

export function setAdminAuth(isAuth) {
  sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAuth ? 'true' : 'false')
}

// SUPABASE API METHODS WITH LOCALSTORAGE FALLBACK
export async function apiGetSettings() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jastip_sessions')
        .select('*')
        .eq('id', 'current')
        .single()

      if (!error && data) {
        const s = {
          storeTitle: data.store_title,
          deliveryDate: data.delivery_date,
          deliveryTime: data.delivery_time,
          cutoffTime: data.cutoff_time,
          pickupLocation: data.pickup_location,
          sellerPhone: data.seller_phone,
          paymentName: data.payment_name,
          bankName: data.bank_name,
          bankNumber: data.bank_number,
          qrisNmid: data.qris_nmid || DEFAULT_SETTINGS.qrisNmid,
          adminPin: data.admin_pin || DEFAULT_SETTINGS.adminPin
        }
        saveLocalSettings(s)
        return s
      }
    } catch (e) {
      console.warn("Supabase settings fetch error, falling back to local:", e)
    }
  }
  return getLocalSettings()
}

export async function apiSaveSettings(s) {
  saveLocalSettings(s)
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('jastip_sessions').upsert({
        id: 'current',
        store_title: s.storeTitle,
        delivery_date: s.deliveryDate,
        delivery_time: s.deliveryTime,
        cutoff_time: s.cutoffTime,
        pickup_location: s.pickupLocation,
        seller_phone: s.sellerPhone,
        payment_name: s.paymentName,
        bank_name: s.bankName,
        bank_number: s.bankNumber,
        qris_nmid: s.qrisNmid,
        admin_pin: s.adminPin
      })
    } catch (e) {
      console.warn("Supabase settings save error:", e)
    }
  }
}

export async function apiGetMenus() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })

      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          desc: item.description,
          price: item.price,
          quota: item.quota,
          icon: item.icon || '🍱',
          badge: item.badge || ''
        }))
        saveLocalMenus(mapped)
        return mapped
      }
    } catch (e) {
      console.warn("Supabase menus fetch error, falling back to local:", e)
    }
  }
  return getLocalMenus()
}

export async function apiSaveMenu(menu) {
  const current = getLocalMenus()
  const newMenu = { id: Date.now(), ...menu }
  const updated = [...current, newMenu]
  saveLocalMenus(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('menu_items').insert({
        name: menu.name,
        description: menu.desc,
        price: menu.price,
        quota: menu.quota,
        icon: menu.icon,
        badge: menu.badge
      }).select().single()

      if (data) {
        newMenu.id = data.id
      }
    } catch (e) {
      console.warn("Supabase menu insert error:", e)
    }
  }
  return updated
}

export async function apiDeleteMenu(id) {
  const current = getLocalMenus()
  const updated = current.filter(m => m.id !== id)
  saveLocalMenus(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').delete().eq('id', id)
    } catch (e) {
      console.warn("Supabase menu delete error:", e)
    }
  }
  return updated
}

export async function apiGetOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const mapped = data.map(o => ({
          id: o.id,
          name: o.buyer_name,
          notes: o.buyer_notes,
          items: o.items,
          total: o.total_price,
          time: new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          method: o.payment_method,
          isPaid: o.is_paid
        }))
        saveLocalOrders(mapped)
        return mapped
      }
    } catch (e) {
      console.warn("Supabase orders fetch error, falling back to local:", e)
    }
  }
  return getLocalOrders()
}

export async function apiCreateOrder(orderData) {
  const id = "PO-" + Math.floor(100 + Math.random() * 900)
  const newOrder = {
    id,
    name: orderData.name,
    notes: orderData.notes || "-",
    items: orderData.items,
    total: orderData.total,
    time: "Baru saja",
    method: orderData.method,
    isPaid: orderData.isPaid
  }

  const current = getLocalOrders()
  const updated = [newOrder, ...current]
  saveLocalOrders(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({
        id,
        buyer_name: orderData.name,
        buyer_notes: orderData.notes,
        items: orderData.items,
        total_price: orderData.total,
        payment_method: orderData.method,
        is_paid: orderData.isPaid
      })
    } catch (e) {
      console.warn("Supabase order insert error:", e)
    }
  }
  return updated
}

export async function apiTogglePayment(orderId, isPaid) {
  const current = getLocalOrders()
  const updated = current.map(o => o.id === orderId ? { ...o, isPaid } : o)
  saveLocalOrders(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ is_paid: isPaid }).eq('id', orderId)
    } catch (e) {
      console.warn("Supabase order payment update error:", e)
    }
  }
  return updated
}
