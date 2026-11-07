-- =========================================================================
-- MOBI — EVERGREEN FUTURE CAMPUS: FULL PRODUCTION SUPABASE SCHEMA
-- Platform for MEA Engineering College, Perinthalmanna
-- Modules: MOBI ECO, MOBI MAP, MOBI EVENTS, MOBI CONNECT, MOBI WALLET, CIRCULARS
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Student Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- References auth.users(id) when Supabase Auth is enabled
    full_name TEXT NOT NULL DEFAULT 'MEA Student',
    department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
    year_of_study TEXT DEFAULT '2nd Year',
    roll_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WALLETS TABLE (Strict Segregation: Mobi Coins vs Chat Points)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mobi_coins INT NOT NULL DEFAULT 0,        -- Fresh start balance: 0 Mobi Coins
    chat_points INT NOT NULL DEFAULT 4,       -- Initial allowance for peer testing: 4 Chat Points
    last_points_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRANSACTIONS TABLE (Wallet Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'penalty', 'reset')),
    currency TEXT NOT NULL CHECK (currency IN ('mobi_coins', 'chat_points')),
    amount INT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('eco_report', 'quiz', 'event_discount', 'canteen_voucher', 'chat_session', 'daily_grant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. WASTE BINS DIRECTORY (19 GPS-Mapped Bins at MEA Campus)
CREATE TABLE IF NOT EXISTS public.waste_bins (
    id TEXT PRIMARY KEY, -- e.g., 'BIN-001'
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'dry', 'wet', 'special')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    fill_level INT NOT NULL DEFAULT 20 CHECK (fill_level BETWEEN 0 AND 100),
    status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'full', 'maintenance')),
    location_note TEXT,
    last_cleared TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WASTE REPORTS TABLE (Student Cleanliness Verification Engine)
CREATE TABLE IF NOT EXISTS public.waste_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    bin_id TEXT REFERENCES public.waste_bins(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('overflow', 'missorted', 'damaged', 'littering')),
    description TEXT,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    reward_coins INT NOT NULL DEFAULT 15,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CAMPUS EVENTS TABLE (Symposiums & Technical Festivals)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    department TEXT NOT NULL,
    fee_inr INT NOT NULL DEFAULT 0,
    max_coins_discount INT NOT NULL DEFAULT 0,
    total_seats INT NOT NULL DEFAULT 100,
    available_seats INT NOT NULL DEFAULT 100,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    coins_redeemed INT NOT NULL DEFAULT 0,
    final_fee_inr INT NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. RANDOM CHAT ROOMS & CIVIC COURTESY
CREATE TABLE IF NOT EXISTS public.civic_oaths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    has_accepted_oath BOOLEAN DEFAULT TRUE,
    quiz_score INT DEFAULT 100,
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code TEXT UNIQUE NOT NULL,
    department_filter TEXT,
    participant_a_id TEXT NOT NULL,
    participant_a_name TEXT NOT NULL,
    participant_a_dept TEXT NOT NULL,
    participant_b_id TEXT,
    participant_b_name TEXT,
    participant_b_dept TEXT,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 hours')
);

CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pseudonym TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_pseudonym TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CAMPUS CIRCULARS & NOTICES
CREATE TABLE IF NOT EXISTS public.campus_circulars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('bus', 'exam', 'event', 'admin', 'hostel')),
    date TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'MEA College Administration',
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- SEED DATA FOR MEA ENGINEERING COLLEGE
-- =========================================================================

-- Insert 19 Ground Truth Waste Bins
INSERT INTO public.waste_bins (id, name, category, latitude, longitude, fill_level, status, location_note)
VALUES
    ('BIN-001', 'Main Entrance Gate Bin A', 'general', 11.0251, 76.2162, 40, 'normal', 'Adjacent to campus security cabin'),
    ('BIN-002', 'Bus Stop Shelter Bin', 'dry', 11.0253, 76.2160, 65, 'normal', 'MEA College bus stop along SH39'),
    ('BIN-003', 'Admin Block Front Bin', 'dry', 11.0248, 76.2165, 30, 'normal', 'Main courtyard garden path'),
    ('BIN-004', 'Admin Block East Wing', 'wet', 11.0247, 76.2167, 85, 'full', 'Outside faculty dining room'),
    ('BIN-005', 'Central Library Veranda', 'general', 11.0245, 76.2169, 25, 'normal', 'Ground floor entrance steps'),
    ('BIN-006', 'Auditorium North Entry', 'dry', 11.0242, 76.2163, 15, 'normal', 'Adjacent to parking portico'),
    ('BIN-007', 'Auditorium Cafeteria Side', 'wet', 11.0240, 76.2164, 75, 'normal', 'Near refreshment counter'),
    ('BIN-008', 'Civil Department Portico', 'general', 11.0255, 76.2175, 45, 'normal', 'Ground floor corridor 1'),
    ('BIN-009', 'Civil Survey Lab Corridor', 'dry', 11.0256, 76.2178, 20, 'normal', 'Near surveying equipment room'),
    ('BIN-010', 'Mechanical Workshop Entry', 'special', 11.0238, 76.2173, 90, 'full', 'Metal shavings & lube collection area'),
    ('BIN-011', 'Foundry & Welding Station', 'special', 11.0236, 76.2174, 50, 'normal', 'Hazardous industrial scrap drum'),
    ('BIN-012', 'CSE Lab Complex Block A', 'dry', 11.0249, 76.2166, 35, 'normal', 'First floor server room corridor'),
    ('BIN-013', 'ECE Hardware Lab Quad', 'special', 11.0247, 76.2168, 10, 'normal', 'E-waste segregation receptacle'),
    ('BIN-014', 'Men''s Hostel Mess Gate', 'wet', 11.0243, 76.2182, 80, 'full', 'Hostel mess biodegradable discard'),
    ('BIN-015', 'Men''s Hostel Recreation Lawn', 'dry', 11.0241, 76.2184, 40, 'normal', 'Near volleyball court bench'),
    ('BIN-016', 'College Canteen Rear Entry', 'wet', 11.0244, 76.2170, 70, 'normal', 'Organic wet composting intake'),
    ('BIN-017', 'College Canteen Front Lawn', 'dry', 11.0245, 76.2171, 30, 'normal', 'Paper cups & dry packaging bin'),
    ('BIN-018', 'Noorul Islam School Pathway', 'general', 11.0258, 76.2158, 20, 'normal', 'West boundary footpath'),
    ('BIN-019', 'Al Fouze Jamia Link Gate', 'general', 11.0232, 76.2167, 15, 'normal', 'South pedestrian exit')
