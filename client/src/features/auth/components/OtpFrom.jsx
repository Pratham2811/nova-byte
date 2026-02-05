import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle2, RefreshCw } from "lucide-react";

import { useAuth } from "../context/authContext";
import { toast } from "sonner";

export function OTPVerificationDialog({ open, onOpenChange }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const { verifyOtp, isEmailVerified, userEmail, verifying, sendOtp } = useAuth();

  useEffect(() => {
    if (!open) {
      setOtp("");
      setError("");
    }
  }, [open]);
  const handleVerifyClick = async () => {
    try {
      const response = await verifyOtp(otp);
      if (response.success) {
        onOpenChange(false);
        toast.success("Email verified");
      } else {
        setError(response.error || "Invalid code. Please try again.");
        setOtp("");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || error?.message || "Something went wrong",
      );
      setOtp("");
    }
  };

  const handleResendClick = async () => {
    if (!userEmail || resending) return;
    try {
      setResending(true);
      setError("");
      setOtp("");
      const response = await sendOtp(userEmail);
      if (response.success) {
        toast.success("A new code has been sent");
      } else {
        toast.error(response.error || "Failed to resend code");
      }
    } finally {
      setResending(false);
    }
  };
  const handleOTPChange = async (value) => {
    setOtp(value);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {isEmailVerified ? (
              <CheckCircle2 className="h-7 w-7 text-primary" />
            ) : (
              <Mail className="h-7 w-7 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl">
            {isEmailVerified ? "Email Verified!" : "Verify your email"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEmailVerified ? (
              "Your email has been successfully verified."
            ) : (
              <>
                Enter the 4-digit code we sent to{" "}
                <span className="font-medium text-foreground">{userEmail}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!isEmailVerified && (
          <>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-full rounded-lg border bg-muted/30 px-4 py-5">
                <div className="mb-3 text-center text-sm text-muted-foreground">
                  Check your inbox (and spam) for the verification code.
                </div>
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={handleOTPChange}
                  className="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendClick}
                  disabled={verifying || resending}
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" />
                  {resending ? "Resending..." : "Resend"}
                </button>
              </div>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button
                type="button"
                onClick={handleVerifyClick}
                disabled={otp.length !== 4 || verifying}
                className="w-full sm:w-auto min-w-32"
              >
                {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {verifying ? "Verifying..." : "Verify Email"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
