import { baseApi } from "./base-api";

export const callApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReport: builder.mutation({
      query: (data) => ({
        url: "/call/report",
        method: "POST",
        body: data,
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: "/call/review",
        method: "POST",
        body: data,
      }),
    }),
    getCallHistory: builder.query({
      query: () => "/call/history",
    }),
    getReports: builder.query({
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

