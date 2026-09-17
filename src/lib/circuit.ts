/**
 * Circuit breaker generik (mail, SMTP, fetch eksternal).
 * - Open setelah `threshold` gagal dalam `windowMs` → fast-fail hemat waktu.
 * - Half-open: 1 probe setelah `cooldownMs`; sukses → close, gagal → open lagi.
 * - Registry per nama agar state berbagi antar request satu instance.
 */

export interface BreakerOptions {
  threshold?: number;
  windowMs?: number;
  cooldownMs?: number;
}

interface State {
  failures: number[];
  openedAt: number | null;
  /** true = masa half-open, 1 probe diizinkan; gagal → open lagi langsung. */
  probing: boolean;
}

const states = new Map<string, State>();

export interface Breaker {
  /** false = sedang open, caller harus pakai fallback tanpa menunggu. */
  canRun(now?: number): boolean;
  recordSuccess(): void;
  recordFailure(now?: number): void;
  isOpen(now?: number): boolean;
}

export function getBreaker(name: string, opts: BreakerOptions = {}): Breaker {
  const { threshold = 5, windowMs = 60_000, cooldownMs = 30_000 } = opts;
  const state = (): State => {
    let s = states.get(name);
    if (!s) {
      s = { failures: [], openedAt: null, probing: false };
      states.set(name, s);
    }
    return s;
  };

  return {
    canRun(now = Date.now()) {
      return !this.isOpen(now);
    },
    isOpen(now = Date.now()) {
      const s = state();
      if (s.openedAt === null) return false;
      if (now - s.openedAt >= cooldownMs) {
        // Half-open: izinkan 1 probe; kegagalan berikutnya open lagi langsung
        s.openedAt = null;
        s.failures = [];
        s.probing = true;
        return false;
      }
      return true;
    },
    recordSuccess() {
      const s = state();
      s.failures = [];
      s.openedAt = null;
      s.probing = false;
    },
    recordFailure(now = Date.now()) {
      const s = state();
      if (s.probing) {
        s.probing = false;
        s.failures = [now];
        s.openedAt = now;
        return;
      }
      s.failures = s.failures.filter((t) => t > now - windowMs);
      s.failures.push(now);
      if (s.failures.length >= threshold) s.openedAt = now;
    },
  };
}

/** Reset semua state (skrip validasi lokal). */
export function resetBreakers(): void {
  states.clear();
}
