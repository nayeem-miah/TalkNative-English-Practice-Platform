/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiResponse,
  CreateLessonInput,
  Lesson,
  UpdateLessonInput,
} from "@/types";
import { baseApi } from "./base-api";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsByCourse: builder.query<ApiResponse<Lesson[]>, string>({
      query: (courseId) => ({
        url: `/lessons/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),
    createLesson: builder.mutation<ApiResponse<Lesson>, CreateLessonInput>({
      query: (lessonData) => ({
        url: "/lessons",
        method: "POST",
        body: lessonData,
      }),
      invalidatesTags: ["Lesson", "Course"],
    }),
    updateLesson: builder.mutation<ApiResponse<Lesson>, UpdateLessonInput>({
      query: ({ id, ...body }) => ({
        url: `/lessons/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Lesson"],
    }),
    deleteLesson: builder.mutation<ApiResponse<any>, string>({
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
