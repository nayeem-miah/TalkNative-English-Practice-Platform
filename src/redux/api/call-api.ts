import { baseApi } from "./base-api";
import {
  ApiResponse,
  Call,
  CallReport,
  CreateCallReportInput,
  CreateCallReviewInput,
} from "@/types";

export const callApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReport: builder.mutation<ApiResponse<CallReport>, CreateCallReportInput>({
      query: (data) => ({
        url: "/call/report",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
    createReview: builder.mutation<ApiResponse<any>, CreateCallReviewInput>({
      query: (data) => ({
        url: "/call/review",
        method: "POST",
        body: data,
      }),
    }),
    getCallHistory: builder.query<ApiResponse<Call[]>, void>({
      query: () => "/call/history",
    }),
    getReports: builder.query<ApiResponse<CallReport[]>, void>({
      query: () => ({
        url: "/call/reports",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useCreateReviewMutation,
  useGetCallHistoryQuery,
  useGetReportsQuery,
} = callApi;
