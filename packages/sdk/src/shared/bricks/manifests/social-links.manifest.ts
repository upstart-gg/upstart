import { Type } from "@sinclair/typebox";
import { TiSocialFlickr } from "react-icons/ti";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { iconRef, string } from "../props/string";
import type { BrickProps } from "../props/types";
import { fontSizeRef } from "../props/text";
import { paddingRef } from "../props/padding";
import { directionRef } from "../props/direction";

export const manifest = defineBrickManifest({
  type: "social-links",
  name: "Social links",
  description: "A list of social media links",
  icon: TiSocialFlickr,
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps({
    links: Type.Array(
      Type.Object({
        icon: Type.Optional(
          iconRef({
            "ui:default-icon-collection": "cib",
          }),
        ),
        label: Type.Optional(string("Label")),
        href: string("Link"),
      }),
      {
        title: "Social Links",
        description: "List of social media links",
        default: [
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
        "ui:widget": "array",
        "ui:displayField": "label",
        "ui:options": {
          orderable: true, // Enable drag & drop reordering
          removable: true, // Enable delete button
          addable: true, // Enable add button
        },
        metadata: {
          category: "content",
        },
      },
    ),
    direction: Type.Optional(
      directionRef({
        default: "flex-row",
      }),
    ),
    fontSize: Type.Optional(fontSizeRef()),
    padding: Type.Optional(
      paddingRef({
        default: "p-2",
      }),
    ),
    icononly: Type.Optional(
      Type.Boolean({
        title: "Only icons",
        description: "If set, the brick will only display the icons without labels.",
      }),
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
    description: "Social icons displayed horizontally, without labels",
    type: "social-links",
    props: {
      icononly: true,
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
    description: "Social icons displayed vertically, without labels",
    type: "social-links",
    props: {
      icononly: true,
      direction: "flex-col",
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
    description: "Social icons displayed horizontally, with labels",
    type: "social-links",
    props: {
      icononly: false,
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
    description: "Social icons displayed vertically, with labels",
    type: "social-links",
    props: {
      icononly: false,
      direction: "flex-col",
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
    description: "Professional social links with labels",
    type: "social-links",
    props: {
      icononly: false,
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
      icononly: true,
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
      icononly: false,
      direction: "flex-col",
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
      icononly: true,
      direction: "flex-col",
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
      icononly: true,
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
      icononly: false,
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
      icononly: false,
      direction: "flex-col",
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
      icononly: true,
      direction: "flex-row",
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
      icononly: false,
      direction: "flex-row",
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
