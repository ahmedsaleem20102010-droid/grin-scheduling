import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: <MapPin className="h-5 w-5 text-blue-600" />,
    label: 'Address',
    lines: ['123 Main Street, Suite 200', 'Your City, ST 00000'],
    href: 'https://maps.google.com',
    linkLabel: 'Get directions →',
  },
  {
    icon: <Phone className="h-5 w-5 text-blue-600" />,
    label: 'Phone',
    lines: ['(123) 456-7890'],
    href: 'tel:+11234567890',
    linkLabel: 'Call us now →',
  },
  {
    icon: <Mail className="h-5 w-5 text-blue-600" />,
    label: 'Email',
    lines: ['hello@brightsmile.com'],
    href: 'mailto:hello@brightsmile.com',
    linkLabel: 'Send an email →',
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    label: 'Hours',
    lines: ['Mon – Fri: 8:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 3:00 PM', 'Sunday: Closed'],
    href: null,
    linkLabel: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate async submit — replace with real API call when ready
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-200">
            Get In Touch
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Contact Us
          </h1>
          <p className="text-lg text-blue-100">
            Have a question or want to book an appointment? We're here to help — reach out any way you like.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-14">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-2">

          {/* Left — contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">Our Information</h2>
              <p className="mt-1 text-slate-500">
                Walk in, call, or email — we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map(item => (
                <div
                  key={item.label}
                  className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                    {item.lines.map(line => (
                      <p key={line} className="mt-0.5 text-sm font-medium text-slate-700">
                        {line}
                      </p>
                    ))}
                    {item.href && item.linkLabel && (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {item.linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">Send Us a Message</h2>
              <p className="mt-1 text-slate-500">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            ) : (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold text-green-800">Message Sent!</h3>
                <p className="mt-2 text-sm text-green-700">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-600 py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-3 text-3xl font-bold text-white">Ready to Schedule?</h2>
          <p className="mb-8 text-blue-100">
            Book your appointment online or give us a call. We're here to help you smile brighter.
          </p>
          <Button asChild size="lg" className="bg-white font-semibold text-blue-700 hover:bg-blue-50 shadow-lg">
            <Link to="/auth">
              Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} BrightSmile Dental. All rights reserved.
        </p>
      </footer>
    </div>
  );
}