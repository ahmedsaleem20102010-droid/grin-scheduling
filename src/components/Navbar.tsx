import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { role } = useAuth();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          BrightSmile
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/services" className="text-white">Services</Link>
          <Link to="/contact" className="text-white">Contact</Link>
          {role === 'admin' && (
            <Link to="/contacts" className="text-white bg-blue-700 px-2 py-1 rounded">Admin: Contacts</Link>
          )}
          <Link to="/auth" className="text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
}
