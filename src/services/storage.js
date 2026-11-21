import { createClient } from '@supabase/supabase-js'

// Support all possible Vercel / Vite env var names, with localStorage custom config fallback
const customConfig = (() => {
  try {
    const saved = localStorage.getItem('nitip_supabase_config')
    return saved ? JSON.parse(saved) : {}
  } catch (_) {
    return {}
  }
})()

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
                    customConfig.url || 
                    'https://fnzoeivyijooqltqprkr.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env.SUPABASE_ANON_KEY || 
                       import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       customConfig.key || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuem9laXZ5aWpvb3FsdHFwcmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNTczMzEsImV4cCI6MjExMDYzMzMzMX0.D3oJTBVqhlcEmt0Un_MR4lBHLnC30KonbU3W1QvWND0'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export function saveCustomSupabaseConfig(url, key) {
  try {
    localStorage.setItem('nitip_supabase_config', JSON.stringify({ url, key }))
    window.location.reload()
  } catch (_) {}
}

if (isSupabaseConfigured) {
  console.log("✅ Supabase Terhubung:", supabaseUrl)
} else {
  console.warn("⚠️ Supabase Belum Terhubung! Menggunakan Local Storage laptop.")
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 3 LAPAK RESMI DENGAN DATA RAPI & SIAP SLICING
export const DEFAULT_STORES = [
  {
    id: "dapur-bu-siti",
    slug: "dapur-bu-siti",
    name: "Dapur Bu Siti - Nasi Kulit & Sambal Bawang",
    ownerName: "Bu Siti",
    category: "Masakan Rumahan 🍲",
    deliveryDate: "Jumat, 21 Nov 2026",
    deliveryTime: "11:30 WIB",
    cutoffTime: "Hari ini, jam 21:00 WIB",
    pickupLocation: "Pantry Lt. 3 (Dekat Kulkas)",
    sellerPhone: "6281234567001",
    paymentName: "Siti Rahmawati",
    bankName: "BCA",
    bankNumber: "8735019281",
    adminPin: "1234",
    icon: "🍗",
    badge: "Paling Laris 🔥",
    isOpen: true
  },
  {
    id: "dimsum-bang-jago",
    slug: "dimsum-bang-jago",
    name: "Dimsum House & Siomay Bang Jago",
    ownerName: "Bang Jago",
    category: "Camilan & Snack 🥟",
    deliveryDate: "Jumat, 21 Nov 2026",
    deliveryTime: "12:00 WIB",
    cutoffTime: "Hari ini, jam 22:00 WIB",
    pickupLocation: "Meja Resepsionis Lobby Depan",
    sellerPhone: "6281234567002",
    paymentName: "Jago Pratama",
    bankName: "Mandiri",
    bankNumber: "1370019283741",
    adminPin: "1234",
    icon: "🥟",
    badge: "Wajib Coba ✨",
    isOpen: true
  },
  {
    id: "fresh-corner",
    slug: "fresh-corner",
    name: "Fresh Corner - Salad Buah & Dessert Box",
    ownerName: "Dita Melia",
    category: "Minuman & Sehat 🥤",
    deliveryDate: "Sabtu, 22 Nov 2026",
    deliveryTime: "14:30 WIB",
    cutoffTime: "Besok, jam 10:00 WIB",
    pickupLocation: "Area Santai Rooftop Lt. 5",
    sellerPhone: "6281234567003",
    paymentName: "Dita Melia",
    bankName: "BSI",
    bankNumber: "7182938491",
    adminPin: "1234",
    icon: "🥗",
    badge: "Menu Sehat 🌿",
    isOpen: true
  }
]

export const DEFAULT_MENUS = [
  // 1. Menu Dapur Bu Siti
  {
    id: "m-siti-1",
    storeId: "dapur-bu-siti",
    name: "Nasi Kulit Sambal Bawang Komplit",
    price: 25000,
    desc: "Nasi hangat + kulit ayam crispy gurih + serundeng + telur ceplok + sambal bawang nampol",
    icon: "🍗",
    quota: 25
  },
  {
    id: "m-siti-2",
    storeId: "dapur-bu-siti",
    name: "Nasi Ayam Geprek Cabe Ijo",
    price: 28000,
    desc: "Ayam crispy digeprek sambal ijo gurih pedas + lalapan timun segar",
    icon: "🌶️",
    quota: 20
  },
  {
    id: "m-siti-3",
    storeId: "dapur-bu-siti",
    name: "Ekstra Kulit Ayam Crispy (Ala Carte)",
    price: 12000,
    desc: "Porsi camilan kulit renyah kriuk berbumbu rempah gurih",
    icon: "🥓",
    quota: 15
  },
  {
    id: "m-siti-4",
    storeId: "dapur-bu-siti",
    name: "Es Teh Manis Melati Jumbo",
    price: 5000,
    desc: "Es teh manis wangi melati dingin segar penghilang dahaga",
    icon: "🥤",
    quota: 30
  },

  // 2. Menu Dimsum Bang Jago
  {
    id: "m-jago-1",
    storeId: "dimsum-bang-jago",
    name: "Dimsum Mentai Tobiko (Isi 4)",
    price: 25000,
    desc: "Dimsum ayam lembut dengan topping saus mentai bakar lumer plus taburan tobiko",
    icon: "🔥",
    quota: 25
  },
  {
    id: "m-jago-2",
    storeId: "dimsum-bang-jago",
    name: "Dimsum Ayam Mozzarella (Isi 4)",
    price: 22000,
    desc: "Dimsum ayam daging padat dengan lelehan keju mozzarella gurih molor",
    icon: "🧀",
    quota: 20
  },
  {
    id: "m-jago-3",
    storeId: "dimsum-bang-jago",
    name: "Siomay Bandung Ikan Tenggiri (Isi 5)",
    price: 24000,
    desc: "Siomay ikan tenggiri asli + bumbu kacang medok kental & perasan jeruk limau",
    icon: "🥟",
    quota: 20
  },
  {
    id: "m-jago-4",
    storeId: "dimsum-bang-jago",
    name: "Dimsum Udang Kukus Spesial (Isi 4)",
    price: 26000,
    desc: "Dimsum premium isi cacahan udang segar garing renyah",
    icon: "🍤",
    quota: 15
  },

  // 3. Menu Fresh Corner
  {
    id: "m-fresh-1",
    storeId: "fresh-corner",
    name: "Salad Buah Creamy Keju Melimpah (500ml)",
    price: 28000,
    desc: "Melon, semangka, apel, anggur, nata de coco dengan saus creamy mayo manis & keju parut",
    icon: "🥗",
    quota: 20
  },
  {
    id: "m-fresh-2",
    storeId: "fresh-corner",
    name: "Fudgy Brownies Bites with Choco Dip",
    price: 32000,
    desc: "Brownies potong cokelat pekat chewy dengan cocolan saus dark chocolate lumer",
    icon: "🍫",
    quota: 15
  },
  {
    id: "m-fresh-3",
    storeId: "fresh-corner",
    name: "Smoothies Mango Jelly Fresh",
    price: 18000,
    desc: "Jus mangga harum manis kental dengan potongan jelly kenyal dingin",
    icon: "🥭",
    quota: 25
  }
]

export const DEFAULT_ORDERS = []

const STORAGE_KEYS = {
  STORES: 'nitip_nyaak_v4_stores',
  MENUS: 'nitip_nyaak_v4_menus',
  ORDERS: 'nitip_nyaak_v4_orders',
  LOGGED_ADMIN_STORE: 'nitip_nyaak_v4_logged_store_id'
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
    if (!o) return DEFAULT_ORDERS
    const parsed = JSON.parse(o)
    return parsed.map(ord => ({
      ...ord,
      items: Array.isArray(ord.items) ? ord.items : (ord.items?.list || ord.items?.items || [])
    }))
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
        // Jika di Supabase masih kosong tapi di laptop ini ada lapak lokal, otomatis upload ke Supabase!
        if (data.length === 0) {
          const localStores = getLocalStores()
          if (localStores && localStores.length > 0) {
            console.log("Auto-uploading local stores to Supabase...", localStores)
            for (const s of localStores) {
              await supabase.from('stores').upsert({
                id: s.id,
                name: s.name,
                owner_name: s.ownerName,
                category: s.category || "Kuliner",
                delivery_date: s.deliveryDate,
                delivery_time: s.deliveryTime,
                cutoff_time: s.cutoffTime,
                pickup_location: s.pickupLocation,
                seller_phone: s.sellerPhone,
                payment_name: s.paymentName,
                bank_name: s.bankName,
                bank_number: s.bankNumber,
                qris_nmid: s.qrisImage || s.qrisNmid || '',
                admin_pin: s.adminPin || "1234",
                icon: s.icon || "🍲",
                badge: s.badge || "",
                is_open: s.isOpen ?? true
              })
            }
            return localStores
          }
        }

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
          qrisImage: s.qris_image || (s.qris_nmid && (s.qris_nmid.startsWith('data:image') || s.qris_nmid.startsWith('http')) ? s.qris_nmid : null),
          qrisNmid: s.qris_nmid && !s.qris_nmid.startsWith('data:image') ? s.qris_nmid : '',
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
        qris_nmid: storeData.qrisImage || storeData.qrisNmid || '',
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
        if (data.length === 0) {
          const localMenus = getLocalMenus()
          if (localMenus && localMenus.length > 0) {
            for (const m of localMenus) {
              await supabase.from('menu_items').insert({
                store_id: m.storeId,
                name: m.name,
                description: m.desc,
                price: m.price,
                quota: m.quota,
                icon: m.icon || '🍱',
                badge: m.badge || '',
                is_active: true
              })
            }
            return localMenus
          }
        }
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
        const mapped = data.map(o => {
          let itemList = []
          let proofImage = null
          if (Array.isArray(o.items)) {
            itemList = o.items
          } else if (o.items && typeof o.items === 'object') {
            itemList = o.items.list || o.items.items || []
            proofImage = o.items.proofImage || null
          }

          return {
            id: o.id,
            storeId: o.store_id,
            name: o.buyer_name,
            notes: o.buyer_notes,
            items: itemList,
            proofImage: proofImage,
            total: o.total_price,
            time: new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            method: o.payment_method,
            isPaid: o.is_paid
          }
        })
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
    proofImage: orderData.proofImage || null,
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
        items: {
          list: orderData.items,
          proofImage: orderData.proofImage || null
        },
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
