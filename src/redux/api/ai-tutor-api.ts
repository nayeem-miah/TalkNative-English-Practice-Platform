import { ApiResponse, AiTutorRequestPayload, AiTutorResponseData } from "@/types";
import { baseApi } from "./base-api";

export const aiTutorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAiTutorResponse: builder.mutation<
      ApiResponse<AiTutorResponseData>,
      AiTutorRequestPayload
    >({
      query: (data) => ({
        url: "/ai-tutor/generate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateAiTutorResponseMutation } = aiTutorApi;
