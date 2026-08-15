import nodemailer from "nodemailer";
import env from "dotenv";
env.config();

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: process.env.BREVO_SMTP_LOGIN,   // Brevo account email
            pass: process.env.BREVO_SMTP_PASSWORD, // Brevo SMTP key (xsmtpsib-...)
        },
    });

    await transporter.sendMail({
        from: `"EasyCart" <${process.env.BREVO_SENDER_EMAIL}>`,
        to,
        subject,
        text: message,
    });
};

export default sendEmail;