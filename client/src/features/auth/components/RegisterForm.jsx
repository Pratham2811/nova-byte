import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRegisterations } from "../hooks/useRegisteration";
import { OTPVerificationDialog } from "./OtpFrom";

export function SignupForm({ className, ...props }) {
 

  const {
    email,
    password,
    error,
    name,
    handleSubmit,
    setName,
    setEmail,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    isEmailVerified,
    handleOptSending,
    resetEmailVerification,
    otpDialogOpen,     
    setOtpDialogOpen
  } = useRegisterations();

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-md">
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold">
              Create your account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>{
                         setEmail(e.target.value);
                         resetEmailVerification();

                      }}
                      placeholder="m@example.com"
                      required
                      className="pr-24"
                    />

                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80"
                      disabled={!email}
                      onClick={() => {
                        handleOptSending(email);

                       
                      }}
                    >
                      Verify
                    </button>
                  </div>
                </Field>

                <Field className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Field>
                </Field>

                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>

                <Field>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!isEmailVerified || loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="#">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="mt-6 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>

      <OTPVerificationDialog
        open={otpDialogOpen}
        onOpenChange={setOtpDialogOpen}
      />
    </div>
  );
}
