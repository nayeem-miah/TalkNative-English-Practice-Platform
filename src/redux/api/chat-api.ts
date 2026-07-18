/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ChatMessage, ChatTicket } from "@/types";
import { baseApi } from "./base-api";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<ApiResponse<ChatMessage[]>, string>({
      query: (ticketId) => ({
        url: `/chat/messages/${ticketId}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getUserTicket: builder.query<ApiResponse<ChatTicket>, void>({
      query: () => ({
        url: "/chat/tickets/my-ticket",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getTickets: builder.query<ApiResponse<ChatTicket[]>, void>({
      query: () => ({
        url: "/chat/tickets",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    resolveTicket: builder.mutation<ApiResponse<ChatTicket>, string>({
      query: (ticketId) => ({
        url: `/chat/ticket/${ticketId}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
    markTicketRead: builder.mutation<ApiResponse<any>, string>({
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
