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
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "accordion",
  name: "Accordion",
  description: "An accordion/collapse element for expandable content",
  aiInstructions: `Use this accordion component for organizing collapsible content sections that help save space and improve content accessibility.

WHEN TO USE:
- FAQ sections with questions and detailed answers
- Product feature lists with expandable descriptions  
- Documentation sections with organized topics
- Step-by-step processes or tutorials
- Menu categories (restaurant, services, pricing tiers)
- Legal documents with different sections
- Course curricula with lesson breakdowns
- Support categories with help topics

STYLING GUIDELINES:
- colorPreset: Use "primary-500" for branded sections, "secondary-400" for features, "neutral-200" for documentation, "accent-500" for highlights
- fontSize: "text-sm" for compact content, "text-base" for standard, "text-lg" for emphasis
- rounding: "rounded-none" for sharp/corporate, "rounded-md" for standard, "rounded-lg" for friendly, "rounded-xl"/"rounded-2xl"/"rounded-3xl" for modern
- gap: "1px" for minimal separation, "0.5rem" for comfortable, "1rem" for spacious layouts
- restrictOneOpen: true for FAQs/single focus, false for reference materials/feature lists

CONTENT ORGANIZATION:
- Use clear, descriptive titles that preview the content
- Keep expandable content concise but comprehensive
- Support HTML formatting in content (lists, links, line breaks)
- Set defaultOpen: true for most important/frequently accessed items

DYNAMIC CONTENT:
- Support template variables in titles: "{{category.name}} - {{category.count}} items"
- Dynamic content: "Learn about {{product.features}} and {{product.benefits}}"
- Loop over data: Display product categories, team departments, or service areas

AVOID:
- Too many items (>10) without organization
- Very long titles that don't fit on mobile
- Empty or placeholder content in collapsed sections
- Mixing different content types in the same accordion`,
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

export const examples: BrickExample<Manifest>[] = [
  // FAQ SECTIONS
  {
    description: "FAQ section with single open restriction - Classic use case for customer support",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: { color: "primary-500" },
      rounding: "rounded-md",
      gap: "0.5rem",
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
      ],
    },
  },

  // PRODUCT FEATURES
  {
    description: "Product features with multiple open panels - Good for showcasing software capabilities",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: { color: "secondary-400" },
      rounding: "rounded-lg",
      gap: "0.5rem",
      fontSize: "text-base",
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

  // DOCUMENTATION & GUIDES
  {
    description: "Documentation sections with neutral colors - Perfect for help centers and knowledge bases",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: { color: "neutral-200" },
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

  // MENU & CATALOG SECTIONS
  {
    description:
      "Restaurant menu sections with accent colors - Great for organizing menu items or service categories",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: { color: "accent-500" },
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

  // COURSE & EDUCATIONAL CONTENT
  {
    description:
      "Course curriculum with primary colors - Excellent for educational content and training programs",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: { color: "primary-600" },
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

  // SUPPORT & HELP SECTIONS
  {
    description: "Support categories with sharp corners - Modern corporate style for help centers",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: { color: "primary-300" },
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

  // PRICING & COMPARISON
  {
    description: "Product pricing comparison with multiple defaults open - Perfect for plan comparisons",
    type: "accordion",
    props: {
      restrictOneOpen: false,
      colorPreset: { color: "secondary-500" },
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

  // DYNAMIC CONTENT EXAMPLES
  {
    description: "Dynamic team member accordion using template variables - Shows data-driven content",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: { color: "accent-400" },
      rounding: "rounded-lg",
      gap: "0.5rem",
      items: [
        {
          title: "Meet {{team.leader.name}} - {{team.leader.role}}",
          content:
            "{{team.leader.bio}} <br/><br/>Experience: {{team.leader.experience}} years<br/>Email: {{team.leader.email}}<br/>Location: {{team.leader.location}}",
          defaultOpen: true,
        },
        {
          title: "{{team.designer.name}} - {{team.designer.role}}",
          content:
            "{{team.designer.bio}} <br/><br/>Specializes in: {{team.designer.specialties}}<br/>Portfolio: <a href='{{team.designer.portfolio}}'>View Work</a>",
        },
        {
          title: "{{team.developer.name}} - {{team.developer.role}}",
          content:
            "{{team.developer.bio}} <br/><br/>Technologies: {{team.developer.skills}}<br/>GitHub: <a href='{{team.developer.github}}'>@{{team.developer.username}}</a>",
        },
      ],
    },
  },

  // SPECIAL STYLING VARIATIONS
  {
    description: "Legal documents with dark theme and large gaps - Professional legal content presentation",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: { color: "neutral-800" },
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
    description: "Ultra-rounded modern design with 3xl rounding - Contemporary aesthetic for creative brands",
    type: "accordion",
    props: {
      restrictOneOpen: true,
      colorPreset: { color: "accent-300" },
      rounding: "rounded-3xl",
      gap: "1.5rem",
      fontSize: "text-lg",
      items: [
        {
          title: "Design Philosophy",
          content:
            "We believe in creating digital experiences that are both beautiful and functional. Our approach combines user-centered design with cutting-edge technology to deliver exceptional results.",
        },
        {
          title: "Our Process",
          content:
            "Discovery → Strategy → Design → Development → Testing → Launch. Each phase includes client collaboration, iterative feedback, and quality assurance to ensure optimal outcomes.",
        },
        {
          title: "Why Choose Us",
          content:
            "15+ years experience, 200+ successful projects, award-winning designs, and a commitment to excellence. We're not just service providers - we're strategic partners in your success.",
        },
      ],
    },
  },
];
