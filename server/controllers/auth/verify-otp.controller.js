import { verifyOtpService } from "../../services/auth/verifyOtp.service.js";

export async function verifyOtpController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpService(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
