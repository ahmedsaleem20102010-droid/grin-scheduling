import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()

    console.log(`Processing contact for ${name} (${email})`)

    // 1. Send notification email to the clinic/admin
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Dental App <onboarding@resend.dev>',
        to: ['ahmedsaleem20102010@gmail.com'], // Notification target
        subject: `New Contact Form Submission: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h3 style="color: #2563eb; margin-top: 0;">New Lead Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
          </div>
        `,
      }),
    })

    // 2. Send confirmation email to the user (patient)
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Dental App <onboarding@resend.dev>',
        to: [email],
        subject: "We received your message",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Hi ${name},</h2>
            <p>Thank you for reaching out to <strong>BrightSmile Dental</strong>. We have received your message and will get back to you as soon as possible.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #666;">This is an automated confirmation. Please do not reply directly to this email.</p>
          </div>
        `,
      }),
    })

    const adminData = await adminRes.json()
    console.log('Resend admin response:', adminData)

    if (adminRes.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify(adminData), {
        status: adminRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error: any) {
    console.error('Error in send-contact-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
