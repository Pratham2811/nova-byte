import { Resend } from "resend";
import Otp from "../../models/OtpModel.js";
import dotenv from "dotenv";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { emailTemplate } from "../../utils/otpTemplate.js";
import { generateOtp } from "../../utils/generateOtp.js";
import User from "../../models/UserModel.js";
dotenv.config();
export async function sendOtpService(email) {

  const existingUser=await User.findOne({email})
  if(existingUser){
    throw new AppError("Email Already Exsist. Please Login");
  }
  const otp = generateOtp();
  const SALT_ROUNDS = 7;
  const hasedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

  await Otp.findOneAndUpdate(
    { email },
    { otp: hasedOtp, createdAt: Date.now() },
    { upsert: true, new: true },
  );
  const emailMessage = emailTemplate(otp);

  const resend = new Resend(process.env.EMAIL_API_KEY);
  const { data, error } = await resend.emails.send({
    from: "Prathamesh <onboarding@cloudmemories.in>",
    to: [email],
    subject: "Verify OTP",
    html: emailMessage,
  });

  if (error) {
    throw new AppError("Failed to send OTP email", 500, error);
  }

  return {
    success: true,
    message: "OTP sent successfully",
  };
}
