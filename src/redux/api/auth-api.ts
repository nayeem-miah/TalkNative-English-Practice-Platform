/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeCookie } from "@/utils/cookie";
import { baseApi } from "./base-api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation<any, any>({
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
    logout: builder.mutation<any, void>({
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
    getMe: builder.query<any, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: ({ token, ...data }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    getallUsrs: builder.query<any, { page?: number; limit?: number; searchTerm?: string; status?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params.status && params.status !== "ALL") queryParams.append("status", params.status);
        return {
          url: `/users?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // ger user by id
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }) ,
    updateUserRole: builder.mutation<any, { userId: string; role: "ADMIN" | "USER" }>({
      query: ({ userId, role }) => ({
        url: `/users/role/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<any, { userId: string; status: "ACTIVE" | "INACTIVE" | "SUSPENDED" }>({
      query: ({ userId, status }) => ({
        url: `/users/status/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
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
  useGetallUsrsQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation
} = authApi;
