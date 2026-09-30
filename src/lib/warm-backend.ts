import { API_URL } from "./config";

/**
 * Wake the backend without waiting for it. Browser-only, fire and forget.
 *
 * The API runs under Passenger on shared hosting, which retires an idle worker
 * after about five minutes; the next request then waits 25-94 seconds for a new
 * one to boot. Sign-in is exactly when that hurts, since the visitor is watching
 * a spinner. Calling this as the sign-in form appears gives the worker the
 * seconds the visitor spends typing to start up, so the real request lands on a
 * warm process.
 *
 * `no-cors` because the answer is never read; only the arrival matters.
 */
export function warmBackend(): void {
  fetch(`${API_URL}/health`, { mode: "no-cors", cache: "no-store", keepalive: true }).catch(() => {
    // Best effort. If the backend is down the form itself will say so.
  });
}
