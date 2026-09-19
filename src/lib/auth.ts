"use client";

const DEFAULT_PIN = process.env.NEXT_PUBLIC_MAINTAINER_PASSWORD || "1234";
const STORAGE_PIN_KEY = "elemen2_maintainer_pin";
const STORAGE_AUTH_KEY = "elemen2_maintainer_unlocked";
const AUTH_EVENT_NAME = "elemen2_auth_changed";

export function getMaintainerPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(STORAGE_PIN_KEY) || DEFAULT_PIN;
}

export function isMaintainerUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_AUTH_KEY) === "true";
}

export function unlockMaintainer(enteredPin: string): boolean {
  const currentPin = getMaintainerPin();
  if (enteredPin.trim() === currentPin.trim()) {
    localStorage.setItem(STORAGE_AUTH_KEY, "true");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: { unlocked: true } }));
    }
    return true;
  }
  return false;
}

export function lockMaintainer(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_AUTH_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: { unlocked: false } }));
}

export function updateMaintainerPin(currentPin: string, newPin: string): { success: boolean; error?: string } {
  if (currentPin.trim() !== getMaintainerPin().trim()) {
    return { success: false, error: "Incorrect current PIN" };
  }
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: "New PIN must be at least 4 digits" };
  }
  localStorage.setItem(STORAGE_PIN_KEY, newPin.trim());
  return { success: true };
}

export function subscribeToAuthChanges(callback: (unlocked: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ unlocked: boolean }>;
    callback(custom.detail?.unlocked ?? isMaintainerUnlocked());
  };

  window.addEventListener(AUTH_EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
