/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiPaginatedResponse,
  ApiResponse,
  ForgotPasswordInput,
  GetUsersParams,
  LoginInput,
  LoginResponseData,
  RegisterInput,
  ResendOtpInput,
  ResetPasswordInput,
  UpdateProfileInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  User,
  VerifyEmailInput,
} from "@/types";
import { removeCookie, setCookie } from "@/utils/cookie";
import { baseApi } from "./base-api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<User>, RegisterInput>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<ApiResponse<any>, VerifyEmailInput>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation<ApiResponse<any>, ResendOtpInput>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginInput>({
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
          const accessToken = resData?.result?.accessToken || resData?.accessToken || (data as any)?.accessToken;
          const refreshToken = resData?.result?.refreshToken || resData?.refreshToken || (data as any)?.refreshToken;

          // Save token to cookie so Next.js middleware (proxy.ts) can read it
          // and also to localStorage as fallback for base-api prepareHeaders
          if (accessToken && typeof window !== "undefined") {
            try { setCookie("accessToken", accessToken); } catch {}
            try { localStorage.setItem("accessToken", accessToken); } catch {}
          }
          if (refreshToken && typeof window !== "undefined") {
            try { setCookie("refreshToken", refreshToken); } catch {}
            try { localStorage.setItem("refreshToken", refreshToken); } catch {}
          }
        } catch {}
      },
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Always clear all token storage and reset RTK Query state
        removeCookie();
        dispatch(baseApi.util.resetApiState());
        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, UpdateProfileInput | FormData>({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<ApiResponse<any>, ForgotPasswordInput>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<any>, ResetPasswordInput>({
      query: ({ token, ...data }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    getallUsrs: builder.query<ApiPaginatedResponse<User>, GetUsersParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
        return {
          url: `/users?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // get user by id
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation<ApiResponse<User>, UpdateUserRoleInput>({
      query: ({ userId, role }) => ({
        url: `/users/role/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<ApiResponse<User>, UpdateUserStatusInput>({
      query: ({ userId, status }) => ({
        url: `/users/status/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
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
  useUpdateUserStatusMutation,
  useDeleteUserMutation
} = authApi;
