const KEY = "userId";
const EVENT = "booknest:auth:update";

export const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
};

export const isLoggedIn = () => Boolean(getUserId());

export const setUserId = (userId) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(userId));
  window.dispatchEvent(new Event(EVENT));
};

export const logout = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
};

export const subscribeAuth = (callback) => {
  const handler = () => callback?.();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

