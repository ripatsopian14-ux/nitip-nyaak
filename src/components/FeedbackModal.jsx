import React, { useState } from 'react'
import { X, MessageSquare, Bug, Sparkles, Send, CheckCircle2, Mail, User, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function FeedbackModal({ isOpen, onClose, targetEmail = "ripatsopian14@gmail.com" }) {
  const [category, setCategory] = useState('bug') // 'bug' | 'feature' | 'general'
  const [name, setName] = useState('')
  const [senderContact, setSenderContact] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    setName('')
    setSenderContact('')
    setMessage('')
    setIsSuccess(false)
    setErrorMsg('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg("Mohon tuliskan pesan atau laporan bug kamu yaa.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = {
        kategori: category === 'bug' ? '🐞 Laporan Bug / Kendala' : (category === 'feature' ? '💡 Saran Fitur Baru' : '💬 Masukan Umum'),
        nama: name.trim() || 'Anonim (Pengguna Nitip Nyaak)',
        kontak_pengirim: senderContact.trim() || 'Tidak disertakan',
        pesan: message.trim(),
        waktu_kirim: new Date().toLocaleString('id-ID'),
        halaman_url: window.location.href,
        _subject: `[Nitip Nyaak] ${category === 'bug' ? '🐞 Bug Report' : (category === 'feature' ? '💡 Saran Fitur' : '💬 Masukan Baru')} dari ${name || 'Pengguna'}`
      }

      // Send to FormSubmit.co AJAX endpoint (free, forwards directly to target email)
      const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsSuccess(true)
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
        } catch (_) {}
      } else {
        throw new Error("Gagal mengirim melalui server email.")
      }
    } catch (err) {
      // Fallback: If FormSubmit blocked or failed, offer mailto
      setErrorMsg("Tidak dapat mengirim otomatis. Kamu bisa kirim via email langsung.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`[Nitip Nyaak] Laporan / Masukan`)
    const body = encodeURIComponent(`Halo!\n\nKategori: ${category}\nNama: ${name}\nKontak: ${senderContact}\n\nPesan:\n${message}`)
    window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-left space-y-4">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Masukan Berhasil Terkirim! 🎉
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Terima kasih banyak atas feedback-nya! Laporan ini sudah otomatis diteruskan ke email pengembang Nitip Nyaak.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md bouncy-tap"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Masukan & Lapor Bug
                </h3>
                <p className="text-xs text-slate-400">
                  Bantu kami bikin Nitip Nyaak makin nyaman
                </p>
              </div>
            </div>

            {/* Category Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-[11px] font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setCategory('bug')}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all bouncy-tap ${
                  category === 'bug' ? 'bg-white text-rose-700 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                <Bug className="w-4 h-4" />
                <span>Lapor Bug</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('feature')}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all bouncy-tap ${
                  category === 'feature' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Usul Fitur</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('general')}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all bouncy-tap ${
                  category === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Masukan</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nama Kamu (Opsional)
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rifat / Anonim"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email / No. WA Kamu (Opsional)
                </label>
                <input 
                  type="text" 
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  placeholder="Biar bisa dihubungi balik jika perlu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Detail {category === 'bug' ? 'Kendala / Bug' : 'Saran'} Kamu *
                </label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === 'bug' 
                      ? 'Ceritain error apa yang kamu temuin, atau tombol mana yang bermasalah...'
                      : 'Fitur apa yang menurutmu keren buat ditambahin ke Nitip Nyaak?...'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium resize-none text-xs"
                  required
                />
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-700 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMailtoFallback}
                    className="font-bold underline text-[11px] shrink-0"
                  >
                    Kirim Manual
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-200 bouncy-tap mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim ke Email...' : 'Kirim Laporan Sekarang'}</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  )
}
