import React from "react";
import { EmailInput } from "./components/EmailInput";
import { useSelector } from "react-redux";
import { VerifyEmailOtpStep } from "./components/OtpInput";
import { AccountInfoStep } from "./components/AccountInfoStep";

export function RegisterForm() {
  const { step } = useSelector((state) => state.auth.registeration);
  switch (step) {
    case "EMAIL":
      return <EmailInput />;

    case "OTP":
      return <VerifyEmailOtpStep />;

    case "INFO":
      return <AccountInfoStep />;

    default:
      return <EmailInput />;
  }
}
