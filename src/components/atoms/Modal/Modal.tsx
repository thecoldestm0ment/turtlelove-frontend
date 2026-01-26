import {
  type DialogProps,
  Content as DialogContent,
  Portal as DialogPortal,
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClosePrimitive,
} from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

// 기본 props (항상 필요)
type BaseModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  description?: string;
  children: ReactNode;
};

// Discriminated union: title 또는 ariaLabel 중 하나는 필수
// WCAG 2.1 SC 4.1.2 준수를 위해 모달에 접근성 이름이 항상 있어야 함
export type ModalProps = BaseModalProps & Omit<DialogProps, 'title'> & (
  | { title: string; ariaLabel?: never } // title 사용 시 ariaLabel 불가
  | { title?: never; ariaLabel: string } // ariaLabel 사용 시 title 불가
);

export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  ariaLabel,
  children,
  ...props
}: ModalProps) {
  // 개발 모드에서 런타임 검증
  if (process.env.NODE_ENV === 'development') {
    if (!title && !ariaLabel) {
      console.warn(
        'Modal: title 또는 ariaLabel 중 하나는 필수입니다. ' +
          '모달에 접근성 이름이 없어 WCAG 2.1 SC 4.1.2를 위반할 수 있습니다.'
      );
    }
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={onOpenChange}
      modal={true}
      {...props}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          aria-label={!title ? ariaLabel : undefined}
          className={cn(
            'fixed',
            'left-1/2',
            'top-1/2',
            'z-50',
            'w-full',
            'max-w-md',
            '-translate-x-1/2',
            '-translate-y-1/2',
            'rounded-xl',
            'bg-warm-white',
            'p-6',
            'shadow-soft-xl',
            'animate-in',
            'fade-in-0',
            'zoom-in-95',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0',
            'data-[state=closed]:zoom-out-95'
          )}
        >
          {title && (
            <DialogHeader>
              <DialogTitle asChild>
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  {title}
                </h2>
              </DialogTitle>
              {description && (
                <DialogDescription asChild>
                  <p className="font-body text-sm text-text-secondary mt-1">
                    {description}
                  </p>
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
          <DialogClose />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}

function DialogOverlay() {
  return (
    <div
      className={cn(
        'fixed',
        'inset-0',
        'z-50',
        'bg-black/20',
        'backdrop-blur-sm',
        'animate-in',
        'fade-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out'
      )}
    />
  );
}

function DialogHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {children}
    </div>
  );
}

function DialogClose() {
  return (
    <DialogClosePrimitive asChild>
      <button
        type="button"
        className={cn(
          'absolute',
          'right-4',
          'top-4',
          'rounded-full',
          'p-1',
          'text-text-muted',
          'transition-colors',
          'hover:bg-soft-gray',
          'hover:text-text-primary',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary',
          'focus-visible:ring-offset-2'
        )}
        aria-label="대화 상자 닫기"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </DialogClosePrimitive>
  );
}

// Composition API
Modal.Header = DialogHeader;
Modal.Close = DialogClose;
