/**
 * Phone number and WhatsApp helper utilities for Nitip Nyaak!
 */

/**
 * Normalizes any Indonesian phone input to pure international WhatsApp format:
 * e.g. "08971234567" -> "628971234567"
 *      "+62 897-1234-567" -> "628971234567"
 *      "8971234567" -> "628971234567"
 */
export function toWhatsAppNumber(phone) {
  if (!phone) return ''
  // 1. Ambil hanya karakter angka
  let digits = String(phone).replace(/\D/g, '')
  if (!digits) return ''

  // 2. Normalisasi awalan:
  // Jika diawali '08', ganti '0' dengan '62' (cth: 0897 -> 62897)
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1)
  } 
  // Jika langsung diawali '8' (cth: 897...), tambahkan '62'
  else if (digits.startsWith('8')) {
    digits = '62' + digits
  } 
  // Jika nomor lokal tanpa kode negara tapi cukup panjang
  else if (!digits.startsWith('62') && digits.length >= 9) {
    digits = '62' + digits
  }

  return digits
}

/**
 * Builds a valid wa.me URL with auto-normalization
 */
export function buildWhatsAppUrl(phone, text = '') {
  const cleanNumber = toWhatsAppNumber(phone)
  if (!cleanNumber) return '#'
  const encodedText = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${cleanNumber}${encodedText}`
}

/**
 * Normalizes phone number to standard local 08xxx format for display or comparison
 */
export function toLocalPhone(phone) {
  if (!phone) return ''
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('62')) {
    digits = '0' + digits.slice(2)
  } else if (digits.startsWith('8')) {
    digits = '0' + digits
  }
  return digits
}

/**
 * Pretty display formatting: e.g. 0897 1234 5678
 */
export function formatPhoneDisplay(phone) {
  const local = toLocalPhone(phone)
  if (!local) return ''
  if (local.length <= 4) return local
  if (local.length <= 8) return `${local.slice(0, 4)} ${local.slice(4)}`
  return `${local.slice(0, 4)} ${local.slice(4, 8)} ${local.slice(8)}`
}
