import { baseApi } from "./base-api";
import { setCookie, removeCookie } from "@/utils/cookie";

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
          if (data?.success && data?.data?.result?.accessToken) {
            setCookie("accessToken", data.data.result.accessToken);
            setCookie("refreshToken", data.data.result.refreshToken);
          }
        } catch (err) {
          // Ignore error
        }
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
          removeCookie("accessToken");
          removeCookie("refreshToken");
        } catch (err) {
          // Even if API fails, we should clear tokens locally
          removeCookie("accessToken");
          removeCookie("refreshToken");
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
  useResetPasswordMutation
} = authApi;
