import { supabase } from "@/integrations/supabase/client";

export const sendEmail = async ({ name, email, message }: { name: string; email: string; message: string }) => {
  // Using the existing Supabase Edge Function 'send-contact-email'
  const { data, error } = await supabase.functions.invoke("send-contact-email", {
    body: {
      name,
      email,
      message,
    },
  });

  if (error) {
    console.error("Error sending email:", error);
    throw error;
  }

  return data;
};
