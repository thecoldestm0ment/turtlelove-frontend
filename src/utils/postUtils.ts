/**
 * post.id를 기반으로 0-100 범위의 결정론적인 warmth 값을 생성
 */
export function getWarmth(id: number): number {
  // 황금비 기반 해시 (Knuth's multiplicative hash)
  const hash = ((id * 2654435761) >>> 0) % 101;
  return hash;
}
