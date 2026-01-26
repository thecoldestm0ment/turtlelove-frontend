import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button 컴포넌트', () => {
  // 1. 기본 렌더링
  describe('기본 렌더링', () => {
    it('텍스트 콘텐츠를 렌더링해야 함', () => {
      render(<Button>클릭</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('클릭')
    })

    it('기본 variant는 primary여야 함', () => {
      render(<Button>버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('from-rose')
    })

    it('기본 size는 md여야 함', () => {
      render(<Button>버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3')
    })
  })

  // 2. Variant 테스트
  describe('Variant 변형', () => {
    it('variant=primary일 때 올바른 스타일을 적용해야 함', () => {
      render(<Button variant="primary">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('from-rose', 'to-rose-deep')
    })

    it('variant=secondary일 때 올바른 스타일을 적용해야 함', () => {
      render(<Button variant="secondary">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-sage')
    })

    it('variant=ghost일 때 올바른 스타일을 적용해야 함', () => {
      render(<Button variant="ghost">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })

    it('variant=danger일 때 올바른 스타일을 적용해야 함', () => {
      render(<Button variant="danger">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-400')
    })
  })

  // 3. Size 테스트
  describe('Size 변형', () => {
    it('size=sm일 때 올바른 크기 스타일을 적용해야 함', () => {
      render(<Button size="sm">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'rounded-sm')
    })

    it('size=md일 때 올바른 크기 스타일을 적용해야 함', () => {
      render(<Button size="md">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-base', 'rounded-md')
    })

    it('size=lg일 때 올바른 크기 스타일을 적용해야 함', () => {
      render(<Button size="lg">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg', 'rounded-lg')
    })
  })

  // 4. Disabled 상태 테스트
  describe('Disabled 상태', () => {
    it('disabled일 때 버튼이 비활성화되어야 함', () => {
      render(<Button disabled>버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-60')
    })

    it('disabled일 때 클릭 이벤트가 발생하지 않아야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button disabled onClick={handleClick}>버튼</Button>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // 5. Loading 상태 테스트
  describe('Loading 상태', () => {
    it('loading일 때 스피너를 렌더링해야 함', () => {
      render(<Button loading>로딩</Button>)
      const button = screen.getByRole('button')
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(button.querySelector('svg')).toHaveClass('animate-spin')
    })

    it('loading일 때 버튼이 비활성화되어야 함', () => {
      render(<Button loading>로딩</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('loading일 때 텍스트를 여전히 렌더링해야 함', () => {
      render(<Button loading>로딩 중</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('로딩 중')
    })
  })

  // 6. asChild 기능 테스트
  describe('asChild 기능', () => {
    it('asChild일 때 Slot 컴포넌트를 사용해야 함', () => {
      render(
        <Button asChild>
          <a href="/test">링크 버튼</a>
        </Button>
      )
      // 버튼이 아닌 링크로 렌더링되어야 함
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
    })

    it('asChild와 loading을 함께 사용하면 콘솔 경고를 띄워야 함', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <Button asChild loading>
          <span>버튼</span>
        </Button>
      )

      expect(consoleWarn).toHaveBeenCalled()
      consoleWarn.mockRestore()
    })
  })

  // 7. 클릭 이벤트 테스트
  describe('클릭 이벤트', () => {
    it('클릭 시 onClick 핸들러가 호출되어야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>클릭</Button>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('여러 번 클릭 시 핸들러가 각각 호출되어야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>클릭</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  // 8. ARIA 속성 테스트
  describe('접근성 (ARIA)', () => {
    it('추가 ARIA 속성을 전달해야 함', () => {
      render(
        <Button aria-label="닫기" aria-describedby="close-desc">
          X
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', '닫기')
      expect(button).toHaveAttribute('aria-describedby', 'close-desc')
    })
  })

  // 9. className 병합 테스트
  describe('className 병합', () => {
    it('추가 className이 기본 스타일과 병합되어야 함', () => {
      render(<Button className="custom-class">버튼</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('inline-flex') // 기본 스타일도 유지
    })
  })
})
