/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enrollFree: builder.mutation<any, { courseId: string }>({
      query: (body) => ({
        url: "/enrollments/enroll-free",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),
    createCheckoutSession: builder.mutation<any, { courseId: string }>({
      query: (body) => ({
        url: "/enrollments/create-checkout-session",
        method: "POST",
        body,
      }),
    }),
    getMyCourses: builder.query<any, void>({
      query: () => ({
        url: "/enrollments/my-courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getAllEnrollments: builder.query<any, { page?: number; limit?: number; searchTerm?: string; paymentStatus?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm)
        if (params.paymentStatus && params.paymentStatus !== "ALL") {
          queryParams.append("paymentStatus", params.paymentStatus)
        }
        return {
          url: `/enrollments?${queryParams.toString()}`,
          method: "GET",
        }
      },
      providesTags: ["Course"],
    }),
    getAdminDashboardOverview: builder.query<any, void>({
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
