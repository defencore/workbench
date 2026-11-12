import { useSyncExternalStore } from "react";
export type OfflineStatus =
  "preparing" | "ready" | "unsupported" | "error" | "preview" | "cleared";
let status: OfflineStatus = import.meta.env.PROD ? "preparing" : "preview";
const listeners = new Set<() => void>();
function setStatus(next: OfflineStatus) {
  status = next;
  listeners.forEach((listener) => listener());
}
export async function initializeOffline() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    setStatus("unsupported");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });
    const installing = registration.installing || registration.waiting;
    if (installing) {
      await new Promise<void>((resolve, reject) => {
        const check = () => {
          if (installing.state === "activated") {
            installing.removeEventListener("statechange", check);
            resolve();
          } else if (installing.state === "redundant") {
            installing.removeEventListener("statechange", check);
            reject(new Error("Offline installation did not complete"));
          }
        };
        installing.addEventListener("statechange", check);
        check();
      });
    }
    await navigator.serviceWorker.ready;
    setStatus("ready");
  } catch {
    setStatus("error");
  }
}
export function useOfflineStatus() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => status,
  );
}

export function markOfflineCleared() {
  setStatus("cleared");
}
