import { baseApi } from "./base-api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  Enrollment,
  CourseWithProgress,
  EnrollFreeInput,
  CheckoutSessionInput,
  GetAllEnrollmentsParams,
  AdminDashboardOverview,
} from "@/types";

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enrollFree: builder.mutation<ApiResponse<Enrollment>, EnrollFreeInput>({
      query: (body) => ({
        url: "/enrollments/enroll-free",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),
    createCheckoutSession: builder.mutation<ApiResponse<{ url: string; checkoutUrl?: string }>, CheckoutSessionInput>({
      query: (body) => ({
        url: "/enrollments/create-checkout-session",
        method: "POST",
        body,
      }),
    }),
    getMyCourses: builder.query<ApiResponse<CourseWithProgress[]>, void>({
      query: () => ({
        url: "/enrollments/my-courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getAllEnrollments: builder.query<ApiPaginatedResponse<Enrollment>, GetAllEnrollmentsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
          if (params.paymentStatus && params.paymentStatus !== "ALL") {
            queryParams.append("paymentStatus", params.paymentStatus);
          }
        }
        return {
          url: queryParams.toString() ? `/enrollments?${queryParams.toString()}` : "/enrollments",
          method: "GET",
        };
      },
      providesTags: ["Course"],
    }),
    getAdminDashboardOverview: builder.query<ApiResponse<AdminDashboardOverview>, void>({
      query: () => ({
        url: "/admin/dashboard-overview",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useEnrollFreeMutation,
  useCreateCheckoutSessionMutation,
  useGetMyCoursesQuery,
  useGetAllEnrollmentsQuery,
  useGetAdminDashboardOverviewQuery,
} = enrollmentApi;
