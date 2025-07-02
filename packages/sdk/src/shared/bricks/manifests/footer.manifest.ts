import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { array, defineProps, group, optional } from "../props/helpers";
import { number } from "../props/number";
import { string, urlOrPageId, urlOrPageIdRef } from "../props/string";
import { VscLayoutPanelOff } from "react-icons/vsc";
import { image, imageRef } from "../props/image";
import { preset } from "../props/preset";
import type { BrickProps } from "../props/types";
import type { FC } from "react";
import { backgroundColorRef } from "../props/background";

export const manifest = defineBrickManifest({
  type: "footer",
  kind: "widget",
  name: "Footer",
  description: "A footer with links and an optional logo",
  icon: VscLayoutPanelOff,
  staticClasses: "flex-1",
  resizable: false,
  defaultWidth: {
    desktop: "100%",
    mobile: "100%",
  },
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("logo-left", { title: "Logo on the left", description: "Logo on the left" }),
          Type.Literal("logo-right", { title: "Logo on the right", description: "Logo on the right" }),
          Type.Literal("logo-center", { title: "Logo on the center", description: "Logo at center" }),
          Type.Literal("multiple-rows", {
            title: "Span on multiple rows.",
            description: "Span on multiple rows. Use when there a a lot of links sections",
          }),
        ],
        {
          title: "Variant",
          description: "Footer variants.",
        },
      ),
    ),
    backgroundColor: optional(backgroundColorRef()),
    logo: optional(imageRef({ title: "Logo" })),
    rows: optional(number("Rows", { default: 1, "ui:field": "slider", minimum: 1, maximum: 5 })),
    linksSections: array(
      Type.Object({
        sectionTitle: string("Links Section title"),
        links: array(
          Type.Object({
            title: string("Title"),
            url: urlOrPageIdRef(),
            column: optional(number("Column", { default: 1 })),
          }),
        ),
      }),
      {
        default: [
          {
            sectionTitle: "Links",
            links: [
              {
                title: "Link",
                url: "/",
              },
            ],
          },
        ],
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
    description: "Simple footer with logo on the left",
    type: "footer",
    props: {
      variants: ["logo-left"],
      backgroundColor: "#f8f9fa",
      logo: {
        src: "https://via.placeholder.com/120x40.png?text=Logo",
        alt: "Company logo",
      },
      linksSections: [
        {
          sectionTitle: "Quick Links",
          links: [
            { title: "Home", url: "/" },
            { title: "About", url: "/about" },
            { title: "Contact", url: "/contact" },
          ],
        },
        {
          sectionTitle: "Legal",
          links: [
            { title: "Privacy Policy", url: "/privacy" },
            { title: "Terms of Service", url: "/terms" },
          ],
        },
      ],
    },
  },
  {
    description: "Corporate footer with centered logo",
    type: "footer",
    props: {
      variants: ["logo-center"],
      backgroundColor: "#2c3e50",
      logo: {
        src: "https://via.placeholder.com/150x50.png?text=Corporate",
        alt: "Corporate logo",
      },
      linksSections: [
        {
          sectionTitle: "Products",
          links: [
            { title: "Software Solutions", url: "/products/software" },
            { title: "Consulting", url: "/products/consulting" },
            { title: "Support", url: "/products/support" },
            { title: "Training", url: "/products/training" },
          ],
        },
        {
          sectionTitle: "Company",
          links: [
            { title: "About Us", url: "/about" },
            { title: "Careers", url: "/careers" },
            { title: "News", url: "/news" },
            { title: "Investors", url: "/investors" },
          ],
        },
        {
          sectionTitle: "Resources",
          links: [
            { title: "Documentation", url: "/docs" },
            { title: "API Reference", url: "/api" },
            { title: "Community", url: "/community" },
            { title: "Blog", url: "/blog" },
          ],
        },
      ],
    },
  },
  {
    description: "E-commerce footer with logo on the right",
    type: "footer",
    props: {
      variants: ["logo-right"],
      backgroundColor: "#ffffff",
      logo: {
        src: "https://via.placeholder.com/140x45.png?text=Shop",
        alt: "Shop logo",
      },
      linksSections: [
        {
          sectionTitle: "Shop",
          links: [
            { title: "All Products", url: "/products" },
            { title: "New Arrivals", url: "/new" },
            { title: "Sale", url: "/sale" },
            { title: "Gift Cards", url: "/gift-cards" },
          ],
        },
        {
          sectionTitle: "Customer Service",
          links: [
            { title: "Help Center", url: "/help" },
            { title: "Returns", url: "/returns" },
            { title: "Shipping Info", url: "/shipping" },
            { title: "Size Guide", url: "/size-guide" },
          ],
        },
        {
          sectionTitle: "Account",
          links: [
            { title: "My Account", url: "/account" },
            { title: "Order History", url: "/orders" },
            { title: "Wishlist", url: "/wishlist" },
          ],
        },
      ],
    },
  },
  {
    description: "Large organization footer with multiple rows",
    type: "footer",
    props: {
      variants: ["logo-center", "multiple-rows"],
      backgroundColor: "#1a1a1a",
      logo: {
        src: "https://via.placeholder.com/180x60.png?text=Enterprise",
        alt: "Enterprise logo",
      },
      linksSections: [
        {
          sectionTitle: "Products & Services",
          links: [
            { title: "Cloud Solutions", url: "/cloud", column: 1 },
            { title: "Data Analytics", url: "/analytics", column: 1 },
            { title: "AI & Machine Learning", url: "/ai", column: 1 },
            { title: "Cybersecurity", url: "/security", column: 2 },
            { title: "DevOps Tools", url: "/devops", column: 2 },
            { title: "IoT Platform", url: "/iot", column: 2 },
          ],
        },
        {
          sectionTitle: "Industries",
          links: [
            { title: "Healthcare", url: "/industries/healthcare", column: 3 },
            { title: "Finance", url: "/industries/finance", column: 3 },
            { title: "Retail", url: "/industries/retail", column: 3 },
            { title: "Manufacturing", url: "/industries/manufacturing", column: 4 },
            { title: "Education", url: "/industries/education", column: 4 },
            { title: "Government", url: "/industries/government", column: 4 },
          ],
        },
        {
          sectionTitle: "Resources",
          links: [
            { title: "Documentation", url: "/docs", column: 1 },
            { title: "API Reference", url: "/api", column: 1 },
            { title: "Tutorials", url: "/tutorials", column: 1 },
            { title: "Webinars", url: "/webinars", column: 2 },
            { title: "White Papers", url: "/whitepapers", column: 2 },
            { title: "Case Studies", url: "/case-studies", column: 2 },
          ],
        },
        {
          sectionTitle: "Support & Community",
          links: [
            { title: "Help Center", url: "/help", column: 3 },
            { title: "Community Forum", url: "/forum", column: 3 },
            { title: "Contact Support", url: "/support", column: 3 },
            { title: "Service Status", url: "/status", column: 4 },
            { title: "Partner Portal", url: "/partners", column: 4 },
            { title: "Developer Hub", url: "/developers", column: 4 },
          ],
        },
      ],
    },
  },
  {
    description: "Startup footer with minimal links and left logo",
    type: "footer",
    props: {
      variants: ["logo-left"],
      backgroundColor: "#f5f5f5",
      logo: {
        src: "https://via.placeholder.com/100x35.png?text=Startup",
        alt: "Startup logo",
      },
      linksSections: [
        {
          sectionTitle: "Company",
          links: [
            { title: "About", url: "/about" },
            { title: "Team", url: "/team" },
            { title: "Jobs", url: "/jobs" },
          ],
        },
        {
          sectionTitle: "Product",
          links: [
            { title: "Features", url: "/features" },
            { title: "Pricing", url: "/pricing" },
            { title: "Demo", url: "/demo" },
          ],
        },
        {
          sectionTitle: "Support",
          links: [
            { title: "Help", url: "/help" },
            { title: "Contact", url: "/contact" },
          ],
        },
      ],
    },
  },
  {
    description: "Agency footer with centered logo and creative sections",
    type: "footer",
    props: {
      variants: ["logo-center"],
      backgroundColor: "#6366f1",
      logo: {
        src: "https://via.placeholder.com/130x45.png?text=Agency",
        alt: "Creative agency logo",
      },
      linksSections: [
        {
          sectionTitle: "Services",
          links: [
            { title: "Web Design", url: "/services/web-design" },
            { title: "Branding", url: "/services/branding" },
            { title: "Digital Marketing", url: "/services/marketing" },
            { title: "Photography", url: "/services/photography" },
          ],
        },
        {
          sectionTitle: "Portfolio",
          links: [
            { title: "Recent Work", url: "/portfolio" },
            { title: "Case Studies", url: "/case-studies" },
            { title: "Client Reviews", url: "/reviews" },
          ],
        },
        {
          sectionTitle: "Connect",
          links: [
            { title: "Contact Us", url: "/contact" },
            { title: "Get Quote", url: "/quote" },
            { title: "Newsletter", url: "/newsletter" },
          ],
        },
      ],
    },
  },
  {
    description: "SaaS platform footer with comprehensive links",
    type: "footer",
    props: {
      variants: ["logo-left", "multiple-rows"],
      backgroundColor: "#0f172a",
      logo: {
        src: "https://via.placeholder.com/160x50.png?text=SaaS+Platform",
        alt: "SaaS platform logo",
      },
      linksSections: [
        {
          sectionTitle: "Platform",
          links: [
            { title: "Dashboard", url: "/dashboard", column: 1 },
            { title: "Analytics", url: "/analytics", column: 1 },
            { title: "Integrations", url: "/integrations", column: 1 },
            { title: "API", url: "/api", column: 1 },
          ],
        },
        {
          sectionTitle: "Solutions",
          links: [
            { title: "For Startups", url: "/solutions/startups", column: 2 },
            { title: "For Enterprise", url: "/solutions/enterprise", column: 2 },
            { title: "For Agencies", url: "/solutions/agencies", column: 2 },
            { title: "For Developers", url: "/solutions/developers", column: 2 },
          ],
        },
        {
          sectionTitle: "Resources",
          links: [
            { title: "Blog", url: "/blog", column: 1 },
            { title: "Documentation", url: "/docs", column: 1 },
            { title: "Help Center", url: "/help", column: 1 },
            { title: "Community", url: "/community", column: 1 },
          ],
        },
        {
          sectionTitle: "Company",
          links: [
            { title: "About Us", url: "/about", column: 2 },
            { title: "Careers", url: "/careers", column: 2 },
            { title: "Press", url: "/press", column: 2 },
            { title: "Legal", url: "/legal", column: 2 },
          ],
        },
      ],
    },
  },
  {
    description: "Non-profit footer with mission-focused links",
    type: "footer",
    props: {
      variants: ["logo-center"],
      backgroundColor: "#059669",
      logo: {
        src: "https://via.placeholder.com/140x50.png?text=Non+Profit",
        alt: "Non-profit organization logo",
      },
      linksSections: [
        {
          sectionTitle: "Our Work",
          links: [
            { title: "Programs", url: "/programs" },
            { title: "Impact", url: "/impact" },
            { title: "Success Stories", url: "/stories" },
            { title: "Research", url: "/research" },
          ],
        },
        {
          sectionTitle: "Get Involved",
          links: [
            { title: "Donate", url: "/donate" },
            { title: "Volunteer", url: "/volunteer" },
            { title: "Events", url: "/events" },
            { title: "Partner with Us", url: "/partnerships" },
          ],
        },
        {
          sectionTitle: "About",
          links: [
            { title: "Our Mission", url: "/mission" },
            { title: "Leadership", url: "/leadership" },
            { title: "Annual Reports", url: "/reports" },
            { title: "Contact", url: "/contact" },
          ],
        },
      ],
    },
  },
  {
    description: "Tech blog footer with right-aligned logo",
    type: "footer",
    props: {
      variants: ["logo-right"],
      backgroundColor: "#111827",
      logo: {
        src: "https://via.placeholder.com/120x40.png?text=Tech+Blog",
        alt: "Tech blog logo",
      },
      linksSections: [
        {
          sectionTitle: "Categories",
          links: [
            { title: "Web Development", url: "/category/web-dev" },
            { title: "AI & ML", url: "/category/ai-ml" },
            { title: "DevOps", url: "/category/devops" },
            { title: "Mobile", url: "/category/mobile" },
          ],
        },
        {
          sectionTitle: "Popular",
          links: [
            { title: "Latest Posts", url: "/latest" },
            { title: "Trending", url: "/trending" },
            { title: "Best of 2024", url: "/best-2024" },
            { title: "Tutorials", url: "/tutorials" },
          ],
        },
        {
          sectionTitle: "Community",
          links: [
            { title: "Newsletter", url: "/newsletter" },
            { title: "Discord", url: "/discord" },
            { title: "Contributors", url: "/contributors" },
            { title: "Write for Us", url: "/write" },
          ],
        },
      ],
    },
  },
  {
    description: "Restaurant footer with location and menu links",
    type: "footer",
    props: {
      variants: ["logo-center"],
      backgroundColor: "#7c2d12",
      logo: {
        src: "https://via.placeholder.com/150x60.png?text=Restaurant",
        alt: "Restaurant logo",
      },
      linksSections: [
        {
          sectionTitle: "Menu",
          links: [
            { title: "Appetizers", url: "/menu/appetizers" },
            { title: "Main Courses", url: "/menu/mains" },
            { title: "Desserts", url: "/menu/desserts" },
            { title: "Beverages", url: "/menu/drinks" },
          ],
        },
        {
          sectionTitle: "Services",
          links: [
            { title: "Reservations", url: "/reservations" },
            { title: "Catering", url: "/catering" },
            { title: "Private Events", url: "/events" },
            { title: "Gift Cards", url: "/gift-cards" },
          ],
        },
        {
          sectionTitle: "Info",
          links: [
            { title: "About Us", url: "/about" },
            { title: "Location", url: "/location" },
            { title: "Hours", url: "/hours" },
            { title: "Contact", url: "/contact" },
          ],
        },
      ],
    },
  },
];
