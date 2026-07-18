/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddCommentInput,
  ApiPaginatedResponse,
  ApiResponse,
  Comment,
  GetPostsParams,
  Post,
  UpdateCommentInput,
  UpdatePostInput,
} from "@/types";
import { baseApi } from "./base-api";

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<ApiPaginatedResponse<Post>, GetPostsParams | Record<string, any> | void>({
      query: (params) => ({
        url: "/community/posts",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Community"],
    }),
    getSinglePost: builder.query<ApiResponse<Post>, string>({
      query: (id) => `/community/posts/${id}`,
      providesTags: ["Community"],
    }),
    createPost: builder.mutation<ApiResponse<Post>, FormData>({
      query: (formData) => ({
        url: "/community/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Community"],
    }),
    updatePost: builder.mutation<ApiResponse<Post>, UpdatePostInput>({
      query: ({ id, formData }) => ({
        url: `/community/posts/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Community"],
    }),
    deletePost: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/community/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community"],
    }),
    toggleLike: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/community/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Community"],
    }),
    addComment: builder.mutation<ApiResponse<Comment>, AddCommentInput>({
      query: ({ postId, content }) => ({
        url: `/community/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Community"],
    }),
    updateComment: builder.mutation<ApiResponse<Comment>, UpdateCommentInput>({
      query: ({ id, content }) => ({
        url: `/community/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Community"],
    }),
    deleteComment: builder.mutation<ApiResponse<any>, string>({
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
