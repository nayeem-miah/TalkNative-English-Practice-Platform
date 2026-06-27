/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<any, void>({
      query: () => "/announcements",
      providesTags: ["Announcement"],
    }),
    getAnnouncementFeed: builder.query<any, void>({
      query: () => "/announcements/feed",
      providesTags: ["Announcement"],
    }),
    createAnnouncement: builder.mutation<any, any>({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    deleteAnnouncement: builder.mutation<any, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementFeedQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
