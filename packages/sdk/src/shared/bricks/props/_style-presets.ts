import { Type, type Static } from "@sinclair/typebox";
import type { BorderSettings } from "./border";
import type { ColorSettings } from "./color";
import type { BackgroundSettings } from "./background";
import type { ShadowSettings } from "./effects";

export type StyleProperties = {
  color?: ColorSettings;
  background: BackgroundSettings;
  border?: Partial<BorderSettings>;
  shadow?: ShadowSettings;
};

export const stylePreset = Type.Optional(
  Type.Object(
    {
      style: Type.Union([
        Type.Literal("ghost", {
          title: "Ghost",
          description: "Minimal style with transparent background and no border",
        }),
        Type.Literal("plain", {
          title: "Plain",
          description: "Simple style with solid dark background and basic border",
        }),
        Type.Literal("plain2", {
          title: "Plain 2",
          description: "Simple style with solid dark background and basic border",
        }),
        Type.Literal("plain3", {
          title: "Plain 3",
          description: "Simple style with solid dark background and basic border",
        }),
        Type.Literal("modern", {
          title: "Modern",
          description: "Bold borders with generous spacing and sharp corners",
        }),
        Type.Literal("modern2", {
          title: "Modern 2",
          description: "Bold borders with generous spacing and sharp corners",
        }),
        Type.Literal("soft", {
          title: "Soft",
          description: "Gentle curves and muted colors for a comfortable feel",
        }),
        Type.Literal("glass", {
          title: "Glass",
          description: "Translucent backdrop with blur effect for depth",
        }),
        Type.Literal("elevated", {
          title: "Elevated",
          description: "Floating appearance with shadow depth and no borders",
        }),
        Type.Literal("outlined", {
          title: "Outlined",
          description: "Simple outline with hover effect and no background",
        }),
        Type.Literal("paper", {
          title: "Paper",
          description: "Subtle texture and slight rotation for a paper-like appearance",
        }),
        Type.Literal("gradient", {
          title: "Gradient",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("gradient2", {
          title: "Gradient 2",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("gradient3", {
          title: "Gradient 3",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("gradient4", {
          title: "Gradient 4",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("gradient5", {
          title: "Gradient 5",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("gradient6", {
          title: "Gradient 6",
          description: "Smooth color gradients background with soft edges",
        }),
        Type.Literal("callout", {
          title: "Callout",
          description: "Prominent style for important information or CTAs",
        }),
      ]),
      variant: Type.Union([
        Type.Literal("primary", {
          title: "Primary",
          description: "Uses the theme primary color as the main color",
        }),
        Type.Literal("secondary", {
          title: "Secondary",
          description: "Uses the theme secondary color as the main color",
        }),
        Type.Literal("neutral", {
          title: "Neutral",
          description: "Uses the theme neutral color as the main color",
        }),
      ]),
    },
    {
      "ui:field": "hidden",
    },
  ),
);

export type StylePreset = Static<typeof stylePreset>;

export function getPresetStyles({ style, variant }: StylePreset): StyleProperties {
  // Variant-specific color mappings
  const variantColors = {
    primary: {
      bg: "bg-primary-50",
      border: "border-primary-200",
      text: "text-primary-900",
      shadow: "shadow-primary-200/50",
    },
    secondary: {
      bg: "bg-secondary-50",
      border: "border-secondary-200",
      text: "text-secondary-900",
      shadow: "shadow-secondary-200/50",
    },
    accent: {
      bg: "bg-accent-50",
      border: "border-accent-200",
      hover: "hover:border-accent-300",
      text: "text-accent-900",
      shadow: "shadow-accent-200/50",
    },
    neutral: {
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      hover: "hover:border-neutral-300",
      text: "text-neutral-900",
      shadow: "shadow-neutral-200/50",
    },
  };

  function getOtherVariantColor(variant: StylePreset["variant"], alt = false) {
    switch (variant) {
      case "primary":
        return alt ? "accent" : "secondary";
      case "secondary":
        return alt ? "primary" : "accent";
      case "neutral":
        return alt ? "primary" : "accent";
    }
  }

  const styleProperties: Record<StylePreset["style"], StyleProperties> = {
    ghost: {
      background: {
        color: "transparent",
      },
      border: {
        width: "border-0",
      },
      color: `text-${variant}-900`,
    },
    plain: {
      background: {
        color: `bg-${variant}-600`,
      },
      border: {
        color: `border-${variant}-900`,
        style: "border-solid",
        width: "border",
      },
      shadow: "shadow-sm",
      color: variant === "neutral" ? "text-neutral-800" : `text-${variant}-50`,
    },
    plain2: {
      background: {
        color: `bg-${variant}-400`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
      },
      shadow: "shadow-sm",
      color: variant === "neutral" ? "text-neutral-800" : `text-${variant}-900`,
    },
    plain3: {
      background: {
        color: `bg-${variant}-200`,
      },
      border: {
        color: `border-${variant}-500`,
        style: "border-solid",
        width: "border",
      },
      shadow: "shadow-sm",
      color: variant === "neutral" ? "text-neutral-800" : `text-${variant}-900`,
    },
    callout: {
      background: {
        color: `bg-${variant}-100`,
      },
      border: {
        color: `border-${variant}-400`,
        style: "border-solid",
        width: "border",
      },
      color: `text-${variant}-900`,
    },
    elevated: {
      background: {
        color: `bg-${variant}-100`,
      },
      shadow: "shadow-lg",
      color: `text-${variant}-900`,
    },
    glass: {
      background: {
        color: `bg-${variant}-50`,
      },
      border: {
        color: variantColors[variant].border,
        style: "border-solid",
        width: "border",
      },
      shadow: "shadow-sm",
      color: `text-${variant}-900`,
    },
    modern: {
      background: {
        color: `bg-${variant}-100`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
      },
      color: `text-${variant}-900`,
    },
    modern2: {
      background: {
        color: `bg-${variant}-300`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
      },
      color: `text-${variant}-900`,
    },
    soft: {
      background: {
        color: `bg-${variant}-50`,
      },
      border: {
        color: `border-${variant}-300`,
        style: "border-solid",
        width: "border",
      },
      color: `text-${variant}-800`,
    },
    gradient: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 to-${variant}-50`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    gradient2: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 ${variant === "neutral" ? "to-neutral-100" : `to-${getOtherVariantColor(variant)}-200`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    gradient3: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 ${variant === "neutral" ? "to-neutral-100" : `to-${getOtherVariantColor(variant, true)}-200`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    gradient4: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-400 to-${variant}-100`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    gradient5: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-400 ${variant === "neutral" ? "to-neutral-200" : `to-${getOtherVariantColor(variant)}-400`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    gradient6: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-400 ${variant === "neutral" ? "to-neutral-200" : `to-${getOtherVariantColor(variant, true)}-400`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
      },
      color: "text-neutral-900",
    },
    paper: {
      background: {
        color: `bg-${variant}-50`,
      },
      color: `text-${variant}-800`,
      shadow: "shadow-md",
    },
    outlined: {
      background: {
        color: "bg-transparent",
      },
      border: {
        color: `border-${variant}-600`,
        style: "border-solid",
        width: "border-2",
      },
      color: `text-${variant}-800`,
    },
  };

  return styleProperties[style];
}
