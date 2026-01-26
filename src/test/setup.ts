import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Tailwind CSS를 테스트 환경에서도 로드
// globals.css는 실제 CSS를 포함하므로, 테스트용 모의 설정만 사용
vi.mock('./styles/globals.css', () => ({}))

// window.matchMedia 모의 (미디어 쿼리 사용 시)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// IntersectionObserver 모의 (무한스크롤 등에서 사용)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver
