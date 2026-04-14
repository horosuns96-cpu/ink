type TickFn = (timestamp: number) => void;

const subscribers = new Set<TickFn>();
let rafId: number | null = null;

function loop(timestamp: number) {
  subscribers.forEach(fn => fn(timestamp));
  rafId = requestAnimationFrame(loop);
}

export function subscribeRaf(fn: TickFn): () => void {
  subscribers.add(fn);
  if (subscribers.size === 1) {
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
