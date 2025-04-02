import type { TiktokVideoListSchema } from "./schema";

export const sample = {
  data: {
    has_more: true,
    cursor: 1,
    videos: [
      {
        title: "Example title",
        video_description: "Example description",
        cover_image_url: "https://example.com/image.jpg",
        duration: 60,
        embed_link: "https://example.com/embed",
        id: "1",
      },
      {
        title: "Another example title",
        video_description: "Another example description",
        cover_image_url: "https://example.com/image.jpg",
        duration: 60,
        embed_link: "https://example.com/embed",
        id: "2",
      },
    ],
  },
} satisfies TiktokVideoListSchema;
