import { authApi } from '@/features/auth/api/authApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useSignup() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login', {
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' },
      });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
      // TODO: 에러 처리 (토스트 등)
    },
  });

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// 이메일 인증번호 발송
export function useSendVerificationCode() {
  const mutation = useMutation({
    mutationFn: authApi.sendVerificationCode,
    onError: (error) => {
      console.error('Send verification code failed:', error);
    },
  });

  return {
    sendCode: mutation.mutate,
    sendCodeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// 인증번호 확인
export function useConfirmVerificationCode() {
  const mutation = useMutation({
    mutationFn: authApi.confirmVerificationCode,
    onError: (error) => {
      console.error('Confirm verification code failed:', error);
    },
  });

  return {
    confirmCode: mutation.mutate,
    confirmCodeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
