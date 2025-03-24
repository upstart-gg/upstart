import { Type, type Static } from "@sinclair/typebox";

export const jobBoardSchema = Type.Object(
  {
    company: Type.Object({
      basicInfo: Type.Object({
        name: Type.String({
          title: "Company Name",
        }),
        legalName: Type.Optional(
          Type.String({
            title: "Legal Company Name",
          }),
        ),
        industry: Type.Array(
          Type.String({
            title: "Industry",
            description: "Industries the company operates in",
          }),
        ),
        companySize: Type.String({
          enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
          title: "Company Size",
        }),
        foundedYear: Type.Optional(
          Type.Number({
            title: "Founded Year",
            minimum: 1800,
            maximum: 2025,
          }),
        ),
        description: Type.String({
          title: "Company Description",
          minLength: 1,
          maxLength: 5000,
        }),
      }),

      contact: Type.Object({
        email: Type.String({
          title: "Company Email",
          pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        }),
        phone: Type.Optional(
          Type.String({
            title: "Company Phone",
            pattern: "^\\+?[1-9]\\d{1,14}$",
          }),
        ),
        website: Type.String({
          title: "Company Website",
          pattern: "^https?://.*",
        }),
        socialMedia: Type.Optional(
          Type.Object({
            linkedin: Type.Optional(Type.String()),
            twitter: Type.Optional(Type.String()),
            facebook: Type.Optional(Type.String()),
          }),
        ),
      }),

      location: Type.Object({
        headquarters: Type.Object({
          address: Type.Optional(Type.String()),
          city: Type.String(),
          state: Type.Optional(Type.String()),
          country: Type.String(),
          postalCode: Type.Optional(Type.String()),
        }),
        hasRemoteWorkPolicy: Type.Boolean({
          title: "Offers Remote Work",
          default: false,
        }),
        offices: Type.Optional(
          Type.Array(
            Type.Object({
              city: Type.String(),
              state: Type.Optional(Type.String()),
              country: Type.String(),
            }),
          ),
        ),
      }),
    }),

    jobListing: Type.Object({
      id: Type.String({
        title: "Job ID",
        description: "Unique identifier for the job posting",
      }),
      basicInfo: Type.Object({
        title: Type.String({
          title: "Job Title",
        }),
        department: Type.String({
          title: "Department",
        }),
        employmentType: Type.Array(
          Type.String({
            enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelance"],
          }),
        ),
        experienceLevel: Type.String({
          enum: ["Entry", "Associate", "Mid-Senior", "Senior", "Lead", "Executive"],
        }),
        workplaceType: Type.String({
          enum: ["On-site", "Hybrid", "Remote"],
        }),
      }),

      compensation: Type.Object({
        salary: Type.Optional(
          Type.Object({
            min: Type.Number({
              minimum: 0,
            }),
            max: Type.Number({
              minimum: 0,
            }),
            currency: Type.String({
              default: "USD",
            }),
            period: Type.String({
              enum: ["Hour", "Day", "Week", "Month", "Year"],
            }),
          }),
        ),
        benefits: Type.Optional(
          Type.Array(
            Type.String({
              enum: [
                "Health Insurance",
                "Dental Insurance",
                "Vision Insurance",
                "401(k)",
                "Stock Options",
                "Paid Time Off",
                "Professional Development",
                "Gym Membership",
                "Remote Work",
                "Flexible Hours",
                "Other",
              ],
            }),
          ),
        ),
        additionalCompensation: Type.Optional(Type.String()),
      }),

      details: Type.Object({
        description: Type.String({
          title: "Job Description",
          minLength: 1,
          maxLength: 10000,
        }),
        responsibilities: Type.Array(Type.String()),
        requirements: Type.Object({
          required: Type.Array(Type.String()),
          preferred: Type.Optional(Type.Array(Type.String())),
        }),
        skills: Type.Array(
          Type.Object({
            name: Type.String(),
            level: Type.Optional(
              Type.String({
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
              }),
            ),
            required: Type.Boolean({
              default: true,
            }),
          }),
        ),
      }),

      applicationProcess: Type.Object({
        howToApply: Type.String({
          enum: ["Direct", "External", "Email"],
        }),
        applicationUrl: Type.Optional(Type.String()),
        applicationEmail: Type.Optional(
          Type.String({
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          }),
        ),
        requiredDocuments: Type.Array(
          Type.String({
            enum: ["Resume", "Cover Letter", "Portfolio", "References", "Other"],
          }),
        ),
      }),

      metadata: Type.Object({
        postingDate: Type.String({
          title: "Posting Date",
          format: "date",
        }),
        expirationDate: Type.Optional(
          Type.String({
            title: "Expiration Date",
            format: "date",
          }),
        ),
        status: Type.String({
          enum: ["Draft", "Active", "Paused", "Filled", "Expired", "Cancelled"],
          default: "Draft",
        }),
        isSponsored: Type.Boolean({
          default: false,
        }),
        isRemoteEligible: Type.Boolean({
          default: false,
        }),
        isVisaSponsored: Type.Boolean({
          default: false,
        }),
      }),
    }),
  },
  {
    description: "Schema representing a job board listing with company and job details",
  },
);

export type JobBoardType = Static<typeof jobBoardSchema>;
