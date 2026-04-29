import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        Sign up with email or phone. Your dashboard will show your active
        subscription and expiry time.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </main>
  );
}

