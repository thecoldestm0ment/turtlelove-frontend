import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="page-enter flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl bg-warm-white p-8 shadow-soft-md">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            TurtleLove
          </h1>
          <p className="mt-2 text-sm font-ui text-text-muted">
            대학생들을 위한 익명 연애 상담 커뮤니티
          </p>
        </div>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
