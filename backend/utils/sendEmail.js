import { Resend } from "resend";
import env from "dotenv";
env.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, message) => {
    await resend.emails.send({
        from: "EasyCart <onboarding@resend.dev>",
        to,
        subject,
        text: message,
    });
};

export default sendEmail;