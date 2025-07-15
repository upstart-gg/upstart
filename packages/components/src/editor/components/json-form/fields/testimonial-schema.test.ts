import { Type } from "@sinclair/typebox";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import { describe, expect, it } from "vitest";

// Simuler le schéma testimonial
function string(title: string, options: any = {}) {
  return Type.String({ title, ...options });
}

function imageRef(options: any = {}) {
  return Type.Object(
    {
      src: Type.String(),
      alt: Type.Optional(Type.String()),
      fit: Type.Optional(Type.String()),
      position: Type.Optional(Type.String()),
    },
    {
      title: options.title || "Image",
      default: {
        alt: "Image",
        fit: "object-cover",
        position: "object-center",
      },
    },
  );
}

const testimonialSchema = Type.Object({
  author: string("Author", { default: "John Doe" }),
  company: Type.Optional(string("Company")),
  text: string("Text", { default: "Amazing product!" }),
  avatar: Type.Optional(imageRef({ title: "Avatar" })),
  socialIcon: Type.Optional(string("Social Icon")),
});

describe("ArrayField default item creation logic", () => {
  it("should only include required fields and fields with explicit defaults", () => {
    const resolvedSchema = resolveSchema(testimonialSchema);

    // Simuler la logique de notre ArrayField
    const defaultItem: Record<string, unknown> = {};
    const requiredFields = new Set(resolvedSchema.required || []);

    if (resolvedSchema.properties) {
      Object.entries(resolvedSchema.properties).forEach(([key, prop]) => {
        const propSchema = resolveSchema(prop as any);

        // Only include fields that are either:
        // 1. Required, OR
        // 2. Have an explicit default value defined at the field level
        if (requiredFields.has(key) || propSchema.default !== undefined) {
          defaultItem[key] = propSchema.default;
        }
      });
    }

    // Vérifications
    expect(defaultItem).toHaveProperty("author", "John Doe"); // Required avec default
    expect(defaultItem).toHaveProperty("text", "Amazing product!"); // Required avec default
    expect(defaultItem).not.toHaveProperty("company"); // Optional sans default
    expect(defaultItem).not.toHaveProperty("avatar"); // Optional avec default dans le type référencé
    expect(defaultItem).not.toHaveProperty("socialIcon"); // Optional sans default
  });

  it("should handle required fields from schema.required array", () => {
    const resolvedSchema = resolveSchema(testimonialSchema);

    // Vérifier que author et text sont bien dans les champs requis
    expect(resolvedSchema.required).toContain("author");
    expect(resolvedSchema.required).toContain("text");
    expect(resolvedSchema.required).not.toContain("company");
    expect(resolvedSchema.required).not.toContain("avatar");
    expect(resolvedSchema.required).not.toContain("socialIcon");
  });
});
