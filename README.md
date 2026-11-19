# 🍲 Nitip Nyaak!
> **Jastip Makanan Anti-Ribet, Tinggal Klik & Bayar QRIS**

Aplikasi web modern berbasis **React + Vite + Tailwind CSS** yang dirancang untuk mengatasi keribetan jastip makanan di grup WhatsApp.

---

## ✨ Fitur Utama

### 1. Sisi Pembeli (Teman / Member Grup)
- 🚀 **Zero Friction (Tanpa Login):** Teman tidak perlu membuat akun atau memasukkan password.
- 📱 **QRIS Langsung Pas Checkout:** Tampilan kode QRIS instan atau nomor rekening bank dengan tombol 1-klik salin.
- 💬 **Otomatis Format WhatsApp:** Pesanan dan konfirmasi pembayaran langsung terformat rapi dan membuka chat WA penjual.
- ⏱️ **Informasi Jelas:** Tahu pasti kapan makanan tiba, jam tutup pesanan (cut-off), dan titik lokasi pengambilan.

### 2. Sisi Penjual (Owner Jastip / Mamah)
- ⚙️ **Atur PO & Menu Fleksibel:** Bisa ubah jadwal kedatangan (besok/lusa), jam cut-off, titik ambil, serta tambah/hapus menu jualan hari ini.
- 📢 **1-Klik Broadcast ke Grup WA:** Menghasilkan template pesan promosi lengkap dengan emoji, daftar menu, dan link order.
- 🍳 **Rekap Dapur Otomatis:** Sistem langsung menghitung total porsi tiap menu yang harus dimasak/disiapkan tanpa hitung manual.
- 💳 **Deteksi Status Pembayaran:** Memisahkan otomatis pesanan yang *Sudah Lunas* dan *Belum Lunas*.
- 💬 **Tombol "Colek Tagihan WA":** Sekali klik untuk menyalin pesan pengingat tagihan ramah tanpa rasa canggung.

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. Pastikan sudah berada di folder `nitip-nyaak`:
   ```bash
   cd nitip-nyaak
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka di browser: `http://localhost:3000`

---

## 🗄️ Koneksi Database Supabase (100% Gratis - Opsional)

Secara default, aplikasi langsung berjalan mulus menggunakan **Local Storage** di browser.

Jika ingin menghubungkan ke cloud database gratis agar pesanan masuk secara realtime ke HP penjual:
1. Buat akun & project baru di [supabase.com](https://supabase.com) (Gratis).
2. Buka menu **SQL Editor**, lalu jalankan query dari file `supabase_schema.sql`.
3. Copy **Project URL** dan **Anon Key** dari menu *Project Settings > API*.
4. Buat file `.env` di folder `nitip-nyaak`:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJh......
   ```

---

## 🌐 Cara Deploy ke Vercel (Gratis & Online 24 Jam)

1. Upload folder ini ke GitHub kamu.
2. Buka [vercel.com](https://vercel.com) dan klik **"Add New Project"**.
3. Pilih repository GitHub kamu, lalu klik **"Deploy"**.
4. Website jastip kamu langsung aktif dengan link seperti `https://nitip-nyaak.vercel.app`!
