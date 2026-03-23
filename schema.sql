-- Profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('admin', 'merchant', 'buyer')),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2),
  sku TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  images TEXT[], 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0 NOT NULL,
  low_stock_threshold INTEGER DEFAULT 5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('store', 'item', 'search')),
  target_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, type, target_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);

CREATE POLICY "Merchants are viewable by everyone." ON merchants FOR SELECT USING (true);
CREATE POLICY "Merchants can be updated by owner or admin." ON merchants FOR UPDATE USING (auth.uid() = owner_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Published products are viewable by everyone." ON products FOR SELECT USING (status = 'published' OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR merchant_id IN (SELECT id FROM merchants WHERE owner_id = auth.uid()));
CREATE POLICY "Merchants can manage their own products." ON products FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE owner_id = auth.uid()));

CREATE POLICY "Users can manage their own bookmarks." ON bookmarks FOR ALL USING (user_id = auth.uid());

-- Store Reports table
CREATE TABLE IF NOT EXISTS store_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Store Documents table
CREATE TABLE IF NOT EXISTS store_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  doc_type TEXT NOT NULL, -- national_id, business_registration, etc
  label TEXT,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  review_note TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE store_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_documents ENABLE ROW LEVEL SECURITY;
