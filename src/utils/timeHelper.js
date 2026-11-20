// Helper utilitas untuk Time Picker & Date Picker di Nitip Nyaak

// Format tanggal ke format YYYY-MM-DD untuk input type="date"
export function toDateInputValue(date = new Date()) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Ekstrak nilai YYYY-MM-DD dari berbagai string (contoh: "Sabtu, 21 Nov 2026", "Besok Siang", "2026-11-21")
export function extractDateInputValue(dateStr) {
  if (!dateStr) return toDateInputValue(new Date())

  const str = String(dateStr).trim()

  // 1. Jika sudah YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

  const lower = str.toLowerCase()
  if (lower.includes('besok')) return getRelativeDateValue(1)
  if (lower.includes('lusa')) return getRelativeDateValue(2)
  if (lower.includes('hari ini')) return getRelativeDateValue(0)

  // 2. Coba parse format "21 Nov 2026" atau "21 November 2026"
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5,
    jul: 6, agu: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11
  }

  const dmyMatch = str.match(/(\d{1,2})\s+([a-zA-Z]{3,9})\s+(\d{4})/)
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10)
    const monthKey = dmyMatch[2].slice(0, 3).toLowerCase()
    const year = parseInt(dmyMatch[3], 10)
    const month = monthMap[monthKey] ?? 0
    const d = new Date(year, month, day)
    if (!isNaN(d.getTime())) return toDateInputValue(d)
  }

  return toDateInputValue(new Date())
}

// Ekstrak waktu HH:MM dari berbagai string (contoh: "11:45 WIB", "jam 21:00", "21.30")
export function extractTimeValue(timeStr) {
  if (!timeStr) return '12:00'
  const match = String(timeStr).match(/(\d{1,2})[:.](\d{2})/)
  if (match) {
    const h = match[1].padStart(2, '0')
    const m = match[2]
    return `${h}:${m}`
  }
  return '12:00'
}

// Format tanggal ramah Bahasa Indonesia (contoh: "Sabtu, 21 Nov 2026")
export function formatDateIndo(dateInput) {
  if (!dateInput) return ''

  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return String(dateInput)

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const dayName = days[d.getDay()]
  const dateNum = d.getDate()
  const monthName = months[d.getMonth()]
  const year = d.getFullYear()

  // Cek apakah hari ini, besok, atau lusa
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  let prefix = ''
  if (diffDays === 0) prefix = '(Hari Ini) '
  else if (diffDays === 1) prefix = '(Besok) '
  else if (diffDays === 2) prefix = '(Lusa) '

  return `${prefix}${dayName}, ${dateNum} ${monthName} ${year}`
}

// Format jam ke display WIB (contoh: "21:00" -> "21:00 WIB")
export function formatTimeIndo(timeHHMM) {
  if (!timeHHMM) return ''
  const clean = extractTimeValue(timeHHMM)
  return `${clean} WIB`
}

// Dapatkan tanggal relatif: 0 = hari ini, 1 = besok, 2 = lusa format YYYY-MM-DD
export function getRelativeDateValue(daysOffset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return toDateInputValue(d)
}
