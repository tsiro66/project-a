interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
}

export const EmailTemplate = ({ name, email, phone, budget, message }: EmailTemplateProps) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1>New Inquiry from {name}</h1>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phone}</p>
    <p><strong>Budget:</strong> {budget}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p>{message}</p>
  </div>
);