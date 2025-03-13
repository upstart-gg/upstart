import { describe, it, expect } from "vitest";
import { image } from "../image";

describe("Image prop test suite", () => {
  describe("image", () => {
    it("should have the correct title", () => {
      const imageProp = image();
      expect(imageProp.title).toBe("Image");
    });

    it("should have a custom title when provided", () => {
      const imageProp = image("Custom Image");
      expect(imageProp.title).toBe("Custom Image");
    });

    it("should be optional by default", () => {
      const imageProp = image();
      expect(imageProp.required).toBeUndefined();
    });

    it("should be required when specified", () => {
      const imageProp = image("Image", { required: true });
      expect(imageProp.required).toBe(true);
    });

    it("should have the correct UI field type", () => {
      const imageProp = image();
      expect(imageProp["ui:field"]).toBe("image");
    });

    it("should accept image files", () => {
      const imageProp = image();
      expect(imageProp["ui:accept"]).toBe("image/*");
    });

    it("should not show image search by default", () => {
      const imageProp = image();
      expect(imageProp["ui:show-img-search"]).toBe(false);
    });

    it("should show image search when specified", () => {
      const imageProp = image("Image", { showImgSearch: true });
      expect(imageProp["ui:show-img-search"]).toBe(true);
    });

    describe("src property", () => {
      it("should have correct src title", () => {
        const imageProp = image("Custom Image");
        expect(imageProp.properties?.src.title).toBe("Custom Image");
      });

      it("should have default image URL when specified", () => {
        const defaultUrl = "https://example.com/image.jpg";
        const imageProp = image("Image", { defaultImageUrl: defaultUrl });
        expect(imageProp.properties?.src.default).toBe(defaultUrl);
      });
    });

    describe("alt property", () => {
      it("should have the correct title", () => {
        const imageProp = image();
        expect(imageProp.properties?.alt.title).toBe("Alternate Text");
      });

      it("should have a description", () => {
        const imageProp = image();
        expect(imageProp.properties?.alt.description).toContain("screen readers and SEO");
      });

      it("should have a placeholder", () => {
        const imageProp = image();
        expect(imageProp.properties?.alt["ui:placeholder"]).toBe("Your image description");
      });

      it("should be optional", () => {
        const imageProp = image();
        expect(imageProp.properties?.alt.required).toBeUndefined();
      });
    });
  });
});
