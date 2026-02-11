import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { updateFormData } from "../../slices/authSlice";
import { sendOtp } from "../../thunks/registrationThunks";

export function EmailInput() {
  const { isLoading } = useSelector((state) => state.auth.registeration);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateFormData({ email }));
      const response = await dispatch(sendOtp(email)).unwrap();
      toast.success("OTP Sent Successfully");
    } catch (error) {
      toast.error(error || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-9 items-center justify-center rounded-md border">
              <GalleryVerticalEnd className="size-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Step 1 of 3 · Create account
            </p>

            <h1 className="text-xl font-semibold">Welcome to Acme Inc.</h1>

            <FieldDescription>Enter your email to get started</FieldDescription>
          </div>

          {/* Email field */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Field>

          {/* CTA */}
          <Button type="submit" className="w-full" disabled={!email||isLoading}>
            {isLoading ? "Sending code..." : "Continue"}
          </Button>

          {/* Social auth (secondary) */}
          <FieldSeparator>Or continue with</FieldSeparator>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" type="button">
              Continue with Apple
            </Button>
            <Button variant="outline" type="button">
              Continue with Google
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
