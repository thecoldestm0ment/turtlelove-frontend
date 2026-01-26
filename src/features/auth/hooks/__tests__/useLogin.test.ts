import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useLogin } from '../useLogin'
import { authApi } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/stores'
import { createWrapper } from '@/test/test-utils'

// Mock dependencies
vi.mock('@/features/auth/api/authApi')
vi.mock('@/stores')
const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useLogin 훅', () => {
  const mockSetAuth = vi.fn()
  const mockSetToken = vi.fn()
  const mockCredentials = {
    email: 'test@university.ac.kr',
    password: 'password123!',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useAuthStore
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        setAuth: mockSetAuth,
        setToken: mockSetToken,
      }
      // Selector pattern support
      return selector ? selector(state) : state
    })
  })

  afterEach(() => {
    // 타이머가 가짜 상태로 남아있으면 실제 타이머로 복원
    vi.useRealTimers()
  })

  // 1. 성공적인 로그인 테스트
  describe('성공적인 로그인', () => {
    it('로그인이 성공하면 토큰을 저장해야 함', async () => {
      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }

      vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalledWith('new-access-token')
      })
    })

    it('로그인이 성공하면 유저 정보를 저장해야 함', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }

      vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(mockSetAuth).toHaveBeenCalledWith(
          expect.objectContaining({
            email: mockCredentials.email,
            nickname: '익명',
            university: '미정',
            gender: null,
          }),
          'access-token'
        )
      })
    })

    it('로그인이 성공하면 /posts로 이동해야 함', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }

      vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/posts')
      })
    })

    it('로그인이 성공하면 isLoading이 false여야 함', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }

      vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      expect(result.current.isLoading).toBe(false)

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  // 2. 로그인 실패 테스트
  describe('로그인 실패', () => {
    it('이메일 또는 비밀번호가 틀리면 에러를 반환해야 함', async () => {
      const mockError = new Error('이메일 또는 비밀번호가 일치하지 않습니다.')
      vi.mocked(authApi.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })
    })

    it('로그인 실패 시 콘솔에 에러를 로깅해야 함', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockError = new Error('Login failed')
      vi.mocked(authApi.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Login failed:', mockError)
      })

      consoleError.mockRestore()
    })

    it('로그인 실패 시 토큰이 저장되지 않아야 함', async () => {
      const mockError = new Error('Unauthorized')
      vi.mocked(authApi.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(mockSetToken).not.toHaveBeenCalled()
      expect(mockSetAuth).not.toHaveBeenCalled()
    })
  })

  // 3. 로딩 상태 테스트
  describe('로딩 상태', () => {
    it('로그인 요청 중 isLoading이 true여야 함', async () => {
      vi.useFakeTimers()

      vi.mocked(authApi.login).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ accessToken: 'token', refreshToken: 'refresh' }), 100))
      )

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      // 마이크로태스크를 처리하여 React Query가 상태를 업데이트하도록 함
      await vi.advanceTimersByTimeAsync(0)

      // isLoading이 true가 되는 것을 확인
      expect(result.current.isLoading).toBe(true)

      // 타이머를 100ms 진행시켜 Promise가 resolve되도록 함
      await vi.advanceTimersByTimeAsync(100)

      // 모든 마이크로태스크가 완료될 때까지 대기
      await vi.runAllTimersAsync()

      // isLoading이 false가 되는 것을 확인
      expect(result.current.isLoading).toBe(false)
    })
  })

  // 4. API 호출 테스트
  describe('API 호출', () => {
    it('authApi.login을 올바른 인자로 호출해야 함', async () => {
      vi.mocked(authApi.login).mockResolvedValueOnce({
        accessToken: 'token',
        refreshToken: 'refresh',
      })

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.login(mockCredentials)

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalled()
        expect(vi.mocked(authApi.login).mock.calls[0][0]).toEqual(mockCredentials)
      })
    })
  })

  // 5. 비동기 버전 테스트
  describe('loginAsync', () => {
    it('loginAsync로 Promise를 반환받을 수 있어야 함', async () => {
      const mockResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
      }
      vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      const promise = result.current.loginAsync(mockCredentials)

      await expect(promise).resolves.toBeDefined()
      expect(mockNavigate).toHaveBeenCalledWith('/posts')
    })

    it('loginAsync는 에러를 throw해야 함', async () => {
      const mockError = new Error('Login failed')
      vi.mocked(authApi.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      await expect(
        result.current.loginAsync(mockCredentials)
      ).rejects.toThrow('Login failed')
    })
  })
})
