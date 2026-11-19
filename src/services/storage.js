import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// INITIAL MULTI-STORE DATA
export const DEFAULT_STORES = [
  {
    id: "mamah-dita",
    slug: "mamah-dita",
    name: "Dapur Mamah Dita",
    ownerName: "Dita Pratiwi",
    category: "Masakan Rumahan 🍲",
    deliveryDate: "Besok (Jumat, 20 Nov)",
    deliveryTime: "11:45 WIB",
    cutoffTime: "Malam ini, jam 21:00",
    pickupLocation: "Pantry Lantai 3",
    sellerPhone: "6281234567890",
    paymentName: "Dita Pratiwi",
    bankName: "BCA",
    bankNumber: "5210984421",
    qrisNmid: "ID10293847592",
    adminPin: "1234",
    icon: "🍲",
    badge: "Paling Favorit 🔥",
    isOpen: true
  },
  {
    id: "mamah-latif",
    slug: "mamah-latif",
    name: "Pempek Asli Mamah Latif",
    ownerName: "Mamah Latif",
    category: "Khas Palembang 🥟",
    deliveryDate: "Besok Siang",
    deliveryTime: "12:00 WIB",
    cutoffTime: "Malam ini, jam 20:30",
    pickupLocation: "Lobi Utama",
    sellerPhone: "6289876543210",
    paymentName: "Hj. Latifah",
    bankName: "Bank Mandiri",
    bankNumber: "1320098765432",
    qrisNmid: "ID98765432101",
    adminPin: "2233",
    icon: "🥟",
    badge: "Ikan Tenggiri Asli ⭐",
    isOpen: true
  },
  {
    id: "bang-dimas",
    slug: "bang-dimas",
    name: "Dimsum Mentai Bang Dimas",
    ownerName: "Dimas Anggoro",
    category: "Camilan & Mentai 🥢",
    deliveryDate: "Besok Sore",
    deliveryTime: "15:00 WIB",
    cutoffTime: "Besok jam 10:00",
    pickupLocation: "Meja CS Lantai 1",
    sellerPhone: "6285678901234",
    paymentName: "Dimas Anggoro",
    bankName: "Bank Jago",
    bankNumber: "500019283746",
    qrisNmid: "ID55443322110",
    adminPin: "5566",
    icon: "🥢",
    badge: "Spesial Mentai 🔥",
    isOpen: true
  }
]

export const DEFAULT_MENUS = [
  // Menus Mamah Dita
  {
    id: 101,
    storeId: "mamah-dita",
    name: "Nasi Bakar Cumi Cabe Ijo",
    desc: "Gurih nagih, pedas pas, cumi empuk isi melimpah",
    price: 22000,
    quota: 10,
    icon: "🍱",
    badge: "Paling Laris 🔥"
  },
  {
    id: 102,
    storeId: "mamah-dita",
    name: "Ayam Penyet Sambel Bawang",
    desc: "Ayam bumbu ungkep rempah + lalapan fresh",
    price: 25000,
    quota: 8,
    icon: "🍗",
    badge: ""
  },
  {
    id: 103,
    storeId: "mamah-dita",
    name: "Risol Mayo Smoked Beef (Isi 2)",
    desc: "Kulit renyah, saus mayo lumer & telur rebus",
    price: 10000,
    quota: 15,
    icon: "🥟",
    badge: "Camilan Favorit ⭐"
  },
  {
    id: 104,
    storeId: "mamah-dita",
    name: "Es Kopi Susu Aren Mamah",
    desc: "Kopi susu creamy dengan gula aren asli 250ml",
    price: 12000,
    quota: 12,
    icon: "🥤",
    badge: ""
  },

  // Menus Mamah Latif
  {
    id: 201,
    storeId: "mamah-latif",
    name: "Pempek Kapal Selam Jumbo",
    desc: "Isi telur bebek utuh, cuko kental pedas manis mantap",
    price: 20000,
    quota: 12,
    icon: "🥟",
    badge: "Wajib Coba 🔥"
  },
  {
    id: 202,
    storeId: "mamah-latif",
    name: "Paket Campur (2 Lenjer + 2 Kulit)",
    desc: "Lenjer kenyal gurih & pempek kulit renyah wangi",
    price: 24000,
    quota: 15,
    icon: "🥢",
    badge: "Paling Hemat ⭐"
  },
  {
    id: 203,
    storeId: "mamah-latif",
    name: "Tekwan Kuah Udang Segar",
    desc: "Bulatan ikan kenyal kuah kaldu udang + jamur kuping & sohun",
    price: 18000,
    quota: 10,
    icon: "🍲",
    badge: ""
  },

  // Menus Bang Dimas
  {
    id: 301,
    storeId: "bang-dimas",
    name: "Dimsum Ayam Mentai Melted (Isi 4)",
    desc: "Daging ayam padat saus mentai bakar lumer gurih tobiko",
    price: 26000,
    quota: 15,
    icon: "🥢",
    badge: "Spesial 🔥"
  },
  {
    id: 302,
    storeId: "bang-dimas",
    name: "Siomay Udang Steamed (Isi 4)",
    desc: "Udang utuh segar kenyal disajikan chili oil gurih",
    price: 22000,
    quota: 10,
    icon: "🥟",
    badge: ""
  }
]

