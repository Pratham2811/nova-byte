import { RegisterForm } from "@/features/auth/registeration/RegisterForm";


export default function RegisterPage() {
  return (
 
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 font-sans text-slate-900">
      <div className="w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <RegisterForm />
      </div>
    </div>
  );
}