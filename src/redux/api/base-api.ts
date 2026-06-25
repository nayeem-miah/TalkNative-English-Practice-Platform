import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    prepareHeaders: (headers) => {
      // Read accessToken_js (non-httpOnly, JS-accessible) set by backend on login
      // The httpOnly accessToken cannot be read by JavaScript
      let token = "";
      if (typeof document !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; accessToken_js=`);
        if (parts.length === 2) {
          token = parts.pop()?.split(";").shift() || "";
        }
      }
      // Fallback to localStorage if cookie not found
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("accessToken") || "";
      }
      if (token) {
        // The deployed Render backend expects the RAW token directly in the authorization header
        // without the 'Bearer ' prefix (its middleware directly verifies req.headers.authorization).
        const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        headers.set("authorization", cleanToken);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["User", "Course", "Lesson", "Report"],
  endpoints: () => ({}),
});
