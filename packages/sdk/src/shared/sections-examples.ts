import type { Section } from "./bricks";

export const sectionsExamples: { label: string; description: string; example: Section }[] = [
  // HERO SECTIONS
  {
    label: "SaaS Product Hero - Modern landing page hero",
    description: `Professional SaaS hero with headline, subtitle, dual CTAs and feature highlights.
    Uses centered layout with gradient background and modern typography hierarchy.`,
    example: {
      id: "saas-hero",
      label: "SaaS Hero",
      order: 0,
      props: {
        colorPreset: {
          color: "primary-500",
          gradientDirection: "bg-gradient-to-br",
        },
        padding: "6rem",
        gap: "2rem",
        justifyContent: "justify-center",
        alignItems: "items-center",
        minHeight: "min-h-screen",
        direction: "flex-col",
      },
      bricks: [
        {
          id: "hero-main",
          type: "hero",
          label: "Main hero",
          props: {
            content: "<h1>Scale Your Business with AI-Powered Automation</h1>",
            tagline:
              "Join 10,000+ companies saving 40+ hours per week with our intelligent workflow platform",
          },
        },
        {
          id: "hero-ctas",
          type: "box",
          label: "CTA buttons",
          props: {
            direction: "flex-row",
            gap: "1rem",
            justifyContent: "justify-center",
            $children: [
              {
                id: "primary-cta",
                type: "button",
                props: {
                  label: "Start Free Trial",
                  link: "/signup",
                  colorPreset: { color: "white" },
                  fill: "solid",
                  fontSize: "text-lg",
                  rounding: "rounded-lg",
                },
              },
              {
                id: "secondary-cta",
                type: "button",
                props: {
                  label: "Watch Demo",
                  link: "/demo",
                  colorPreset: { color: "white" },
                  fill: "outline",
                  fontSize: "text-lg",
                  rounding: "rounded-lg",
                },
              },
            ],
          },
        },
        {
          id: "hero-social-proof",
          type: "text",
          label: "Social proof",
          props: {
            content: "<p>Trusted by teams at Google, Microsoft, and 500+ startups</p>",
          },
        },
      ],
    },
  },

  {
    label: "Restaurant Hero - Visual-first with image background",
    description: `Restaurant hero section with appetizing background image, elegant overlay, and reservation CTA.
    Perfect for food & hospitality businesses.`,
    example: {
      id: "restaurant-hero",
      label: "Restaurant Hero",
      order: 1,
      props: {
        backgroundImage: {
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3",
        },
        padding: "8rem",
        gap: "2rem",
        justifyContent: "justify-center",
        alignItems: "items-center",
        minHeight: "min-h-screen",
        direction: "flex-col",
      },
      bricks: [
        {
          id: "restaurant-title",
          type: "hero",
          props: {
            content: "<h1>Bella Vista</h1>",
            tagline:
              "Authentic Italian cuisine in the heart of the city. Experience flavors that tell a story.",
          },
        },
        {
          id: "restaurant-cta",
          type: "button",
          props: {
            label: "Reserve Your Table",
            link: "/reservations",
            colorPreset: { color: "accent-500" },
            fill: "solid",
            fontSize: "text-xl",
            rounding: "rounded-full",
          },
        },
      ],
    },
  },

  {
    label: "Portfolio Hero - Creative professional showcase",
    description: `Creative portfolio hero with split-screen layout featuring personal photo and introduction.
    Ideal for designers, photographers, and creative professionals.`,
    example: {
      id: "portfolio-hero",
      label: "Portfolio Hero",
      order: 2,
      props: {
        padding: "4rem",
        gap: "4rem",
        alignItems: "items-center",
        minHeight: "min-h-screen",
      },
      mobileProps: {
        padding: "2rem",
      },
      bricks: [
        {
          id: "portfolio-image",
          type: "image",
          label: "Professional photo",
          props: {
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            alt: "Professional headshot",
            rounding: "rounded-2xl",
          },
        },
        {
          id: "portfolio-intro",
          type: "box",
          label: "Introduction",
          props: {
            gap: "2rem",
            $children: [
              {
                id: "intro-text",
                type: "hero",
                props: {
                  content: "<h1>Creative Director & Brand Designer</h1>",
                  tagline:
                    "I help ambitious companies build memorable brands through thoughtful design and strategic thinking.",
                },
              },
              {
                id: "portfolio-ctas",
                type: "box",
                props: {
                  direction: "flex-row",
                  gap: "1rem",
                  $children: [
                    {
                      id: "view-work-btn",
                      type: "button",
                      props: {
                        label: "View My Work",
                        link: "/portfolio",
                        colorPreset: { color: "primary-500" },
                        fill: "solid",
                      },
                    },
                    {
                      id: "contact-btn",
                      type: "button",
                      props: {
                        label: "Get In Touch",
                        link: "/contact",
                        colorPreset: { color: "primary-500" },
                        fill: "outline",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },

  // FEATURE SECTIONS
  {
    label: "Feature Grid - Three-column benefits showcase",
    description: `Modern feature section with icon-based grid layout showcasing product benefits.
    Uses consistent spacing and visual hierarchy with icons and descriptions.`,
    example: {
      id: "features-grid",
      label: "Features Grid",
      order: 3,
      props: {
        padding: "6rem",
        gap: "4rem",
        justifyContent: "justify-between",
      },
      bricks: [
        {
          id: "features-header",
          type: "text",
          label: "Section header",
          props: {
            content:
              "<h2>Why Choose Our Platform?</h2><p>Everything you need to streamline your workflow and boost productivity.</p>",
          },
        },
        {
          id: "features-grid-container",
          type: "box",
          label: "Features container",
          props: {
            direction: "flex-row",
            gap: "3rem",
            justifyContent: "justify-center",
            $children: [
              {
                id: "feature-1",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  padding: "2rem",
                  $children: [
                    {
                      id: "feature-1-icon",
                      type: "icon",
                      props: {
                        icon: "mdi:rocket-launch",
                        size: "3rem",
                        colorPreset: { color: "primary-500" },
                      },
                    },
                    {
                      id: "feature-1-content",
                      type: "text",
                      props: {
                        content:
                          "<h3>Lightning Fast</h3><p>Deploy in seconds, not hours. Our optimized infrastructure ensures blazing-fast performance.</p>",
                      },
                    },
                  ],
                },
              },
              {
                id: "feature-2",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  padding: "2rem",
                  $children: [
                    {
                      id: "feature-2-icon",
                      type: "icon",
                      props: {
                        icon: "mdi:shield-check",
                        size: "3rem",
                        colorPreset: { color: "green-500" },
                      },
                    },
                    {
                      id: "feature-2-content",
                      type: "text",
                      props: {
                        content:
                          "<h3>Bank-Level Security</h3><p>Your data is protected with enterprise-grade encryption and compliance standards.</p>",
                      },
                    },
                  ],
                },
              },
              {
                id: "feature-3",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  padding: "2rem",
                  $children: [
                    {
                      id: "feature-3-icon",
                      type: "icon",
                      props: {
                        icon: "mdi:account-group",
                        size: "3rem",
                        colorPreset: { color: "purple-500" },
                      },
                    },
                    {
                      id: "feature-3-content",
                      type: "text",
                      props: {
                        content:
                          "<h3>Team Collaboration</h3><p>Real-time collaboration tools that keep your entire team in sync and productive.</p>",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },

  {
    label: "Feature Showcase - Side-by-side with screenshot",
    description: `Feature showcase with alternating image-text layout. Perfect for demonstrating
    software features with screenshots and detailed explanations.`,
    example: {
      id: "feature-showcase",
      label: "Feature Showcase",
      order: 4,
      props: {
        direction: "flex-row",
        padding: "6rem",
        gap: "4rem",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "feature-content",
          type: "box",
          label: "Feature description",
          props: {
            direction: "flex-col",
            gap: "2rem",
            $children: [
              {
                id: "feature-title",
                type: "text",
                props: {
                  content:
                    "<h2>Powerful Analytics Dashboard</h2><p>Get real-time insights into your business performance with our comprehensive analytics suite.</p>",
                },
              },
              {
                id: "feature-list",
                type: "text",
                props: {
                  content:
                    "<ul><li>✓ Real-time data visualization</li><li>✓ Custom report generation</li><li>✓ Multi-platform integration</li></ul>",
                },
              },
              {
                id: "feature-cta",
                type: "button",
                props: {
                  label: "Explore Analytics",
                  link: "/analytics",
                  colorPreset: { color: "primary-500" },
                  fill: "solid",
                },
              },
            ],
          },
        },
        {
          id: "feature-image",
          type: "image",
          label: "Dashboard screenshot",
          props: {
            src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=800",
            alt: "Analytics dashboard interface",
            rounding: "rounded-xl",
          },
        },
      ],
    },
  },

  // TEAM SECTIONS
  {
    label: "Meet the Team - Photo grid with bios",
    description: `Professional team showcase with photos, roles, and social links.
    Perfect for about pages and building trust with potential customers.`,
    example: {
      id: "team-section",
      label: "Meet the Team",
      order: 7,
      props: {
        direction: "flex-col",
        padding: "6rem",
        gap: "4rem",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "team-header",
          type: "text",
          label: "Team section header",
          props: {
            content: "<h2>Meet Our Team</h2><p>The passionate people behind our success</p>",
          },
        },
        {
          id: "team-grid",
          type: "box",
          label: "Team members grid",
          props: {
            direction: "flex-row",
            gap: "3rem",
            justifyContent: "justify-center",
            $children: [
              {
                id: "team-member-1",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "member-1-photo",
                      type: "image",
                      props: {
                        src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=300",
                        alt: "Alex Johnson, CEO",
                        rounding: "rounded-full",
                      },
                    },
                    {
                      id: "member-1-info",
                      type: "text",
                      props: {
                        content:
                          "<h3>Alex Johnson</h3><p><strong>CEO & Founder</strong></p><p>10+ years building products that scale. Previously led engineering at TechCorp.</p>",
                      },
                    },
                    {
                      id: "member-1-social",
                      type: "social-links",
                      props: {
                        links: [
                          { platform: "linkedin", url: "https://linkedin.com/in/alexjohnson" },
                          { platform: "twitter", url: "https://twitter.com/alexjohnson" },
                        ],
                        size: "small",
                      },
                    },
                  ],
                },
              },
              {
                id: "team-member-2",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "member-2-photo",
                      type: "image",
                      props: {
                        src: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&w=300",
                        alt: "Sarah Kim, CTO",
                        rounding: "rounded-full",
                      },
                    },
                    {
                      id: "member-2-info",
                      type: "text",
                      props: {
                        content:
                          "<h3>Sarah Kim</h3><p><strong>CTO</strong></p><p>Stanford CS grad with expertise in AI/ML. Built scalable systems for millions of users.</p>",
                      },
                    },
                    {
                      id: "member-2-social",
                      type: "social-links",
                      props: {
                        links: [
                          { platform: "linkedin", url: "https://linkedin.com/in/sarahkim" },
                          { platform: "github", url: "https://github.com/sarahkim" },
                        ],
                        size: "small",
                      },
                    },
                  ],
                },
              },
              {
                id: "team-member-3",
                type: "box",
                props: {
                  direction: "flex-col",
                  gap: "1.5rem",
                  alignItems: "items-center",
                  $children: [
                    {
                      id: "member-3-photo",
                      type: "image",
                      props: {
                        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=300",
                        alt: "Maria Garcia, Head of Design",
                        rounding: "rounded-full",
                      },
                    },
                    {
                      id: "member-3-info",
                      type: "text",
                      props: {
                        content:
                          "<h3>Maria Garcia</h3><p><strong>Head of Design</strong></p><p>Award-winning designer with 8+ years creating beautiful, user-centered experiences.</p>",
                      },
                    },
                    {
                      id: "member-3-social",
                      type: "social-links",
                      props: {
                        links: [
                          { platform: "linkedin", url: "https://linkedin.com/in/mariagarcia" },
                          { platform: "behance", url: "https://behance.net/mariagarcia" },
                        ],
                        size: "small",
                      },
                    },
                  ],
                },
              },
            ],
            mobileProps: {
              direction: "flex-col",
            },
          },
        },
      ],
    },
  },

  // CONTENT SECTIONS
  {
    label: "FAQ Section - Expandable questions",
    description: `Frequently asked questions section using accordion layout.
    Helps address common customer concerns and reduces support load.`,
    example: {
      id: "faq-section",
      label: "FAQ",
      order: 9,
      props: {
        direction: "flex-col",
        padding: "6rem",
        gap: "3rem",
        alignItems: "items-center",
      },
      bricks: [
        {
          id: "faq-header",
          type: "text",
          label: "FAQ header",
          props: {
            content: "<h2>Frequently Asked Questions</h2><p>Got questions? We've got answers.</p>",
          },
        },
        {
          id: "faq-accordion",
          type: "accordion",
          label: "FAQ accordion",
          props: {
            items: [
              {
                title: "How long does it take to get started?",
                content:
                  "You can be up and running in less than 5 minutes. Our onboarding process is designed to be quick and intuitive, with guided setup and sample data to help you get familiar with the platform.",
              },
              {
                title: "Do you offer a free trial?",
                content:
                  "Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can upgrade, downgrade, or cancel at any time during or after the trial period.",
              },
              {
                title: "What integrations do you support?",
                content:
                  "We integrate with 100+ popular tools including Slack, Google Workspace, Microsoft 365, Salesforce, HubSpot, and many more. We also provide a robust API for custom integrations.",
              },
              {
                title: "Is my data secure?",
                content:
                  "Absolutely. We use bank-level encryption, regular security audits, and comply with SOC 2, GDPR, and other industry standards. Your data is stored in secure data centers with 99.9% uptime guarantee.",
              },
              {
                title: "Can I change or cancel my plan anytime?",
                content:
                  "Yes, you have complete flexibility to upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
              },
            ],
            colorPreset: { color: "white" },
            rounding: "rounded-lg",
            shadow: "shadow-lg",
          },
        },
      ],
    },
  },
];
