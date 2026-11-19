-- SQL SCHEMA UNTUK SUPABASE DATABASE (100% GRATIS)
-- Copas query ini di SQL Editor di dashboard Supabase kamu: https://supabase.com/dashboard

-- 1. Table Jastip Sessions / Settings
CREATE TABLE IF NOT EXISTS jastip_sessions (
  id TEXT PRIMARY KEY DEFAULT 'current',
  store_title TEXT NOT NULL DEFAULT 'Dapur Mamah Dita',
  delivery_date TEXT NOT NULL DEFAULT 'Besok Siang',
  delivery_time TEXT NOT NULL DEFAULT '11:45 WIB',
  cutoff_time TEXT NOT NULL DEFAULT 'Malam ini, jam 21:00',
  pickup_location TEXT NOT NULL DEFAULT 'Pantry Lantai 3',
  seller_phone TEXT NOT NULL DEFAULT '6281234567890',
  payment_name TEXT NOT NULL DEFAULT 'Dita Pratiwi',
  bank_name TEXT NOT NULL DEFAULT 'BCA',
  bank_number TEXT NOT NULL DEFAULT '5210984421',
  qris_nmid TEXT DEFAULT 'ID10293847592',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
  buyer_name TEXT NOT NULL,
  buyer_notes TEXT,
  items JSONB NOT NULL,
  total_price INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'QRIS',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE jastip_sessions;
