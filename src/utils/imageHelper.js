/**
 * Compress an uploaded image file into a lightweight base64 DataURL
 * Optimal for QR codes and avatars (target ~30-50KB)
 */
export function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error("File yang dipilih bukan gambar valid."))
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        // Fill white background in case PNG has transparent layers
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.onerror = () => reject(new Error("Gagal membaca file gambar."))
    }
    reader.onerror = () => reject(new Error("Gagal mengunggah file."))
  })
}
