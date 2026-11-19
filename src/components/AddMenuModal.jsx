import React, { useState } from 'react'
import { X, Plus, UtensilsCrossed } from 'lucide-react'

export default function AddMenuModal({ isOpen, onClose, onAddMenu }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quota, setQuota] = useState('10')
  const [icon, setIcon] = useState('🍱')
  const [badge, setBadge] = useState('Menu Baru ✨')
  const [desc, setDesc] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Nama makanan harus diisi!")
      return
    }

    onAddMenu({
      name: name.trim(),
      price: parseInt(price) || 15000,
      quota: parseInt(quota) || 10,
      icon: icon.trim() || '🍱',
      badge: badge.trim(),
      desc: desc.trim() || 'Menu masakan spesial fresh hari ini'
    })

    // Reset form
    setName('')
    setPrice('')
    setQuota('10')
    setDesc('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[32px] max-w-sm w-full p-5 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-brand-600" />
            <span>Tambah Menu Jastip Baru</span>
          </h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center text-sm bouncy-tap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nama Makanan / Minuman</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Nasi Bakar Tongkol Pedas" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Harga (Rp)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="20000" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Kuota Porsi</label>
              <input 
                type="number" 
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder="10" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Icon / Emoji</label>
              <input 
                type="text" 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🍱 / 🍗 / 🥟" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Badge (Opsional)</label>
              <input 
                type="text" 
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Favorit / Baru" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Deskripsi Singkat</label>
            <input 
              type="text" 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Gurih mantap, sambel terasi melimpah" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs font-medium"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button 
              type="submit" 
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-200 bouncy-tap"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Buka Menu</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
