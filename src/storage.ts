import type { Lang } from "./data/types";
export const STORAGE_KEY = "defencore-workbench:v1";
export interface Preferences {
  language: Lang;
  saved: string[];
  completed: string[];
  checks: string[];
  measurements: Record<string, string>;
}
export const defaults: Preferences = {
  language: "uk",
  saved: [],
  completed: [],
  checks: [],
  measurements: {},
};
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (v): v is string => typeof v === "string" && v.length < 160,
          ),
        ),
      ].slice(0, 5000)
    : [];
function records(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries: [string, string][] = [];
  for (const [key, item] of Object.entries(value)) {
    if (key.length < 160 && typeof item === "string" && item.length <= 1000) {
      entries.push([key, item]);
      if (entries.length >= 3000) break;
    }
  }
  return Object.fromEntries(entries);
}
export function readPreferences(): Preferences {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || typeof raw !== "object") return { ...defaults };
    return {
      language: raw.language === "en" ? "en" : "uk",
      saved: strings(raw.saved),
      completed: strings(raw.completed),
      checks: strings(raw.checks),
      measurements: records(raw.measurements),
    };
  } catch {
    return { ...defaults };
  }
}
export function writePreferences(value: Preferences): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export async function clearServiceData(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  const worker = navigator.serviceWorker?.controller;
  if (worker)
    await new Promise<void>((resolve) => {
      const channel = new MessageChannel();
      const timer = window.setTimeout(resolve, 1500);
      channel.port1.onmessage = () => {
        clearTimeout(timer);
        channel.port1.close();
        resolve();
      };
      worker.postMessage({ type: "DISABLE_CACHE" }, [channel.port2]);
    });
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations)
      if (
        new URL(reg.scope).origin === location.origin &&
        new URL(
          reg.active?.scriptURL ||
            reg.waiting?.scriptURL ||
            reg.installing?.scriptURL ||
            location.href,
        ).pathname === "/sw.js"
      )
        await reg.unregister();
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith("workbench-"))
        .map((k) => caches.delete(k)),
    );
  }
}
