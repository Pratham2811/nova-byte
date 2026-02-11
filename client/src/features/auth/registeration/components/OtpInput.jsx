import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../thunks/registrationThunks";
import { goBack } from "../../slices/authSlice";


export function VerifyEmailOtpStep() {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const { formData, isLoading } = useSelector((state) => state.auth.registeration);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter valid OTP");
      return;
    }

    try {
      console.log(otp,formData);
      
      await dispatch(verifyOtp({ email: formData.email, otp })).unwrap();

      toast.success("OTP Verified Successfully");
    } catch (err) {
      toast.error(err || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 text-center"
        >
          <Button
            type="button"
            variant="ghost"
            className="self-start"
            onClick={() => dispatch(goBack())}
          >
            ← Back
          </Button>
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Verify your email</h1>

            <p className="text-sm text-muted-foreground">
              We’ve sent a 6-digit verification code to
            </p>

            <p className="text-sm font-medium break-all">{formData.email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>

          {/* Resend */}
          <p className="text-xs text-muted-foreground">
            Didn’t receive the code?{" "}
            <button type="button" className="underline font-medium">
              Resend
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
