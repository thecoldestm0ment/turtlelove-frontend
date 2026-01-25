import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Date 객체가 유효한지 검증합니다.
 * @param date - 검증할 Date 객체
 * @returns 유효한 Date이면 true, Invalid Date이면 false
 */
function isValidDate(date: Date): date is Date {
  return !isNaN(date.getTime());
}

/**
 * 날짜를 상대적인 시간으로 포맷팅합니다.
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 상대적인 시간 문자열 (예: "5분 전", "2시간 전")
 *          유효하지 않은 입력의 경우 "방금 전"을 반환합니다.
 *
 * @example
 * formatRelativeTime("2026-01-12T14:00:00") // "5분 전"
 * formatRelativeTime("") // "방금 전" (invalid fallback)
 * formatRelativeTime("invalid-date") // "방금 전" (invalid fallback)
 */
export function formatRelativeTime(dateString: string): string {
  // 입력값 검증: 빈 문자열 또는 null/undefined 처리
  if (!dateString || dateString.trim() === '') {
    return '방금 전';
  }

  const date = new Date(dateString);

  // Invalid Date 검증
  if (!isValidDate(date)) {
    return '방금 전';
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ko,
  });
}
