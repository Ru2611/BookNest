const KEY = "booknest:wishlist:v1";
const EVENT = "booknest:wishlist:update";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getWishlistIds = () => {
  if (typeof window === "undefined") return [];
  const raw = safeParse(window.localStorage.getItem(KEY) || "[]");
  return Array.isArray(raw) ? raw : [];
};

export const isWishlisted = (id) => {
  const ids = getWishlistIds().map((v) => String(v));
  return ids.includes(String(id));
};

export const setWishlistIds = (ids) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
};

export const toggleWishlistId = (id) => {
  const current = getWishlistIds().map((v) => String(v));
  const key = String(id);
  const next = current.includes(key)
    ? current.filter((v) => v !== key)
    : [...current, key];
  setWishlistIds(next);
  return next;
};

export const subscribeWishlist = (callback) => {
  const handler = () => callback?.();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

