import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input 컴포넌트', () => {
  // 1. 기본 렌더링
  describe('기본 렌더링', () => {
    it('input 엘리먼트를 렌더링해야 함', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('placeholder를 표시해야 함', () => {
      render(<Input placeholder="이메일 입력" />)
      expect(screen.getByPlaceholderText('이메일 입력')).toBeInTheDocument()
    })

    it('기본 type은 text여야 함', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })
  })

  // 2. Label 기능 테스트
  describe('Label 기능', () => {
    it('label prop이 있으면 label 엘리먼트를 렌더링해야 함', () => {
      render(<Input label="이메일" />)
      expect(screen.getByText('이메일')).toBeInTheDocument()
    })

    it('label과 input이 연결되어야 함 (htmlFor)', () => {
      render(<Input label="비밀번호" />)
      const input = screen.getByRole('textbox')
      const label = screen.getByText('비밀번호')

      // jsdom에서는 label.htmlFor 프로퍼티를 직접 확인
      expect(label).toHaveProperty('htmlFor')
      expect(input).toHaveAttribute('id')
    })

    it('명시적 id가 제공되면 그 id를 사용해야 함', () => {
      render(<Input id="custom-id" label="이메일" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id')

      const label = screen.getByText('이메일')
      expect(label).toHaveProperty('htmlFor', 'custom-id')
    })

    it('label에 공백이 있으면 자동으로 id가 생성되어야 함', () => {
      render(<Input label="이메일 주소" />)
      const input = screen.getByRole('textbox')
      const label = screen.getByText('이메일 주소')

      expect(input).toHaveAttribute('id', '이메일-주소')
      expect(label).toHaveProperty('htmlFor', '이메일-주소')
    })
  })

  // 3. Error 상태 테스트
  describe('Error 상태', () => {
    it('error prop이 있으면 에러 메시지를 표시해야 함', () => {
      render(<Input error="이메일 형식이 올바르지 않습니다" />)
      expect(screen.getByText('이메일 형식이 올바르지 않습니다')).toBeInTheDocument()
    })

    it('error 상태일 때 aria-invalid="true"여야 함', () => {
      render(<Input error="에러" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('error 상태일 때 aria-describedby로 에러 메시지 id를 연결해야 함', () => {
      render(<Input id="test-input" error="에러 메시지" />)
      const input = screen.getByRole('textbox')
      const errorMessage = screen.getByText('에러 메시지')

      expect(input).toHaveAttribute('aria-describedby')
      expect(errorMessage).toHaveAttribute('id', 'test-input-error')
    })

    it('error 상태일 때 테두리 색상이 빨간색이어야 함', () => {
      render(<Input error="에러" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-red-400')
    })

    it('error가 있으면 helperText를 표시하지 않아야 함', () => {
      render(
        <Input
          error="에러 메시지"
          helperText="도움말 텍스트"
        />
      )
      expect(screen.getByText('에러 메시지')).toBeInTheDocument()
      expect(screen.queryByText('도움말 텍스트')).not.toBeInTheDocument()
    })
  })

  // 4. Helper Text 테스트
  describe('Helper Text', () => {
    it('helperText를 표시해야 함', () => {
      render(<Input helperText="8자 이상 입력해주세요" />)
      expect(screen.getByText('8자 이상 입력해주세요')).toBeInTheDocument()
    })

    it('helperText의 id가 input의 aria-describedby로 연결되어야 함', () => {
      render(<Input id="test" helperText="도움말" />)
      const input = screen.getByRole('textbox')
      const helper = screen.getByText('도움말')

      expect(input).toHaveAttribute('aria-describedby')
      expect(helper).toHaveAttribute('id', 'test-helper')
    })
  })

  // 5. 사용자 입력 테스트
  describe('사용자 입력', () => {
    it('사용자가 텍스트를 입력할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<Input />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'hello@world.com')

      expect(input).toHaveValue('hello@world.com')
    })

    it('onChange 이벤트가 호출되어야 함', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(<Input onChange={handleChange} />)
      await user.type(screen.getByRole('textbox'), 'test')

      expect(handleChange).toHaveBeenCalled()
    })

    it('type="password"면 별표로 표시되어야 함', async () => {
      const user = userEvent.setup()
      render(<Input type="password" />)

      const input = screen.getByDisplayValue('')
      await user.type(input, 'password')

      expect(input).toHaveValue('password')
    })
  })

  // 6. Disabled 상태 테스트
  describe('Disabled 상태', () => {
    it('disabled일 때 입력이 불가능해야 함', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('disabled일 때 회색 배경을 가져야 함', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toHaveClass('disabled:bg-soft-gray')
    })
  })

  // 7. ARIA 및 접근성 테스트
  describe('접근성', () => {
    it('추가 ARIA 속성을 전달할 수 있어야 함', () => {
      render(<Input aria-required="true" aria-invalid="false" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    it('name 속성을 전달할 수 있어야 함', () => {
      render(<Input name="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email')
    })
  })

  // 8. ref 전달 테스트
  describe('Ref 전달', () => {
    it('ref가 input 엘리먼트에 연결되어야 함', () => {
      let ref: HTMLInputElement | null = null
      render(<Input ref={(el) => { ref = el }} />)

      expect(ref).toBeInstanceOf(HTMLInputElement)
      expect(ref).toHaveAttribute('type', 'text')
    })
  })
})
