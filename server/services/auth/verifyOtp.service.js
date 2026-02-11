import Otp from "../../models/OtpModel.js";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";
export async function verifyOtpService(email, otp) {
  const otpSession = await Otp.findOne({ email });

  if (!otpSession) {
    throw new AppError("OTP expired or not found", 400);
  }

  const isValid = await bcrypt.compare(otp, otpSession.otp);

  if (!isValid) {
    throw new AppError("Invalid OTP", 400);
  }
  await Otp.deleteOne({ email });
  return { verified: true };
}
