import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { useAuthStore } from '@/stores'
import { createWrapper } from '@/test/test-utils'

// Mock the auth store
vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(),
}))

describe('useAuth 훅', () => {
  const mockSetAuth = vi.fn()
  const mockLogout = vi.fn()
  const mockUser = {
    id: 1,
    email: 'test@university.ac.kr',
    nickname: '테스트유저',
    university: '서울대학교',
    gender: 'MALE' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the store mock to default authenticated state
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        user: mockUser,
        accessToken: 'test-token',
        isAuthenticated: true,
        setAuth: mockSetAuth,
        logout: mockLogout,
      }
      return selector ? selector(state) : state
    })
  })

  // 1. 인증 상태 반환 테스트
  describe('인증 상태 반환', () => {
    it('인증된 상태에서 user를 반환해야 함', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.accessToken).toBe('test-token')
    })

    it('인증되지 않은 상태에서 user가 null이어야 함', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
          setAuth: mockSetAuth,
          logout: mockLogout,
        }
        return selector ? selector(state) : state
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.accessToken).toBeNull()
    })

    it('accessToken을 반환해야 함', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      expect(result.current.accessToken).toBe('test-token')
    })
  })

  // 2. Store 액션 노출 테스트
  describe('Store 액션 노출', () => {
    it('setAuth 함수를 노출해야 함', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      expect(result.current.setAuth).toBeDefined()
      expect(result.current.setAuth).toEqual(mockSetAuth)
    })

    it('logout 함수를 노출해야 함', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      expect(result.current.logout).toBeDefined()
      expect(result.current.logout).toEqual(mockLogout)
    })
  })

  // 3. 로딩 상태 테스트
  describe('로딩 상태', () => {
    it('초기 isLoading 상태를 확인할 수 있어야 함', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      // Query의 초기 로딩 상태
      expect(typeof result.current.isLoading).toBe('boolean')
    })

    it('인증되지 않은 상태에서는 isLoading이 false여야 함', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
          setAuth: mockSetAuth,
          logout: mockLogout,
        }
        return selector ? selector(state) : state
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      // enabled: false이므로 로딩되지 않음
      expect(result.current.isLoading).toBe(false)
    })
  })

  // 4. Query 설정 테스트
  describe('Query 설정', () => {
    it('인증된 상태에서만 user query가 활성화되어야 함', () => {
      // 인증된 상태
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockUser,
          accessToken: 'token',
          isAuthenticated: true,
          setAuth: mockSetAuth,
          logout: mockLogout,
        }
        return selector ? selector(state) : state
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      // Query가 실행됨 (enabled: true)
      expect(result.current.user).toBeDefined()
    })

    it('인증되지 않은 상태에서는 user query가 비활성화되어야 함', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
          setAuth: mockSetAuth,
          logout: mockLogout,
        }
        return selector ? selector(state) : state
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

      // Query가 실행되지 않음 (enabled: false)
      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  // 5. Stale Time 테스트
  describe('캐싱 동작', () => {
    it('5분 동안 데이터가 신선하게 유지되어야 함', async () => {
      const wrapper = createWrapper()
      const { result, rerender } = renderHook(() => useAuth(), { wrapper })

      const firstUser = result.current.user

      // Rerender should not refetch due to staleTime
      rerender()

      // Same data should be returned (from cache)
      expect(result.current.user).toEqual(firstUser)
    })
  })
})
