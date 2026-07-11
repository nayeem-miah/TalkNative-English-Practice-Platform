/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base-api";

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: "/community/posts",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Community"],
    }),
    getSinglePost: builder.query<any, string>({
      query: (id) => `/community/posts/${id}`,
      providesTags: ["Community"],
    }),
    createPost: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/community/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Community"],
    }),
    updatePost: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/community/posts/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Community"],
    }),
    deletePost: builder.mutation<any, string>({
      query: (id) => ({
        url: `/community/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community"],
    }),
    toggleLike: builder.mutation<any, string>({
      query: (id) => ({
        url: `/community/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Community"],
    }),
    addComment: builder.mutation<any, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/community/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Community"],
    }),
    updateComment: builder.mutation<any, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/community/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Community"],
    }),
    deleteComment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/community/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = communityApi;
