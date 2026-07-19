export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;

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

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  let cookieVal = "";
  if (parts.length === 2) {
    cookieVal = parts.pop()?.split(";").shift() || "";
  }

  if (cookieVal) {
    return cookieVal;
  }

  if (typeof window !== "undefined") {
    try {
      const localVal = localStorage.getItem(name);
      if (localVal) {
        setCookie(name, localVal);
        return localVal;
      }
    } catch {
    }
  }

  return "";
};

export const removeCookie = (name?: string) => {
  if (typeof document === "undefined") return;

  const ALL_AUTH_KEYS = ["accessToken", "refreshToken", "accessToken_js"];
  const namesToClear = name ? [name, ...ALL_AUTH_KEYS] : ALL_AUTH_KEYS;
  const uniqueNames = Array.from(new Set(namesToClear));

  uniqueNames.forEach((n) => {
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax;`;
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure;`;
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(n);
      } catch {
      }
    }
  });
};
