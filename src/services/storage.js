import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// DEFAULT INITIAL STATE (Jika belum ada di DB / localStorage)
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
  qrisNmid: "ID10293847592"
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

// LOCAL STORAGE HELPERS
const STORAGE_KEYS = {
  SETTINGS: 'nitip_nyaak_settings_v1',
  MENUS: 'nitip_nyaak_menus_v1',
  ORDERS: 'nitip_nyaak_orders_v1'
}

export function loadLocalData() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    const m = localStorage.getItem(STORAGE_KEYS.MENUS)
    const o = localStorage.getItem(STORAGE_KEYS.ORDERS)

    return {
      settings: s ? JSON.parse(s) : DEFAULT_SETTINGS,
      menus: m ? JSON.parse(m) : DEFAULT_MENUS,
      orders: o ? JSON.parse(o) : DEFAULT_ORDERS
    }
  } catch (err) {
    console.error("Error reading localStorage:", err)
    return {
      settings: DEFAULT_SETTINGS,
      menus: DEFAULT_MENUS,
      orders: DEFAULT_ORDERS
    }
  }
}

export function saveLocalSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

export function saveLocalMenus(menus) {
  localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus))
}

export function saveLocalOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}
