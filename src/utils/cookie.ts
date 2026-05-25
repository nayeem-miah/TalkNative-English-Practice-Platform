export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
  
  // Local storage fallback for robust device support
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn("localStorage is not accessible:", e);
    }
  }
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  
  // 1. Try to read from cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  let cookieVal = "";
  if (parts.length === 2) {
    cookieVal = parts.pop()?.split(";").shift() || "";
  }
  
  if (cookieVal) {
    return cookieVal;
  }
  
  // 2. Fallback to localStorage on client side if cookie is missing (Safari ITP / Private Browsing support)
  if (typeof window !== "undefined") {
    try {
      const localVal = localStorage.getItem(name);
      if (localVal) {
        // Restore the cookie so server-side middleware and requests work on subsequent actions
        setCookie(name, localVal);
        return localVal;
      }
    } catch (e) {
      // Ignore
    }
  }
  
  return "";
};

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`;
  
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      // Ignore
    }
  }
};
