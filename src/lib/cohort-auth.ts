"use client";

const DEFAULT_COHORT_PASSWORD = process.env.NEXT_PUBLIC_COHORT_PASSWORD || "elemen2";
const STORAGE_COHORT_PASSWORD_KEY = "elemen2_cohort_password";
const STORAGE_COHORT_TOKEN_KEY = "elemen2_cohort_token";
const STORAGE_LAST_KNOWN_HASH_KEY = "elemen2_cohort_last_known_hash";
const COHORT_AUTH_EVENT = "elemen2_cohort_auth_changed";

/**
 * Deterministic hash function for token and password fingerprinting.
 * Fast, synchronous, and operates identically on browser and server.
 */
export function hashString(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/**
 * Get active cohort password.
 * Checks localStorage first, then falls back to environment variable or default.
 */
export function getCohortPassword(): string {
  if (typeof window === "undefined") return DEFAULT_COHORT_PASSWORD;
  return localStorage.getItem(STORAGE_COHORT_PASSWORD_KEY) || DEFAULT_COHORT_PASSWORD;
}

/**
 * Generates the expected session token for a given password (or current active password).
 */
export function getCohortPasswordToken(password?: string): string {
  const targetPassword = password !== undefined ? password : getCohortPassword();
  return hashString(`elemen2_cohort_salt_${targetPassword.trim()}`);
}

/**
 * Checks if the current visitor has authenticated with the CURRENT active cohort password.
 * If the password was changed by admin, the stored token will not match, returning false.
 */
export function isCohortAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const currentExpectedToken = getCohortPasswordToken();
  const storedToken = localStorage.getItem(STORAGE_COHORT_TOKEN_KEY);

  if (!storedToken) return false;

  const isValid = storedToken === currentExpectedToken;
  if (!isValid) {
    // If token exists but is invalid, it means the password was changed!
    // Clean up outdated token
    localStorage.removeItem(STORAGE_COHORT_TOKEN_KEY);
  }

  return isValid;
}

/**
 * Check if the user previously had a session that was invalidated due to a password change.
 */
export function wasPasswordRecentlyChanged(): boolean {
  if (typeof window === "undefined") return false;
  const lastKnownHash = localStorage.getItem(STORAGE_LAST_KNOWN_HASH_KEY);
  const currentHash = getCohortPasswordToken();
  return Boolean(lastKnownHash && lastKnownHash !== currentHash);
}

/**
 * Clear the password changed flag once the user is notified or logs in.
 */
export function clearPasswordChangedFlag(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_LAST_KNOWN_HASH_KEY, getCohortPasswordToken());
}

/**
 * Attempt to unlock cohort access by providing the global password.
 */
export function verifyAndUnlockCohort(enteredPassword: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window undefined" };

  const currentPassword = getCohortPassword().trim();
  if (enteredPassword.trim() === currentPassword) {
    const token = getCohortPasswordToken(currentPassword);
    localStorage.setItem(STORAGE_COHORT_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_LAST_KNOWN_HASH_KEY, token);

    window.dispatchEvent(new CustomEvent(COHORT_AUTH_EVENT, { detail: { authenticated: true } }));
    return { success: true };
  }

  return { success: false, error: "Incorrect cohort password. Please check with your group admin." };
}

/**
 * Lock cohort access on this device immediately.
 */
export function lockCohort(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_COHORT_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(COHORT_AUTH_EVENT, { detail: { authenticated: false } }));
}

/**
 * Admin action: Update the global cohort password.
 * Automatically rotates the token, updates admin's device, and invalidates all other devices.
 */
export function updateCohortPassword(newPassword: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window undefined" };

  const trimmed = newPassword.trim();
  if (!trimmed || trimmed.length < 3) {
    return { success: false, error: "Password must be at least 3 characters" };
  }

  const oldToken = getCohortPasswordToken();
  // Record old token as last known hash before updating
  localStorage.setItem(STORAGE_LAST_KNOWN_HASH_KEY, oldToken);

  // Save new password
  localStorage.setItem(STORAGE_COHORT_PASSWORD_KEY, trimmed);

  // Re-authorize this admin device with the new token
  const newToken = getCohortPasswordToken(trimmed);
  localStorage.setItem(STORAGE_COHORT_TOKEN_KEY, newToken);

  // Notify listeners across app
  window.dispatchEvent(new CustomEvent(COHORT_AUTH_EVENT, { detail: { authenticated: true, passwordChanged: true } }));

  // Notify other tabs via storage trigger
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_COHORT_PASSWORD_KEY, newValue: trimmed }));

  return { success: true };
}

/**
 * Subscribe to cohort authentication state changes (local events & storage updates).
 */
export function subscribeToCohortAuth(callback: (authenticated: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(isCohortAuthenticated());
  };

  window.addEventListener(COHORT_AUTH_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(COHORT_AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Sync with server-side password configuration if deployed with an environment variable.
 */
export async function syncServerCohortAuth(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const res = await fetch("/api/cohort-auth", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.serverPasswordHash) {
      const localToken = getCohortPasswordToken();
      if (data.serverPasswordHash !== localToken && data.hasCustomServerPassword) {
        // Server password was changed (e.g. via Vercel env var)!
        // If stored token no longer matches, invalidate
        const userToken = localStorage.getItem(STORAGE_COHORT_TOKEN_KEY);
        if (userToken && userToken !== data.serverPasswordHash) {
          localStorage.removeItem(STORAGE_COHORT_TOKEN_KEY);
          localStorage.setItem(STORAGE_LAST_KNOWN_HASH_KEY, userToken);
          window.dispatchEvent(new CustomEvent(COHORT_AUTH_EVENT, { detail: { authenticated: false } }));
        }
      }
    }
  } catch {
    // Graceful offline degradation
  }
}
