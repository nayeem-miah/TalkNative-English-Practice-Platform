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
  }),
});

export const { useCreateReportMutation, useCreateReviewMutation, useGetCallHistoryQuery } = callApi;
