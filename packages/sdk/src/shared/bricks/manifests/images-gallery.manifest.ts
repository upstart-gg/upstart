import { Type } from "@sinclair/typebox";
import { IoGridOutline } from "react-icons/io5";
import { defineBrickManifest } from "~/shared/bricks/types";
import { defineProps } from "../props/helpers";
import { image } from "../props/image";
import { colorPreset } from "../props/color-preset";
import { border, rounding } from "../props/border";
import { loop } from "../props/dynamic";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";
import { grow } from "../props/grow";

export const manifest = defineBrickManifest({
  type: "images-gallery",
  name: "Gallery",
  category: "media",
  description: "Displays an images collection.",
  aiInstructions:
    "This brick should mostly be used for image galleries. Prefer using card bricks for product showcases, articles lists with images, or other collections.",
  consumesMultipleQueryRows: true,
  defaultInspectorTab: "content",
  isContainer: false,
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 300,
  },
  defaultWidth: {
    desktop: "400px",
    mobile: "100%",
  },
  icon: IoGridOutline,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
      }),
    ),
    loop: Type.Optional(loop()),
    images: Type.Array(
      Type.Object({
        image: image({
          "ui:responsive": "desktop",
          "ui:no-alt-text": true,
          "ui:no-object-options": true,
          "ui:placeholder": "https://example.com/image.jpg",
        }),
        legend: Type.Optional(Type.String({ title: "Legend" })),
      }),
      {
        title: "Images",
        default: [],
        maxItems: 12,
        metadata: {
          category: "content",
          consumeQuery: true,
        },
        examples: [
          {
            image: { src: "https://via.placeholder.com/300x200.png?text=Image+1" },
            legend: "Image 1",
          },
          {
            image: { src: "https://via.placeholder.com/300x200.png?text=Image+2" },
            legend: "Image 2",
          },
          {
            image: { src: "https://via.placeholder.com/300x200.png?text=Image+3" },
            legend: "Image 3",
          },
        ],
      },
    ),
    columns: Type.Optional(
      Type.Number({
        title: "Columns",
        description:
          "Number of columns. Only applies to desktop screens. On mobile, it will always display 1 column.",
        minimum: 1,
        maximum: 6,
        default: 3,
        "ui:field": "slider",
        "ui:responsive": "desktop",
      }),
    ),
    gap: Type.Optional(
      cssLength({
        title: "Gap",
        description: "The gap between the images.",
        default: "1rem",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "3rem",
        description: "Padding inside the gallery.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: rounding(),
    border: Type.Optional(border()),

    // Override grow to default to true
    grow: Type.Optional(
      grow({
        default: true,
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Product portfolio gallery (3-column grid)",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "2.5rem",
      padding: "p-4",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+1",
          },
          legend: "Premium wireless headphones",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+2",
          },
          legend: "Bluetooth speaker",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+3",
          },
          legend: "Smart fitness tracker",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+4",
          },
          legend: "Wireless charging pad",
        },
      ],
    },
  },
  {
    description: "Team photos gallery (4-column grid), light neutral background",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "1rem",
      padding: "p-6",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=CEO",
          },
          legend: "Sarah Johnson - Chief Executive Officer",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=CTO",
          },
          legend: "Mike Chen - Chief Technology Officer",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Design",
          },
          legend: "Emily Rodriguez - Head of Design",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Marketing",
          },
          legend: "David Park - Marketing Director",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Sales",
          },
          legend: "Lisa Wong - Sales Manager",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Support",
          },
          legend: "Alex Thompson - Customer Support Lead",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Dev",
          },
          legend: "Carlos Martinez - Senior Developer",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=HR",
          },
          legend: "Jennifer Adams - HR Specialist",
        },
      ],
      colorPreset: {
        color: "neutral-100",
      },
    },
  },
  {
    description: "Project showcase (2-column grid with larger spacing)",
    type: "images-gallery",
    props: {
      columns: 2,
      gap: "1rem",
      padding: "p-6",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Website+Redesign",
          },
          legend: "Modern e-commerce website redesign project",
        },
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Mobile+App",
          },
          legend: "iOS and Android mobile application",
        },
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Brand+Identity",
          },
          legend: "Complete brand identity design package",
        },
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Dashboard+UI",
          },
          legend: "Analytics dashboard user interface",
        },
      ],
    },
  },
  {
    description: "Event photos gallery with tight spacing and minimal padding",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "1rem",
      padding: "p-6",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Opening",
          },
          legend: "Conference opening ceremony",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Keynote",
          },
          legend: "Keynote presentation",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Workshop",
          },
          legend: "Technical workshop session",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Networking",
          },
          legend: "Networking lunch break",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Panel",
          },
          legend: "Expert panel discussion",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Awards",
          },
          legend: "Awards ceremony",
        },
      ],
    },
  },
  {
    description: "Photography portfolio with single column layout and primary background",
    type: "images-gallery",
    props: {
      columns: 1,
      gap: "3rem",
      padding: "4rem",
      colorPreset: {
        color: "primary-50",
      },
      rounding: "rounded-lg",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/800x600.png?text=Landscape+1",
          },
          legend: "Mountain sunrise landscape photography",
        },
        {
          image: {
            src: "https://via.placeholder.com/800x600.png?text=Portrait+1",
          },
          legend: "Professional business portrait session",
        },
        {
          image: {
            src: "https://via.placeholder.com/800x600.png?text=Architecture+1",
          },
          legend: "Modern architectural photography",
        },
      ],
    },
  },
  {
    description: "Real estate property gallery with secondary colors and borders",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "1.5rem",
      padding: "2rem",
      colorPreset: {
        color: "secondary-100",
      },
      border: {
        width: "border",
        color: "border-secondary-300",
      },
      rounding: "rounded-xl",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Living+Room",
          },
          legend: "Spacious living room with natural light",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Kitchen",
          },
          legend: "Modern kitchen with granite countertops",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Master+Bedroom",
          },
          legend: "Master bedroom with walk-in closet",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Bathroom",
          },
          legend: "Luxury bathroom with marble finishes",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Backyard",
          },
          legend: "Private backyard with pool",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x300.png?text=Garage",
          },
          legend: "Two-car garage with storage",
        },
      ],
    },
  },
  {
    description: "Restaurant food gallery with 5-column grid and accent colors",
    type: "images-gallery",
    props: {
      columns: 5,
      gap: "0.75rem",
      padding: "1.5rem",
      colorPreset: {
        color: "accent-200",
      },
      rounding: "rounded-md",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Appetizer",
          },
          legend: "Bruschetta with fresh tomatoes",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Soup",
          },
          legend: "Creamy mushroom bisque",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Salad",
          },
          legend: "Mediterranean quinoa salad",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Main+Course",
          },
          legend: "Grilled salmon with herbs",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Dessert",
          },
          legend: "Chocolate lava cake",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Beverage",
          },
          legend: "Artisan coffee selection",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Pasta",
          },
          legend: "Homemade fettuccine alfredo",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Pizza",
          },
          legend: "Wood-fired margherita pizza",
        },
      ],
    },
  },
  {
    description: "Art gallery exhibition with 6-column grid and minimal styling",
    type: "images-gallery",
    props: {
      columns: 6,
      gap: "0.5rem",
      padding: "1rem",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Abstract+1",
          },
          legend: "Abstract composition #1",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Portrait+Art",
          },
          legend: "Contemporary portrait",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Landscape+Art",
          },
          legend: "Impressionist landscape",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Still+Life",
          },
          legend: "Modern still life",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Sculpture",
          },
          legend: "Bronze sculpture piece",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Digital+Art",
          },
          legend: "Digital artwork collection",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Mixed+Media",
          },
          legend: "Mixed media installation",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Photography",
          },
          legend: "Fine art photography",
        },
        {
          image: {
            src: "https://via.placeholder.com/200x250.png?text=Watercolor",
          },
          legend: "Watercolor painting",
        },
      ],
    },
  },
  {
    description: "Fashion lookbook with 2-column layout and neutral dark theme",
    type: "images-gallery",
    props: {
      columns: 2,
      gap: "2rem",
      padding: "3rem",
      colorPreset: {
        color: "neutral-800",
      },
      border: {
        width: "border-2",
        color: "border-neutral-600",
      },
      rounding: "rounded-2xl",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Spring+Look",
          },
          legend: "Spring casual collection 2024",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Summer+Look",
          },
          legend: "Summer evening wear",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Business+Look",
          },
          legend: "Professional business attire",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Weekend+Look",
          },
          legend: "Weekend comfort style",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Formal+Look",
          },
          legend: "Formal evening collection",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x600.png?text=Street+Style",
          },
          legend: "Urban street fashion",
        },
      ],
    },
  },
  {
    description: "Travel destinations gallery with 3-column grid and no legends",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "1.25rem",
      padding: "2.5rem",
      colorPreset: {
        color: "primary-100",
      },
      rounding: "rounded-lg",
      border: {
        width: "border",
        color: "border-primary-200",
      },
      images: [
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=Paris",
          },
        },
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=Tokyo",
          },
        },
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=New+York",
          },
        },
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=London",
          },
        },
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=Rome",
          },
        },
        {
          image: {
            src: "https://via.placeholder.com/350x250.png?text=Barcelona",
          },
        },
      ],
    },
  },
  {
    description: "Technical equipment gallery with 4-column grid and accent styling",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "1rem",
      padding: "2rem",
      colorPreset: {
        color: "accent-100",
      },
      border: {
        width: "border-4",
        color: "border-accent-400",
      },
      rounding: "rounded-xl",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Camera",
          },
          legend: "Professional DSLR camera",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Laptop",
          },
          legend: "High-performance laptop",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Microphone",
          },
          legend: "Studio recording microphone",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Monitor",
          },
          legend: "4K professional monitor",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Tablet",
          },
          legend: "Digital drawing tablet",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Speakers",
          },
          legend: "Studio monitor speakers",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Keyboard",
          },
          legend: "Mechanical keyboard",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Mouse",
          },
          legend: "Precision gaming mouse",
        },
      ],
    },
  },
  {
    description: "Minimal product showcase with large gaps and no padding",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "4rem",
      padding: "0rem",
      images: [
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Watch",
          },
          legend: "Luxury Swiss timepiece",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Jewelry",
          },
          legend: "Handcrafted gold necklace",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Sunglasses",
          },
          legend: "Designer sunglasses collection",
        },
      ],
    },
  },
  {
    description: "Dynamic product gallery using products query with loop",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "1.5rem",
      padding: "2rem",
      colorPreset: {
        color: "primary-50",
      },
      rounding: "rounded-lg",
      border: {
        width: "border",
        color: "border-primary-200",
      },
      images: [
        {
          image: {
            src: "{{products.image}}",
          },
          legend: "{{products.name}} - ${{products.price}}",
        },
      ],
      loop: {
        over: "products",
      },
    },
  },
  {
    description: "Portfolio showcase using portfolioProjects query with loop",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "2rem",
      padding: "3rem",
      colorPreset: {
        color: "secondary-100",
      },
      rounding: "rounded-xl",
      images: [
        {
          image: {
            src: "{{portfolioProjects.thumbnail}}",
          },
          legend:
            "{{portfolioProjects.projectName}} - {{portfolioProjects.clientName}} ({{portfolioProjects.year}})",
        },
      ],
      loop: {
        over: "portfolioProjects",
      },
    },
  },
  {
    description: "Event photo gallery using eventPhotos query with loop",
    type: "images-gallery",
    props: {
      columns: 5,
      gap: "1rem",
      padding: "1.5rem",
      colorPreset: {
        color: "accent-50",
      },
      border: {
        width: "border-2",
        color: "border-accent-300",
      },
      rounding: "rounded-md",
      images: [
        {
          image: {
            src: "{{eventPhotos.imageUrl}}",
          },
          legend: "{{eventPhotos.caption}} - {{eventPhotos.eventDate}}",
        },
      ],
      loop: {
        over: "eventPhotos",
      },
    },
  },
  {
    description: "Team member gallery using teamMembers query with loop",
    type: "images-gallery",
    props: {
      columns: 6,
      gap: "0.75rem",
      padding: "2.5rem",
      colorPreset: {
        color: "neutral-100",
      },
      rounding: "rounded-lg",
      border: {
        width: "border",
        color: "border-neutral-300",
      },
      images: [
        {
          image: {
            src: "{{teamMembers.profilePhoto}}",
          },
          legend: "{{teamMembers.fullName}} - {{teamMembers.position}}",
        },
      ],
      loop: {
        over: "teamMembers",
      },
    },
  },
];
