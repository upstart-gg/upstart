import { Type, type Static } from "@sinclair/typebox";

export const restaurantSchema = Type.Object(
  {
    basicInfo: Type.Object({
      name: Type.String({
        title: "Restaurant Name",
      }),
      legalName: Type.Optional(
        Type.String({
          title: "Legal Business Name",
        }),
      ),
      taxId: Type.Optional(
        Type.String({
          title: "Tax ID/VAT Number",
        }),
      ),
      establishedDate: Type.String({
        title: "Establishment Date",
        format: "date",
      }),
      cuisine: Type.Array(
        Type.String({
          title: "Cuisine Type",
          description: "Types of cuisine served",
        }),
      ),
    }),

    contact: Type.Object({
      email: Type.String({
        title: "Email",
        pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      }),
      phone: Type.String({
        title: "Phone Number",
        pattern: "^\\+?[1-9]\\d{1,14}$",
      }),
      socialMedia: Type.Optional(
        Type.Object({
          facebook: Type.Optional(Type.String()),
          instagram: Type.Optional(Type.String()),
          twitter: Type.Optional(Type.String()),
        }),
      ),
    }),

    location: Type.Object({
      address: Type.String({
        title: "Street Address",
      }),
      city: Type.String({
        title: "City",
      }),
      state: Type.Optional(
        Type.String({
          title: "State/Province",
        }),
      ),
      postalCode: Type.String({
        title: "Postal Code",
      }),
      country: Type.String({
        title: "Country",
      }),
      coordinates: Type.Optional(
        Type.Object({
          latitude: Type.Number(),
          longitude: Type.Number(),
        }),
      ),
    }),

    hours: Type.Object({
      regularHours: Type.Array(
        Type.Object({
          day: Type.String({
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          }),
          open: Type.String({
            title: "Opening Time",
            pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
          }),
          close: Type.String({
            title: "Closing Time",
            pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
          }),
          closed: Type.Optional(
            Type.Boolean({
              title: "Closed on this day",
              default: false,
            }),
          ),
        }),
      ),
      specialHours: Type.Optional(
        Type.Array(
          Type.Object({
            date: Type.String({
              title: "Special Date",
              format: "date",
            }),
            description: Type.String({
              title: "Description",
            }),
            open: Type.Optional(Type.String()),
            close: Type.Optional(Type.String()),
            closed: Type.Boolean({
              default: false,
            }),
          }),
        ),
      ),
    }),

    menu: Type.Object({
      categories: Type.Array(
        Type.Object({
          name: Type.String({
            title: "Category Name",
            description: "E.g., Starters, Main Course, Desserts",
          }),
          description: Type.Optional(Type.String()),
          items: Type.Array(
            Type.Object({
              id: Type.String({
                title: "Item ID",
              }),
              name: Type.String({
                title: "Item Name",
              }),
              description: Type.String({
                title: "Item Description",
              }),
              price: Type.Number({
                title: "Price",
                minimum: 0,
              }),
              currency: Type.String({
                default: "USD",
              }),
              spicyLevel: Type.Optional(
                Type.Number({
                  minimum: 0,
                  maximum: 5,
                }),
              ),
              allergens: Type.Optional(
                Type.Array(
                  Type.String({
                    enum: ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish", "Fish", "Other"],
                  }),
                ),
              ),
              dietary: Type.Optional(
                Type.Array(
                  Type.String({
                    enum: ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Dairy-Free"],
                  }),
                ),
              ),
              available: Type.Boolean({
                title: "Currently Available",
                default: true,
              }),
              image: Type.Optional(
                Type.String({
                  title: "Image URL",
                  pattern: "^https?://.*",
                }),
              ),
              customizations: Type.Optional(
                Type.Array(
                  Type.Object({
                    name: Type.String({
                      title: "Customization Name",
                    }),
                    options: Type.Array(
                      Type.Object({
                        name: Type.String(),
                        price: Type.Optional(Type.Number()),
                      }),
                    ),
                    required: Type.Boolean({
                      default: false,
                    }),
                    multiSelect: Type.Boolean({
                      default: false,
                    }),
                  }),
                ),
              ),
            }),
          ),
        }),
      ),
      specials: Type.Optional(
        Type.Array(
          Type.Object({
            name: Type.String(),
            description: Type.String(),
            price: Type.Number(),
            startDate: Type.String({
              format: "date",
            }),
            endDate: Type.String({
              format: "date",
            }),
            daysAvailable: Type.Optional(
              Type.Array(
                Type.String({
                  enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                }),
              ),
            ),
          }),
        ),
      ),
    }),
  },
  {
    description: "Schema representing a restaurant with its menu and details",
  },
);
