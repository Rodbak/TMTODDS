import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        Use your email or phone number.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </main>
  );
}

