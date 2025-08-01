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
