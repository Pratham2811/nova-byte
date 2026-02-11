import { sendOtpService } from "../../services/auth/send-otp.service.js";
export async function sendOtpController(req, res, next) {
  try {
    const { email } = req.body;
    const result = await sendOtpService(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
