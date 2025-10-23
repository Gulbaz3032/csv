import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL || "no-reply@example.com";

let transporter: nodemailer.Transporter | null = null;

if (host && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
} else {
  console.warn("SMTP not configured. Emails will be logged to console.");
}

export const sendCredentialsEmail = async (to: string, tempPassword: string) => {
  const subject = "Your temporary account credentials";
  const text = `Your account was created.\n\nEmail: ${to}\nTemporary Password: ${tempPassword}\n\nPlease login and change your password immediately.`;
  if (!transporter) {
    console.log(`[EMAIL LOG] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};

export const sendNewPasswordEmail = async (to: string, tempPassword: string) => {
  const subject = "Your new temporary password";
  const text = `An administrator generated a new temporary password for your account.\n\nTemporary Password: ${tempPassword}\n\nPlease login and change your password immediately.`;
  if (!transporter) {
    console.log(`[EMAIL LOG] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};
