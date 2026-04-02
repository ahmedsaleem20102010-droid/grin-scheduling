import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Slot {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
}

interface AppointmentWithPatient {
  id: string;
  date: string;
  time: string;
  status: string;
  user_id: string;
  profiles: { name: string; email: string } | null;
}

export default function AdminDashboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);

  const fetchSlots = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .order('date')
      .order('time');
    setSlots(data || []);
  };

  const fetchAppointments = async () => {
    const { data: aptsData } = await supabase
      .from('appointments')
      .select('*')
      .order('date')
      .order('time');

    if (!aptsData || aptsData.length === 0) { setAppointments([]); return; }

    const userIds = [...new Set(aptsData.map(a => a.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, name, email')
      .in('user_id', userIds);

    const profileMap = new Map((profilesData || []).map(p => [p.user_id, p]));
    setAppointments(aptsData.map(apt => ({
      ...apt,
      profiles: profileMap.get(apt.user_id) || null,
    })));
  };

  useEffect(() => { fetchSlots(); fetchAppointments(); }, []);

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setAddingSlot(true);
    const { error } = await supabase.from('availability').insert({
      date: newDate,
      time: newTime,
      is_available: true,
    });
    if (error) {
      if (error.message.includes('duplicate')) toast.error('This slot already exists');
      else toast.error('Failed to add slot');
    } else {
      toast.success('Time slot added');
      setNewDate('');
      setNewTime('');
      fetchSlots();
    }
    setAddingSlot(false);
  };

  const deleteSlot = async (id: string) => {
    const { error } = await supabase.from('availability').delete().eq('id', id);
    if (error) toast.error('Failed to delete slot');
    else { toast.success('Slot deleted'); fetchSlots(); }
  };

  const toggleSlotAvailability = async (slot: Slot) => {
    const { error } = await supabase
      .from('availability')
      .update({ is_available: !slot.is_available })
      .eq('id', slot.id);
    if (error) toast.error('Failed to update slot');
    else { fetchSlots(); }
  };

  const updateStatus = async (aptId: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', aptId);
    if (error) toast.error('Failed to update status');
    else { toast.success(`Status updated to ${status}`); fetchAppointments(); }
  };

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'default';
    if (s === 'completed') return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage slots and appointments</p>
      </div>

      <Tabs defaultValue="slots">
        <TabsList>
          <TabsTrigger value="slots">
            <Clock className="mr-1.5 h-4 w-4" /> Time Slots
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Users className="mr-1.5 h-4 w-4" /> Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slots" className="space-y-6 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Add New Slot</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={addSlot} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="slot-date">Date</Label>
                  <Input id="slot-date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="slot-time">Time</Label>
                  <Input id="slot-time" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} required />
                </div>
                <Button type="submit" disabled={addingSlot}>
                  <Plus className="mr-1 h-4 w-4" /> {addingSlot ? 'Adding...' : 'Add Slot'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {slots.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No slots created yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {slots.map(slot => (
                <Card key={slot.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
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
                      <Badge variant={slot.is_available ? 'default' : 'secondary'}>
                        {slot.is_available ? 'Available' : 'Blocked'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleSlotAvailability(slot)}>
                        {slot.is_available ? 'Block' : 'Unblock'}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteSlot(slot.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4 mt-4">
          {appointments.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No appointments yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {appointments.map(apt => (
                <Card key={apt.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(apt.date + 'T00:00:00'), 'MMM d, yyyy')} at {apt.time.slice(0, 5)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.profiles?.name || 'Unknown'} ({apt.profiles?.email || 'N/A'})
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColor(apt.status)} className="capitalize">{apt.status}</Badge>
                      <Select value={apt.status} onValueChange={(v) => updateStatus(apt.id, v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
