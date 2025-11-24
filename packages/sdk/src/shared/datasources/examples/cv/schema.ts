import { Type, type Static } from "@sinclair/typebox";
export const cvSchema = Type.Object(
  {
    firstName: Type.String({
      title: "First name",
    }),
    lastName: Type.String({
      title: "Last name",
    }),
    tagLine: Type.String({
      title: "Tag line",
    }),
    email: Type.String({
      title: "Email",
      format: "email",
    }),
    phoneNumber: Type.Optional(
      Type.String({
        title: "Phone number",
      }),
    ),
    address: Type.Optional(
      Type.String({
        title: "Address",
      }),
    ),
    socialLinks: Type.Optional(
      Type.Array(
        Type.Object({
          platform: Type.String({
            title: "Platform",
            enum: ["LinkedIn", "GitHub", "Twitter", "Portfolio", "Other"],
          }),
          url: Type.String({
            title: "URL",
            format: "uri",
          }),
        }),
      ),
    ),
    professionalSummary: Type.String({
      title: "Professional Summary",
      description: "Brief overview of your professional background and goals",
      maxLength: 2000,
    }),
    workExperience: Type.Array(
      Type.Object({
        company: Type.String({ title: "Company Name" }),
        position: Type.String({ title: "Position" }),
        location: Type.Optional(Type.String({ title: "Location" })),
        startDate: Type.String({
          title: "Start Date",
          format: "date",
        }),
        endDate: Type.Optional(
          Type.String({
            title: "End Date",
            format: "date",
          }),
        ),
        current: Type.Optional(
          Type.Boolean({
            title: "Current Position",
            default: false,
          }),
        ),
        description: Type.String({
          title: "Description",
          description: "Description of responsibilities and achievements",
          format: "markdown",
        }),
        achievements: Type.Optional(
          Type.Array(
            Type.String({
              title: "Achievement",
            }),
          ),
        ),
      }),
    ),
    education: Type.Array(
      Type.Object({
        institution: Type.String({ title: "Institution" }),
        degree: Type.String({ title: "Degree" }),
        field: Type.String({ title: "Field of Study" }),
        startDate: Type.String({
          title: "Start Date",
          format: "date",
        }),
        endDate: Type.Optional(
          Type.String({
            title: "End Date",
            format: "date",
          }),
        ),
        gpa: Type.Optional(
          Type.Number({
            title: "GPA",
            minimum: 0,
            maximum: 4,
          }),
        ),
        honors: Type.Optional(
          Type.Array(
            Type.String({
              title: "Honor/Award",
            }),
          ),
        ),
      }),
    ),
    skills: Type.Array(
      Type.Object({
        category: Type.String({
          title: "Skill Category",
          description: "E.g., Programming Languages, Tools, Soft Skills",
        }),
        items: Type.Array(
          Type.Object({
            name: Type.String({ title: "Skill Name" }),
            level: Type.Optional(
              Type.String({
                title: "Proficiency Level",
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
              }),
            ),
          }),
        ),
      }),
    ),
    certifications: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String({ title: "Certification Name" }),
          issuer: Type.String({ title: "Issuing Organization" }),
          dateObtained: Type.String({
            title: "Date Obtained",
            format: "date",
          }),
          expiryDate: Type.Optional(
            Type.String({
              title: "Expiry Date",
              format: "date",
            }),
          ),
          credentialId: Type.Optional(Type.String({ title: "Credential ID" })),
        }),
      ),
    ),
    languages: Type.Optional(
      Type.Array(
        Type.Object({
          language: Type.String({ title: "Language" }),
          proficiency: Type.String({
            title: "Proficiency Level",
            enum: ["Basic", "Intermediate", "Advanced", "Native/Bilingual"],
          }),
        }),
      ),
    ),
    projects: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String({ title: "Project Name" }),
          description: Type.String({ title: "Description" }),
          url: Type.Optional(
            Type.String({
              title: "Project URL",
              pattern: "^https?://.*",
            }),
          ),
          technologies: Type.Array(Type.String({ title: "Technology" })),
          startDate: Type.Optional(
            Type.String({
              title: "Start Date",
              format: "date",
            }),
          ),
          endDate: Type.Optional(
            Type.String({
              title: "End Date",
              format: "date",
            }),
          ),
        }),
      ),
    ),
    references: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String({ title: "Reference Name" }),
          position: Type.String({ title: "Position" }),
          company: Type.String({ title: "Company" }),
          email: Type.Optional(
            Type.String({
              title: "Email",
              pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            }),
          ),
          phoneNumber: Type.Optional(
            Type.String({
              title: "Phone Number",
              pattern: "^\\+?[1-9]\\d{1,14}$",
            }),
          ),
          relationship: Type.String({ title: "Professional Relationship" }),
        }),
      ),
    ),
  },
  {
    description: "Schema representing a comprehensive CV",
  },
);

export type CVschema = Static<typeof cvSchema>;
