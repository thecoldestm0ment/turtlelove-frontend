import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import {
  useSignup,
  useSendVerificationCode,
  useConfirmVerificationCode,
} from '@/features/auth/hooks';
import { Link } from 'react-router-dom';

// Step 1: 이메일
const emailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .refine(
      (email) => email.endsWith('.ac.kr') || email.endsWith('.edu'),
      '대학 이메일(.ac.kr, .edu)만 가입 가능합니다'
    ),
});

// Step 2: 인증번호
const codeSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .min(1, '인증번호를 입력해주세요')
    .length(6, '인증번호는 6자리입니다'),
});

// Step 3: 회원정보
const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
  passwordConfirm: z.string(),
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .min(2, '닉네임은 2자 이상이어야 합니다')
    .max(20, '닉네임은 20자 이하이어야 합니다')
    .regex(
      /^[가-힣a-zA-Z0-9]+$/,
      '닉네임은 한글, 영문, 숫자만 가능합니다'
    ),
  gender: z
    .enum(['MALE', 'FEMALE'], {
      message: '성별을 선택해주세요',
    })
    .refine((val) => val === 'MALE' || val === 'FEMALE', {
      message: '성별을 선택해주세요',
    }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});

export type SignupFormValues = z.infer<typeof signupSchema>;

type Step = 1 | 2 | 3;

const TIMER_SECONDS = 180; // 3분

function Step1Email({
  onNext,
}: {
  onNext: (email: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
  }>({
    resolver: zodResolver(emailSchema),
  });

  const { sendCode, isLoading } = useSendVerificationCode();

  const onSubmit = (data: { email: string }) => {
    sendCode(
      { email: data.email },
      {
        onSuccess: () => onNext(data.email),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="대학 이메일"
          type="email"
          placeholder="your@university.ac.kr"
          error={errors.email?.message}
          {...register('email')}
        />
        <p className="mt-2 text-xs font-ui text-text-muted">
          *.ac.kr 또는 *.edu 도메인의 대학 이메일만 가입 가능합니다
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={isLoading}>
        인증번호 받기
      </Button>

      <div className="text-center">
        <p className="text-sm font-ui text-text-muted">
          이미 회원이신가요?{' '}
          <Link
            to="/login"
            className="font-medium text-rose hover:text-rose-deep transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}

function Step2Code({
  email,
  onPrev,
  onNext,
}: {
  email: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    code: string;
  }>({
    resolver: zodResolver(codeSchema),
    defaultValues: { email },
  });

  const { confirmCode, isLoading } = useConfirmVerificationCode();

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = (data: { email: string; code: string }) => {
    confirmCode(
      { email: data.email, code: data.code },
      {
        onSuccess: () => onNext(),
      }
    );
  };

  const isExpired = timeLeft <= 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="인증번호"
          type="text"
          placeholder="6자리 숫자"
          maxLength={6}
          error={errors.code?.message || (isExpired ? '인증시간이 만료되었습니다' : undefined)}
          {...register('code', {
            onChange: (e) => {
              const value = e.target.value.replace(/\D/g, '');
              e.target.value = value;
            },
          })}
        />
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={isExpired ? 'warning' : 'success'}>
            {isExpired ? '만료됨' : '유효'}
          </Badge>
          <p className="text-xs font-ui text-text-muted">
            남은 시간: {formatTime(timeLeft)}
          </p>
        </div>
        <p className="mt-2 text-xs font-ui text-text-muted">
          이메일로 발송된 인증번호를 입력해주세요
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          size="lg"
          onClick={onPrev}
        >
          이전
        </Button>
        <Button
          type="submit"
          className="flex-1"
          size="lg"
          loading={isLoading}
          disabled={isExpired}
        >
          확인
        </Button>
      </div>
    </form>
  );
}

function Step3Signup({
  email,
  onPrev,
}: {
  email: string;
  onPrev: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email },
  });

  const { signup, isLoading } = useSignup();

  const onSubmit = (data: SignupFormValues) => {
    signup({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      university: '임시대학교', // TODO: 이메일 도메인에서 파싱
      gender: data.gender,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="비밀번호"
        type="password"
        placeholder="8자 이상, 영문+숫자"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 다시 입력"
        error={errors.passwordConfirm?.message}
        {...register('passwordConfirm')}
      />

      <Input
        label="닉네임"
        type="text"
        placeholder="2~20자, 한글/영문/숫자"
        error={errors.nickname?.message}
        {...register('nickname')}
      />

      <div>
        <label className="mb-2 block text-sm font-medium font-ui text-text-primary">
          성별
        </label>
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              value="MALE"
              className="peer sr-only"
              {...register('gender')}
            />
            <div className="rounded-lg border-2 border-warm-gray bg-warm-white px-4 py-3 text-center font-ui text-text-muted transition-all cursor-pointer peer-checked:border-rose peer-checked:bg-rose-light peer-checked:text-rose-dark hover:border-rose/50">
              남성
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              value="FEMALE"
              className="peer sr-only"
              {...register('gender')}
            />
            <div className="rounded-lg border-2 border-warm-gray bg-warm-white px-4 py-3 text-center font-ui text-text-muted transition-all cursor-pointer peer-checked:border-rose peer-checked:bg-rose-light peer-checked:text-rose-dark hover:border-rose/50">
              여성
            </div>
          </label>
        </div>
        {errors.gender && (
          <p className="mt-2 text-sm font-ui text-red-400">
            {errors.gender.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          size="lg"
          onClick={onPrev}
        >
          이전
        </Button>
        <Button type="submit" className="flex-1" size="lg" loading={isLoading}>
          가입하기
        </Button>
      </div>
    </form>
  );
}

export function SignupForm() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');

  const handleNextStep1 = (inputEmail: string) => {
    setEmail(inputEmail);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handlePrevStep2 = () => {
    setStep(1);
  };

  const handlePrevStep3 = () => {
    setStep(2);
  };

  return (
    <div className="w-full">
      {/* 진행 상태 표시 */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-rose' : 'bg-warm-gray'
            }`}
          />
        ))}
      </div>

      {/* Step 표시 */}
      <div className="mb-6 text-center">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          {step === 1 && '이메일 인증'}
          {step === 2 && '인증번호 확인'}
          {step === 3 && '정보 입력'}
        </h2>
      </div>

      {/* Step별 폼 */}
      {step === 1 && <Step1Email onNext={handleNextStep1} />}
      {step === 2 && (
        <Step2Code
          email={email}
          onPrev={handlePrevStep2}
          onNext={handleNextStep2}
        />
      )}
      {step === 3 && (
        <Step3Signup email={email} onPrev={handlePrevStep3} />
      )}
    </div>
  );
}
