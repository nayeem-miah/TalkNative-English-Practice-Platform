import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie, removeCookie } from "@/utils/cookie";

const rawBaseQuery = fetchBaseQuery({ 
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
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const existingToken = getCookie("accessToken");
    if (existingToken) {
      removeCookie();
      api.dispatch(baseApi.util.resetApiState());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Course", "Lesson", "Report", "Announcement", "Chat", "Community"],
  endpoints: () => ({}),
});
