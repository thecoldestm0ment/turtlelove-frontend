import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal 접근성', () => {
  describe('ARIA 속성', () => {
    it('열려있을 때 role="dialog"여야 함', () => {
      render(
        <Modal open title="테스트 모달">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('title이 있으면 접근 가능한 이름으로 제공해야 함', () => {
      render(
        <Modal open title="테스트 제목">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog', { name: '테스트 제목' });
      expect(dialog).toBeInTheDocument();
    });

    it('description이 있으면 aria-describedby가 설정되어야 함', () => {
      render(
        <Modal open title="제목" description="설명">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby');
    });
  });

  describe('포커스 관리', () => {
    it('닫기 버튼에 aria-label="대화 상자 닫기"가 있어야 함', () => {
      render(
        <Modal open title="테스트">
          <p>내용</p>
        </Modal>
      );
      const closeButton = screen.getByLabelText('대화 상자 닫기');
      expect(closeButton).toBeInTheDocument();
    });

    it('ESC 키로 모달을 닫을 수 있어야 함 (Radix UI 기본 동작)', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal open onOpenChange={handleClose} title="테스트">
          <p>내용</p>
        </Modal>
      );

      // Radix UI는 ESC 키를 자동으로 처리하여 onOpenChange를 호출함
      const dialog = screen.getByRole('dialog');
      dialog.focus();

      await user.keyboard('{Escape}');

      // Radix UI가 ESC 키를 처리하는지 확인
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('키보드 네비게이션', () => {
    it('ESC 키로 닫을 수 있어야 함', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal open onOpenChange={handleClose} title="테스트">
          <p>내용</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      dialog.focus();
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledWith(false);
      });
    });

    it('Tab 키로 포커스 이동이 가능해야 함', async () => {
      const user = userEvent.setup();

      render(
        <Modal open title="테스트">
          <button>첫 번째 버튼</button>
          <button>두 번째 버튼</button>
        </Modal>
      );

      const firstButton = screen.getByText('첫 번째 버튼');
      const secondButton = screen.getByText('두 번째 버튼');

      firstButton.focus();
      expect(firstButton).toHaveFocus();

      await user.tab();
      expect(secondButton).toHaveFocus();
    });
  });

  describe('Radix UI Dialog 구성', () => {
    it('DialogContent이 렌더링되어야 함', () => {
      render(
        <Modal open title="테스트">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('DialogPortal이 적용되어야 함 (body 외부 렌더링)', () => {
      const { container } = render(
        <Modal open title="테스트">
          <p>내용</p>
        </Modal>
      );

      // Dialog가 body의 직접적인 자식으로 렌더링되는지 확인
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(container).not.toContainHTML(dialog?.outerHTML ?? '');
    });
  });

  describe('Composition API', () => {
    it('Modal.Close가 존재해야 함', () => {
      expect(Modal.Close).toBeDefined();
    });

    it('Modal.Header가 존재해야 함', () => {
      expect(Modal.Header).toBeDefined();
    });
  });

  describe('동작', () => {
    it('trigger 버튼을 클릭하면 모달이 열려야 함', async () => {
      const user = userEvent.setup();

      render(
        <Modal
          trigger={<button>열기</button>}
          title="테스트"
        >
          <p>내용</p>
        </Modal>
      );

      const triggerButton = screen.getByText('열기');
      await user.click(triggerButton);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('open prop이 false이면 모달이 렌더링되지 않아야 함', () => {
      render(
        <Modal open={false} title="테스트">
          <p>내용</p>
        </Modal>
      );

      const dialog = screen.queryByRole('dialog');
      expect(dialog).not.toBeInTheDocument();
    });
  });

  describe('ariaLabel prop', () => {
    it('title이 없고 ariaLabel이 있으면 aria-label이 설정되어야 함', () => {
      render(
        <Modal open ariaLabel="접근성 레이블">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog', { name: '접근성 레이블' });
      expect(dialog).toBeInTheDocument();
    });

    it('title과 ariaLabel이 둘 다 있으면 title이 우선되어야 함', () => {
      render(
        // @ts-expect-error - 둘 다 제공하는 것은 타입 오류지만, 우선순위 테스트를 위해 허용
        <Modal open title="명시적 제목" ariaLabel="대체 레이블">
          <p>내용</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog', { name: '명시적 제목' });
      expect(dialog).toBeInTheDocument();
      expect(dialog).not.toHaveAttribute('aria-label');
    });
  });
});
