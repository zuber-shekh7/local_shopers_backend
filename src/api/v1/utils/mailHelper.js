import nodemailer from "nodemailer";

const sentEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: '"support@localshoppers.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(message);
};
export { sentEmail };
