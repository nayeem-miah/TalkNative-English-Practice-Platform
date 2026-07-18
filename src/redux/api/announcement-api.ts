import { baseApi } from "./base-api";
import {
  ApiResponse,
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "@/types";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<ApiResponse<Announcement[]>, void>({
      query: () => "/announcements",
      providesTags: ["Announcement"],
    }),
    getAnnouncementFeed: builder.query<ApiResponse<Announcement[]>, void>({
      query: () => "/announcements/feed",
      providesTags: ["Announcement"],
    }),
    createAnnouncement: builder.mutation<ApiResponse<Announcement>, CreateAnnouncementInput>({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation<ApiResponse<Announcement>, UpdateAnnouncementInput>({
      query: ({ id, data }) => ({
        url: `/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    deleteAnnouncement: builder.mutation<ApiResponse<any>, string>({
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
