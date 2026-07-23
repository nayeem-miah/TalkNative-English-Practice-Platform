import {
  GetNotificationsParams,
  Notification,
  NotificationMeta,
} from "@/types/notification";
import { baseApi } from "./base-api";

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  meta: NotificationMeta;
}

interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),

    getNotifications: builder.query<
      NotificationsResponse,
      GetNotificationsParams
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        queryParams.append("sortBy", params.sortBy || "createdAt");
        queryParams.append("sortOrder", params.sortOrder || "desc");
        return `/notifications?${queryParams.toString()}`;
      },
      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    clearAllNotificationsApi: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsApiMutation,
} = notificationApi;
