import { Type, type Static } from "@sinclair/typebox";
import { linksSchema } from "../links/schema";

export const contactInfoSchema = Type.Object(
  {
    email: Type.String({ format: "email", title: "Email" }),
    phone: Type.Optional(Type.String({ title: "Phone" })),
    companyName: Type.Optional(Type.String({ title: "Company Name" })),
    firstName: Type.Optional(Type.String({ title: "First Name" })),
    lastName: Type.Optional(Type.String({ title: "Last Name" })),
    url: Type.Optional(Type.String({ format: "uri", title: "Website URL" })),
    address: Type.Optional(Type.String({ title: "Address" })),
    socialLinks: linksSchema,
  },
  {
    description: "A generic schema representing a person or company contact information",
  },
);

export type ContactInfo = Static<typeof contactInfoSchema>;
