import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Calendar,
  Clock,
  Shield,
  Star,
  Users,
  Zap,
  CheckCircle2,
  Phone,
  MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Slot {
  id: string;
  date: string;
  time: string;
}

const SERVICES = [
  {
    name: 'Teeth Cleaning',
    price: '$80',
    description: 'Professional plaque and tartar removal for a brighter, healthier smile.',
    icon: '🦷',
    popular: false,
  },
  {
    name: 'Teeth Whitening',
    price: '$150',
    description: 'Advanced whitening treatment that lightens your teeth by several shades.',
    icon: '✨',
    popular: true,
  },
  {
    name: 'Root Canal',
    price: '$500',
    description: 'Pain-free treatment to save infected teeth and restore full function.',
    icon: '🔬',
    popular: false,
  },
  {
    name: 'Braces',
    price: '$3,000',
    description: 'Straighten your teeth with modern, comfortable orthodontic solutions.',
    icon: '😁',
    popular: false,
  },
];

const WHY_US = [
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: 'Modern Equipment',
    desc: 'State-of-the-art digital X-rays, laser tools, and 3D imaging for precise, comfortable care.',
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'Experienced Team',
    desc: 'Our dentists bring 15+ years of combined experience across all dental specialties.',
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: 'Patient-First Care',
    desc: 'We take time to listen and tailor every treatment plan to your individual needs.',
  },
  {
    icon: <Star className="h-6 w-6 text-blue-600" />,
    title: '5-Star Rated',
    desc: 'Trusted by 2,000+ patients with consistently top-rated reviews across all platforms.',
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

export default function Home() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // If already logged in, don't redirect — let them see the public page
  // They can use the navbar to go to Dashboard

  useEffect(() => {
    const fetchSlots = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: availData } = await supabase
        .from('availability')
        .select('id, date, time')
        .eq('is_available', true)
        .gte('date', today)
        .order('date')
        .order('time')
        .limit(6);

      if (!availData || availData.length === 0) {
        setSlots([]);
        setLoadingSlots(false);
        return;
      }

      const { data: bookedData } = await supabase
        .from('appointments')
        .select('availability_id')
        .eq('status', 'confirmed');

      const bookedIds = new Set((bookedData || []).map(a => a.availability_id));
      setSlots(availData.filter(s => !bookedIds.has(s.id)));
      setLoadingSlots(false);
    };

    fetchSlots();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pb-24 pt-20">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/30" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20" />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <Badge className="mb-5 border-blue-400/50 bg-blue-500/30 text-blue-100 hover:bg-blue-500/30">
            ✦ Accepting New Patients
          </Badge>
          <h1 className="mb-5 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Professional Dental Care
            <br />
            <span className="text-blue-200">You Can Trust</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-blue-100">
            From routine cleanings to full smile makeovers — our expert team delivers gentle,
            affordable dental care tailored to your needs.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg"
            >
              <Link to="/auth">
                Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-300 bg-transparent text-white hover:bg-blue-600/50"
            >
              <a href="tel:+1234567890">
                <Phone className="mr-2 h-4 w-4" /> Call Us Today
              </a>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 rounded-2xl border border-blue-500/40 bg-blue-700/40 px-6 py-5 backdrop-blur-sm">
            {[
              { value: '2,000+', label: 'Happy Patients' },
              { value: '15+', label: 'Years Experience' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING SLOTS ── */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Next Available
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">
              Book a Time That Works for You
            </h2>
            <p className="mt-2 text-slate-500">
              Select an open slot below, or{' '}
              <Link to="/auth" className="text-blue-600 underline hover:text-blue-700">
                sign in
              </Link>{' '}
              to see your full booking dashboard.
            </p>
          </div>

          {loadingSlots ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-500">No slots available right now.</p>
              <p className="mt-1 text-sm text-slate-400">Check back soon or call us directly.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map(slot => (
                <Link
                  to="/auth"
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{formatDate(slot.date)}</p>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {slot.time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
                    Book
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Link to="/auth">
                View All Available Times <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              What We Offer
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Our Services</h2>
            <p className="mt-2 text-slate-500">
              Comprehensive dental care for the whole family — all under one roof.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(service => (
              <div
                key={service.name}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {service.popular && (
                  <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <div className="mb-4 text-3xl">{service.icon}</div>
                <h3 className="mb-1 text-lg font-bold text-slate-800">{service.name}</h3>
                <p className="mb-3 text-sm text-slate-500 leading-relaxed">{service.description}</p>
                <p className="text-xl font-extrabold text-blue-600">{service.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400">
              All prices are starting rates. Final cost determined during consultation.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-200">
              Our Promise
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white">Why Choose BrightSmile?</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-blue-500/50 bg-blue-700/40 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              'No hidden fees',
              'Same-day emergency appointments',
              'Insurance accepted',
              'Flexible payment plans',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-blue-100">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-800">
            Ready for Your Best Smile?
          </h2>
          <p className="mb-8 text-slate-500">
            Book your appointment online in under a minute, or give us a call — we're always happy to help.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold">
              <Link to="/auth">
                Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-300">
              <a href="tel:+1234567890">
                <Phone className="mr-2 h-4 w-4" /> (123) 456-7890
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xs font-bold text-white">B</span>
              </div>
              <span className="font-bold text-slate-700">BrightSmile Dental</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>123 Main Street, Your City, ST 00000</span>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} BrightSmile Dental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
