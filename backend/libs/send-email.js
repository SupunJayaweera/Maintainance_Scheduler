import sGmail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sGmail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.FROM_EMAIL;

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: `Maintenance App <${fromEmail}>`,
      subject,
      html,
    };
    await sGmail.send(msg);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_SECURE === "true",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendEmail = async (to, subject, html) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to,
//       subject,
//       html,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
// };

// export default sendEmail;
