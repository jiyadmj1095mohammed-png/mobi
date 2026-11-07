-- Seed Data for MOBI — Evergreen Future Campus

-- Demo Users
INSERT INTO public.profiles (id, email, full_name, department, role, is_guest) VALUES
('d1111111-1111-1111-1111-111111111111', 'student@meaec.edu.in', 'Mohammed Jiyad', 'Computer Science & Engineering', 'student', false),
('d2222222-2222-2222-2222-222222222222', 'fatima.z@meaec.edu.in', 'Fatima Zahra', 'Civil Engineering', 'student', false),
('d3333333-3333-3333-3333-333333333333', 'rahul.m@meaec.edu.in', 'Rahul Menon', 'Mechanical Engineering', 'student', false),
('d9999999-9999-9999-9999-999999999999', 'admin@meaec.edu.in', 'Dr. Campus Admin', 'Campus Administration', 'admin', false)
ON CONFLICT (id) DO NOTHING;

-- Initial Wallets
INSERT INTO public.wallets (user_id, mobi_coins, chat_points) VALUES
('d1111111-1111-1111-1111-111111111111', 45, 6),
('d2222222-2222-2222-2222-222222222222', 75, 4),
('d3333333-3333-3333-3333-333333333333', 30, 2),
('d9999999-9999-9999-9999-999999999999', 500, 100)
ON CONFLICT (user_id) DO NOTHING;

-- Wallet Transactions
INSERT INTO public.wallet_transactions (user_id, currency, amount, action, description, reference_id) VALUES
('d1111111-1111-1111-1111-111111111111', 'mobi_coin', 15, 'earned', 'Verified Waste Report: BIN-005 Overflowing resolved', 'REP-101'),
('d1111111-1111-1111-1111-111111111111', 'mobi_coin', 30, 'earned', 'Campus Cleanliness Drive Participation Reward', 'CAMP-01'),
('d1111111-1111-1111-1111-111111111111', 'chat_point', 3, 'earned', 'Civic Quiz Completion: 5/5 Correct', 'QUIZ-88'),
('d1111111-1111-1111-1111-111111111111', 'chat_point', 3, 'earned', 'Civic Quiz Completion: 5/5 Correct', 'QUIZ-89');

-- Waste Reports
INSERT INTO public.waste_reports (id, user_id, user_name, bin_id, category, location_name, description, status, reward_amount) VALUES
('r1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Mohammed Jiyad', 'BIN-005', 'overflowing', 'Near Main Block East Porch', 'Dry waste bin BIN-005 is full with beverage cups after the afternoon break.', 'approved', 15),
('r2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Fatima Zahra', 'BIN-009', 'improper_dumping', 'Civil Dept Walkway', 'Plastic wrappers discarded next to bin instead of inside segregated chute.', 'reviewed', 15),
('r3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'Rahul Menon', 'BIN-014', 'damaged_bin', 'Mechanical Workshop Entrance', 'E-waste bin latch is unhinged. Needs screw reinforcement.', 'pending', 15);

-- Campus Events
INSERT INTO public.events (id, title, description, department, club, date, time, venue, fee, organizer, registration_deadline, total_seats, registered_count, max_coin_discount, image_url) VALUES
('e1111111-1111-1111-1111-111111111111', 'MEA National Tech Fest: INNOVEX 2026', 'Premier annual technical symposium featuring paper presentations, robotics showdown, code sprints, and guest lectures from industry pioneers.', 'Computer Science & Engineering', 'FOSS & IEEE Club', '2026-11-20', '09:30 AM - 05:00 PM', 'MEA Engineering College Auditorium', 60, 'Department of CSE & Student Council', '2026-11-18 18:00:00+00', 250, 142, 25, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'),
('e2222222-2222-2222-2222-222222222222', 'Evergreen Campus Tree Plantation Drive', 'Join hands with the National Service Scheme (NSS) to plant 150 indigenous saplings across the college perimeter and sports ground.', 'General Engineering', 'NSS Unit 112 & Nature Club', '2026-11-15', '07:30 AM - 11:00 AM', 'Near Playfield & West Campus Boundary', 0, 'NSS Unit 112', '2026-11-14 20:00:00+00', 80, 58, 0, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'),
('e3333333-3333-3333-3333-333333333333', 'Civil CAD & Sustainable Architecture Workshop', 'Hands-on practical masterclass on green building rating systems, energy modeling, and modern structural drafting.', 'Civil Engineering', 'ASCE Student Chapter', '2026-11-25', '10:00 AM - 04:00 PM', 'Civil CAD Lab, Block C', 50, 'Civil Engineering Association', '2026-11-23 15:00:00+00', 45, 29, 20, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80'),
('e4444444-4444-4444-4444-444444444444', 'FabLab CNC & 3D Prototyping Bootcamp', 'Intensive 2-day hands-on fabrication workshop covering laser cutting, 3D printing filaments, and precision CNC milling.', 'Mechanical Engineering', 'SAE Collegiate Club', '2026-12-02', '09:00 AM - 04:30 PM', 'Mechanical Workshop FabLab', 80, 'SAE Collegiate Club', '2026-11-30 18:00:00+00', 35, 18, 30, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');

-- Campus Announcements
INSERT INTO public.announcements (id, title, content, category, department, author, pinned) VALUES
('a1111111-1111-1111-1111-111111111111', 'Welcome to MOBI: The Evergreen Future Campus Platform', 'We are proud to introduce MOBI — the student-engineered platform uniting navigation, sustainability, event discounts, and respectful communication for MEA Engineering College.', 'official', 'Principal Office', 'Principal & IQAC Cell', true),
('a2222222-2222-2222-2222-222222222222', 'Plastic-Free Zone Implementation on Campus Paths', 'All single-use plastic covers and disposable water cups are strictly prohibited on campus walkways. Please utilize the 5 designated water purification points and segregated blue/yellow bins.', 'campaign', 'Green Campus Committee', 'Green Campus Cell', true),
('a3333333-3333-3333-3333-333333333333', 'Special Bus Timing Updates on SH39 Route', 'Due to evening technical seminars, special campus feeder buses to Perinthalmanna town will depart from MEA College Stop at 04:45 PM and 05:30 PM.', 'official', 'Transportation Dept', 'Transport Coordinator', false);
