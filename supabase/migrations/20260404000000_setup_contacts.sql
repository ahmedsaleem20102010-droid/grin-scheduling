-- Create the contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (so the contact form works)
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT WITH CHECK (true);

-- Allow admins to view all (so Contacts.tsx works)
CREATE POLICY "Admins can view all contacts" ON public.contacts
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
