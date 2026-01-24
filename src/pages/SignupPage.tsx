import { SignupForm } from '@/features/auth/components/SignupForm';

export function SignupPage() {
  return (
    <div className="page-enter flex min-h-screen items-center justify-center bg-cream px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-warm-white p-8 shadow-soft-md">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            회원가입
          </h1>
          <p className="mt-2 text-sm font-ui text-text-muted">
            대학생만 이용할 수 있는 안전한 공간
          </p>
        </div>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
