import nodemailer from "nodemailer";
import env from "dotenv";
env.config();

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message
    };

    await transporter.sendMail(mailOptions);
}

export default sendEmail;