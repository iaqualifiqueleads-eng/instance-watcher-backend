import pRetry from 'p-retry';

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
): Promise<T> {
  return pRetry(fn, {
    retries,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 15000,
  });
}
