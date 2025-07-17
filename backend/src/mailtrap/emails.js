import { mailtrapClient, sender } from "../config/mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

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
      category: "Welcome Email",
    });

    console.log("Welcome email successfully sent", response);
  } catch (error) {
    console.log("Error sending welcome email: ", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log("Error sending password reset email: ", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    console.log("Error sending password reset email: ", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};
