import { createClient } from '@supabase/supabase-js'

// Support all possible Vercel / Vite env var names
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env.SUPABASE_ANON_KEY || 
                       import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (isSupabaseConfigured) {
  console.log("✅ Supabase Terhubung:", supabaseUrl)
} else {
  console.warn("⚠️ Supabase Belum Terhubung! Menggunakan Local Storage laptop.")
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// START FROM 0 (KOSONG BERSIH UNTUK TESTING)
export const DEFAULT_STORES = []
export const DEFAULT_MENUS = []
export const DEFAULT_ORDERS = []

const STORAGE_KEYS = {
  STORES: 'nitip_nyaak_v3_clean_stores',
  MENUS: 'nitip_nyaak_v3_clean_menus',
  ORDERS: 'nitip_nyaak_v3_clean_orders',
  LOGGED_ADMIN_STORE: 'nitip_nyaak_v3_logged_store_id'
}

// LOCAL STORAGE ACCESSORS
export function getLocalStores() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.STORES)
    return s ? JSON.parse(s) : DEFAULT_STORES
  } catch (_) {
    return DEFAULT_STORES
  }
}

export function saveLocalStores(stores) {
  try {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores))
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

export function getLoggedAdminStoreId() {
  return sessionStorage.getItem(STORAGE_KEYS.LOGGED_ADMIN_STORE) || null
}

export function setLoggedAdminStoreId(storeId) {
  if (storeId) {
    sessionStorage.setItem(STORAGE_KEYS.LOGGED_ADMIN_STORE, storeId)
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.LOGGED_ADMIN_STORE)
  }
}

// SUPABASE API WITH LOCALSTORAGE FALLBACK
export async function apiGetStores() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error("Supabase stores fetch error:", error)
      } else if (data) {
        const mapped = data.map(s => ({
          id: s.id,
          slug: s.id,
          name: s.name,
          ownerName: s.owner_name,
          category: s.category || "Kuliner",
          deliveryDate: s.delivery_date,
          deliveryTime: s.delivery_time,
          cutoffTime: s.cutoff_time,
          pickupLocation: s.pickup_location,
          sellerPhone: s.seller_phone,
          paymentName: s.payment_name,
          bankName: s.bank_name,
          bankNumber: s.bank_number,
          qrisNmid: s.qris_nmid,
          adminPin: s.admin_pin || "1234",
          icon: s.icon || "🍲",
          badge: s.badge || "",
          isOpen: s.is_open ?? true
        }))
        saveLocalStores(mapped)
        return mapped
      }
    } catch (e) {
      console.warn("Supabase stores fetch error, fallback to local:", e)
    }
  }
  return getLocalStores()
}

export async function apiSaveStore(storeData) {
  const current = getLocalStores()
  const existsIndex = current.findIndex(s => s.id === storeData.id)
  let updated = []
  if (existsIndex >= 0) {
    updated = [...current]
    updated[existsIndex] = { ...updated[existsIndex], ...storeData }
  } else {
    updated = [...current, storeData]
  }
  saveLocalStores(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('stores').upsert({
        id: storeData.id,
        name: storeData.name,
        owner_name: storeData.ownerName,
        category: storeData.category,
        delivery_date: storeData.deliveryDate,
        delivery_time: storeData.deliveryTime,
        cutoff_time: storeData.cutoffTime,
        pickup_location: storeData.pickupLocation,
        seller_phone: storeData.sellerPhone,
        payment_name: storeData.paymentName,
        bank_name: storeData.bankName,
        bank_number: storeData.bankNumber,
        qris_nmid: storeData.qrisNmid,
        admin_pin: storeData.adminPin,
        icon: storeData.icon,
        badge: storeData.badge,
        is_open: storeData.isOpen
      })
      if (error) {
        console.error("Supabase store upsert error:", error)
      }
    } catch (e) {
      console.warn("Supabase store save error:", e)
    }
  }
  return updated
}

export async function apiGetMenus() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error("Supabase menus fetch error:", error)
      } else if (data) {
        const mapped = data.map(m => ({
          id: m.id,
          storeId: m.store_id,
          name: m.name,
          desc: m.description,
          price: m.price,
          quota: m.quota,
          icon: m.icon || '🍱',
          badge: m.badge || ''
        }))
        saveLocalMenus(mapped)
        return mapped
      }
    } catch (e) {
      console.warn("Supabase menus fetch error, fallback to local:", e)
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
      const { data, error } = await supabase.from('menu_items').insert({
        store_id: menu.storeId,
        name: menu.name,
        description: menu.desc,
        price: menu.price,
        quota: menu.quota,
        icon: menu.icon,
        badge: menu.badge
      }).select().single()

      if (error) {
        console.error("Supabase menu insert error:", error)
      } else if (data) {
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
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) console.error("Supabase menu delete error:", error)
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

      if (error) {
        console.error("Supabase orders fetch error:", error)
      } else if (data) {
        const mapped = data.map(o => ({
          id: o.id,
          storeId: o.store_id,
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
      console.warn("Supabase orders fetch error, fallback to local:", e)
    }
  }
  return getLocalOrders()
}

export async function apiCreateOrder(orderData) {
  const id = "PO-" + Math.floor(100 + Math.random() * 900)
  const newOrder = {
    id,
    storeId: orderData.storeId,
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
      const { error } = await supabase.from('orders').insert({
        id,
        store_id: orderData.storeId,
        buyer_name: orderData.name,
        buyer_notes: orderData.notes,
        items: orderData.items,
        total_price: orderData.total,
        payment_method: orderData.method,
        is_paid: orderData.isPaid
      })
      if (error) console.error("Supabase order insert error:", error)
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
      const { error } = await supabase.from('orders').update({ is_paid: isPaid }).eq('id', orderId)
      if (error) console.error("Supabase payment update error:", error)
    } catch (e) {
      console.warn("Supabase payment update error:", e)
    }
  }
  return updated
}
