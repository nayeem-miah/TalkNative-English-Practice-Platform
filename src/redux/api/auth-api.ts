import { removeCookie } from "@/utils/cookie";
import { baseApi } from "./base-api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const resData = data?.data || data;
          const accessToken = resData?.result?.accessToken || resData?.accessToken || data?.accessToken;
          const refreshToken = resData?.result?.refreshToken || resData?.refreshToken || data?.refreshToken;

          // Save to localStorage as fallback for base-api prepareHeaders
          // (backend sets httpOnly cookie which JS cannot read,
          //  and also sets accessToken_js which JS CAN read)
          if (accessToken && typeof window !== "undefined") {
            try { localStorage.setItem("accessToken", accessToken); } catch (e) {}
          }
          if (refreshToken && typeof window !== "undefined") {
            try { localStorage.setItem("refreshToken", refreshToken); } catch (e) {}
          }
        } catch (err) {}
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {}
        // Always clear all token storage regardless of API result
        removeCookie("accessToken");
        removeCookie("refreshToken");
        removeCookie("accessToken_js");
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          } catch (e) {}
        }
      },
    }),
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...data }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    getallUsrs: builder.query({
      query: ({ page, limit }) => `/users?page=${page}&limit=${limit}`,
      providesTags: ["User"],
    })
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetallUsrsQuery
} = authApi;
