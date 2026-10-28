import { Resend } from 'resend';
// Initialize Resend client with the API key from environment variables.
// The key is only available on the server side; do not expose it to the client.
const resend = new Resend(process.env.RESEND);

/**
 * Sends a contact form email via Resend.
 *
 * @param param0 Object containing name, email and message from the contact form.
 * @returns The response from Resend API.
 */
export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  // Recipient address – use CONTACT_EMAIL env var if defined, otherwise fallback to a placeholder.
  const to = process.env.CONTACT_EMAIL || 'admin@example.com';

  // Sender – you can configure a FROM_EMAIL env var if needed.
  const from = process.env.FROM_EMAIL || 'Contact Form <no-reply@yourdomain.com>';

  const html = `
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
  `;

  const emailData = {
    from,
    to,
    subject: `Nouveau message de contact de ${name}`,
    html,
  };

  // Resend client returns a promise; we forward it so callers can handle errors.
  // The Resend SDK type definitions are permissive; we use a plain object.
  return resend.emails.send(emailData as any);
}
