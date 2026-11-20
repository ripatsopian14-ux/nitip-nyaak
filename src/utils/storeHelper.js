// Helper to calculate store status (Buka PO, Tutup Manual, Lewat Cut-Off)
export function getStoreStatus(store) {
  if (!store) {
    return { 
      canOrder: false, 
      label: 'Tutup', 
      badgeClass: 'bg-slate-100 text-slate-500 border-slate-200', 
      dotClass: 'bg-slate-400',
      isClosedManually: true, 
      isCutoffPassed: false 
    }
  }

  // 1. Manual Toggle by Seller (highest priority)
  if (store.isOpen === false) {
    return {
      canOrder: false,
      label: 'PO Ditutup',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200/80',
      dotClass: 'bg-rose-500',
      isClosedManually: true,
      isCutoffPassed: false
    }
  }

  // 2. Automatic Cut-off Time Check
  const cutoffPassed = checkCutoffPassed(store.cutoffTime, store.deliveryDate)
  if (cutoffPassed) {
    return {
      canOrder: false,
      label: 'Lewat Cut-Off',
      badgeClass: 'text-amber-800 bg-amber-50 border-amber-200/80',
      dotClass: 'bg-amber-500',
      isClosedManually: false,
      isCutoffPassed: true
    }
  }

  // 3. Open for Orders
  return {
    canOrder: true,
    label: 'Buka PO',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    dotClass: 'bg-emerald-500 animate-pulse',
    isClosedManually: false,
    isCutoffPassed: false
  }
}

// Parses human-written or time cutoff like "21:00", "Malam ini, jam 21:00", "15.30 WIB"
export function checkCutoffPassed(cutoffText, deliveryDate) {
  if (!cutoffText) return false

  const text = String(cutoffText).toLowerCase().trim()

  // If explicitly says "besok" or "lusa", it's in the future
  if (text.includes('besok') || text.includes('lusa')) {
    return false
  }

  // Try parsing full ISO or timestamp format
  const parsedDate = Date.parse(cutoffText)
  if (!isNaN(parsedDate) && cutoffText.length > 8) {
    return Date.now() >= parsedDate
  }

  // Extract hour & minute, e.g. "21:00", "21.00", "09:30"
  const match = text.match(/(\d{1,2})[:.](\d{2})/)
  if (!match) return false

  const targetHour = parseInt(match[1], 10)
  const targetMinute = parseInt(match[2], 10)

  if (targetHour < 0 || targetHour > 23 || targetMinute < 0 || targetMinute > 59) {
    return false
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // If today or standard time notation (e.g. "21:00 WIB"):
  const nowInMinutes = currentHour * 60 + currentMinute
  const targetInMinutes = targetHour * 60 + targetMinute

  return nowInMinutes >= targetInMinutes
}

// Helper to calculate available remaining quota for a menu item
export function getMenuAvailableQuota(menu, orders = [], storeId) {
  if (!menu) return 0
  const maxQuota = Number(menu.quota) || 10

  const orderedCount = (orders || [])
    .filter(o => String(o.storeId) === String(storeId))
    .flatMap(o => Array.isArray(o.items) ? o.items : [])
    .filter(it => String(it.id) === String(menu.id) || (it.name && it.name.trim().toLowerCase() === menu.name.trim().toLowerCase()))
    .reduce((sum, it) => sum + (Number(it.qty) || 0), 0)

  return Math.max(0, maxQuota - orderedCount)
}
