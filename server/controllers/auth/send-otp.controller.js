import { sendOtpService } from "../../services/auth/send-otp.service.js";
import { sendOtp } from "../../utils/sendOtp.js";

export async function sendOtpController(req, res, next) {
  try {
    const { email } = req.body;
    console.log(email);

    const result = await sendOtpService(email);
    res.status(200).json({
        result

    });
  } catch (error) {
    next(error);
  }
}
