import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import { textContentRef } from "../props/text";
import { imageRef } from "../props/image";
import { HiOutlineChatBubbleBottomCenter } from "react-icons/hi2";
import type { BrickProps } from "../props/types";
import { backgroundRef } from "../props/background";
import { borderRef } from "../props/border";
import { paddingRef } from "../props/padding";
import { shadowRef } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "testimonials",
  name: "Testimonials",
  kind: "widget",
  description: "Display testimonials from users",
  repeatable: false,
  icon: HiOutlineChatBubbleBottomCenter,
  props: defineProps(
    {
      orientation: Type.Optional(
        Type.Union(
          [
            Type.Literal("horizontal", { title: "Horizontal" }),
            Type.Literal("vertical", { title: "Vertical" }),
          ],
          { title: "Orientation", default: "horizontal" },
        ),
      ),
      background: Type.Optional(backgroundRef()),
      border: Type.Optional(borderRef()),
      padding: Type.Optional(paddingRef()),
      shadow: Type.Optional(shadowRef()),
      testimonials: Type.Array(
        Type.Object({
          author: string("Author", { default: "John Doe" }),
          company: Type.Optional(string("Company")),
          text: textContentRef({ title: "Text", default: "Amazing product!" }),
          avatar: Type.Optional(imageRef({ title: "Avatar" })),
          socialIcon: Type.Optional(
            string("Social Icon", {
              description: "Iconify reference for the social icon",
              "ui:field": "iconify",
            }),
          ),
        }),
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

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "SaaS platform testimonials with avatars (horizontal)",
    type: "testimonials",
    props: {
      orientation: "horizontal",
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
    description: "E-commerce customer reviews (vertical)",
    type: "testimonials",
    props: {
      orientation: "vertical",
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
      orientation: "horizontal",
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
    description: "App user feedback (vertical layout)",
    type: "testimonials",
    props: {
      orientation: "vertical",
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
      orientation: "horizontal",
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
      orientation: "horizontal",
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
      orientation: "vertical",
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
      orientation: "horizontal",
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
    description: "Fitness/wellness testimonials with achievement focus",
    type: "testimonials",
    props: {
      orientation: "vertical",
      testimonials: [
        {
          author: "Mark Thompson",
          text: "Lost 30 pounds in 4 months following this program! The personalized approach and constant support made all the difference in achieving my goals.",
          avatar: {
            src: "https://via.placeholder.com/75x75.png?text=MT",
            alt: "Mark Thompson transformation photo",
          },
          socialIcon: "mdi:dumbbell",
        },
        {
          author: "Anna Johnson",
          text: "Finally found a workout routine I actually enjoy! The trainers are motivating and the community support keeps me accountable every day.",
          avatar: {
            src: "https://via.placeholder.com/75x75.png?text=AJ",
            alt: "Anna Johnson fitness photo",
          },
          socialIcon: "mdi:heart-pulse",
        },
        {
          author: "Chris Davis",
          text: "This program completely changed my relationship with fitness. I'm stronger, more confident, and have energy I haven't felt in years.",
          avatar: {
            src: "https://via.placeholder.com/75x75.png?text=CD",
            alt: "Chris Davis success photo",
          },
          socialIcon: "mdi:trophy",
        },
      ],
    },
  },
  {
    description: "Restaurant customer reviews with food focus",
    type: "testimonials",
    props: {
      orientation: "horizontal",
      testimonials: [
        {
          author: "Food Critic Helen",
          company: "Local Food Blog",
          text: "Exceptional cuisine and impeccable service! Every dish was a masterpiece and the attention to detail was remarkable. A true culinary experience.",
          avatar: {
            src: "https://via.placeholder.com/65x65.png?text=HC",
            alt: "Helen food critic photo",
          },
          socialIcon: "mdi:silverware-fork-knife",
        },
        {
          author: "Regular Customer Joe",
          text: "Been coming here for years and it never disappoints. The staff knows my order by heart and the quality is consistently outstanding.",
          avatar: {
            src: "https://via.placeholder.com/65x65.png?text=JC",
            alt: "Joe regular customer",
          },
          socialIcon: "mdi:food",
        },
      ],
    },
  },
];
