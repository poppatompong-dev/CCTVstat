import "server-only";

export function perfStart() {
  return performance.now();
}

export function perfLog(label: string, start: number) {
  console.log(`[perf] ${label}: ${Math.round(performance.now() - start)}ms`);
}

export async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = perfStart();
  try {
    return await fn();
  } finally {
    perfLog(label, start);
  }
}
