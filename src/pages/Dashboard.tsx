import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PatientDashboard from '@/components/PatientDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import AppHeader from '@/components/AppHeader';

export default function Dashboard() {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        {role === 'admin' ? <AdminDashboard /> : <PatientDashboard />}
      </main>
    </div>
  );
}
