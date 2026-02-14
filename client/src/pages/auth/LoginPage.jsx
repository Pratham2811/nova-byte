import LoginForm from "@/features/auth/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 font-sans text-slate-900">
      <div className="w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <LoginForm />
      </div>
    </div>
  );
}
