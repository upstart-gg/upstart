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

export const manifest = defineBrickManifest({
  type: "testimonials",
  name: "Testimonials",
  description: "Display testimonials from users",
  defaultWidth: { desktop: "100%" },
  icon: HiOutlineChatBubbleBottomCenter,
  consumesMultipleQueryRows: true,
  aiInstructions: `This brick displays user testimonials with optional avatars and social icons.
It is typically used to showcase customer feedback or endorsements.
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
      testimonials: Type.Optional(
        Type.Array(
          Type.Object({
            text: Type.String({
              title: "Text",
              default: "Amazing product!",
              "ui:multiline": true,
              "ui:textarea-class": "h-20",
            }),
            author: Type.String({ title: "Author", default: "John Doe" }),
            company: Type.Optional(Type.String({ title: "Company" })),
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
    description: "SaaS platform testimonials with avatars",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Sarah Johnson",
          company: "TechCorp Solutions",
          text: "This platform has completely transformed how we manage our projects. The intuitive interface and powerful automation features have saved us countless hours.",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=SJ",
            alt: "Sarah Johnson profile photo",
          },
          socialIcon: "mdi:linkedin",
        },
        {
          author: "Mike Chen",
          company: "StartupFlow",
          text: "Outstanding customer support and regular feature updates. We've been using this for over a year and it keeps getting better. Highly recommend!",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=MC",
            alt: "Mike Chen profile photo",
          },
          socialIcon: "mdi:twitter",
        },
        {
          author: "Emily Rodriguez",
          company: "Digital Agency Pro",
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
    description: "E-commerce customer reviews",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Jessica Williams",
          company: "Happy Customer",
          text: "Amazing product quality and fast shipping! The item exceeded my expectations and the customer service was excellent when I had questions.",
          avatar: {
            src: "https://via.placeholder.com/60x60.png?text=JW",
            alt: "Jessica Williams customer photo",
          },
          socialIcon: "mdi:star",
        },
        {
          author: "David Park",
          text: "Five stars! Been using this product for 6 months and it's still going strong. Definitely worth the investment and I've already recommended it to friends.",
          avatar: {
            src: "https://via.placeholder.com/60x60.png?text=DP",
            alt: "David Park customer photo",
          },
          socialIcon: "mdi:thumbs-up",
        },
      ],
    },
  },
  {
    description: "Agency client testimonials with company info",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Rachel Thompson",
          company: "Global Enterprises",
          text: "The team delivered exceptional results on time and within budget. Their creative approach and attention to detail made all the difference for our brand.",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=RT",
            alt: "Rachel Thompson headshot",
          },
          socialIcon: "mdi:briefcase",
        },
        {
          author: "Alex Kumar",
          company: "Innovation Labs",
          text: "Working with this agency was a game-changer for our digital presence. They understood our vision and brought it to life beautifully.",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=AK",
            alt: "Alex Kumar profile",
          },
          socialIcon: "mdi:lightbulb",
        },
        {
          author: "Maria Santos",
          company: "Retail Plus",
          text: "Professional, creative, and results-driven. Our website traffic increased by 200% after their redesign. Couldn't be happier!",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=MS",
            alt: "Maria Santos photo",
          },
          socialIcon: "mdi:chart-line",
        },
      ],
    },
  },
  {
    description: "App user feedback",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Tom Wilson",
          text: "This app has made my daily routine so much easier. Love the clean interface and how everything just works seamlessly across all my devices.",
          avatar: {
            src: "https://via.placeholder.com/65x65.png?text=TW",
            alt: "Tom Wilson user photo",
          },
          socialIcon: "mdi:cellphone",
        },
        {
          author: "Lisa Chang",
          text: "Been using this app for months and it's become essential to my workflow. The latest update with AI features is incredibly impressive.",
          avatar: {
            src: "https://via.placeholder.com/65x65.png?text=LC",
            alt: "Lisa Chang profile picture",
          },
          socialIcon: "mdi:robot",
        },
        {
          author: "James Miller",
          text: "Simple, powerful, and reliable. Exactly what I was looking for. The customer support team is also very responsive and helpful.",
          avatar: {
            src: "https://via.placeholder.com/65x65.png?text=JM",
            alt: "James Miller avatar",
          },
          socialIcon: "mdi:heart",
        },
      ],
    },
  },
  {
    description: "Course/education testimonials with social icons",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Amanda Foster",
          company: "UX Designer",
          text: "This course completely changed my career trajectory. The practical projects and expert feedback helped me land my dream job in just 3 months.",
          avatar: {
            src: "https://via.placeholder.com/75x75.png?text=AF",
            alt: "Amanda Foster student photo",
          },
          socialIcon: "mdi:school",
        },
        {
          author: "Carlos Rodriguez",
          company: "Software Engineer",
          text: "The instructors are industry experts and the content is always up-to-date. I've taken three courses here and each one exceeded my expectations.",
          avatar: {
            src: "https://via.placeholder.com/75x75.png?text=CR",
            alt: "Carlos Rodriguez profile",
          },
          socialIcon: "mdi:code-tags",
        },
      ],
    },
  },
  {
    description: "Simple testimonials without avatars",
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
    description: "Consultant testimonials with professional focus",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Dr. Patricia Lee",
          company: "Medical Practice Solutions",
          text: "The consulting services provided were invaluable to our practice. Revenue increased by 40% and patient satisfaction scores improved significantly.",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=PL",
            alt: "Dr. Patricia Lee headshot",
          },
          socialIcon: "mdi:medical-bag",
        },
        {
          author: "Robert Kim",
          company: "Manufacturing Inc.",
          text: "Their strategic insights helped us streamline operations and reduce costs by 25%. The ROI was evident within the first quarter.",
          avatar: {
            src: "https://via.placeholder.com/80x80.png?text=RK",
            alt: "Robert Kim executive photo",
          },
          socialIcon: "mdi:factory",
        },
      ],
    },
  },
  {
    description: "Event testimonials with social media icons",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "Jennifer Adams",
          company: "Marketing Director",
          text: "Best conference I've attended in years! The networking opportunities were incredible and the speakers were top-notch industry leaders.",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=JA",
            alt: "Jennifer Adams conference attendee",
          },
          socialIcon: "mdi:twitter",
        },
        {
          author: "Michael Brown",
          company: "Tech Startup Founder",
          text: "The workshops were incredibly practical and I left with actionable strategies I could implement immediately. Already planning to attend next year!",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=MB",
            alt: "Michael Brown participant photo",
          },
          socialIcon: "mdi:linkedin",
        },
        {
          author: "Sophie Chen",
          company: "Product Manager",
          text: "Amazing organization and valuable content. Met so many like-minded professionals and learned cutting-edge techniques I'm excited to try.",
          avatar: {
            src: "https://via.placeholder.com/70x70.png?text=SC",
            alt: "Sophie Chen attendee photo",
          },
          socialIcon: "mdi:instagram",
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
          company: "{{customerReviews.company}}",
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
          company: "{{clientFeedback.companyName}} - {{clientFeedback.position}}",
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
  {
    description: "Dynamic employee testimonials using teamTestimonials query",
    type: "testimonials",
    props: {
      testimonials: [
        {
          author: "{{teamTestimonials.employeeName}}",
          company: "{{teamTestimonials.department}} - {{teamTestimonials.jobTitle}}",
          text: "{{teamTestimonials.testimonial}}",
          avatar: {
            src: "{{teamTestimonials.profilePhoto}}",
            alt: "{{teamTestimonials.employeeName}} profile photo",
          },
          socialIcon: "{{teamTestimonials.socialIcon}}",
        },
      ],
      loop: {
        over: "teamTestimonials",
      },
    },
  },
];
