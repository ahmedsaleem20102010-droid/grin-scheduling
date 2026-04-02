import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CalendarPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Slot {
  id: string;
  date: string;
  time: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [booking, setBooking] = useState<string | null>(null);

  const fetchSlots = async () => {
    // Get available slots not already booked
    const { data } = await supabase
      .from('availability')
      .select('id, date, time')
      .eq('is_available', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .order('time');
    
    // Filter out slots that have active appointments
    const { data: bookedSlots } = await supabase
      .from('appointments')
      .select('availability_id')
      .in('status', ['confirmed']);
    
    const bookedIds = new Set(bookedSlots?.map(a => a.availability_id) || []);
    setSlots((data || []).filter(s => !bookedIds.has(s.id)));
  };

  const fetchAppointments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('date')
      .order('time');
    setAppointments(data || []);
  };

  useEffect(() => { fetchSlots(); fetchAppointments(); }, []);

  const bookSlot = async (slot: Slot) => {
    if (!user) return;
    setBooking(slot.id);
    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      availability_id: slot.id,
      date: slot.date,
      time: slot.time,
      status: 'confirmed',
    });
    if (error) toast.error('Booking failed: ' + error.message);
    else { toast.success('Appointment booked!'); fetchSlots(); fetchAppointments(); }
    setBooking(null);
  };

  const cancelAppointment = async (apt: Appointment) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', apt.id);
    if (error) toast.error('Cancel failed');
    else { toast.success('Appointment cancelled'); fetchSlots(); fetchAppointments(); }
  };

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'default';
    if (s === 'completed') return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Book an Appointment</h2>
        <p className="text-muted-foreground">Select an available time slot</p>
      </div>

      {slots.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No available slots at the moment. Check back later!</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map(slot => (
            <Card key={slot.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    {format(new Date(slot.date + 'T00:00:00'), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {slot.time.slice(0, 5)}
                  </div>
                </div>
                <Button size="sm" onClick={() => bookSlot(slot)} disabled={booking === slot.id}>
                  <CalendarPlus className="mr-1 h-4 w-4" />
                  {booking === slot.id ? 'Booking...' : 'Book'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Appointments</h2>
        <p className="text-muted-foreground">Your upcoming and past appointments</p>
      </div>

      {appointments.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No appointments yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {appointments.map(apt => (
            <Card key={apt.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      {format(new Date(apt.date + 'T00:00:00'), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {apt.time.slice(0, 5)}
                    </div>
                  </div>
                  <Badge variant={statusColor(apt.status)} className="capitalize">{apt.status}</Badge>
                </div>
                {apt.status === 'confirmed' && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => cancelAppointment(apt)}>
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
