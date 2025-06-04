import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { FaWpforms } from "react-icons/fa6";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
  name: "Form",
  description: "A form element",
  aiInstructions: `The form brick takes a JSON schema as input and generates a form based on it.
The schema should define the fields using string, number, and boolean types.
The available string formats are:
- date-time
- time
- date
- email
- uri
- uuid
- regex
- password
- multiline (for textarea)
The form will be rendered with the specified fields and will handle user input accordingly.`,
  isContainer: true,
  icon: FaWpforms,
  props: defineProps({
    // preset: preset(),
    title: optional(string("Title", "My form", { description: " The title of the form" })),
    intro: optional(string("Intro", undefined, { description: " The intro text of the form" })),
    fields: prop({
      title: "Fields",
      description: "The JSON schema of the form fields",
      schema: Type.Object({}, { additionalProperties: true }),
    }),
    align: optional(
      prop({
        title: "Alignment",
        description:
          "The alignment of the form fields. Default is vertical. Only use horizotal for very short forms.",
        schema: Type.Union(
          [
            Type.Literal("vertical", { title: "Vertical" }),
            Type.Literal("horizontal", { title: "Horizontal" }),
          ],
          { default: "vertical" },
        ),
      }),
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
    description: "Basic contact form",
    type: "form",
    props: {
      title: "Contact Us",
      intro: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Full Name",
            description: "Enter your full name",
          },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
            description: "We'll never share your email",
          },
          subject: {
            type: "string",
            title: "Subject",
            description: "Brief description of your inquiry",
          },
          message: {
            type: "string",
            format: "multiline",
            title: "Message",
            description: "Tell us how we can help you",
          },
        },
        required: ["name", "email", "message"],
      },
    },
  },
  {
    description: "User registration form",
    type: "form",
    props: {
      title: "Create Account",
      intro: "Join our platform and start your journey today.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          username: {
            type: "string",
            title: "Username",
            description: "Choose a unique username",
            minLength: 3,
            maxLength: 20,
          },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
          },
          password: {
            type: "string",
            format: "password",
            title: "Password",
            description: "Must be at least 8 characters",
            minLength: 8,
          },
          confirmPassword: {
            type: "string",
            format: "password",
            title: "Confirm Password",
          },
          firstName: {
            type: "string",
            title: "First Name",
          },
          lastName: {
            type: "string",
            title: "Last Name",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            title: "Date of Birth",
          },
          agreeToTerms: {
            type: "boolean",
            title: "I agree to the Terms of Service and Privacy Policy",
          },
        },
        required: [
          "username",
          "email",
          "password",
          "confirmPassword",
          "firstName",
          "lastName",
          "agreeToTerms",
        ],
      },
    },
  },
  {
    description: "Newsletter subscription form (horizontal)",
    type: "form",
    props: {
      title: "Stay Updated",
      intro: "Subscribe to our newsletter for the latest updates and exclusive content.",
      align: "horizontal",
      fields: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
            description: "Enter your email",
          },
          subscribe: {
            type: "boolean",
            title: "I want to receive marketing emails",
          },
        },
        required: ["email"],
      },
    },
  },
  {
    description: "Event registration form",
    type: "form",
    props: {
      title: "Conference Registration",
      intro: "Register for the Annual Tech Conference 2025. Early bird pricing ends soon!",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          attendeeName: {
            type: "string",
            title: "Attendee Name",
            description: "Full name as it should appear on badge",
          },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
          },
          company: {
            type: "string",
            title: "Company/Organization",
          },
          jobTitle: {
            type: "string",
            title: "Job Title",
          },
          phone: {
            type: "string",
            title: "Phone Number",
            description: "Include country code",
          },
          ticketType: {
            type: "string",
            title: "Ticket Type",
            enum: ["early-bird", "regular", "student", "vip"],
            enumNames: ["Early Bird ($299)", "Regular ($399)", "Student ($99)", "VIP ($599)"],
          },
          dietaryRequirements: {
            type: "string",
            format: "multiline",
            title: "Dietary Requirements",
            description: "Let us know about any food allergies or dietary restrictions",
          },
          emergencyContact: {
            type: "string",
            title: "Emergency Contact",
            description: "Name and phone number",
          },
        },
        required: ["attendeeName", "email", "ticketType"],
      },
    },
  },
  {
    description: "Job application form",
    type: "form",
    props: {
      title: "Apply for Position",
      intro: "We're excited to learn more about you! Please fill out this application form completely.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            title: "First Name",
          },
          lastName: {
            type: "string",
            title: "Last Name",
          },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
          },
          phone: {
            type: "string",
            title: "Phone Number",
          },
          position: {
            type: "string",
            title: "Position Applied For",
            enum: [
              "frontend-developer",
              "backend-developer",
              "fullstack-developer",
              "designer",
              "product-manager",
            ],
            enumNames: [
              "Frontend Developer",
              "Backend Developer",
              "Fullstack Developer",
              "UI/UX Designer",
              "Product Manager",
            ],
          },
          experience: {
            type: "number",
            title: "Years of Experience",
            minimum: 0,
            maximum: 50,
          },
          salary: {
            type: "number",
            title: "Expected Salary (USD)",
            description: "Annual salary expectation",
          },
          availability: {
            type: "string",
            format: "date",
            title: "Available Start Date",
          },
          portfolio: {
            type: "string",
            format: "uri",
            title: "Portfolio/Website URL",
            description: "Link to your work (optional)",
          },
          coverLetter: {
            type: "string",
            format: "multiline",
            title: "Cover Letter",
            description: "Tell us why you're interested in this position",
          },
          relocate: {
            type: "boolean",
            title: "Willing to relocate",
          },
        },
        required: ["firstName", "lastName", "email", "phone", "position", "experience", "availability"],
      },
    },
  },
  {
    description: "Customer feedback form",
    type: "form",
    props: {
      title: "Share Your Feedback",
      intro: "Your opinion matters to us. Help us improve our products and services.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            title: "Name (Optional)",
            description: "You can remain anonymous",
          },
          email: {
            type: "string",
            format: "email",
            title: "Email (Optional)",
            description: "Only if you'd like a response",
          },
          productUsed: {
            type: "string",
            title: "Product/Service Used",
            enum: ["website", "mobile-app", "customer-support", "billing", "product-quality"],
            enumNames: ["Website", "Mobile App", "Customer Support", "Billing", "Product Quality"],
          },
          rating: {
            type: "number",
            title: "Overall Rating",
            minimum: 1,
            maximum: 5,
            description: "Rate from 1 (poor) to 5 (excellent)",
          },
          recommendation: {
            type: "number",
            title: "Likelihood to Recommend",
            minimum: 0,
            maximum: 10,
            description: "0 = Not likely, 10 = Extremely likely",
          },
          feedback: {
            type: "string",
            format: "multiline",
            title: "Detailed Feedback",
            description: "What did you like? What could be improved?",
          },
          improvements: {
            type: "string",
            format: "multiline",
            title: "Suggestions for Improvement",
            description: "Any specific features or changes you'd like to see?",
          },
        },
        required: ["productUsed", "rating", "feedback"],
      },
    },
  },
  {
    description: "Appointment booking form",
    type: "form",
    props: {
      title: "Book an Appointment",
      intro: "Schedule a consultation with our team. We'll confirm your appointment within 24 hours.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          clientName: {
            type: "string",
            title: "Full Name",
          },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
          },
          phone: {
            type: "string",
            title: "Phone Number",
          },
          serviceType: {
            type: "string",
            title: "Service Type",
            enum: ["consultation", "design-review", "technical-support", "training", "other"],
            enumNames: [
              "General Consultation",
              "Design Review",
              "Technical Support",
              "Training Session",
              "Other",
            ],
          },
          preferredDate: {
            type: "string",
            format: "date",
            title: "Preferred Date",
          },
          preferredTime: {
            type: "string",
            format: "time",
            title: "Preferred Time",
          },
          duration: {
            type: "string",
            title: "Expected Duration",
            enum: ["30min", "1hour", "2hours", "half-day"],
            enumNames: ["30 minutes", "1 hour", "2 hours", "Half day"],
          },
          meetingType: {
            type: "string",
            title: "Meeting Type",
            enum: ["in-person", "video-call", "phone-call"],
            enumNames: ["In Person", "Video Call", "Phone Call"],
          },
          notes: {
            type: "string",
            format: "multiline",
            title: "Additional Notes",
            description: "Anything specific you'd like to discuss?",
          },
        },
        required: ["clientName", "email", "phone", "serviceType", "preferredDate", "preferredTime"],
      },
    },
  },
  {
    description: "Quick login form (horizontal)",
    type: "form",
    props: {
      title: "Sign In",
      align: "horizontal",
      fields: {
        type: "object",
        properties: {
          username: {
            type: "string",
            title: "Username or Email",
          },
          password: {
            type: "string",
            format: "password",
            title: "Password",
          },
          rememberMe: {
            type: "boolean",
            title: "Remember me",
          },
        },
        required: ["username", "password"],
      },
    },
  },
  {
    description: "Survey form with various field types",
    type: "form",
    props: {
      title: "User Experience Survey",
      intro: "Help us understand how you use our platform. This survey takes about 5 minutes to complete.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
            title: "User ID",
            description: "Your unique identifier (auto-filled)",
          },
          usageFrequency: {
            type: "string",
            title: "How often do you use our platform?",
            enum: ["daily", "weekly", "monthly", "rarely"],
            enumNames: ["Daily", "Weekly", "Monthly", "Rarely"],
          },
          primaryUseCase: {
            type: "string",
            title: "Primary Use Case",
            enum: ["personal", "business", "education", "research"],
            enumNames: ["Personal Projects", "Business/Work", "Education", "Research"],
          },
          satisfaction: {
            type: "number",
            title: "Satisfaction Level",
            minimum: 1,
            maximum: 10,
            description: "Rate your overall satisfaction (1-10)",
          },
          favoriteFeatures: {
            type: "string",
            format: "multiline",
            title: "Favorite Features",
            description: "What features do you use most?",
          },
          improvements: {
            type: "string",
            format: "multiline",
            title: "Suggested Improvements",
            description: "What would make the platform better?",
          },
          bugReports: {
            type: "string",
            format: "multiline",
            title: "Bug Reports",
            description: "Any issues or bugs you've encountered?",
          },
          contactForFollowup: {
            type: "boolean",
            title: "May we contact you for follow-up questions?",
          },
        },
        required: ["usageFrequency", "primaryUseCase", "satisfaction"],
      },
    },
  },
  {
    description: "Product order form",
    type: "form",
    props: {
      title: "Place Your Order",
      intro:
        "Complete your purchase by filling out the details below. All fields marked with * are required.",
      align: "vertical",
      fields: {
        type: "object",
        properties: {
          customerEmail: {
            type: "string",
            format: "email",
            title: "Email Address",
            description: "For order confirmations and updates",
          },
          shippingName: {
            type: "string",
            title: "Shipping Name",
            description: "Full name for delivery",
          },
          shippingAddress: {
            type: "string",
            format: "multiline",
            title: "Shipping Address",
            description: "Include street, city, state, and ZIP code",
          },
          phone: {
            type: "string",
            title: "Phone Number",
            description: "For delivery coordination",
          },
          productQuantity: {
            type: "number",
            title: "Quantity",
            minimum: 1,
            maximum: 10,
            description: "Number of items",
          },
          shippingMethod: {
            type: "string",
            title: "Shipping Method",
            enum: ["standard", "express", "overnight"],
            enumNames: ["Standard (5-7 days)", "Express (2-3 days)", "Overnight"],
          },
          giftMessage: {
            type: "string",
            format: "multiline",
            title: "Gift Message (Optional)",
            description: "Include a personal message",
          },
          specialInstructions: {
            type: "string",
            format: "multiline",
            title: "Special Instructions",
            description: "Any specific delivery instructions",
          },
          newsletter: {
            type: "boolean",
            title: "Subscribe to newsletter for deals and updates",
          },
        },
        required: [
          "customerEmail",
          "shippingName",
          "shippingAddress",
          "phone",
          "productQuantity",
          "shippingMethod",
        ],
      },
    },
  },
];
