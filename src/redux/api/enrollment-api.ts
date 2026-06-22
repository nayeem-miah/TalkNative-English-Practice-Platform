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
  }),
});

export const {
  useEnrollFreeMutation,
  useCreateCheckoutSessionMutation,
  useGetMyCoursesQuery,
} = enrollmentApi;
