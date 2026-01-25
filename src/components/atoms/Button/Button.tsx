import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
}

const variantStyles = {
  primary: [
    'bg-gradient-to-br from-rose to-rose-deep',
    'text-white',
    'shadow-rose',
    'hover:shadow-lg',
    'hover:-translate-y-0.5',
    'active:translate-y-0',
    'active:shadow-soft-md',
    'disabled:from-warm-gray',
    'disabled:to-warm-gray',
    'disabled:shadow-none',
    'disabled:translate-y-0',
  ],
  secondary: [
    'bg-sage',
    'text-white',
    'shadow-sage',
    'hover:bg-sage-deep',
    'hover:shadow-lg',
    'hover:-translate-y-0.5',
    'active:translate-y-0',
  ],
  ghost: [
    'bg-transparent',
    'text-text-primary',
    'hover:bg-soft-gray',
    'active:bg-warm-gray',
  ],
  danger: [
    'bg-red-400',
    'text-white',
    'shadow-soft-md',
    'hover:bg-red-500',
  ],
} as const;

const sizeStyles = {
  sm: ['px-4', 'py-2', 'text-sm', 'rounded-sm'],
  md: ['px-6', 'py-3', 'text-base', 'rounded-md'],
  lg: ['px-8', 'py-4', 'text-lg', 'rounded-lg'],
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    // Slot(asChild)는 단 하나의 자식만 허용하므로 loading 스피너를 사용할 수 없음
    if (asChild && loading) {
      console.warn(
        'Button: "loading" prop cannot be used with "asChild". ' +
        'Loading spinner will be hidden, but disabled state remains.'
      );
    }

    const buttonClassName = cn(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'font-ui',
      'font-medium',
      'transition-all',
      'duration-[var(--duration-normal)]',
      'ease-out',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',
      'touch-target',
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    // asChild일 때는 Slot을 사용하며 children만 전달 (단일 자식 요소만 허용)
    if (asChild) {
      const { type: _, ...restProps } = props;
      return (
        <Slot
          ref={ref}
          className={buttonClassName}
          {...restProps}
        >
          {children}
        </Slot>
      );
    }

    // 일반 버튼일 때는 loading spinner와 children을 함께 렌더링
    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
