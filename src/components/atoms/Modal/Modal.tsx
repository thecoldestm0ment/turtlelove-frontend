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

export interface ModalProps extends DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  ...props
}: ModalProps) {
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
          'hover:text-text-primary'
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
