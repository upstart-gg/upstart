import { Type } from "@sinclair/typebox";
import { TbCarouselHorizontal } from "react-icons/tb";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { image } from "../props/image";
import { rounding } from "../props/border";
import { colorPreset } from "../props/color-preset";
import { loop } from "../props/dynamic";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "carousel",
  name: "Carousel",
  description: "An image carousel with navigation arrows and dots or numbers indicator",
  aiInstructions: `Use the carousel component for showcasing sequential visual content with smooth navigation between images.

WHEN TO USE:
- Product galleries with multiple angles or variations
- Portfolio showcases with project images
- Step-by-step tutorials or processes (recipes, instructions)
- Before/after comparisons or transformations
- Team member profiles with photos
- Event photo galleries or highlights
- Feature demonstrations or software screenshots
- Travel destinations or location showcases

CONTENT GUIDELINES:
- Optimal range: 2-8 images for best user engagement (max 12 supported)
- Single image allowed only as placeholder for future expansion
- Each image needs: { src: { src, alt }, legend }
- Alt text MUST be descriptive and never empty
- Legend text should be concise (≤90 characters) and informative
- Use empty string ("") for legend only when no caption is intentionally desired

IMAGE CONSISTENCY:
- Keep aspect ratios similar across slides to prevent layout jumps
- Avoid mixing very tall portrait with very wide landscape images
- Use consistent image quality and style throughout carousel
- Consider loading performance with image optimization

STYLING OPTIONS:
- padding: "0" for edge-to-edge, "1rem" for standard, "2rem+" for generous spacing
- borderRadius: "rounded-none" for sharp/modern, "rounded-md" for standard, "rounded-xl" for friendly, "rounded-full" for circular (avatars)
- colorPreset: Use sparingly - "neutral-50"/"primary-50" for subtle framing, gradients for premium feel

DYNAMIC CONTENT:
- Use loop property with single template object for data-driven carousels
- Template variables in src and legend: "{{product.image}}", "{{team.name}} - {{team.role}}"
- Perfect for: product catalogs, team directories, portfolio projects, event galleries

AVOID:
- Including unrelated properties (buttons, titles outside legend)
- Heavy background colors that distract from images
- Inconsistent aspect ratios that cause jarring transitions
- More than 12 images (reduces focus and performance)
- Empty or placeholder alt text (accessibility requirement)`,
  category: "media",
  defaultInspectorTab: "content",
  consumesMultipleQueryRows: true,
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 300,
  },
  icon: TbCarouselHorizontal,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "1rem",
        description: "Padding inside the carousel.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    images: Type.Optional(
      Type.Array(
        Type.Object({
          src: image({
            "ui:responsive": "desktop",
            "ui:no-alt-text": true,
            "ui:no-object-options": true,
          }),
          legend: Type.String({ title: "Legend" }),
        }),
        {
          title: "Images",
          default: [],
          maxItems: 12,
          metadata: {
            category: "content",
          },
        },
      ),
    ),
    borderRadius: Type.Optional(
      rounding({
        default: "rounded-md",
      }),
    ),
    loop: Type.Optional(loop()),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  // BASIC CAROUSEL EXAMPLES
  {
    description: "Basic image carousel with legends - Simple content showcase",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+1",
            alt: "First slide",
          },
          legend: "Beautiful landscape",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+2",
            alt: "Second slide",
          },
          legend: "Amazing architecture",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+3",
            alt: "Third slide",
          },
          legend: "Stunning nature",
        },
      ],
    },
  },

  // PRODUCT & COMMERCIAL
  {
    description: "Product showcase carousel with rounded corners and padding - E-commerce gallery style",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Product+1",
            alt: "Product 1",
          },
          legend: "Premium Headphones - $199",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Product+2",
            alt: "Product 2",
          },
          legend: "Wireless Speaker - $149",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Product+3",
            alt: "Product 3",
          },
          legend: "Smart Watch - $299",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Product+4",
            alt: "Product 4",
          },
          legend: "Laptop Stand - $79",
        },
      ],
      borderRadius: "rounded-xl",
      padding: "2rem",
      colorPreset: { color: "neutral-50" },
    },
  },

  // PORTFOLIO & CREATIVE
  {
    description: "Portfolio carousel with minimal styling - Clean professional presentation",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/900x600.png?text=Portfolio+1",
            alt: "Portfolio piece 1",
          },
          legend: "Web Design Project",
        },
        {
          src: {
            src: "https://via.placeholder.com/900x600.png?text=Portfolio+2",
            alt: "Portfolio piece 2",
          },
          legend: "Brand Identity Design",
        },
        {
          src: {
            src: "https://via.placeholder.com/900x600.png?text=Portfolio+3",
            alt: "Portfolio piece 3",
          },
          legend: "Mobile App Interface",
        },
      ],
      borderRadius: "rounded-none",
      padding: "0",
    },
  },

  // EVENTS & EXPERIENCES
  {
    description: "Event photos carousel with primary color theme - Conference or gathering highlights",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/800x500.png?text=Event+Photo+1",
            alt: "Event photo 1",
          },
          legend: "Opening Ceremony",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x500.png?text=Event+Photo+2",
            alt: "Event photo 2",
          },
          legend: "Keynote Speaker",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x500.png?text=Event+Photo+3",
            alt: "Event photo 3",
          },
          legend: "Networking Session",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x500.png?text=Event+Photo+4",
            alt: "Event photo 4",
          },
          legend: "Award Ceremony",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x500.png?text=Event+Photo+5",
            alt: "Event photo 5",
          },
          legend: "Closing Remarks",
        },
      ],
      colorPreset: { color: "primary-100" },
      borderRadius: "rounded-lg",
      padding: "1.5rem",
    },
  },
  {
    description: "Travel destinations carousel without legends",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/700x450.png?text=Paris",
            alt: "Paris cityscape",
          },
          legend: "",
        },
        {
          src: {
            src: "https://via.placeholder.com/700x450.png?text=Tokyo",
            alt: "Tokyo skyline",
          },
          legend: "",
        },
        {
          src: {
            src: "https://via.placeholder.com/700x450.png?text=New+York",
            alt: "New York streets",
          },
          legend: "",
        },
        {
          src: {
            src: "https://via.placeholder.com/700x450.png?text=London",
            alt: "London landmarks",
          },
          legend: "",
        },
      ],
      borderRadius: "rounded-2xl",
      padding: "1rem",
    },
  },

  // TEAM & PEOPLE
  {
    description: "Team members carousel with circular images - Professional team showcase",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Team+1",
            alt: "Team member 1",
          },
          legend: "John Smith - CEO",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Team+2",
            alt: "Team member 2",
          },
          legend: "Sarah Johnson - CTO",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Team+3",
            alt: "Team member 3",
          },
          legend: "Mike Davis - Design Lead",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Team+4",
            alt: "Team member 4",
          },
          legend: "Emily Chen - Marketing Director",
        },
      ],
      colorPreset: { color: "primary-50" },
      borderRadius: "rounded-full",
      padding: "2rem",
    },
  },

  // TUTORIALS & PROCESSES
  {
    description: "Recipe steps carousel with detailed descriptions - Step-by-step instructional content",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Step+1",
            alt: "Recipe step 1",
          },
          legend: "Step 1: Prepare all ingredients",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Step+2",
            alt: "Recipe step 2",
          },
          legend: "Step 2: Heat oil in a large pan",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Step+3",
            alt: "Recipe step 3",
          },
          legend: "Step 3: Add vegetables and sauté",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Step+4",
            alt: "Recipe step 4",
          },
          legend: "Step 4: Season and serve hot",
        },
      ],
      colorPreset: { color: "accent-50" },
      borderRadius: "rounded-md",
      padding: "1.5rem",
    },
  },
  {
    description: "Before and after comparison carousel",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Before+1",
            alt: "Before renovation 1",
          },
          legend: "Kitchen - Before Renovation",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=After+1",
            alt: "After renovation 1",
          },
          legend: "Kitchen - After Renovation",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Before+2",
            alt: "Before renovation 2",
          },
          legend: "Living Room - Before",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=After+2",
            alt: "After renovation 2",
          },
          legend: "Living Room - After",
        },
      ],
      colorPreset: { color: "accent-100" },
      borderRadius: "rounded-lg",
      padding: "1rem",
    },
  },
  {
    description: "Art gallery carousel with dramatic styling",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/600x800.png?text=Artwork+1",
            alt: "Abstract painting 1",
          },
          legend: "Abstract Composition #1 - 2023",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x800.png?text=Artwork+2",
            alt: "Abstract painting 2",
          },
          legend: "Urban Landscape - 2023",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x800.png?text=Artwork+3",
            alt: "Abstract painting 3",
          },
          legend: "Color Study #7 - 2024",
        },
      ],
      colorPreset: { color: "neutral-900" },
      borderRadius: "rounded-sm",
      padding: "3rem",
    },
  },
  {
    description: "Fashion lookbook carousel with purple theme",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+1",
            alt: "Fashion look 1",
          },
          legend: "Spring Collection - Casual Chic",
        },
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+2",
            alt: "Fashion look 2",
          },
          legend: "Summer Vibes - Beach Ready",
        },
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+3",
            alt: "Fashion look 3",
          },
          legend: "Autumn Elegance - Business",
        },
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+4",
            alt: "Fashion look 4",
          },
          legend: "Winter Style - Cozy Comfort",
        },
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+5",
            alt: "Fashion look 5",
          },
          legend: "Evening Wear - Formal Event",
        },
        {
          src: {
            src: "https://via.placeholder.com/500x700.png?text=Look+6",
            alt: "Fashion look 6",
          },
          legend: "Weekend Casual - Relaxed Fit",
        },
      ],
      colorPreset: { color: "secondary-100" },
      borderRadius: "rounded-xl",
      padding: "2rem",
    },
  },
  {
    description: "Car showcase carousel with compact design",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/800x450.png?text=Car+1",
            alt: "Sports car 1",
          },
          legend: "2024 Sports Coupe",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x450.png?text=Car+2",
            alt: "SUV model",
          },
          legend: "Family SUV",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x450.png?text=Car+3",
            alt: "Electric vehicle",
          },
          legend: "Electric Sedan",
        },
      ],
      colorPreset: { color: "accent-50" },
      borderRadius: "rounded-lg",
      padding: "0.5rem",
    },
  },
  {
    description: "Software features carousel with large padding",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/900x500.png?text=Feature+1",
            alt: "Software feature 1",
          },
          legend: "Dashboard Analytics - Real-time insights",
        },
        {
          src: {
            src: "https://via.placeholder.com/900x500.png?text=Feature+2",
            alt: "Software feature 2",
          },
          legend: "Team Collaboration - Work together seamlessly",
        },
        {
          src: {
            src: "https://via.placeholder.com/900x500.png?text=Feature+3",
            alt: "Software feature 3",
          },
          legend: "Mobile App - Access anywhere, anytime",
        },
        {
          src: {
            src: "https://via.placeholder.com/900x500.png?text=Feature+4",
            alt: "Software feature 4",
          },
          legend: "Security - Enterprise-grade protection",
        },
      ],
      colorPreset: { color: "primary-50" },
      borderRadius: "rounded-2xl",
      padding: "4rem",
    },
  },
  {
    description: "Dynamic product gallery using products query - Data-driven product showcase",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{products.image}}",
            alt: "{{products.name}}",
          },
          legend: "{{products.name}} - ${{products.price}}",
        },
      ],
      colorPreset: { color: "primary-50" },
      borderRadius: "rounded-lg",
      padding: "1.5rem",
      loop: {
        over: "products",
      },
    },
  },

  // DYNAMIC CONTENT EXAMPLES
  {
    description: "Loop template for portfolioProjects query (one object will repeat per row)",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{portfolioProjects.featuredImage}}",
            alt: "{{portfolioProjects.projectName}} featured image",
          },
          legend:
            "{{portfolioProjects.projectName}} – {{portfolioProjects.clientName}} ({{portfolioProjects.year}})",
        },
      ],
      colorPreset: { color: "neutral-50" },
      borderRadius: "rounded-md",
      padding: "1rem",
      loop: {
        over: "portfolioProjects",
      },
    },
  },

  // SPECIAL STYLING VARIATIONS
  {
    description: "Showcase carousel with subtle gradient background frame",
    type: "carousel",
    props: {
      images: [
        {
          src: { src: "https://via.placeholder.com/900x500.png?text=Showcase+1", alt: "Showcase slide 1" },
          legend: "Launch Dashboard",
        },
        {
          src: { src: "https://via.placeholder.com/900x500.png?text=Showcase+2", alt: "Showcase slide 2" },
          legend: "Collaboration Tools",
        },
        {
          src: { src: "https://via.placeholder.com/900x500.png?text=Showcase+3", alt: "Showcase slide 3" },
          legend: "Usage Analytics",
        },
      ],
      colorPreset: { color: "primary-gradient-300", gradientDirection: "bg-gradient-to-br" },
      borderRadius: "rounded-xl",
      padding: "2rem",
    },
  },
  // MINIMAL EDGE (no padding, square corners)
  {
    description: "Minimal edge-to-edge carousel (no padding, no rounding)",
    type: "carousel",
    props: {
      images: [
        {
          src: { src: "https://via.placeholder.com/800x400.png?text=Edge+1", alt: "Edge slide 1" },
          legend: "",
        },
        {
          src: { src: "https://via.placeholder.com/800x400.png?text=Edge+2", alt: "Edge slide 2" },
          legend: "",
        },
      ],
      borderRadius: "rounded-none",
      padding: "0",
    },
  },
  // SINGLE IMAGE (acts as prepared placeholder carousel)
  {
    description: "Single-image carousel (placeholder for future expansion)",
    type: "carousel",
    props: {
      images: [
        {
          src: { src: "https://via.placeholder.com/1000x420.png?text=Banner", alt: "Promotional banner" },
          legend: "Early Access Program",
        },
      ],
      colorPreset: { color: "secondary-50" },
      borderRadius: "rounded-lg",
      padding: "1.25rem",
    },
  },
  {
    description: "Team member carousel using teamMembers query with roles and departments",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{teamMembers.photo}}",
            alt: "{{teamMembers.fullName}}",
          },
          legend: "{{teamMembers.fullName}} - {{teamMembers.position}}, {{teamMembers.department}}",
        },
      ],
      colorPreset: { color: "secondary-100" },
      borderRadius: "rounded-xl",
      padding: "2rem",
      loop: {
        over: "teamMembers",
      },
    },
  },
  {
    description: "Portfolio showcase using portfolioProjects query with client information",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{portfolioProjects.featuredImage}}",
            alt: "{{portfolioProjects.projectName}}",
          },
          legend:
            "{{portfolioProjects.projectName}} - {{portfolioProjects.clientName}} ({{portfolioProjects.year}})",
        },
      ],
      colorPreset: { color: "neutral-100" },
      borderRadius: "rounded-md",
      padding: "1rem",
      loop: {
        over: "portfolioProjects",
      },
    },
  },
  {
    description: "Event photo gallery using eventPhotos query with captions and dates",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{eventPhotos.imageUrl}}",
            alt: "{{eventPhotos.caption}}",
          },
          legend: "{{eventPhotos.caption}} - {{eventPhotos.eventDate}}",
        },
      ],
      colorPreset: { color: "accent-50" },
      borderRadius: "rounded-lg",
      padding: "2rem",
      loop: {
        over: "eventPhotos",
      },
    },
  },
  {
    description: "Property listings carousel using realEstateProperties query with pricing",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{realEstateProperties.mainPhoto}}",
            alt: "{{realEstateProperties.address}}",
          },
          legend:
            "{{realEstateProperties.address}} - ${{realEstateProperties.price}} • {{realEstateProperties.bedrooms}}BR/{{realEstateProperties.bathrooms}}BA",
        },
      ],
      colorPreset: { color: "primary-100" },
      borderRadius: "rounded-xl",
      padding: "1.5rem",
      loop: {
        over: "realEstateProperties",
      },
    },
  },
  {
    description: "Restaurant menu carousel using menuItems query with categories and prices",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{menuItems.photo}}",
            alt: "{{menuItems.dishName}}",
          },
          legend: "{{menuItems.dishName}} - {{menuItems.category}} • ${{menuItems.price}}",
        },
      ],
      colorPreset: { color: "neutral-50" },
      borderRadius: "rounded-lg",
      padding: "1rem",
      loop: {
        over: "menuItems",
      },
    },
  },
  {
    description: "Travel destinations carousel using destinations query with country information",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{destinations.heroImage}}",
            alt: "{{destinations.cityName}}",
          },
          legend: "{{destinations.cityName}}, {{destinations.country}} - {{destinations.bestTimeToVisit}}",
        },
      ],
      colorPreset: { color: "secondary-50" },
      borderRadius: "rounded-2xl",
      padding: "2.5rem",
      loop: {
        over: "destinations",
      },
    },
  },
  {
    description: "Art collection carousel using artworks query with artist and year information",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "{{artworks.imageUrl}}",
            alt: "{{artworks.title}}",
          },
          legend: "{{artworks.title}} by {{artworks.artist}} ({{artworks.year}}) - {{artworks.medium}}",
        },
      ],
      colorPreset: { color: "accent-100" },
      borderRadius: "rounded-sm",
      padding: "3rem",
      loop: {
        over: "artworks",
      },
    },
  },
];
