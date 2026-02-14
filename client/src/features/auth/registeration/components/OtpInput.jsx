import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../thunks/registrationThunks";
import { goBack } from "../../slices/authSlice";
import { ArrowLeft } from "lucide-react";

export function VerifyEmailOtpStep() {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const { formData, isLoading } = useSelector((state) => state.auth.registeration);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid code");
      return;
    }
    try {
      await dispatch(verifyOtp({ email: formData.email, otp })).unwrap();
      toast.success("Email verified");
    } catch (err) {
      toast.error(err || "Invalid OTP");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <Button
        type="button"
        variant="ghost"
        className="mb-6 -ml-4 text-slate-500 hover:text-slate-900"
        onClick={() => dispatch(goBack())}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Change email
      </Button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center text-center">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-500">
            We’ve sent a 6-digit verification code to <br/>
            <span className="font-medium text-slate-900">{formData.email}</span>
          </p>
        </div>

        <div className="py-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index} 
                  className="h-12 w-10 sm:h-14 sm:w-12 border border-slate-200 bg-slate-50 rounded-md text-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-500/20"
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <p className="text-sm text-slate-500">
          Didn’t receive the code?{" "}
          <button type="button" className="text-indigo-600 font-medium hover:underline">
            Click to resend
          </button>
        </p>
      </form>
    </div>
  );
}