import { mailtrapClient, sender } from "../config/mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email send successfully!", response);
  } catch (error) {
    console.log("Error sending email verification: ", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "4a03e727-323e-4f05-bdf5-c00f49905ba5",
      template_variables: {
        company_info_name: "Test_Company",
        name: name,
      },
    });

    console.log("Welcome email successfully sent", response);
  } catch (error) {
    console.log("Error sending welcome email: ", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};
