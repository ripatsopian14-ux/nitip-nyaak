-- SQL SCHEMA LENGKAP UNTUK SUPABASE (PASTIKAN JALANKAN INI DI SQL EDITOR SUPABASE)
-- Link: https://supabase.com/dashboard/project/_/sql

-- 1. Table Stores / Lapak Jastip
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  category TEXT DEFAULT 'Kuliner',
  delivery_date TEXT DEFAULT 'Besok Siang',
  delivery_time TEXT DEFAULT '11:45 WIB',
  cutoff_time TEXT DEFAULT 'Malam ini, jam 21:00',
  pickup_location TEXT DEFAULT 'Pantry Lantai 3',
  seller_phone TEXT DEFAULT '6281234567890',
  payment_name TEXT,
  bank_name TEXT DEFAULT 'BCA',
  bank_number TEXT,
  qris_nmid TEXT,
  admin_pin TEXT NOT NULL DEFAULT '1234',
  icon TEXT DEFAULT '🍲',
  badge TEXT DEFAULT '',
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  store_id TEXT REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  quota INTEGER NOT NULL DEFAULT 10,
  icon TEXT DEFAULT '🍱',
  badge TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Table Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  store_id TEXT REFERENCES stores(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_notes TEXT,
  items JSONB NOT NULL,
  total_price INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'QRIS',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. PENTING: Matikan RLS & berikan izin akses penuh ke anon agar aplikasi bisa baca & tulis
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE stores TO anon, authenticated, service_role;
GRANT ALL ON TABLE menu_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE orders TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Enable Realtime agar saat teman pesan di HP, langsung masuk ke laptop secara instan
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE stores;
