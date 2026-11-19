import React, { useState } from 'react'
import { X, Cloud, Key, Globe, CheckCircle2 } from 'lucide-react'
import { saveCustomSupabaseConfig } from '../services/storage'

export default function CloudConfigModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (!url.trim() || !key.trim()) {
      alert("Mohon masukkan Project URL dan Anon Key dari Supabase yaa!")
      return
    }
    saveCustomSupabaseConfig(url.trim(), key.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hubungkan Supabase Cloud</h3>
            <p className="text-xs text-slate-500">Agar lapak langsung muncul di HP teman & pembeli</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-800 mb-5 leading-relaxed">
          <p className="font-bold mb-1">📍 Cara ambil di Supabase Dashboard:</p>
          <p>Buka <strong>Project Settings (ikon gear ⚙️)</strong> &rarr; <strong>API</strong> &rarr; Copy <strong>Project URL</strong> dan <strong>anon / public key</strong>.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Project URL
            </label>
            <input 
              type="url"
              placeholder="https://xyzproject.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Anon Public API Key
            </label>
            <textarea 
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono resize-none"
              required
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan & Konek
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
