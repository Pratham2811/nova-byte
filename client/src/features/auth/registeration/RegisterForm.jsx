import React from "react";
import { useSelector } from "react-redux";
import { EmailInput } from "./components/EmailInput";
import { VerifyEmailOtpStep } from "./components/OtpInput";
import { AccountInfoStep } from "./components/AccountInfoStep";
import { Check } from "lucide-react";

export function RegisterForm() {
  const { step } = useSelector((state) => state.auth.registeration);

  // Mapping steps to internal names
  const steps = [
    { id: "EMAIL", label: "Email" },
    { id: "OTP", label: "Verification" },
    { id: "INFO", label: "Details" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  let StepComponent;
  switch (step) {
    case "EMAIL":
      StepComponent = <EmailInput />;
      break;
    case "OTP":
      StepComponent = <VerifyEmailOtpStep />;
      break;
    case "INFO":
      StepComponent = <AccountInfoStep />;
      break;
    default:
      StepComponent = <EmailInput />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="flex flex-col items-center py-12 px-6 sm:px-12 lg:px-24">
        
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="text-slate-500 text-base max-w-sm mx-auto">
            Join thousands of developers building the future of software with Acme Inc.
          </p>
        </div>

        {/* Modern Step Indicator */}
        <div className="w-full max-w-md mb-12 relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
          
          <div className="flex justify-between items-center w-full">
            {steps.map((s, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                      ${isCompleted 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : isCurrent 
                          ? "border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]" 
                          : "border-slate-200 text-slate-400 bg-slate-50"}
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-300 ${isCurrent ? "text-indigo-600" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area (Constrained Width) */}
        <div className="w-full max-w-[500px]">
          {StepComponent}
        </div>
        
      </div>
    </div>
  );
}