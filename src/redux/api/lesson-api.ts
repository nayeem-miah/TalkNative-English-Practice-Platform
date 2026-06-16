/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsByCourse: builder.query<any, string>({
      query: (courseId) => ({
        url: `/lessons/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),
    createLesson: builder.mutation<any, { courseId: string; title: string; content: string; videoUrl?: string; duration: number; order: number }>({
      query: (lessonData) => ({
        url: "/lessons",
        method: "POST",
        body: lessonData,
      }),
      invalidatesTags: ["Lesson", "Course"],
    }),
    updateLesson: builder.mutation<any, { id: string; title?: string; content?: string; videoUrl?: string; duration?: number; order?: number }>({
      query: ({ id, ...body }) => ({
        url: `/lessons/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Lesson"],
    }),
    deleteLesson: builder.mutation<any, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson", "Course"],
    }),
  }),
});

export const {
  useGetLessonsByCourseQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