export const DEFAULT_ORDERS = [
  {
    id: "PO-001",
    storeId: "mamah-dita",
    name: "Budi (Design Lt.2)",
    items: [{ id: 101, name: "Nasi Bakar Cumi Cabe Ijo", qty: 2, price: 22000 }],
    notes: "Satu pedas, satu biasa ya",
    total: 44000,
    time: "08:45",
    method: "QRIS",
    isPaid: false
  },
  {
    id: "PO-002",
    storeId: "mamah-dita",
    name: "Sarah (HR)",
    items: [
      { id: 102, name: "Ayam Penyet Sambel Bawang", qty: 1, price: 25000 },
      { id: 103, name: "Risol Mayo Smoked Beef (Isi 2)", qty: 1, price: 10000 }
    ],
    notes: "Sambel dipisah",
    total: 35000,
    time: "09:12",
    method: "QRIS",
    isPaid: true
  },
  {
    id: "PO-003",
    storeId: "mamah-latif",
    name: "Rian (Finance)",
    items: [
      { id: 201, name: "Pempek Kapal Selam Jumbo", qty: 1, price: 20000 },
      { id: 203, name: "Tekwan Kuah Udang Segar", qty: 1, price: 18000 }
    ],
    notes: "Cuko pedes ya mamah",
    total: 38000,
    time: "09:30",
    method: "QRIS",
    isPaid: true
  }
]

const STORAGE_KEYS = {
  STORES: 'nitip_nyaak_stores_multi_v1',
  MENUS: 'nitip_nyaak_menus_multi_v1',
  ORDERS: 'nitip_nyaak_orders_multi_v1',
  LOGGED_ADMIN_STORE: 'nitip_nyaak_logged_store_id'
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

      if (!error && data && data.length > 0) {
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
      await supabase.from('stores').upsert({
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

      if (!error && data && data.length > 0) {
        const mapped = data.map(m => ({
          id: m.id,
          storeId: m.store_id || "mamah-dita",
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
      const { data } = await supabase.from('menu_items').insert({
        store_id: menu.storeId,
        name: menu.name,
        description: menu.desc,
        price: menu.price,
        quota: menu.quota,
        icon: menu.icon,
        badge: menu.badge
      }).select().single()

      if (data) newMenu.id = data.id
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
          storeId: o.store_id || "mamah-dita",
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
      await supabase.from('orders').insert({
        id,
        store_id: orderData.storeId,
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
      console.warn("Supabase payment update error:", e)
    }
  }
  return updated
}
