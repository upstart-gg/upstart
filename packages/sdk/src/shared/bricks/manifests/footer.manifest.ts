import { Type } from "@sinclair/typebox";
import { VscLayoutPanelOff } from "react-icons/vsc";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { array, defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { paddingRef } from "../props/padding";
import { colorPresetRef } from "../props/color-preset";
import { string, urlOrPageIdRef } from "../props/string";
import { fontSize, fontSizeRef } from "../props/text";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "footer",
  name: "Footer",
  category: "layout",
  description: "A footer with links and an optional logo",
  icon: VscLayoutPanelOff,
  staticClasses: "flex-1",
  resizable: false,
  defaultWidth: {
    desktop: "100%",
    mobile: "100%",
  },
  props: defineProps({
    color: Type.Optional(
      colorPresetRef({
        title: "Color preset",
        default: "bg-neutral text-neutral-content",
      }),
    ),
    // backgroundColor:Type.Optional(backgroundColorRef()),
    padding: Type.Optional(paddingRef({ default: "p-10" })),
    logo: Type.Optional(imageRef({ title: "Logo", "ui:no-object-options": true, "ui:no-alt-text": true })),
    fontSize: Type.Optional(fontSizeRef({ default: "text-sm", "ui:no-extra-large-sizes": true })),
    // rows:Type.Optional(number("Rows", { default: 1, "ui:field": "slider", minimum: 1, maximum: 5 })),
    linksSections: array(
      Type.Object({
        sectionTitle: string("Title"),
        links: array(
          Type.Object({
            title: string("Title"),
            url: urlOrPageIdRef(),
          }),
          {
            title: "Links",
          },
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
        title: "Links",
        "ui:displayField": "sectionTitle",
        "ui:options": {
          orderable: true, // Enable drag & drop reordering
          removable: true, // Enable delete button
          addable: true, // Enable add button
        },
        description: "List of Links Sections",
        metadata: {
          category: "content",
        },
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
      // backgroundColor: "#f8f9fa",
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
      // backgroundColor: "#2c3e50",
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
      // backgroundColor: "#ffffff",
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
      // backgroundColor: "#1a1a1a",
      logo: {
        src: "https://via.placeholder.com/180x60.png?text=Enterprise",
        alt: "Enterprise logo",
      },
      linksSections: [
        {
          sectionTitle: "Products & Services",
          links: [
            { title: "Cloud Solutions", url: "/cloud" },
            { title: "Data Analytics", url: "/analytics" },
            { title: "AI & Machine Learning", url: "/ai" },
            { title: "Cybersecurity", url: "/security" },
            { title: "DevOps Tools", url: "/devops" },
            { title: "IoT Platform", url: "/iot" },
          ],
        },
        {
          sectionTitle: "Industries",
          links: [
            { title: "Healthcare", url: "/industries/healthcare" },
            { title: "Finance", url: "/industries/finance" },
            { title: "Retail", url: "/industries/retail" },
            { title: "Manufacturing", url: "/industries/manufacturing" },
            { title: "Education", url: "/industries/education" },
            { title: "Government", url: "/industries/government" },
          ],
        },
        {
          sectionTitle: "Resources",
          links: [
            { title: "Documentation", url: "/docs" },
            { title: "API Reference", url: "/api" },
            { title: "Tutorials", url: "/tutorials" },
            { title: "Webinars", url: "/webinars" },
            { title: "White Papers", url: "/whitepapers" },
            { title: "Case Studies", url: "/case-studies" },
          ],
        },
        {
          sectionTitle: "Support & Community",
          links: [
            { title: "Help Center", url: "/help" },
            { title: "Community Forum", url: "/forum" },
            { title: "Contact Support", url: "/support" },
            { title: "Service Status", url: "/status" },
            { title: "Partner Portal", url: "/partners" },
            { title: "Developer Hub", url: "/developers" },
          ],
        },
      ],
    },
  },
  {
    description: "Startup footer with minimal links and left logo",
    type: "footer",
    props: {
      // backgroundColor: "#f5f5f5",
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
      // backgroundColor: "#6366f1",
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
      logo: {
        src: "https://via.placeholder.com/160x50.png?text=SaaS+Platform",
        alt: "SaaS platform logo",
      },
      linksSections: [
        {
          sectionTitle: "Platform",
          links: [
            { title: "Dashboard", url: "/dashboard" },
            { title: "Analytics", url: "/analytics" },
            { title: "Integrations", url: "/integrations" },
            { title: "API", url: "/api" },
          ],
        },
        {
          sectionTitle: "Solutions",
          links: [
            { title: "For Startups", url: "/solutions/startups" },
            { title: "For Enterprise", url: "/solutions/enterprise" },
            { title: "For Agencies", url: "/solutions/agencies" },
            { title: "For Developers", url: "/solutions/developers" },
          ],
        },
        {
          sectionTitle: "Resources",
          links: [
            { title: "Blog", url: "/blog" },
            { title: "Documentation", url: "/docs" },
            { title: "Help Center", url: "/help" },
            { title: "Community", url: "/community" },
          ],
        },
        {
          sectionTitle: "Company",
          links: [
            { title: "About Us", url: "/about" },
            { title: "Careers", url: "/careers" },
            { title: "Press", url: "/press" },
            { title: "Legal", url: "/legal" },
          ],
        },
      ],
    },
  },
  {
    description: "Non-profit footer with mission-focused links",
    type: "footer",
    props: {
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
