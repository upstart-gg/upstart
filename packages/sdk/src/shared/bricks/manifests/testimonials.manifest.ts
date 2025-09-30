import { type Static, type TObject, Type } from "@sinclair/typebox";
import { HiOutlineChatBubbleBottomCenter } from "react-icons/hi2";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { image } from "../props/image";
import { icon } from "../props/string";
import type { BrickProps } from "../props/types";
import { fontSize } from "../props/text";
import { colorPreset } from "../props/color-preset";
import { cssLength } from "../props/css-length";
import { loop } from "../props/dynamic";
import { border } from "../props/border";
import { shadow } from "../props/effects";
import type { BrickExample } from "./_types";
import { grow } from "../props/grow";

export const manifest = defineBrickManifest({
  type: "testimonials",
  name: "Testimonials",
  description: "Display a list of testimonials from users",
  defaultWidth: { desktop: "100%" },
  icon: HiOutlineChatBubbleBottomCenter,
  consumesMultipleQueryRows: true,
  aiInstructions: `This brick displays a list of testimonials with optional avatars and social icons.
It is typically used to showcase customer feedback or endorsements.
It can directly consume data from a page query to populate the testimonials dynamically.
Optionally either use an avatar or a social icon but not both at the same time.`,
  props: defineProps(
    {
      colorPreset: Type.Optional(
        colorPreset({
          title: "Color",
          default: "base-100",
        }),
      ),
      border: Type.Optional(
        border({
          title: "Border",
          description: "Customize the border of the testimonial cards.",
          default: {
            width: "border",
            color: "border-accent-500",
          },
        }),
      ),
      fontSize: Type.Optional(
        fontSize({
          "ui:no-extra-large-sizes": true,
        }),
      ),
      padding: Type.Optional(
        cssLength({
          default: "1rem",
          description: "Padding inside the main container.",
          "ai:instructions": "Use only a single value like '1rem' or '10px'",
          title: "Padding",
          "ui:responsive": true,
          "ui:placeholder": "Not specified",
          "ui:styleId": "styles:padding",
        }),
      ),
      gap: Type.Optional(
        cssLength({
          title: "Gap",
          default: "26px",
          description: "Space between bricks.",
          "ai:instructions":
            "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
          "ui:placeholder": "Not specified",
          "ui:styleId": "styles:gap",
        }),
      ),
      shadow: Type.Optional(shadow()),
      loop: Type.Optional(
        loop({
          // title: "Use dynamic content",
          description:
            "If enabled, each row from the query result will be used to create a testimonial. Otherwise, the testimonials will be static.",
          "ui:placeholder": "Not specified (static)",
        }),
      ),
      grow: Type.Optional(
        grow({
          default: true,
        }),
      ),
      testimonials: Type.Optional(
        Type.Array(
          Type.Object({
            text: Type.String({
              title: "Text",
              default: "Amazing product!",
              description: "The testimonial text",
              "ui:multiline": true,
              "ui:textarea-class": "h-20",
            }),
            author: Type.String({
              title: "Author",
              description: "Name of the person giving the testimonial",
              default: "John Doe",
            }),
            subtitle: Type.Optional(
              Type.String({
                title: "Subtitle",
                description: "Subtitle, can be a company, social handle, job title, etc",
              }),
            ),
            avatar: Type.Optional(
              image({
                title: "Avatar",
                "ui:placeholder": "https://via.placeholder.com/80x80.png?text=JD",
                noObjectOptions: true,
              }),
            ),
            socialIcon: Type.Optional(icon()),
          }),
          {
            title: "Testimonials",
            default: [], // Empty array by default
            "ui:displayField": "author", // Affiche le nom de l'auteur dans la vue compacte
            "ui:options": {
              orderable: true, // Enable drag & drop reordering
              removable: true, // Enable delete button
              addable: true, // Enable add button
            },
            metadata: {
              category: "content",
              consumeQuery: true,
            },
            examples: [
              {
                text: "This is a great product! It has changed my life.",
                author: "John Doe",
                company: "Acme Inc.",
                avatar: {
                  src: "https://via.placeholder.com/80x80.png?text=JD",
                  alt: "John Doe profile photo",
                },
                socialIcon: "mdi:linkedin",
              },
            ],
          },
        ),
      ),
    },
    {
      default: {
        orientation: "horizontal",
      },
    },
  ),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "SaaS platform testimonials with avatars (static content)",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Sarah Johnson",
          subtitle: "TechCorp Solutions",
          text: "This platform has completely transformed how we manage our projects. The intuitive interface and powerful automation features have saved us countless hours.",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=SJ",
            alt: "Sarah Johnson profile photo",
          },
          socialIcon: "mdi:linkedin",
        },
        {
          author: "Mike Chen",
          subtitle: "StartupFlow",
          text: "Outstanding customer support and regular feature updates. We've been using this for over a year and it keeps getting better. Highly recommend!",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=MC",
            alt: "Mike Chen profile photo",
          },
          socialIcon: "mdi:twitter",
        },
        {
          author: "Emily Rodriguez",
          subtitle: "Digital Agency Pro",
          text: "The automation capabilities are game-changing. What used to take us days now happens automatically. It's like having an extra team member.",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=ER",
            alt: "Emily Rodriguez profile photo",
          },
          socialIcon: "mdi:linkedin",
        },
      ],
    },
  },
  {
    description: "Simple testimonials without avatars (static content)",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Anonymous User",
          text: "Great service and excellent value for money. Would definitely recommend to others looking for a reliable solution.",
          socialIcon: "mdi:account-circle",
        },
        {
          author: "Verified Customer",
          text: "Quick delivery and exactly as described. Very satisfied with my purchase and the overall experience.",
          socialIcon: "mdi:check-circle",
        },
        {
          author: "Beta Tester",
          text: "Been using the beta version and it's already impressive. Looking forward to the full release with even more features.",
          socialIcon: "mdi:beta",
        },
      ],
    },
  },
  {
    description: "Dynamic customer testimonials using customerReviews query",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "{{customerReviews.customerName}}",
          subtitle: "{{customerReviews.company}}",
          text: "{{customerReviews.reviewText}}",
          avatar: {
            src: "{{customerReviews.customerPhoto}}",
            alt: "{{customerReviews.customerName}} photo",
          },
          socialIcon: "{{customerReviews.socialPlatform}}",
        },
      ],
      loop: {
        over: "customerReviews",
      },
    },
  },
  {
    description: "Dynamic client testimonials using clientFeedback query",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "{{clientFeedback.clientName}}",
          subtitle: "{{clientFeedback.companyName}} - {{clientFeedback.position}}",
          text: "{{clientFeedback.testimonial}}",
          avatar: {
            src: "{{clientFeedback.headshot}}",
            alt: "{{clientFeedback.clientName}} headshot",
          },
          socialIcon: "{{clientFeedback.preferredIcon}}",
        },
      ],
      loop: {
        over: "clientFeedback",
      },
    },
  },
  {
    description: "Dynamic product reviews using productReviews query",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "{{productReviews.reviewerName}}",
          text: "{{productReviews.review}} - {{productReviews.rating}}/5 stars",
          avatar: {
            src: "{{productReviews.userAvatar}}",
            alt: "{{productReviews.reviewerName}} profile",
          },
          socialIcon: "mdi:star",
        },
      ],
      loop: {
        over: "productReviews",
      },
    },
  },
];