ON CONFLICT (id) DO NOTHING;

-- Insert Campus Symposiums & Events
INSERT INTO public.events (id, title, date, time, venue, department, fee_inr, max_coins_discount, total_seats, available_seats, tags)
VALUES
    ('EVT-01', 'KAIZEN 2026: National Tech Symposium', 'November 18, 2026', '09:30 AM', 'Main College Auditorium', 'Computer Science & Engineering', 250, 100, 300, 240, ARRAY['Hackathon', 'AI', 'Coding']),
    ('EVT-02', 'MECHSURGE: Robotics & CAD Expo', 'November 22, 2026', '10:00 AM', 'Mechanical Workshop Stage 2', 'Mechanical Engineering', 180, 80, 150, 95, ARRAY['Robotics', 'CAD', 'Design']),
    ('EVT-03', 'GREENSPARK: Clean Campus Hackathon', 'November 25, 2026', '09:00 AM', 'Civil Dept Seminar Hall', 'MOBI ECO Council', 0, 0, 120, 48, ARRAY['Sustainability', 'Eco', 'Ideation']),
    ('EVT-04', 'COMMUNITY SUMMIT: Civic Engineering', 'December 02, 2026', '02:00 PM', 'Conference Hall A', 'Student Affairs', 50, 30, 80, 62, ARRAY['Leadership', 'Student Life'])
ON CONFLICT (id) DO NOTHING;

-- Insert Official Circulars
INSERT INTO public.campus_circulars (title, category, date, author, content, priority)
VALUES
    ('Perinthalmanna Bus Schedule Update — Fall 2026', 'bus', 'Nov 07, 2026', 'MEA Transport Office', 'All campus shuttle buses on Route 4 (Perinthalmanna - Nilambur Road) will depart from MEA College Stop at 04:30 PM sharp following lab extensions.', 'high'),
    ('Internal Assessment Series II Timetable Published', 'exam', 'Nov 06, 2026', 'Academic Council', 'Series tests for S3 and S5 students begin November 24th. Please inspect your individual department notice boards.', 'urgent'),
    ('MOBI Waste Segregation Bonus Week', 'event', 'Nov 05, 2026', 'Campus Sustainability Club', 'Submit verified photo reports of full bins across campus to earn double Mobi Coins (30 Coins per report) throughout this week.', 'normal');

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & REALTIME POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_oaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_circulars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all catalog tables
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read wallets" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Public update wallets" ON public.wallets FOR UPDATE USING (true);

CREATE POLICY "Public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read waste_bins" ON public.waste_bins FOR SELECT USING (true);
CREATE POLICY "Public update waste_bins" ON public.waste_bins FOR UPDATE USING (true);

CREATE POLICY "Public read waste_reports" ON public.waste_reports FOR SELECT USING (true);
CREATE POLICY "Public insert waste_reports" ON public.waste_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update waste_reports" ON public.waste_reports FOR UPDATE USING (true);

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read event_registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Public insert event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read chat_rooms" ON public.chat_rooms FOR ALL USING (true);
CREATE POLICY "Public read chat_participants" ON public.chat_participants FOR ALL USING (true);
CREATE POLICY "Public read chat_messages" ON public.chat_messages FOR ALL USING (true);
CREATE POLICY "Public read civic_oaths" ON public.civic_oaths FOR ALL USING (true);
CREATE POLICY "Public read circulars" ON public.campus_circulars FOR ALL USING (true);

-- Enable Supabase Realtime for live messaging and bin status updates
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.chat_messages, 
    public.chat_rooms, 
    public.waste_bins, 
    public.waste_reports;
COMMIT;
