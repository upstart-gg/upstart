import type { YoutubeListSchema } from "./schema";

export const sample = [
  {
    etag: "123456789",
    id: {
      videoId: "dQw4w9WgXcQ",
      channelId: "UCXuqSBlHAE6Xw-yeJA0Tunw",
      playlistId: "PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
    },
    snippet: {
      channelId: "UCXuqSBlHAE6Xw-yeJA0Tunw",
      channelTitle: "RickAstleyVEVO",
      description:
        "Rick Astley's official music video for “Never Gonna Give You Up” Listen to Rick Astley: https://RickAstley.lnk.to/_listenYD Subscribe to the official Rick Astley YouTube channel: https://RickAstley.lnk.to/_subscribeYD Follow Rick Astley: Facebook: https://RickAstley.lnk.to/_followYD Twitter: https://RickAstley.lnk.to/_followYD Instagram: https://RickAstley.lnk.to/_followYD Website: https://RickAstley.lnk.to/_followYD Spotify: https://RickAstley.lnk.to/_followYD Lyrics: We're no strangers to love You know the rules and so do I A full commitment's what I'm thinking of You wouldn't get this from any other guy I just wanna tell you how I'm feeling Gotta make you understand Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you #RickAstley #NeverGonnaGiveYouUp #DancePop",
      liveBroadcastContent: "none",
      publishedAt: "2009-10-25",
      thumbnails: {
        default: {
          height: 90,
          url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
          width: 120,
        },
        standard: {
          height: 480,
          url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg",
          width: 640,
        },
      },
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    },
  },
] satisfies YoutubeListSchema;
