CREATE TYPE public.app_role AS ENUM ('admin','staff','user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());
CREATE POLICY "Admins delete profiles" ON public.profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views published posts" ON public.posts FOR SELECT TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views clients" ON public.clients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Cleaner',
  division TEXT NOT NULL DEFAULT 'commercial',
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  hire_date DATE,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.employees TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active employees" ON public.employees FOR SELECT TO anon, authenticated
USING (status = 'active' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage employees" ON public.employees FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER employees_updated_at BEFORE UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.clients (name, industry, location, featured) VALUES
('Nairobi Financial Centre', 'Banking & Finance', 'Upper Hill, Nairobi', true),
('Kilimani Heights Apartments', 'Real Estate', 'Kilimani, Nairobi', true),
('East Africa Logistics Ltd', 'Logistics', 'Industrial Area, Nairobi', true),
('Serene Gardens Hotel', 'Hospitality', 'Karen, Nairobi', true),
('Mombasa Port Services', 'Shipping', 'Mombasa', true),
('Westlands Medical Plaza', 'Healthcare', 'Westlands, Nairobi', true);

INSERT INTO public.employees (full_name, role, division, phone, email, status, hire_date) VALUES
('Samuel Okoro', 'Senior Floor Technician', 'domestic', '+254 700 111 222', 'samuel@saham.co.ke', 'active', '2021-03-15'),
('Mercy Wanjiku', 'Housekeeping Lead', 'domestic', '+254 700 333 444', 'mercy@saham.co.ke', 'active', '2020-08-01'),
('Kamau Omondi', 'Facade Specialist', 'commercial', '+254 700 555 666', 'kamau@saham.co.ke', 'active', '2019-11-20'),
('Zainab Hassan', 'Executive Office Supervisor', 'commercial', '+254 700 777 888', 'zainab@saham.co.ke', 'active', '2022-01-10'),
('Peter Mutua', 'Waste Management Operator', 'commercial', '+254 700 999 000', 'peter@saham.co.ke', 'active', '2023-05-05'),
('Grace Achieng', 'Fumigation Technician', 'domestic', '+254 701 222 333', 'grace@saham.co.ke', 'on_leave', '2022-09-12');

INSERT INTO public.posts (title, slug, excerpt, content, category, published, published_at) VALUES
('How often should an office be deep cleaned?', 'office-deep-cleaning-frequency', 'A practical schedule for Nairobi offices balancing daily upkeep with quarterly deep cleans.', 'High-traffic offices benefit from daily surface cleaning, weekly washroom sanitising and a quarterly deep clean covering carpets, upholstery, vents and hard-to-reach glass. We build schedules around occupancy rather than a fixed template.', 'Commercial', true, now() - interval '10 days'),
('Post-construction cleaning: what to expect', 'post-construction-cleaning-guide', 'Fine dust, adhesive residue and paint splatter need specialist equipment, not a mop.', 'Post-construction cleanup runs in three passes: rough debris removal, fine dust extraction with HEPA vacuums, and a detail pass on glass, fixtures and floors. Handing over a spotless site protects your finishes and your reputation.', 'Commercial', true, now() - interval '5 days'),
('Caring for hardwood floors after sanding', 'hardwood-floor-care-after-sanding', 'Simple habits that keep freshly sanded and varnished floors looking new for years.', 'Give new varnish 72 hours to cure before replacing furniture, use felt pads under legs, avoid soaking the floor when mopping and re-coat high-traffic areas every few years instead of full re-sanding.', 'Domestic', true, now() - interval '2 days');