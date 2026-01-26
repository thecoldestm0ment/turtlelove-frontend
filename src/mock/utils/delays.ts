/**
 * 네트워크 지연 시뮬레이션
 */

export async function simulateNetworkDelay(min = 200, max = 800): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function simulateLongDelay(min = 1000, max = 3000): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
