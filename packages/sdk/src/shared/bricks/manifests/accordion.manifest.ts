import { Type } from "@sinclair/typebox";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { boolean } from "../props/boolean";
import { defineProps } from "../props/helpers";
import { colorPresetRef } from "../props/color-preset";
import { fontSizeRef, textContentRef } from "../props/text";
import type { BrickProps } from "../props/types";
import { loopRef } from "../props/dynamic";
import { cssLengthRef } from "../props/css-length";

export const manifest = defineBrickManifest({
  type: "accordion",
  name: "Accordion",
  description: "An accordion/collapse element for expandable content",
  aiInstructions: `
This accordion element displays content in collapsible panels.
It is typically used for FAQ sections, organized documentation, or to save space.
Each item has a title and expandable content area.
Multiple panels can be open simultaneously or limited to one at a time.
  `.trim(),
  icon: TfiLayoutAccordionSeparated,

  defaultWidth: { desktop: "450px", mobile: "100%" },

  props: defineProps({
    items: Type.Array(
      Type.Object({
        title: textContentRef({
          title: "Title",
          default: "My title",
          disableSizing: true,
          showInSettings: true,
        }),
        content: textContentRef({ title: "Content", default: "Expandable content goes here" }),
        defaultOpen: Type.Optional(boolean("Open by default", false)),
      }),
      {
        title: "Accordion items",
        metadata: {
          category: "content",
        },
      },
    ),
    fontSize: Type.Optional(fontSizeRef({ default: "inherit" })),
    restrictOneOpen: boolean("Restrict to one open item", false, {
      description:
        "Restrict to one open item at a time. If false, multiple items can be open simultaneously.",
    }),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the accordion items.",
        default: "1px",
        "ui:styleId": "styles:gap",
      }),
    ),
    rounding: Type.Optional(
      StringEnum(
        [
          "rounded-auto",
          "rounded-none",
          "rounded-sm",
          "rounded-md",
          "rounded-lg",
          "rounded-xl",
          "rounded-2xl",
          "rounded-3xl",
        ],
        {
          title: "Corner rounding",
          enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "3xl"],
          "ui:placeholder": "Not specified",
          "ui:field": "enum",
          "ui:display": "select",
          "ui:styleId": "styles:rounding",
          default: "rounded-auto",
        },
      ),
    ),
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
        default: { color: "bg-primary-500 text-primary-500-content" },
      }),
    ),
    loop: Type.Optional(loopRef()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "FAQ section with card styling with single open",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      items: [
        {
          title: "What is included in the basic plan?",
          content:
            "The basic plan includes access to all core features, up to 10 projects, 5GB storage, email support, and basic analytics. You can upgrade at any time to access advanced features like API access, priority support, and unlimited projects.",
          defaultOpen: true,
        },
        {
          title: "How do I cancel my subscription?",
          content:
            "You can cancel your subscription at any time from your account settings. Go to Billing > Manage Subscription > Cancel. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
        },
        {
          title: "Is there a free trial available?",
          content:
            "Yes! We offer a 14-day free trial with full access to all premium features. No credit card required to start. You can upgrade to a paid plan anytime during or after the trial period.",
        },
        {
          title: "What payment methods do you accept?",
          content:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners.",
        },
        {
          title: "Do you offer refunds?",
          content:
            "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.",
        },
      ],
    },
  },
  {
    description: "Product features accordion with multiple open panels and secondary color scheme",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "secondary-400",
      },
      rounding: "rounded-lg",
      gap: "0.5rem",
      items: [
        {
          title: "Advanced Analytics Dashboard",
          content:
            "Get detailed insights into your business performance with real-time analytics, custom reports, and data visualization tools. Track key metrics, monitor trends, and make data-driven decisions.",
          defaultOpen: true,
        },
        {
          title: "Team Collaboration Tools",
          content:
            "Work seamlessly with your team using built-in collaboration features including shared workspaces, real-time editing, comments, and task management. Perfect for remote and hybrid teams.",
          defaultOpen: true,
        },
        {
          title: "API Integration & Automation",
          content:
            "Connect with over 1000+ popular tools and services through our robust API. Set up automated workflows, sync data across platforms, and streamline your business processes.",
        },
        {
          title: "Enterprise Security",
          content:
            "Bank-level security with end-to-end encryption, SSO integration, two-factor authentication, and compliance with SOC 2, GDPR, and HIPAA standards.",
        },
      ],
    },
  },
  {
    description: "Documentation sections with neutral styling and large font size",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "neutral-200",
      },
      fontSize: "text-lg",
      rounding: "rounded-md",
      gap: "2px",
      items: [
        {
          title: "Getting Started",
          content:
            "Learn the basics of our platform with step-by-step tutorials, setup guides, and quick start examples. Perfect for new users who want to get up and running quickly.",
        },
        {
          title: "API Reference",
          content:
            "Complete API documentation with endpoints, parameters, response examples, and SDKs for popular programming languages including JavaScript, Python, PHP, and Ruby.",
        },
        {
          title: "Advanced Configuration",
          content:
            "Deep dive into advanced features, custom configurations, webhooks, and enterprise-level integrations. Includes code samples and best practices.",
        },
      ],
    },
  },
  {
    description: "Restaurant menu sections with accent colors and extra large rounding",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: {
        color: "accent-500",
      },
      rounding: "rounded-xl",
      gap: "1rem",
      items: [
        {
          title: "Appetizers & Starters",
          content:
            "Bruschetta with Fresh Tomatoes - $8.99<br/>Calamari Rings with Marinara - $12.99<br/>Spinach & Artichoke Dip - $10.99<br/>Buffalo Wings (6 pieces) - $9.99",
          defaultOpen: true,
        },
        {
          title: "Main Courses",
          content:
            "Grilled Salmon with Herbs - $18.99<br/>Chicken Parmesan with Pasta - $16.99<br/>Ribeye Steak (12oz) - $24.99<br/>Vegetarian Lasagna - $14.99",
        },
        {
          title: "Desserts",
          content:
            "Tiramisu - $7.99<br/>Chocolate Lava Cake - $8.99<br/>New York Cheesecake - $6.99<br/>Gelato (3 scoops) - $5.99",
        },
      ],
    },
  },
  {
    description: "Course curriculum with primary colors and minimal gap",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "primary-600",
      },
      rounding: "rounded-sm",
      gap: "1px",
      fontSize: "text-base",
      items: [
        {
          title: "Week 1: Introduction to Web Development",
          content:
            "Learn the fundamentals of HTML, CSS, and basic JavaScript. Set up your development environment and create your first web page. Includes hands-on exercises and project templates.",
        },
        {
          title: "Week 2: Responsive Design & CSS Framework",
          content:
            "Master responsive web design principles, CSS Grid, Flexbox, and popular frameworks like Bootstrap and Tailwind CSS. Build mobile-first designs that work on all devices.",
        },
        {
          title: "Week 3: JavaScript Fundamentals",
          content:
            "Deep dive into JavaScript programming including variables, functions, objects, arrays, DOM manipulation, and event handling. Build interactive web applications.",
        },
        {
          title: "Week 4: Modern JavaScript & APIs",
          content:
            "Learn ES6+ features, async/await, fetch API, and how to work with external APIs. Create dynamic applications that interact with real-world data sources.",
        },
      ],
    },
  },
  {
    description: "Legal terms accordion with neutral dark theme and large gaps",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: {
        color: "neutral-800",
      },
      rounding: "rounded-lg",
      gap: "1.5rem",
      fontSize: "text-sm",
      items: [
        {
          title: "Terms of Service",
          content:
            "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use the service.",
        },
        {
          title: "Privacy Policy",
          content:
            "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. We use this information to provide, maintain, and improve our services.",
        },
        {
          title: "Cookie Policy",
          content:
            "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.",
        },
      ],
    },
  },
  {
    description: "Event schedule with secondary colors and 2xl rounding",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "secondary-300",
      },
      rounding: "rounded-2xl",
      gap: "0.75rem",
      items: [
        {
          title: "Day 1: Opening Ceremony & Keynotes",
          content:
            "9:00 AM - Registration & Welcome Coffee<br/>10:00 AM - Opening Ceremony<br/>11:00 AM - Keynote: Future of Technology<br/>12:30 PM - Networking Lunch<br/>2:00 PM - Panel Discussion<br/>4:00 PM - Closing Remarks",
          defaultOpen: true,
        },
        {
          title: "Day 2: Workshops & Technical Sessions",
          content:
            "9:00 AM - Workshop: AI in Practice<br/>11:00 AM - Technical Deep Dive: Cloud Architecture<br/>1:00 PM - Lunch Break<br/>2:30 PM - Hands-on Lab: DevOps Tools<br/>4:30 PM - Q&A Session",
        },
        {
          title: "Day 3: Networking & Demo Day",
          content:
            "10:00 AM - Startup Pitch Competition<br/>12:00 PM - Demo Showcase<br/>2:00 PM - Networking Session<br/>3:30 PM - Awards Ceremony<br/>5:00 PM - Closing Party",
        },
      ],
    },
  },
  {
    description: "Fitness program details with accent colors and 3xl rounding",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: {
        color: "accent-400",
      },
      rounding: "rounded-3xl",
      gap: "1.25rem",
      fontSize: "text-lg",
      items: [
        {
          title: "Beginner Program (4 weeks)",
          content:
            "Perfect for newcomers to fitness. Includes basic bodyweight exercises, flexibility training, and cardio. 3 sessions per week, 45 minutes each. Includes nutrition guidance and progress tracking.",
        },
        {
          title: "Intermediate Program (8 weeks)",
          content:
            "For those with some fitness experience. Combines strength training, HIIT workouts, and endurance building. 4 sessions per week, 60 minutes each. Includes meal planning and supplement recommendations.",
        },
        {
          title: "Advanced Program (12 weeks)",
          content:
            "High-intensity program for experienced athletes. Features complex movements, periodization, and sport-specific training. 5-6 sessions per week. Includes recovery protocols and performance optimization.",
        },
      ],
    },
  },
  {
    description: "Support categories with primary colors and no rounding",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "primary-300",
      },
      rounding: "rounded-none",
      gap: "0px",
      fontSize: "text-base",
      items: [
        {
          title: "Account & Billing",
          content:
            "Get help with account settings, password reset, billing questions, subscription management, and payment issues. Average response time: 2 hours during business hours.",
        },
        {
          title: "Technical Support",
          content:
            "Troubleshoot technical issues, API problems, integration questions, and performance concerns. Includes access to our knowledge base and video tutorials.",
        },
        {
          title: "Sales & Partnerships",
          content:
            "Inquiries about enterprise solutions, custom pricing, partnership opportunities, and bulk discounts. Schedule a call with our sales team for personalized assistance.",
        },
        {
          title: "Feature Requests",
          content:
            "Submit ideas for new features, improvements, and integrations. Our product team reviews all suggestions and provides updates on development roadmap.",
        },
      ],
    },
  },
  {
    description: "Company policies with neutral colors and small font size",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: {
        color: "neutral-100",
      },
      rounding: "rounded-md",
      gap: "0.25rem",
      fontSize: "text-sm",
      items: [
        {
          title: "Remote Work Policy",
          content:
            "All employees have the flexibility to work remotely full-time or adopt a hybrid schedule. Required equipment is provided, and employees must maintain reliable internet connection and dedicated workspace.",
        },
        {
          title: "Professional Development",
          content:
            "Annual budget of $2,000 per employee for conferences, courses, certifications, and training materials. Time off is provided for approved learning activities and skill development.",
        },
        {
          title: "Time Off & Benefits",
          content:
            "Unlimited PTO policy with minimum 3 weeks encouraged annually. Comprehensive health insurance, dental, vision, 401k matching, and wellness stipend included.",
        },
      ],
    },
  },
  {
    description: "Product comparison with secondary colors and multiple defaults open",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "secondary-500",
      },
      rounding: "rounded-lg",
      gap: "0.5rem",
      fontSize: "text-base",
      items: [
        {
          title: "Basic Plan - $9/month",
          content:
            "✓ Up to 5 projects<br/>✓ 10GB storage<br/>✓ Email support<br/>✓ Basic analytics<br/>✓ Mobile app access<br/>✗ API access<br/>✗ Custom integrations",
          defaultOpen: true,
        },
        {
          title: "Pro Plan - $29/month",
          content:
            "✓ Unlimited projects<br/>✓ 100GB storage<br/>✓ Priority support<br/>✓ Advanced analytics<br/>✓ API access<br/>✓ Custom integrations<br/>✓ Team collaboration",
          defaultOpen: true,
        },
        {
          title: "Enterprise Plan - Custom pricing",
          content:
            "✓ Everything in Pro<br/>✓ Unlimited storage<br/>✓ Dedicated support<br/>✓ White-label options<br/>✓ SSO integration<br/>✓ Custom contracts<br/>✓ On-premise deployment",
        },
      ],
    },
  },
  {
    description: "Troubleshooting guide with accent colors and large font",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: {
        color: "accent-600",
      },
      rounding: "rounded-xl",
      gap: "1rem",
      fontSize: "text-lg",
      items: [
        {
          title: "Connection Issues",
          content:
            "1. Check your internet connection<br/>2. Clear browser cache and cookies<br/>3. Disable VPN if active<br/>4. Try incognito/private browsing mode<br/>5. Contact support if issues persist",
        },
        {
          title: "Login Problems",
          content:
            "1. Verify your email address and password<br/>2. Use 'Forgot Password' to reset<br/>3. Check for CAPS LOCK<br/>4. Try a different browser<br/>5. Ensure account is not suspended",
        },
        {
          title: "Performance Issues",
          content:
            "1. Close unnecessary browser tabs<br/>2. Update your browser to latest version<br/>3. Disable browser extensions<br/>4. Check system resources (RAM/CPU)<br/>5. Try using the mobile app instead",
        },
      ],
    },
  },
];
