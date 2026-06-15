/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<any, { page?: number; limit?: number; level?: string; searchTerm?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.level && params.level !== "ALL") queryParams.append("level", params.level);
        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);

        return {
          url: `/courses?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Course"],
    }),
    createCourse: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/courses",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation<any, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
