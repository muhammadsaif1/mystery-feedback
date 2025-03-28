import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "True Feedback | Verification Code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully!" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}
