import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "@/utils/cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
    prepareHeaders: (headers) => {
      const token = getCookie("accessToken");
      if (token) {
        // The deployed Render backend expects the RAW token directly in the authorization header
        // without the 'Bearer ' prefix (its middleware directly verifies req.headers.authorization).
        const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        headers.set("authorization", `Bearer ${cleanToken}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["User", "Course", "Lesson", "Report", "Announcement", "Chat", "Community"],
  endpoints: () => ({}),
});
