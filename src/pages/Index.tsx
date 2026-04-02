import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Stethoscope, ArrowRight } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Stethoscope className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          DentaCare
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Easy online appointment booking for your dental care needs. Book your next visit in seconds.
        </p>
        <Button size="lg" asChild>
          <a href="/auth">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
