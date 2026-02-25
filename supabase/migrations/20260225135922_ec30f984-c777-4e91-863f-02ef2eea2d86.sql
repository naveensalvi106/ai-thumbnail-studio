
-- Fix profiles RLS policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix thumbnail_requests RLS policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Users can read own requests" ON public.thumbnail_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.thumbnail_requests;
DROP POLICY IF EXISTS "Admins can read all requests" ON public.thumbnail_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.thumbnail_requests;

CREATE POLICY "Users can read own requests" ON public.thumbnail_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own requests" ON public.thumbnail_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all requests" ON public.thumbnail_requests
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all requests" ON public.thumbnail_requests
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles RLS policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
