import { Link } from 'react-router-dom';

const SERVICES = [
  { id: 'cleaning', title: 'Teeth Cleaning', description: 'Professional dental cleaning and polishing to keep your mouth healthy.', price: '$80' },
  { id: 'whitening', title: 'Teeth Whitening', description: 'Safe in-office whitening to brighten your smile in one visit.', price: '$150' },
  { id: 'checkup', title: 'Dental Checkup', description: 'Comprehensive exam with X-rays and personalized treatment plan.', price: '$65' },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-extrabold">Our Services</h1>
          <p className="mt-4 text-lg">Explore the dental care options we offer and book your next appointment.</p>
          <Link to="/contact" className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50">Contact Us</Link>
        </div>
      </section>

      <section className="mx-auto my-12 grid max-w-5xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(service => (
          <div key={service.id} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-bold text-slate-800">{service.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-4 text-lg font-semibold text-blue-600">{service.price}</p>
            <Link to="/contact" className="mt-5 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Book now</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
