import { Type } from "@sinclair/typebox";
import { TiSocialFlickr } from "react-icons/ti";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { backgroundColorRef } from "../props/background";
import { borderRef } from "../props/border";
import { colorRef } from "../props/color";
import { shadowRef } from "../props/effects";
import { defineProps } from "../props/helpers";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "social-links",
  kind: "widget",
  name: "Social links",
  description: "A list of social media links",
  icon: TiSocialFlickr,
  props: defineProps({
    links: Type.Array(
      Type.Object({
        href: string("Link"),
        label: Type.Optional(string("Label")),
        icon: Type.Optional(
          string("Icon", {
            description: "Icon to display (iconify reference)",
            readOnly: true,
          }),
        ),
      }),
      {
        title: "Social Links",
        description: "List of social media links",
        default: [], // Empty array by default
        "ui:widget": "array",
        "ui:options": {
          orderable: true, // Enable drag & drop reordering
          removable: true, // Enable delete button
          addable: true, // Enable add button
        },
      },
    ),
    justifyContent: Type.Optional(
      StringEnum(["justify-start", "justify-center", "justify-end"], {
        enumNames: ["Left", "Center", "Right"],
        title: "Alignment",
        "ui:placeholder": "Not specified",
        default: "justify-center",
      }),
    ),
    backgroundColor: Type.Optional(backgroundColorRef()),
    color: Type.Optional(colorRef()),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("icon-only", { title: "Only icons", description: "Display only icons" }),
          Type.Literal("display-inline", { title: "Display inline", description: "Display links inline" }),
          Type.Literal("display-block", {
            title: "Display block",
            description: "Display links as block elements",
          }),
        ],
        // {
        //   title: "Variant",
        //   description: "Social links variants",
        // },
      ),
      {
        default: ["icon-only", "display-inline"], // Default to icon-only and inline display
      },
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Social icons aligned to the left",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      justifyContent: "justify-start",
      links: [
        {
          href: "https://facebook.com/company",
          label: "Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://twitter.com/company",
          label: "Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "https://instagram.com/company",
          label: "Instagram",
          icon: "mdi:instagram",
        },
      ],
    },
  },
  {
    description: "Social icons with space between",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      justifyContent: "justify-start",
      links: [
        {
          href: "https://facebook.com/company",
          label: "Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://twitter.com/company",
          label: "Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "https://instagram.com/company",
          label: "Instagram",
          icon: "mdi:instagram",
        },
      ],
    },
  },
  {
    description: "Social icons with custom color",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      justifyContent: "justify-center",
      color: "#3b82f6", // Blue color
      links: [
        {
          href: "https://facebook.com/company",
          label: "Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://twitter.com/company",
          label: "Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "https://instagram.com/company",
          label: "Instagram",
          icon: "mdi:instagram",
        },
        {
          href: "https://linkedin.com/company/company",
          label: "LinkedIn",
          icon: "mdi:linkedin",
        },
      ],
    },
  },
  {
    description: "Standard social media icons inline",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      links: [
        {
          href: "https://facebook.com/company",
          label: "Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://twitter.com/company",
          label: "Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "https://instagram.com/company",
          label: "Instagram",
          icon: "mdi:instagram",
        },
        {
          href: "https://linkedin.com/company/company",
          label: "LinkedIn",
          icon: "mdi:linkedin",
        },
      ],
    },
  },
  {
    description: "Professional social links with labels (block layout)",
    type: "social-links",
    props: {
      variants: ["display-block"],
      links: [
        {
          href: "https://linkedin.com/in/johndoe",
          label: "Connect on LinkedIn",
          icon: "mdi:linkedin",
        },
        {
          href: "https://github.com/johndoe",
          label: "View GitHub Profile",
          icon: "mdi:github",
        },
        {
          href: "https://twitter.com/johndoe",
          label: "Follow on Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "mailto:john@example.com",
          label: "Send Email",
          icon: "mdi:email",
        },
      ],
    },
  },
  {
    description: "Creative portfolio social links (icon-only inline)",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      links: [
        {
          href: "https://dribbble.com/designer",
          label: "Dribbble",
          icon: "mdi:dribbble",
        },
        {
          href: "https://behance.net/designer",
          label: "Behance",
          icon: "mdi:behance",
        },
        {
          href: "https://instagram.com/designer",
          label: "Instagram",
          icon: "mdi:instagram",
        },
        {
          href: "https://pinterest.com/designer",
          label: "Pinterest",
          icon: "mdi:pinterest",
        },
        {
          href: "https://youtube.com/designer",
          label: "YouTube",
          icon: "mdi:youtube",
        },
      ],
    },
  },
  {
    description: "Developer/tech social links with labels",
    type: "social-links",
    props: {
      variants: ["display-inline"],
      links: [
        {
          href: "https://github.com/developer",
          label: "GitHub",
          icon: "mdi:github",
        },
        {
          href: "https://stackoverflow.com/users/developer",
          label: "Stack Overflow",
          icon: "mdi:stack-overflow",
        },
        {
          href: "https://dev.to/developer",
          label: "Dev.to",
          icon: "mdi:dev-to",
        },
        {
          href: "https://codepen.io/developer",
          label: "CodePen",
          icon: "mdi:codepen",
        },
      ],
    },
  },
  {
    description: "Music artist social platforms (block layout)",
    type: "social-links",
    props: {
      variants: ["display-block"],
      links: [
        {
          href: "https://spotify.com/artist/musician",
          label: "Listen on Spotify",
          icon: "mdi:spotify",
        },
        {
          href: "https://music.apple.com/artist/musician",
          label: "Apple Music",
          icon: "mdi:apple",
        },
        {
          href: "https://soundcloud.com/musician",
          label: "SoundCloud",
          icon: "mdi:soundcloud",
        },
        {
          href: "https://youtube.com/musician",
          label: "YouTube Channel",
          icon: "mdi:youtube",
        },
        {
          href: "https://bandcamp.com/musician",
          label: "Bandcamp",
          icon: "mdi:bandcamp",
        },
      ],
    },
  },
  {
    description: "Business contact icons only",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      links: [
        {
          href: "tel:+1234567890",
          label: "Phone",
          icon: "mdi:phone",
        },
        {
          href: "mailto:contact@business.com",
          label: "Email",
          icon: "mdi:email",
        },
        {
          href: "https://maps.google.com/business",
          label: "Location",
          icon: "mdi:map-marker",
        },
        {
          href: "https://business.com",
          label: "Website",
          icon: "mdi:web",
        },
      ],
    },
  },
  {
    description: "Gaming content creator links (inline with labels)",
    type: "social-links",
    props: {
      variants: ["display-inline"],
      links: [
        {
          href: "https://twitch.tv/gamer",
          label: "Twitch",
          icon: "mdi:twitch",
        },
        {
          href: "https://youtube.com/gamer",
          label: "YouTube",
          icon: "mdi:youtube",
        },
        {
          href: "https://discord.gg/gamer",
          label: "Discord",
          icon: "mdi:discord",
        },
        {
          href: "https://tiktok.com/@gamer",
          label: "TikTok",
          icon: "mdi:tiktok",
        },
      ],
    },
  },
  {
    description: "Restaurant social presence (block layout)",
    type: "social-links",
    props: {
      variants: ["display-block"],
      links: [
        {
          href: "https://facebook.com/restaurant",
          label: "Follow us on Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://instagram.com/restaurant",
          label: "See photos on Instagram",
          icon: "mdi:instagram",
        },
        {
          href: "https://yelp.com/restaurant",
          label: "Review us on Yelp",
          icon: "mdi:yelp",
        },
        {
          href: "https://tripadvisor.com/restaurant",
          label: "TripAdvisor Reviews",
          icon: "mdi:tripadvisor",
        },
        {
          href: "tel:+1234567890",
          label: "Call for Reservations",
          icon: "mdi:phone",
        },
      ],
    },
  },
  {
    description: "Minimal footer social icons",
    type: "social-links",
    props: {
      variants: ["icon-only", "display-inline"],
      links: [
        {
          href: "https://twitter.com/company",
          label: "Twitter",
          icon: "mdi:twitter",
        },
        {
          href: "https://linkedin.com/company/company",
          label: "LinkedIn",
          icon: "mdi:linkedin",
        },
        {
          href: "mailto:hello@company.com",
          label: "Email",
          icon: "mdi:email",
        },
      ],
    },
  },
  {
    description: "E-commerce store social channels (inline with labels)",
    type: "social-links",
    props: {
      variants: ["display-inline"],
      links: [
        {
          href: "https://facebook.com/store",
          label: "Facebook",
          icon: "mdi:facebook",
        },
        {
          href: "https://instagram.com/store",
          label: "Instagram",
          icon: "mdi:instagram",
        },
        {
          href: "https://pinterest.com/store",
          label: "Pinterest",
          icon: "mdi:pinterest",
        },
        {
          href: "https://youtube.com/store",
          label: "YouTube",
          icon: "mdi:youtube",
        },
        {
          href: "https://tiktok.com/@store",
          label: "TikTok",
          icon: "mdi:tiktok",
        },
      ],
    },
  },
];
