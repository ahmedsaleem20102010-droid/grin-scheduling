const url = "https://hmnbepgvxinixucbajls.supabase.co/rest/v1/contact";

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbmJlcGd2eGluaXh1Y2JhamxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDc3NTksImV4cCI6MjA5MDUyMzc1OX0.VIkPq6tDHRXwEG2oEToyV7Np2aM7ry72hSqa67JF0fE',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbmJlcGd2eGluaXh1Y2JhamxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDc3NTksImV4cCI6MjA5MDUyMzc1OX0.VIkPq6tDHRXwEG2oEToyV7Np2aM7ry72hSqa67JF0fE',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    message: 'Test message'
  })
})
  .then(res => res.json().then(data => ({status: res.status, data})))
  .then(console.log)
  .catch(console.error);
