/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<any, string>({
      query: (ticketId) => ({
        url: `/chat/messages/${ticketId}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getUserTicket: builder.query<any, void>({
      query: () => ({
        url: "/chat/tickets/my-ticket", // Adjust if backend uses a different endpoint for fetching the active ticket
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getTickets: builder.query<any, void>({
      query: () => ({
        url: "/chat/tickets",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    resolveTicket: builder.mutation<any, string>({
      query: (ticketId) => ({
        url: `/chat/ticket/${ticketId}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
    markTicketRead: builder.mutation<any, string>({
      query: (ticketId) => ({
        url: `/chat/ticket/${ticketId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetUserTicketQuery,
  useGetTicketsQuery,
  useResolveTicketMutation,
  useMarkTicketReadMutation,
} = chatApi;
