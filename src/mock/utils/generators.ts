/**
 * Mock 데이터 생성 유틸리티
 */

let idCounter = 10000; // 높은 ID부터 시작 (기존 데이터와 충돌 방지)

export function generateId(): number {
  return idCounter++;
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

export function resetIdCounter(): void {
  idCounter = 10000;
}

/**
 * 과거 날짜 생성 (N일 전)
 */
export function generatePastTimestamp(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}
