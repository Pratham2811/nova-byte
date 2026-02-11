import { RegisterForm } from "@/features/auth/registeration/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] min-h-[640px] bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 flex flex-col justify-center relative">
        <RegisterForm />
      </div>
    </div>
  );
}