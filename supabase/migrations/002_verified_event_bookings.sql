-- Event bookings must belong to the currently authenticated student.
-- In Supabase Dashboard, keep Authentication > Email > Confirm email enabled.
-- Confirmed-email users are the only users who can obtain a password session,
-- so this policy prevents anonymous/unverified inserts at the database boundary.

DROP POLICY IF EXISTS "Public insert event_registrations" ON public.event_registrations;

CREATE POLICY "Verified users can create their own event registrations"
  ON public.event_registrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
