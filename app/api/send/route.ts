import { Resend } from 'resend';
import { EmailTemplate } from '@/app/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Get the data from the frontend
    const body = await request.json();
    const { name, email, phone, budget, message } = body;

    // 2. Send the email
    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', 
      to: ['info@flux-web.com'], // Put your real email here!
      subject: `New Project Inquiry from ${name}`,
      react: EmailTemplate({ name, email, phone, budget, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}