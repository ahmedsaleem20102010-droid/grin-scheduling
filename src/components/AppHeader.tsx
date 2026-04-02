import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, LogOut } from 'lucide-react';

export default function AppHeader() {
  const { user, role, signOut } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>DentaCare</span>
          {role && <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="capitalize">{role}</Badge>}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
