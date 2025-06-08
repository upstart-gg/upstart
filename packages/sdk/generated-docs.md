# Upstart SDK documentation

The Upstart SDK allows users to create and manage websites using a structured JSON format.
It is later converted into a website.
It provides various *bricks* (predefined components) that can be used to build a website. It also
allows users to define themes, site & pages attributes, and other configurations in a structured way.

## Terms
- Theme: a set of available colors and fonts for the whole site.
- Page: a web page described by a set of attributes and organized into sections & bricks
- sitemap: an object referencing all pages from the site.
- Section: A page is composed of sections vertically stacked. Each section contain bricks stacked horizontally.
  When needed to place bricks vertically inside a section, you can use a container brick.
- Brick: an component within a section, such as a text block, image, video, etc. Aka "widgets" for some complex bricks
- Container: a specific brick that can contain other bricks within their `$children` prop and control their layout.
- Datasource: a defined source of dynamic data that can be consumed by pages.
- Datarecord: a defined destination for data submitted by users through forms& surveys.
- Site manifest: a set of attributes used to declare datasources and datarecords of the site, as well as other site-wide attributes.

## Theme
A theme is a set of available colors and fonts. It can be used to customize the look and feel of the website.
The first theme is the default theme.

## Attributes
We distinguish 2 types of attributes: *Site* attributes and *page* attributes.
Some attributes are shared between them, while others are specific to one of them. Pages can override site attributes, but not the other way around. Attributes prefixed with `$` are considered as "predefined" attributes and reserved for the SDK. The others are considered as "custom" attributes defined by the designer/developer.

## Datasources (for dynamic content)
Datasources are used to define a source of dynamic data that can be consumed by pages. They are defined in the `datasources` array of the site attributes.
You can think of datasources as SQL tables.

### Ready-to-use datasources
Upstart provides a set of ready-to-use datasources that can be used to quickly set up a website.
Simply use the right "provider" to use them.

Here are the built-in providers with their schemas:

#### `rss`
RSS feed items
Schema:
- `title`: [optional] `string`. The title of the RSS feed item. 
- `link`: [optional] `string`. The link to the RSS feed item. 
- `creator`: [optional] `string`. The creator of the RSS feed item. 
- `content`: [optional] `string`. The content of the RSS feed item. 
- `pubDate`: [optional] `string`. The publication date of the RSS feed item. 

#### `youtube-list`
Schema for a list of Youtube videos
Schema:
- `etag`: [optional] `string`.  
- `id`: [optional] `object`.  
  * `videoId`: [required] `string`.  
  * `channelId`: [required] `string`.  
  * `playlistId`: [required] `string`.  
- `snippet`: [optional] `object`.  
  * `publishedAt`: [required] `string`.  
  * `channelId`: [required] `string`.  
  * `title`: [required] `string`.  
  * `description`: [required] `string`.  
  * `thumbnails`: [required] `object`.  
    * `default`: [required] `object`.  
      * `url`: [required] `string`.  
      * `width`: [required] `number`.  
      * `height`: [required] `number`.  
    * `standard`: [required] `object`.  
      * `url`: [required] `string`.  
      * `width`: [required] `number`.  
      * `height`: [required] `number`.  
  * `channelTitle`: [required] `string`.  
  * `liveBroadcastContent`: [required] `string`.  

#### `internal-blog`
List of blog posts
Schema:
- `title`: [optional] `string`. Blog post title. 
- `excerpt`: [optional] `string`. Short summary of the blog post. 
- `image`: [optional] `string`. Blog post image. 
- `content`: [optional] `string`. Blog post content. 
- `author`: [optional] `object`.  
  * `name`: [required] `string`. Author's name. 
- `publishedAt`: [optional] `string`. Publication date in ISO format. 
- `slug`: [optional] `string`. URL-friendly version of the title. 
- `status`: [optional] `enum`. Publication status of the blog post. Values: `draft`, `published`, `archived` 
- `categories`: [optional] `string[]`.  
- `tags`: [optional] `string[]`.  

#### `internal-changelog`
Changelog items
Schema:
- `title`: [optional] `string`. Title of the release. 
- `version`: [optional] `string`. Version number. 
- `date`: [optional] `string`. Release date in ISO format. 
- `changes`: [optional] `object[]`.  
  * `type`: [required] `enum`.  Values: `added`, `changed`, `fixed`, `improved`, `deprecated`, `removed` 
  * `description`: [required] `string`.  


#### `internal-faq`
Schema representing a collection of frequently asked questions (FAQ)
Schema:
- `question`: [optional] `string`.  
- `answer`: [optional] `string`.  
- `category`: [optional] `string`.  
- `tags`: [optional] `string[]`.  
- `order`: [optional] `number`.  

#### `internal-links`
Schema representing a collection of links
Schema:
- `url`: [optional] `string`.  
- `title`: [optional] `string`.  
- `description`: [optional] `string`.  
- `icon`: [optional] `string`.  

#### `internal-recipes`
Collection of recipes
Schema:
- `title`: [optional] `string`.  
- `description`: [optional] `string`.  
- `time`: [optional] `string`.  
- `ingredients`: [optional] `object[]`.  
  * `name`: [required] `string`.  
  * `quantity`: [required] `string`.  

- `steps`: [optional] `object[]`.  
  * `title`: [required] `string`.  
  * `description`: [required] `string`.  


#### `http-json`
JSON array retrieved from an HTTP endpoint
This provider needs you to declare your schema.

###  Custom datasources
You can define your own datasources using JSON schemas. They can be used to store dynamic data that can be consumed by pages.
A datasources schema is ALWAYS an array of objects, each object representing a record in the datasource.
The schema must define the properties of the objects in the array, including their types and formats.

Example of a custom datasource:

```json
{
  "name": "my-datasource",
  "provider": "custom",
  "schema": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "title": {
          "type": "string",
          "maxLength": 100
        },
        "description": {
          "type": "string",
          "maxLength": 500
        },
      },
      "required": ["id", "title"]
    }
  }
}
```

## Datarecords (for user-submitted data)

Datarecords are used to define a destination for data submitted by users through forms & surveys.
They are defined in the `datarecords` array of the site attributes.
Datarecords can then be used in forms to submit data to the defined datarecord.

## External datarecords providers
Datarecords providers corresponds to external services that can be used to store user-submitted data.

Available providers are:
- `airtable`
- `google-sheets`
- `generic-webhook`
- `internal`

Using an external datarecord provider is as simple as defining the `provider` property in the datarecord object:

```json title="Example of a datarecord using an external provider"
{
  "name": "my-datarecord",
  "provider": "google-sheets"
}
```

## Custom datarecords

Custom datarecords are used to store user data directly to the Upstart platform.
When using a custom datarecords, you must define its schema using a JSON schema.
Datarecords schema is always an object, each object representing a record.

Example of a datarecord:

```json
{
  "name": "my-datarecord",
  "provider": "custom",
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "format": "uuid"
      },
      "name": {
        "type": "string",
        "maxLength": 100
      },
      "email": {
        "type": "string",
        "format": "email"
      }
    },
    "required": ["id", "name", "email"]
  }
}
```

## Bricks
There is a large number of available bricks. Each brick has its own set of attributes.
Bricks can share common styles properties but not necessarily with the same names.
Also note that several properties are required but have a default value.
This means that the default value will be used if the property is not set.

A brick is mainly defined by those properties (non exhaustive):
- `type`: the type of the brick (e.g. `text`, `image`, `video`, `container` etc.)
- `props`: the properties of the brick
- `mobileProps`: the optional properties of the brick for mobile devices. Merged with the `props` object. This is useful for bricks that have different properties for mobile devices
- `$children`: For container-bricks only. An array of children bricks

## Common properties

### Common styles
Those styles ids are referenced later in various bricks schemas.

#### Preset (`styles:preset`)

```json
{
  "$id": "styles:preset",
  "title": "Preset",
  "description": "Styles presets are used to maintain styles consistency across the application.",
  "default": "preset-none",
  "anyOf": [
    {
      "title": "Surface 1",
      "description": "Surface elevation 1, light background with dark text.",
      "const": "surface-1",
      "type": "string"
    },
    {
      "title": "Surface 2",
      "description": "Surface elevation 2, slightly darker background with dark text.",
      "const": "surface-2",
      "type": "string"
    },
    {
      "title": "Surface 3",
      "description": "Surface elevation 3, even darker background with dark text.",
      "const": "surface-3",
      "type": "string"
    },
    {
      "title": "Bold Primary",
      "description": "Bold display on primary-700 background.",
      "const": "bold-primary",
      "type": "string"
    },
    {
      "title": "Bold Secondary",
      "description": "Bold display on secondary-700 background.",
      "const": "bold-secondary",
      "type": "string"
    },
    {
      "title": "Bold Accent",
      "description": "Bold display on accent-700 background.",
      "const": "bold-accent",
      "type": "string"
    },
    {
      "title": "Medium Primary",
      "description": "Filled display on primary-200 background.",
      "const": "medium-primary",
      "type": "string"
    },
    {
      "title": "Medium Secondary",
      "description": "Medium display on secondary-200 background.",
      "const": "medium-secondary",
      "type": "string"
    },
    {
      "title": "Medium Accent",
      "description": "Medium display on accent-200 background.",
      "const": "medium-accent",
      "type": "string"
    },
    {
      "title": "Subtle Primary",
      "description": "Subtle display on primary-100 background and 1px border.",
      "const": "subtle-primary",
      "type": "string"
    },
    {
      "title": "Subtle Secondary",
      "description": "Subtle display on secondary-100 background and 1px border.",
      "const": "subtle-secondary",
      "type": "string"
    },
    {
      "title": "Subtle Accent",
      "description": "Subtle display on accent-100 background and 1px border.",
      "const": "subtle-accent",
      "type": "string"
    },
    {
      "title": "None",
      "description": "No background and no border. Useful for bricks inside a card or a container that already have a surface/background.",
      "const": "preset-none",
      "type": "string"
    }
  ]
}
```

#### Padding (`styles:padding`)

```json
{
  "$id": "styles:padding",
  "description": "Space between the content and the border",
  "ai:instructions": "Can be a tailwind class like `p-4` or a custom value like `p-[16px]`.",
  "type": "string",
  "title": "Padding"
}
```

#### Background (`styles:background`)

```json
{
  "$id": "styles:background",
  "type": "object",
  "properties": {
    "color": {
      "title": "Color",
      "description": "Use `bg-<variant>-<shade>`, variants being 'primary', 'secondary', 'accent' and 'neutral', and shades between 50 and 900. Can also be a gradient using 'bg-gradient-to-<direction> from-<color> to-<color>'",
      "examples": [
        "bg-primary",
        "bg-base-100",
        "bg-primary-50",
        "bg-primary-500",
        "bg-accent-900"
      ],
      "type": "string"
    },
    "image": {
      "title": "Image",
      "description": "The background image. Can be a URL or a data URI",
      "examples": [
        "https://example.com/image.png",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
      ],
      "type": "string"
    },
    "size": {
      "default": "auto",
      "ai:instructions": "Only use this when the image is set.",
      "anyOf": [
        {
          "title": "Auto",
          "const": "auto",
          "type": "string"
        },
        {
          "title": "Cover",
          "const": "cover",
          "type": "string"
        },
        {
          "title": "Contain",
          "const": "contain",
          "type": "string"
        }
      ]
    },
    "repeat": {
      "default": "no-repeat",
      "ai:instructions": "Only use this when the image is set.",
      "anyOf": [
        {
          "title": "No repeat",
          "const": "no-repeat",
          "type": "string"
        },
        {
          "title": "Repeat",
          "const": "repeat",
          "type": "string"
        },
        {
          "title": "Repeat horizontally",
          "const": "repeat-x",
          "type": "string"
        },
        {
          "title": "Repeat vertically",
          "const": "repeat-y",
          "type": "string"
        },
        {
          "title": "Space",
          "const": "space",
          "type": "string"
        },
        {
          "title": "Round",
          "const": "round",
          "type": "string"
        }
      ]
    }
  },
  "title": "Background"
}
```

#### Background color (`styles:backgroundColor`)

```json
{
  "$id": "styles:backgroundColor",
  "ai:instructions": "Can be set to transparent, hex/rgb/rgba color, or classes like `bg-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 100 and 900. Use bg-<variant>-<shade> classes as much as possible.",
  "type": "string",
  "title": "Background color"
}
```

#### Text color (`styles:color`)

```json
{
  "$id": "styles:color",
  "ai:instructions": "hex/rgb/rgba color or classes like `text-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
  "type": "string",
  "title": "Text color"
}
```

#### Border (`styles:border`)

```json
{
  "title": "Border",
  "$id": "styles:border",
  "type": "object",
  "properties": {
    "rounding": {
      "type": "string",
      "enum": [
        "rounded-auto",
        "rounded-none",
        "rounded-sm",
        "rounded-md",
        "rounded-lg",
        "rounded-xl",
        "rounded-2xl",
        "rounded-3xl",
        "rounded-full"
      ],
      "title": "Corner rounding",
      "enumNames": [
        "Auto",
        "None",
        "Small",
        "Medium",
        "Large",
        "Extra large",
        "2xl",
        "3xl",
        "Full"
      ]
    },
    "width": {
      "type": "string",
      "enum": [
        "border-0",
        "border",
        "border-2",
        "border-4",
        "border-8"
      ],
      "title": "Width",
      "enumNames": [
        "None",
        "S",
        "M",
        "L",
        "XL"
      ],
      "ai:instructions": "Don't specify width if you want no border."
    },
    "color": {
      "title": "Color",
      "ai:instructions": "Can be set to transparent, hex/rgb/rgba color, or classes like `border-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 50 and 900",
      "type": "string"
    },
    "sides": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "border-l",
          "border-t",
          "border-r",
          "border-b"
        ],
        "title": "Sides",
        "enumNames": [
          "Left",
          "Top",
          "Right",
          "Bottom"
        ],
        "description": "The specific sides where to apply the border. Not specifying sides will apply the border to all sides.",
        "ai:instructions": "Use this to apply the border to specific sides. Not specifying sides will apply the border to all sides."
      }
    },
    "style": {
      "type": "string",
      "enum": [
        "border-solid",
        "border-dashed",
        "border-dotted"
      ],
      "title": "Style",
      "description": "The brick border style",
      "enumNames": [
        "Solid",
        "Dashed",
        "Dotted"
      ],
      "ai:instructions": "Use only when width is different than border-0."
    }
  }
}
```

#### Layout (`undefined`)

```json
{
  "title": "Layout",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "flex",
        "grid"
      ],
      "enumNames": [
        "Flex",
        "Grid"
      ],
      "title": "Layout type",
      "description": "Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid"
    },
    "gap": {
      "title": "Gap",
      "description": "Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
      "type": "string"
    },
    "direction": {
      "type": "string",
      "enum": [
        "flex-row",
        "flex-col"
      ],
      "enumNames": [
        "Row",
        "Column"
      ],
      "title": "Direction",
      "description": "The direction of the container. Only applies to flex layout"
    },
    "columns": {
      "title": "Columns",
      "description": "Number of columns. Only applies to grid layout.",
      "minimum": 1,
      "maximum": 16,
      "type": "number"
    },
    "wrap": {
      "title": "Wrap",
      "description": "Wrap items.",
      "ai:instructions": "Only applies to flex layout",
      "type": "boolean"
    },
    "fillSpace": {
      "title": "Fill space",
      "description": "Makes items of the container fill the available space.",
      "ai:instructions": "Only applies to flex layout",
      "type": "boolean"
    },
    "justifyContent": {
      "type": "string",
      "enum": [
        "justify-start",
        "justify-center",
        "justify-end",
        "justify-between",
        "justify-around",
        "justify-evenly",
        "justify-stretch"
      ],
      "enumNames": [
        "Start",
        "Center",
        "End",
        "Space between",
        "Space around",
        "Evenly distributed",
        "Stretch"
      ],
      "title": "Justify",
      "description": "Justify content along the main axis (horizontal for row, vertical for column).",
      "ai:instructions": "Only applies to flex layout"
    },
    "alignItems": {
      "title": "Alignment",
      "description": "Align items along the cross axis (vertical for row, horizontal for column).",
      "ai:instructions": "Only applies to flex layout",
      "anyOf": [
        {
          "title": "Start",
          "const": "items-start",
          "type": "string"
        },
        {
          "title": "Center",
          "const": "items-center",
          "type": "string"
        },
        {
          "title": "End",
          "const": "items-end",
          "type": "string"
        },
        {
          "title": "Stretch",
          "const": "items-stretch",
          "type": "string"
        }
      ]
    }
  },
  "required": [
    "type"
  ]
}
```

#### Effects (`styles:effects`)

```json
{
  "title": "Effects",
  "default": {},
  "$id": "styles:effects",
  "type": "object",
  "properties": {
    "opacity": {
      "minimum": 0.1,
      "maximum": 1,
      "default": 1,
      "multipleOf": 0.1,
      "type": "number",
      "title": "Opacity"
    },
    "shadow": {
      "type": "string",
      "enum": [
        "shadow-none",
        "shadow-sm",
        "shadow-md",
        "shadow-lg",
        "shadow-xl",
        "shadow-2xl"
      ],
      "title": "Shadow",
      "default": "shadow-none",
      "enumNames": [
        "None",
        "Small",
        "Medium",
        "Large",
        "Extra large",
        "Extra large (2x)"
      ]
    }
  }
}
```

#### Image (`assets:image`)

```json
{
  "$id": "assets:image",
  "default": {
    "alt": "Image",
    "fit": "object-cover",
    "position": "object-center"
  },
  "type": "object",
  "properties": {
    "src": {
      "title": "Image",
      "description": "Image URL. Can be a link to an image or a data URI",
      "type": "string"
    },
    "alt": {
      "title": "Alternate Text",
      "description": "Alternative text for the image. Recommended for screen readers and SEO",
      "type": "string"
    },
    "fit": {
      "title": "Fit",
      "description": "How the image should be resized to fit its container",
      "anyOf": [
        {
          "title": "None",
          "const": "object-none",
          "type": "string"
        },
        {
          "title": "Contain",
          "const": "object-contain",
          "type": "string"
        },
        {
          "title": "Cover",
          "const": "object-cover",
          "type": "string"
        },
        {
          "title": "Fill",
          "const": "object-fill",
          "type": "string"
        },
        {
          "title": "Scale down",
          "const": "object-scale-down",
          "type": "string"
        }
      ]
    },
    "position": {
      "title": "Position",
      "description": "The position of the image inside its container",
      "anyOf": [
        {
          "title": "Top",
          "const": "object-top",
          "type": "string"
        },
        {
          "title": "Center",
          "const": "object-center",
          "type": "string"
        },
        {
          "title": "Bottom",
          "const": "object-bottom",
          "type": "string"
        },
        {
          "title": "Left",
          "const": "object-left",
          "type": "string"
        },
        {
          "title": "Right",
          "const": "object-right",
          "type": "string"
        },
        {
          "title": "Top left",
          "const": "object-left-top",
          "type": "string"
        },
        {
          "title": "Top right",
          "const": "object-right-top",
          "type": "string"
        },
        {
          "title": "Bottom left",
          "const": "object-left-bottom",
          "type": "string"
        },
        {
          "title": "Bottom right",
          "const": "object-right-bottom",
          "type": "string"
        }
      ]
    }
  },
  "required": [
    "src"
  ],
  "title": "Image"
}
```

#### Text (`content:text`)

```json
{
  "$id": "content:text",
  "default": "My text",
  "type": "string",
  "title": "Text",
  "description": "Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>."
}
```



### Preset
Styles presets are used to maintain styles consistency across the application.
Available presets:

- `surface-1`: Surface 1. Surface elevation 1, light background with dark text.
- `surface-2`: Surface 2. Surface elevation 2, slightly darker background with dark text.
- `surface-3`: Surface 3. Surface elevation 3, even darker background with dark text.
- `bold-primary`: Bold Primary. Bold display on primary-700 background.
- `bold-secondary`: Bold Secondary. Bold display on secondary-700 background.
- `bold-accent`: Bold Accent. Bold display on accent-700 background.
- `medium-primary`: Medium Primary. Filled display on primary-200 background.
- `medium-secondary`: Medium Secondary. Medium display on secondary-200 background.
- `medium-accent`: Medium Accent. Medium display on accent-200 background.
- `subtle-primary`: Subtle Primary. Subtle display on primary-100 background and 1px border.
- `subtle-secondary`: Subtle Secondary. Subtle display on secondary-100 background and 1px border.
- `subtle-accent`: Subtle Accent. Subtle display on accent-100 background and 1px border.
- `preset-none`: None. No background and no border. Useful for bricks inside a card or a container that already have a surface/background.


### Variants
Some bricks have a prop called `variants` that can be used to change the look and/or layout of the brick.
You can specify multiple variants if they don't share the same prefix.
For example, you can use `props: { variants: ["with-logo-left", "align-h"] ... }` to apply both variants to the brick because they don't share the same prefix.

## Available bricks
- Text (`text`): Text with formatting options
- Hero (`hero`): A big textual element for home pages
- Image (`image`): An image brick
- Video (`video`): Youtube video
- Card (`card`): A multi-purpose card that can have a title, subtitle, image, and content
- Map (`map`): A map element showing a location
- Form (`form`): A form element
- Sidebar (`sidebar`): A sidebard element
- Gallery (`images-gallery`): An image collection
- Carousel (`carousel`): A carousel element
- Navbar (`navbar`): A navigation bar with logo and navigation
- Footer (`footer`): A footer with links and an optional logo
- Button (`button`): A button with text and optional icon
- Icon (`icon`): An icon with optional text
- Social links (`social-links`): A list of social media links
- Container (`container`): A container that can hold other bricks and align them horizontally or vertically
- Divider (`divider`): A horizontal or vertical divider
- Testimonials (`testimonials`): Display testimonials from users
- Timeline (`timeline`): A timeline element for showing chronological events
- Accordion (`accordion`): An accordion/collapse element for expandable content

### Text Brick (`text`)

Text with formatting options
Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.


#### Text Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `content`: [required] See $ref 'content:text'.  
- `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
- `color`: [optional] See $ref 'styles:color'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `border`: [optional] See $ref 'styles:border'.  
- `effects`: [optional] See $ref 'styles:effects'.  

#### Text Examples

##### Example: Welcome paragraph with emphasis

```json
{
  "id": "example-1",
  "type": "text",
  "props": {
    "content": "Welcome to our platform! We're <strong>excited</strong> to have you here. Our mission is to <em>transform</em> the way you work with cutting-edge technology and <a href='/features'>innovative features</a>.",
    "padding": "p-16"
  }
}
```

##### Example: Feature list with HTML formatting

```json
{
  "id": "example-2",
  "type": "text",
  "props": {
    "content": "<h3>Key Features</h3><ul><li><strong>Advanced Analytics</strong> - Real-time data insights</li><li><strong>Cloud Integration</strong> - Seamless connectivity</li><li><strong>24/7 Support</strong> - Always here to help</li></ul>",
    "backgroundColor": "#f8fafc",
    "padding": "p-8"
  }
}
```

##### Example: Quote block with styling

```json
{
  "id": "example-3",
  "type": "text",
  "props": {
    "content": "<p style='text-align: center'><em>\"Innovation distinguishes between a leader and a follower.\"</em><br><strong>- Steve Jobs</strong></p>",
    "backgroundColor": "#1e293b",
    "color": "#f1f5f9",
    "padding": "p-8",
    "effects": {
      "textShadow": "text-shadow-md"
    }
  }
}
```

##### Example: Multi-paragraph article content

```json
{
  "id": "example-4",
  "type": "text",
  "props": {
    "content": "<p>The future of web development is rapidly evolving with new technologies and frameworks emerging every year. <strong>Modern developers</strong> need to stay current with trends while maintaining focus on <em>user experience</em> and performance.</p><p>Our platform provides the tools and resources you need to build <a href='/docs'>exceptional web applications</a> that scale with your business needs.</p><p>Join thousands of developers who trust our solutions for their most critical projects.</p>",
    "padding": "p-8"
  }
}
```

##### Example: Call-to-action text with bright styling

```json
{
  "id": "example-5",
  "type": "text",
  "props": {
    "content": "<p style='text-align: center'><strong>Ready to Get Started?</strong><br>Join over <span style='color: #ef4444'>50,000</span> satisfied customers and transform your business today!</p><p style='text-align: center'><a href='/signup'>Sign up now</a> and get your first month <em>absolutely free</em>.</p>",
    "backgroundColor": "#fef3c7",
    "color": "#92400e"
  }
}
```

##### Example: Simple heading with subtle background

```json
{
  "id": "example-6",
  "type": "text",
  "props": {
    "content": "<h2>About Our Company</h2><p>We've been serving customers since 2010, building trust through quality products and exceptional service.</p>",
    "backgroundColor": "#f0f9ff"
  }
}
```

##### Example: Technical documentation snippet

```json
{
  "id": "example-7",
  "type": "text",
  "props": {
    "content": "<h4>API Configuration</h4><p>To get started with our API, you'll need to:</p><ol><li>Create an account and <strong>generate an API key</strong></li><li>Install the SDK: <code>npm install @company/sdk</code></li><li>Initialize with your credentials</li></ol><p>For detailed instructions, visit our <a href='/docs/api'>API documentation</a>.</p>",
    "backgroundColor": "#f8fafc",
    "padding": "p-8"
  }
}
```

##### Example: Team introduction with formatting

```json
{
  "id": "example-8",
  "type": "text",
  "props": {
    "content": "<p style='text-align: center'><strong>Meet Our Team</strong></p><p>Our diverse team of experts brings together decades of experience in technology, design, and business strategy. We're passionate about <em>creating solutions</em> that make a real difference.</p><p><a href='/team'>Learn more about our team</a> and the values that drive us forward.</p>",
    "padding": "p-8",
    "color": "#374151"
  }
}
```

##### Example: Warning notice with dark theme

```json
{
  "id": "example-9",
  "type": "text",
  "props": {
    "content": "<p><strong>⚠️ Important Notice:</strong><br>Scheduled maintenance will occur on <em>Sunday, March 15th</em> from 2:00 AM to 6:00 AM UTC.</p><p>During this time, some features may be temporarily unavailable. We apologize for any inconvenience.</p>",
    "backgroundColor": "#dc2626",
    "color": "#fef2f2",
    "padding": "p-8"
  }
}
```

##### Example: Success message with green theme

```json
{
  "id": "example-10",
  "type": "text",
  "props": {
    "content": "<p style='text-align: center'><strong>✅ Success!</strong><br>Your account has been created successfully.</p><p style='text-align: center'>Check your email for verification instructions and <a href='/dashboard' style='color: #065f46'>start exploring</a> your new dashboard.</p>",
    "backgroundColor": "#d1fae5",
    "padding": "p-8"
  }
}
```

### Hero Brick (`hero`)

A big textual element for home pages
This hero element is a large text element that can be used to display a title and an optional tagline.
      It is typically used on home pages to grab the user's attention.

#### Hero Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `content`: [required] See $ref 'content:text'.  Default: `"I'm a big text"`. 
- `tagline`: [optional] See $ref 'content:text'.  Default: `"I'm a tagline"`. 
- `background`: [optional] See $ref 'styles:background'.  
- `color`: [optional] See $ref 'styles:color'.  
- `effects`: [optional] See $ref 'styles:effects'.  
- `align`: [optional] See $ref 'styles:basicAlign'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `border`: [optional] See $ref 'styles:border'.  

#### Hero Examples

##### Example: Simple welcome hero with blue background

```json
{
  "id": "example-1",
  "type": "hero",
  "props": {
    "preset": "bold-primary",
    "content": "Welcome to Our Platform",
    "tagline": "The future of productivity starts here",
    "align": {
      "horizontal": "justify-center"
    },
    "padding": "p-8"
  }
}
```

##### Example: Startup hero with gradient background

```json
{
  "id": "example-2",
  "type": "hero",
  "props": {
    "preset": "bold-secondary",
    "content": "Build Something Amazing",
    "tagline": "Turn your ideas into reality with our cutting-edge tools",
    "align": {
      "horizontal": "justify-center"
    },
    "padding": "p-16"
  }
}
```

##### Example: Construction company hero with bold presence

```json
{
  "id": "example-3",
  "type": "hero",
  "props": {
    "preset": "bold-primary",
    "content": "Building Tomorrow Today",
    "tagline": "Quality construction services for residential and commercial projects",
    "padding": "p-16"
  }
}
```

##### Example: Fashion brand hero with modern appeal

```json
{
  "id": "example-4",
  "type": "hero",
  "props": {
    "preset": "bold-accent",
    "content": "Express Your Style",
    "tagline": "Contemporary fashion that speaks to your individuality",
    "align": {
      "horizontal": "justify-center",
      "vertical": "items-start"
    },
    "padding": "p-16",
    "effects": {
      "textShadow": "text-shadow-sm"
    }
  }
}
```

##### Example: Law firm hero with authoritative tone

```json
{
  "id": "example-5",
  "type": "hero",
  "props": {
    "preset": "bold-secondary",
    "content": "Justice You Can Trust",
    "tagline": "Experienced legal representation for individuals and businesses",
    "padding": "p-8",
    "border": {
      "width": "border-2",
      "color": "border-gray-800",
      "rounding": "rounded-lg"
    }
  }
}
```

##### Example: Photography studio hero with artistic flair

```json
{
  "id": "example-6",
  "type": "hero",
  "props": {
    "preset": "surface-1",
    "content": "Capturing Life's Moments",
    "tagline": "Professional photography services for weddings, portraits, and events",
    "border": {
      "rounding": "rounded-lg"
    }
  }
}
```

### Image Brick (`image`)

An image brick

#### Image Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `image`: [required] See $ref 'assets:image'.  
- `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
- `border`: [optional] See $ref 'styles:border'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 
- `blurHash`: [optional] `string`. A placeholder for the image while it is loading. Use a blur hash string.. 
- `author`: [optional] `object`.  
  * `name`: [required] `string`. Image author. Use this to give credit to the author. 
  * `url`: [required] `string`. Image author URL. Use this to give credit to the author. 
- `provider`: [optional] `string`. Image provider. Use this to give credit to the author. 

#### Image Examples

##### Example: Hero landscape image with shadow

```json
{
  "id": "example-1",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/800x400.png?text=Hero+Landscape",
      "alt": "Beautiful landscape view for hero section"
    },
    "shadow": "shadow-lg"
  }
}
```

##### Example: Team member profile photo

```json
{
  "id": "example-2",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/300x300.png?text=Profile+Photo",
      "alt": "Team member profile photo"
    },
    "shadow": "shadow-md",
    "border": {
      "rounding": "rounded-full"
    }
  }
}
```

##### Example: Product showcase image

```json
{
  "id": "example-3",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/400x400.png?text=Product+Image",
      "alt": "Premium product showcase"
    },
    "shadow": "shadow-sm"
  }
}
```

##### Example: Blog article featured image

```json
{
  "id": "example-4",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/600x300.png?text=Article+Featured",
      "alt": "Featured image for blog article"
    },
    "author": {
      "name": "John Photographer",
      "url": "https://example.com/john"
    },
    "provider": "unsplash"
  }
}
```

##### Example: Gallery thumbnail with hover effect

```json
{
  "id": "example-5",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/250x250.png?text=Gallery+Thumb",
      "alt": "Gallery thumbnail image"
    },
    "shadow": "shadow-md"
  }
}
```

##### Example: Logo image with padding

```json
{
  "id": "example-6",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/200x80.png?text=Company+Logo",
      "alt": "Company logo"
    },
    "padding": "p-8"
  }
}
```

##### Example: Testimonial customer photo

```json
{
  "id": "example-7",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/120x120.png?text=Customer",
      "alt": "Happy customer testimonial photo"
    },
    "border": {
      "rounding": "rounded-xl"
    },
    "shadow": "shadow-lg",
    "padding": "p-2",
    "backgroundColor": "#ffffff"
  }
}
```

##### Example: Event banner image

```json
{
  "id": "example-8",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/800x200.png?text=Event+Banner",
      "alt": "Annual conference event banner"
    },
    "border": {
      "rounding": "rounded-lg"
    },
    "shadow": "shadow-xl",
    "author": {
      "name": "Event Photographer",
      "url": "https://example.com/photographer"
    },
    "provider": "pexels"
  }
}
```

##### Example: Illustration with background

```json
{
  "id": "example-9",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/150x150.png?text=Blabla+Feature",
      "alt": "Feature illustration"
    },
    "backgroundColor": "#f0f9ff",
    "padding": "p-8",
    "border": {
      "rounding": "rounded-lg"
    },
    "shadow": "shadow-sm"
  }
}
```

##### Example: Image with blurHash

```json
{
  "id": "example-10",
  "type": "image",
  "props": {
    "image": {
      "src": "https://via.placeholder.com/300x200.png?text=Card+Image",
      "alt": "My image"
    },
    "border": {
      "rounding": "rounded-lg"
    },
    "shadow": "shadow-md",
    "blurHash": "L6PZfSi_.AyE_3t7t7R**0o#DgR4"
  }
}
```

### Video Brick (`video`)

Youtube video

#### Video Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `url`: [required] `string`. URL of the video to embed. It can be a YouTube link or an embed link.. 

#### Video Examples

##### Example: A YouTube video

```json
{
  "id": "example-1",
  "type": "video",
  "props": {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
}
```

##### Example: An embedded YouTube video

```json
{
  "id": "example-2",
  "type": "video",
  "props": {
    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
}
```

##### Example: A Vimeo video

```json
{
  "id": "example-3",
  "type": "video",
  "props": {
    "url": "https://vimeo.com/123456789"
  }
}
```

### Card Brick (`card`)

A multi-purpose card that can have a title, subtitle, image, and content

#### Card Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `variants`: [required] `array`.  Values: `image-first`, `image-last`, `image-overlay`, `image-left-side`, `image-right-side`, `centered`, `large-padding` 
- `cardTitle`: [optional] `object`.  
  * `content`: [required] See $ref 'content:text'.  
  * `padding`: [optional] See $ref 'styles:padding'.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
- `cardImage`: [optional] `object`.  
  * `image`: [required] See $ref 'assets:image'.  
- `cardBody`: [optional] `object`.  
  * `content`: [required] See $ref 'content:text'.  
  * `padding`: [optional] See $ref 'styles:padding'.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  

#### Card Examples

##### Example: A simple card with a title and content

```json
{
  "id": "example-1",
  "type": "card",
  "props": {
    "variants": [
      "image-first"
    ],
    "preset": "bold-primary",
    "cardTitle": {
      "content": "Card Title",
      "padding": "p-4"
    },
    "cardBody": {
      "content": "This is the body of the card."
    }
  }
}
```

##### Example: Card with image and overlay text

```json
{
  "id": "example-2",
  "type": "card",
  "props": {
    "variants": [
      "image-overlay",
      "centered"
    ],
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/400x300",
        "alt": "Placeholder image"
      }
    },
    "cardTitle": {
      "content": "Overlay Title",
      "padding": "p-8",
      "backgroundColor": "rgba(0, 0, 0, 0.7)"
    },
    "cardBody": {
      "content": "Beautiful overlay content with semi-transparent background.",
      "padding": "p-4",
      "backgroundColor": "rgba(255, 255, 255, 0.9)"
    }
  }
}
```

##### Example: Product card with image on the left

```json
{
  "id": "example-3",
  "type": "card",
  "props": {
    "variants": [
      "image-left-side"
    ],
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/200x200",
        "alt": "Product image"
      }
    },
    "cardTitle": {
      "content": "Premium Headphones",
      "padding": "p-4"
    },
    "cardBody": {
      "content": "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      "padding": "p-4"
    }
  }
}
```

##### Example: Feature card with large padding and background

```json
{
  "id": "example-4",
  "type": "card",
  "props": {
    "variants": [
      "large-padding",
      "centered"
    ],
    "cardTitle": {
      "content": "Key Feature",
      "padding": "p-8",
      "backgroundColor": "#f8f9fa"
    },
    "cardBody": {
      "content": "This feature provides exceptional value and enhances user experience significantly.",
      "padding": "p-8",
      "backgroundColor": "#ffffff"
    }
  }
}
```

##### Example: Blog post card with image at the bottom

```json
{
  "id": "example-5",
  "type": "card",
  "props": {
    "variants": [
      "image-last"
    ],
    "cardTitle": {
      "content": "The Future of Technology",
      "padding": "p-4"
    },
    "cardBody": {
      "content": "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
      "padding": "p-4"
    },
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/400x200",
        "alt": "Technology concept"
      }
    }
  }
}
```

##### Example: Testimonial card with right-side image

```json
{
  "id": "example-6",
  "type": "card",
  "props": {
    "variants": [
      "image-right-side"
    ],
    "cardTitle": {
      "content": "Customer Review",
      "padding": "p-4",
      "backgroundColor": "#e3f2fd"
    },
    "cardBody": {
      "content": "\"This product exceeded my expectations. The quality is outstanding and the customer service is top-notch!\"",
      "padding": "p-4"
    },
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/150x150",
        "alt": "Customer photo"
      }
    }
  }
}
```

##### Example: Minimal centered card without image

```json
{
  "id": "example-7",
  "type": "card",
  "props": {
    "variants": [
      "centered"
    ],
    "cardTitle": {
      "content": "Simple Announcement",
      "padding": "p-4"
    },
    "cardBody": {
      "content": "Important updates will be posted here regularly.",
      "padding": "p-4"
    }
  }
}
```

##### Example: Event card with multiple variants

```json
{
  "id": "example-8",
  "type": "card",
  "props": {
    "variants": [
      "image-first",
      "large-padding",
      "centered"
    ],
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/400x250",
        "alt": "Event venue"
      }
    },
    "cardTitle": {
      "content": "Annual Conference 2025",
      "padding": "p-8",
      "backgroundColor": "#1976d2"
    },
    "cardBody": {
      "content": "Join us for three days of inspiring talks, networking opportunities, and hands-on workshops.",
      "padding": "p-8"
    }
  }
}
```

##### Example: News article card with compact layout

```json
{
  "id": "example-9",
  "type": "card",
  "props": {
    "variants": [
      "image-left-side"
    ],
    "cardImage": {
      "image": {
        "src": "https://via.placeholder.com/120x120",
        "alt": "News thumbnail"
      }
    },
    "cardTitle": {
      "content": "Breaking News Update",
      "padding": "p-2"
    },
    "cardBody": {
      "content": "Latest developments in the ongoing story with expert analysis and community reactions.",
      "padding": "p-2"
    }
  }
}
```

##### Example: Call-to-action card with prominent styling

```json
{
  "id": "example-10",
  "type": "card",
  "props": {
    "variants": [
      "centered",
      "large-padding"
    ],
    "cardTitle": {
      "content": "Get Started Today",
      "padding": "p-8",
      "backgroundColor": "#4caf50"
    },
    "cardBody": {
      "content": "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
      "padding": "p-8",
      "backgroundColor": "#f1f8e9"
    }
  }
}
```

### Map Brick (`map`)

A map element showing a location
This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.

#### Map Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `location`: [required] `object`. The location to display on the map. 
  * `lat`: [required] `number`.  
  * `lng`: [required] `number`.  
  * `tooltip`: [optional] `string`.  
- `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
- `border`: [optional] See $ref 'styles:border'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 

#### Map Examples

##### Example: Map showing a specific location

```json
{
  "id": "example-1",
  "type": "map",
  "props": {
    "location": {
      "lat": 37.7749,
      "lng": -122.4194,
      "tooltip": "San Francisco, CA"
    }
  }
}
```

##### Example: Map with custom styles

```json
{
  "id": "example-2",
  "type": "map",
  "props": {
    "location": {
      "lat": 40.7128,
      "lng": -74.006,
      "tooltip": "New York, NY"
    },
    "backgroundColor": "bg-gray-100",
    "border": {
      "color": "border-gray-300",
      "width": "border"
    },
    "padding": "p-16",
    "shadow": "shadow-lg"
  }
}
```

### Form Brick (`form`)

A form element
The form brick automatically renders form fields based on the datarecord id provided in the props.
There is no need to define the form fields manually and the form does not accept any children.

#### Form Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `title`: [optional] `string`.  The title of the form. Default: `"My form"`. 
- `intro`: [optional] `string`.  The intro text of the form. 
- `datarecordId`: [required] `string`.  
- `align`: [optional] `enum`. The alignment of the form fields. Default is vertical. Only use horizotal for very short forms.. Default: `"vertical"`. Values: `vertical`, `horizontal` 

#### Form Examples

##### Example: Basic contact form

```json
{
  "id": "example-1",
  "type": "form",
  "props": {
    "title": "Contact Us",
    "intro": "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    "align": "vertical",
    "datarecordId": "contacts"
  }
}
```

##### Example: User registration form

```json
{
  "id": "example-2",
  "type": "form",
  "props": {
    "title": "Create Account",
    "intro": "Join our platform and start your journey today.",
    "align": "vertical",
    "datarecordId": "user-registration"
  }
}
```

##### Example: Newsletter subscription form (horizontal)

```json
{
  "id": "example-3",
  "type": "form",
  "props": {
    "title": "Stay Updated",
    "intro": "Subscribe to our newsletter for the latest updates and exclusive content.",
    "align": "horizontal",
    "datarecordId": "newsletter-subscription"
  }
}
```

##### Example: Event registration form

```json
{
  "id": "example-4",
  "type": "form",
  "props": {
    "title": "Conference Registration",
    "intro": "Register for the Annual Tech Conference 2025. Early bird pricing ends soon!",
    "align": "vertical",
    "datarecordId": "event-registration"
  }
}
```

##### Example: Job application form

```json
{
  "id": "example-5",
  "type": "form",
  "props": {
    "title": "Apply for Position",
    "intro": "We're excited to learn more about you! Please fill out this application form completely.",
    "align": "vertical",
    "datarecordId": "job-application"
  }
}
```

##### Example: Customer feedback form

```json
{
  "id": "example-6",
  "type": "form",
  "props": {
    "title": "Share Your Feedback",
    "intro": "Your opinion matters to us. Help us improve our products and services.",
    "align": "vertical",
    "datarecordId": "customer-feedback"
  }
}
```

### Sidebar Brick (`sidebar`)

A sidebard element
This brick should be used on most sites/pages for navigation. By deault, it will display links
    to the main pages of the site. You can customize the links by using the 'navigation.navItems' prop.

#### Sidebar Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `container`: [optional] `object`.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
  * `border`: [optional] See $ref 'styles:border'.  
  * `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 
  * `fixedPositioned`: [optional] `boolean`.  Default: `false`. 
- `navigation`: [optional] `object`.  
  * `datasource`: [optional] `object`. Reference to a data source. Only used for dynamic websites. 
    * `id`: [required] `string`.  
    * `mapping`: [required] `object`. Mapping of data source fields to brick props. 
    * `filters`: [optional] `object`. Filter data source records. 
    * `sort`: [optional] `object`. Sort data source records. 
    * `limit`: [optional] `number`. Limit the number of records to fetch. 
    * `offset`: [optional] `number`. Offset the records to fetch. 
  * `navItems`: [optional] `object[]`.  Default: `[]`. 
    * `urlOrPageId`: [required] `enum`.  Values: `undefined`, `undefined` 
    * `label`: [required] `string`.  


#### Sidebar Examples

##### Example: Standard sidebar with navigation links base on site pages

```json
{
  "id": "example-1",
  "type": "sidebar",
  "props": {}
}
```

##### Example: Sidebar with specified navigation links

```json
{
  "id": "example-2",
  "type": "sidebar",
  "props": {
    "container": {
      "backgroundColor": "#f0f0f0"
    },
    "navigation": {
      "navItems": [
        {
          "urlOrPageId": "https://google.com",
          "label": "Google"
        },
        {
          "urlOrPageId": "https://bing.com",
          "label": "Bing"
        }
      ]
    }
  }
}
```

### Gallery Brick (`images-gallery`)

An image collection
This brick should mostly be used for image galleries and collections.

#### Gallery Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `datasource`: [optional] `object`. Reference to a data source. Only used for dynamic websites. 
  * `id`: [required] `string`.  
  * `mapping`: [required] `object`. Mapping of data source fields to brick props. 
  * `filters`: [optional] `object`. Filter data source records. 
  * `sort`: [optional] `object`. Sort data source records. 
  * `limit`: [optional] `number`. Limit the number of records to fetch. 
  * `offset`: [optional] `number`. Offset the records to fetch. 
- `staticImages`: [optional] `object[]`.  Default: `[]`. 
  * `src`: [required] `string`.  
  * `legend`: [required] `string`.  

- `styles`: [required] `object`.  
  * `layout`: [required] See $ref 'styles:containerLayout'. Settings for the layout of the container.. 

#### Gallery Examples

##### Example: Product portfolio gallery (3-column grid)

```json
{
  "id": "example-1",
  "type": "images-gallery",
  "props": {
    "styles": {
      "layout": {
        "type": "grid",
        "columns": 3,
        "gap": "gap-4"
      }
    },
    "staticImages": [
      {
        "src": "https://via.placeholder.com/400x400.png?text=Product+1",
        "legend": "Premium wireless headphones"
      },
      {
        "src": "https://via.placeholder.com/400x400.png?text=Product+2",
        "legend": "Bluetooth speaker"
      },
      {
        "src": "https://via.placeholder.com/400x400.png?text=Product+3",
        "legend": "Smart fitness tracker"
      },
      {
        "src": "https://via.placeholder.com/400x400.png?text=Product+4",
        "legend": "Wireless charging pad"
      }
    ]
  }
}
```

##### Example: Team photos gallery (4-column grid)

```json
{
  "id": "example-2",
  "type": "images-gallery",
  "props": {
    "styles": {
      "layout": {
        "type": "grid",
        "gap": "gap-8"
      }
    },
    "staticImages": [
      {
        "src": "https://via.placeholder.com/300x300.png?text=CEO",
        "legend": "Sarah Johnson - Chief Executive Officer"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=CTO",
        "legend": "Mike Chen - Chief Technology Officer"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=Design",
        "legend": "Emily Rodriguez - Head of Design"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=Marketing",
        "legend": "David Park - Marketing Director"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=Sales",
        "legend": "Lisa Wong - Sales Manager"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=Support",
        "legend": "Alex Thompson - Customer Support Lead"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=Dev",
        "legend": "Carlos Martinez - Senior Developer"
      },
      {
        "src": "https://via.placeholder.com/300x300.png?text=HR",
        "legend": "Jennifer Adams - HR Specialist"
      }
    ]
  }
}
```

##### Example: Project showcase (2-column grid with larger spacing)

```json
{
  "id": "example-3",
  "type": "images-gallery",
  "props": {
    "styles": {
      "layout": {
        "type": "grid",
        "columns": 2,
        "gap": "gap-8"
      }
    },
    "staticImages": [
      {
        "src": "https://via.placeholder.com/600x400.png?text=Website+Redesign",
        "legend": "Modern e-commerce website redesign project"
      },
      {
        "src": "https://via.placeholder.com/600x400.png?text=Mobile+App",
        "legend": "iOS and Android mobile application"
      },
      {
        "src": "https://via.placeholder.com/600x400.png?text=Brand+Identity",
        "legend": "Complete brand identity design package"
      },
      {
        "src": "https://via.placeholder.com/600x400.png?text=Dashboard+UI",
        "legend": "Analytics dashboard user interface"
      }
    ]
  }
}
```

##### Example: Event photos (horizontal flex layout)

```json
{
  "id": "example-4",
  "type": "images-gallery",
  "props": {
    "styles": {
      "layout": {
        "type": "flex",
        "direction": "flex-row",
        "wrap": true,
        "gap": "gap-4"
      }
    },
    "staticImages": [
      {
        "src": "https://via.placeholder.com/250x180.png?text=Opening",
        "legend": "Conference opening ceremony"
      },
      {
        "src": "https://via.placeholder.com/250x180.png?text=Keynote",
        "legend": "Keynote presentation"
      },
      {
        "src": "https://via.placeholder.com/250x180.png?text=Workshop",
        "legend": "Technical workshop session"
      },
      {
        "src": "https://via.placeholder.com/250x180.png?text=Networking",
        "legend": "Networking lunch break"
      },
      {
        "src": "https://via.placeholder.com/250x180.png?text=Panel",
        "legend": "Expert panel discussion"
      },
      {
        "src": "https://via.placeholder.com/250x180.png?text=Awards",
        "legend": "Awards ceremony"
      }
    ]
  }
}
```

### Carousel Brick (`carousel`)

A carousel element

#### Carousel Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `variants`: [required] `array`.  Values: `pager-arrows`, `pager-numbers`, `pager-dots` 
- `background`: [optional] See $ref 'styles:background'.  
- `border`: [optional] See $ref 'styles:border'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `effects`: [optional] See $ref 'styles:effects'.  
- `$childrenType`: [optional] `string`. Type of the child bricks that will be created when container is dynamic.. 
- `$children`: [required] `array`. List of nested bricks. Default: `[]`. 

#### Carousel Examples

##### Example: An image carousel with pager arrows

```json
{
  "id": "example-1",
  "type": "carousel",
  "props": {
    "variants": [
      "pager-arrows"
    ],
    "$children": [
      {
        "type": "image",
        "props": {
          "src": "https://via.placeholder.com/300x200.png?text=Image+1"
        }
      },
      {
        "type": "image",
        "props": {
          "src": "https://via.placeholder.com/300x200.png?text=Image+2"
        }
      },
      {
        "type": "image",
        "props": {
          "src": "https://via.placeholder.com/300x200.png?text=Image+3"
        }
      }
    ]
  }
}
```

##### Example: A carousel of text slides with numbered pager

```json
{
  "id": "example-2",
  "type": "carousel",
  "props": {
    "variants": [
      "pager-numbers"
    ],
    "$children": [
      {
        "type": "text",
        "props": {
          "content": "Slide 1",
          "preset": "bold-primary"
        }
      },
      {
        "type": "text",
        "props": {
          "content": "Slide 2",
          "preset": "bold-secondary"
        }
      },
      {
        "type": "text",
        "props": {
          "content": "Slide 3",
          "preset": "bold-accent"
        }
      }
    ]
  }
}
```

### Navbar Brick (`navbar`)

A navigation bar with logo and navigation
This brick should be used on most sites/pages.

#### Navbar Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `container`: [optional] `object`.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
  * `border`: [optional] See $ref 'styles:border'.  
  * `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 
  * `fixedPositioned`: [optional] `boolean`.  Default: `false`. 
- `brand`: [required] `object`.  
  * `name`: [optional] See $ref 'content:text'.  Default: `"Acme Inc."`. 
  * `logo`: [optional] See $ref 'assets:image'.  
  * `hideText`: [optional] `boolean`.  Default: `false`. 
  * `color`: [optional] See $ref 'styles:color'.  
- `navigation`: [required] `object`.  
  * `position`: [required] `enum`.  Default: `"right"`. Values: `left`, `center`, `right` 
  * `color`: [optional] See $ref 'styles:color'.  
  * `datasource`: [optional] `object`. Reference to a data source. Only used for dynamic websites. 
    * `id`: [required] `string`.  
    * `mapping`: [required] `object`. Mapping of data source fields to brick props. 
    * `filters`: [optional] `object`. Filter data source records. 
    * `sort`: [optional] `object`. Sort data source records. 
    * `limit`: [optional] `number`. Limit the number of records to fetch. 
    * `offset`: [optional] `number`. Offset the records to fetch. 
  * `staticItems`: [optional] `object[]`.  Default: `[]`. 
    * `urlOrPageId`: [required] `enum`.  Values: `undefined`, `undefined` 


#### Navbar Examples

##### Example: Corporate navbar with logo and right-aligned navigation

```json
{
  "id": "example-1",
  "type": "navbar",
  "props": {
    "preset": "bold-primary",
    "container": {},
    "brand": {
      "name": "TechCorp Solutions",
      "logo": {
        "src": "https://via.placeholder.com/120x40.png?text=TechCorp",
        "alt": "TechCorp Solutions logo"
      },
      "color": "#1f2937"
    },
    "navigation": {
      "position": "right",
      "color": "#374151",
      "staticItems": [
        {
          "urlOrPageId": "/services"
        },
        {
          "urlOrPageId": "/about"
        },
        {
          "urlOrPageId": "/portfolio"
        },
        {
          "urlOrPageId": "/contact"
        }
      ]
    }
  }
}
```

##### Example: Dark theme navbar with centered navigation

```json
{
  "id": "example-2",
  "type": "navbar",
  "props": {
    "container": {
      "backgroundColor": "#1f2937",
      "shadow": "shadow-lg"
    },
    "brand": {
      "name": "Creative Studio",
      "logo": {
        "src": "https://via.placeholder.com/100x35.png?text=Studio",
        "alt": "Creative Studio logo"
      },
      "color": "#ffffff"
    },
    "navigation": {
      "position": "center",
      "color": "#d1d5db",
      "staticItems": [
        {
          "urlOrPageId": "/work"
        },
        {
          "urlOrPageId": "/services"
        },
        {
          "urlOrPageId": "/team"
        },
        {
          "urlOrPageId": "/blog"
        }
      ]
    }
  }
}
```

##### Example: SaaS platform navbar with fixed positioning

```json
{
  "id": "example-3",
  "type": "navbar",
  "props": {
    "container": {
      "backgroundColor": "#3b82f6",
      "fixedPositioned": true,
      "shadow": "shadow-md"
    },
    "brand": {
      "name": "CloudFlow",
      "logo": {
        "src": "https://via.placeholder.com/110x38.png?text=CloudFlow",
        "alt": "CloudFlow platform logo"
      },
      "color": "#ffffff"
    },
    "navigation": {
      "position": "right",
      "color": "#f1f5f9",
      "staticItems": [
        {
          "urlOrPageId": "/features"
        },
        {
          "urlOrPageId": "/pricing"
        },
        {
          "urlOrPageId": "/docs"
        },
        {
          "urlOrPageId": "/login"
        }
      ]
    }
  }
}
```

##### Example: E-commerce navbar

```json
{
  "id": "example-4",
  "type": "navbar",
  "props": {
    "preset": "bold-primary",
    "brand": {
      "name": "ShopEasy",
      "logo": {
        "src": "https://via.placeholder.com/130x45.png?text=ShopEasy",
        "alt": "ShopEasy store logo"
      }
    },
    "navigation": {
      "position": "right",
      "staticItems": [
        {
          "urlOrPageId": "/products"
        },
        {
          "urlOrPageId": "/categories"
        },
        {
          "urlOrPageId": "/deals"
        },
        {
          "urlOrPageId": "/account"
        },
        {
          "urlOrPageId": "/cart"
        }
      ]
    }
  }
}
```

##### Example: Agency navbar with logo-only brand

```json
{
  "id": "example-5",
  "type": "navbar",
  "props": {
    "container": {
      "shadow": "shadow-sm"
    },
    "brand": {
      "logo": {
        "src": "https://via.placeholder.com/140x50.png?text=Agency+Logo",
        "alt": "Digital agency logo"
      },
      "hideText": true
    },
    "navigation": {
      "position": "right",
      "color": "#64748b",
      "staticItems": [
        {
          "urlOrPageId": "/projects"
        },
        {
          "urlOrPageId": "/capabilities"
        },
        {
          "urlOrPageId": "/insights"
        },
        {
          "urlOrPageId": "/contact"
        }
      ]
    }
  }
}
```

##### Example: Restaurant navbar with warm styling

```json
{
  "id": "example-6",
  "type": "navbar",
  "props": {
    "container": {
      "backgroundColor": "#7c2d12",
      "shadow": "shadow-lg"
    },
    "brand": {
      "name": "Bella Vista",
      "logo": {
        "src": "https://via.placeholder.com/80x50.png?text=BV",
        "alt": "Bella Vista restaurant logo"
      },
      "color": "#fed7aa"
    },
    "navigation": {
      "position": "center",
      "color": "#fdba74",
      "staticItems": [
        {
          "urlOrPageId": "/menu"
        },
        {
          "urlOrPageId": "/reservations"
        },
        {
          "urlOrPageId": "/events"
        },
        {
          "urlOrPageId": "/location"
        }
      ]
    }
  }
}
```

##### Example: Portfolio navbar with left-aligned navigation

```json
{
  "id": "example-7",
  "type": "navbar",
  "props": {
    "preset": "bold-secondary",
    "container": {
      "backgroundColor": "#f1f5f9",
      "border": {
        "sides": [
          "border-b"
        ],
        "color": "border-accent"
      }
    },
    "brand": {
      "name": "Alex Martinez",
      "color": "#334155"
    },
    "navigation": {
      "position": "left",
      "color": "#64748b",
      "staticItems": [
        {
          "urlOrPageId": "/work"
        },
        {
          "urlOrPageId": "/about"
        },
        {
          "urlOrPageId": "/experience"
        },
        {
          "urlOrPageId": "/contact"
        }
      ]
    }
  }
}
```

##### Example: Non-profit navbar with mission-focused design

```json
{
  "id": "example-8",
  "type": "navbar",
  "props": {
    "preset": "bold-primary",
    "container": {
      "shadow": "shadow-md"
    },
    "brand": {
      "name": "Green Future",
      "logo": {
        "src": "https://via.placeholder.com/100x40.png?text=GF",
        "alt": "Green Future organization logo"
      },
      "color": "#d1fae5"
    },
    "navigation": {
      "position": "right",
      "color": "#a7f3d0",
      "staticItems": [
        {
          "urlOrPageId": "/mission"
        },
        {
          "urlOrPageId": "/programs"
        },
        {
          "urlOrPageId": "/volunteer"
        },
        {
          "urlOrPageId": "/donate"
        }
      ]
    }
  }
}
```

### Footer Brick (`footer`)

A footer with links and an optional logo

#### Footer Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `variants`: [required] `array`.  Values: `logo-left` (Logo on the left), `logo-right` (Logo on the right), `logo-center` (Logo at center), `multiple-rows` (Span on multiple rows. Use when there a a lot of links sections) 
- `backgroundColor`: [optional] `string`.  
- `logo`: [optional] See $ref 'assets:image'.  
- `linksSections`: [required] `object[]`.  
  * `sectionTitle`: [required] `string`.  
  * `row`: [optional] `number`. Row number of the section. Default: `0`. 
  * `links`: [required] `object[]`.  
    * `title`: [required] `string`.  
    * `url`: [required] `enum`.  Values: `undefined`, `undefined` 
    * `column`: [optional] `number`.  Default: `1`. 



#### Footer Examples

##### Example: Simple footer with logo on the left

```json
{
  "id": "example-1",
  "type": "footer",
  "props": {
    "variants": [
      "logo-left"
    ],
    "backgroundColor": "#f8f9fa",
    "logo": {
      "src": "https://via.placeholder.com/120x40.png?text=Logo",
      "alt": "Company logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Quick Links",
        "links": [
          {
            "title": "Home",
            "url": "/"
          },
          {
            "title": "About",
            "url": "/about"
          },
          {
            "title": "Contact",
            "url": "/contact"
          }
        ]
      },
      {
        "sectionTitle": "Legal",
        "links": [
          {
            "title": "Privacy Policy",
            "url": "/privacy"
          },
          {
            "title": "Terms of Service",
            "url": "/terms"
          }
        ]
      }
    ]
  }
}
```

##### Example: Corporate footer with centered logo

```json
{
  "id": "example-2",
  "type": "footer",
  "props": {
    "variants": [
      "logo-center"
    ],
    "backgroundColor": "#2c3e50",
    "logo": {
      "src": "https://via.placeholder.com/150x50.png?text=Corporate",
      "alt": "Corporate logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Products",
        "links": [
          {
            "title": "Software Solutions",
            "url": "/products/software"
          },
          {
            "title": "Consulting",
            "url": "/products/consulting"
          },
          {
            "title": "Support",
            "url": "/products/support"
          },
          {
            "title": "Training",
            "url": "/products/training"
          }
        ]
      },
      {
        "sectionTitle": "Company",
        "links": [
          {
            "title": "About Us",
            "url": "/about"
          },
          {
            "title": "Careers",
            "url": "/careers"
          },
          {
            "title": "News",
            "url": "/news"
          },
          {
            "title": "Investors",
            "url": "/investors"
          }
        ]
      },
      {
        "sectionTitle": "Resources",
        "links": [
          {
            "title": "Documentation",
            "url": "/docs"
          },
          {
            "title": "API Reference",
            "url": "/api"
          },
          {
            "title": "Community",
            "url": "/community"
          },
          {
            "title": "Blog",
            "url": "/blog"
          }
        ]
      }
    ]
  }
}
```

##### Example: E-commerce footer with logo on the right

```json
{
  "id": "example-3",
  "type": "footer",
  "props": {
    "variants": [
      "logo-right"
    ],
    "backgroundColor": "#ffffff",
    "logo": {
      "src": "https://via.placeholder.com/140x45.png?text=Shop",
      "alt": "Shop logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Shop",
        "links": [
          {
            "title": "All Products",
            "url": "/products"
          },
          {
            "title": "New Arrivals",
            "url": "/new"
          },
          {
            "title": "Sale",
            "url": "/sale"
          },
          {
            "title": "Gift Cards",
            "url": "/gift-cards"
          }
        ]
      },
      {
        "sectionTitle": "Customer Service",
        "links": [
          {
            "title": "Help Center",
            "url": "/help"
          },
          {
            "title": "Returns",
            "url": "/returns"
          },
          {
            "title": "Shipping Info",
            "url": "/shipping"
          },
          {
            "title": "Size Guide",
            "url": "/size-guide"
          }
        ]
      },
      {
        "sectionTitle": "Account",
        "links": [
          {
            "title": "My Account",
            "url": "/account"
          },
          {
            "title": "Order History",
            "url": "/orders"
          },
          {
            "title": "Wishlist",
            "url": "/wishlist"
          }
        ]
      }
    ]
  }
}
```

##### Example: Large organization footer with multiple rows

```json
{
  "id": "example-4",
  "type": "footer",
  "props": {
    "variants": [
      "logo-center",
      "multiple-rows"
    ],
    "backgroundColor": "#1a1a1a",
    "logo": {
      "src": "https://via.placeholder.com/180x60.png?text=Enterprise",
      "alt": "Enterprise logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Products & Services",
        "row": 0,
        "links": [
          {
            "title": "Cloud Solutions",
            "url": "/cloud",
            "column": 1
          },
          {
            "title": "Data Analytics",
            "url": "/analytics",
            "column": 1
          },
          {
            "title": "AI & Machine Learning",
            "url": "/ai",
            "column": 1
          },
          {
            "title": "Cybersecurity",
            "url": "/security",
            "column": 2
          },
          {
            "title": "DevOps Tools",
            "url": "/devops",
            "column": 2
          },
          {
            "title": "IoT Platform",
            "url": "/iot",
            "column": 2
          }
        ]
      },
      {
        "sectionTitle": "Industries",
        "row": 0,
        "links": [
          {
            "title": "Healthcare",
            "url": "/industries/healthcare",
            "column": 3
          },
          {
            "title": "Finance",
            "url": "/industries/finance",
            "column": 3
          },
          {
            "title": "Retail",
            "url": "/industries/retail",
            "column": 3
          },
          {
            "title": "Manufacturing",
            "url": "/industries/manufacturing",
            "column": 4
          },
          {
            "title": "Education",
            "url": "/industries/education",
            "column": 4
          },
          {
            "title": "Government",
            "url": "/industries/government",
            "column": 4
          }
        ]
      },
      {
        "sectionTitle": "Resources",
        "row": 1,
        "links": [
          {
            "title": "Documentation",
            "url": "/docs",
            "column": 1
          },
          {
            "title": "API Reference",
            "url": "/api",
            "column": 1
          },
          {
            "title": "Tutorials",
            "url": "/tutorials",
            "column": 1
          },
          {
            "title": "Webinars",
            "url": "/webinars",
            "column": 2
          },
          {
            "title": "White Papers",
            "url": "/whitepapers",
            "column": 2
          },
          {
            "title": "Case Studies",
            "url": "/case-studies",
            "column": 2
          }
        ]
      },
      {
        "sectionTitle": "Support & Community",
        "row": 1,
        "links": [
          {
            "title": "Help Center",
            "url": "/help",
            "column": 3
          },
          {
            "title": "Community Forum",
            "url": "/forum",
            "column": 3
          },
          {
            "title": "Contact Support",
            "url": "/support",
            "column": 3
          },
          {
            "title": "Service Status",
            "url": "/status",
            "column": 4
          },
          {
            "title": "Partner Portal",
            "url": "/partners",
            "column": 4
          },
          {
            "title": "Developer Hub",
            "url": "/developers",
            "column": 4
          }
        ]
      }
    ]
  }
}
```

##### Example: Startup footer with minimal links and left logo

```json
{
  "id": "example-5",
  "type": "footer",
  "props": {
    "variants": [
      "logo-left"
    ],
    "backgroundColor": "#f5f5f5",
    "logo": {
      "src": "https://via.placeholder.com/100x35.png?text=Startup",
      "alt": "Startup logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Company",
        "links": [
          {
            "title": "About",
            "url": "/about"
          },
          {
            "title": "Team",
            "url": "/team"
          },
          {
            "title": "Jobs",
            "url": "/jobs"
          }
        ]
      },
      {
        "sectionTitle": "Product",
        "links": [
          {
            "title": "Features",
            "url": "/features"
          },
          {
            "title": "Pricing",
            "url": "/pricing"
          },
          {
            "title": "Demo",
            "url": "/demo"
          }
        ]
      },
      {
        "sectionTitle": "Support",
        "links": [
          {
            "title": "Help",
            "url": "/help"
          },
          {
            "title": "Contact",
            "url": "/contact"
          }
        ]
      }
    ]
  }
}
```

##### Example: Agency footer with centered logo and creative sections

```json
{
  "id": "example-6",
  "type": "footer",
  "props": {
    "variants": [
      "logo-center"
    ],
    "backgroundColor": "#6366f1",
    "logo": {
      "src": "https://via.placeholder.com/130x45.png?text=Agency",
      "alt": "Creative agency logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Services",
        "links": [
          {
            "title": "Web Design",
            "url": "/services/web-design"
          },
          {
            "title": "Branding",
            "url": "/services/branding"
          },
          {
            "title": "Digital Marketing",
            "url": "/services/marketing"
          },
          {
            "title": "Photography",
            "url": "/services/photography"
          }
        ]
      },
      {
        "sectionTitle": "Portfolio",
        "links": [
          {
            "title": "Recent Work",
            "url": "/portfolio"
          },
          {
            "title": "Case Studies",
            "url": "/case-studies"
          },
          {
            "title": "Client Reviews",
            "url": "/reviews"
          }
        ]
      },
      {
        "sectionTitle": "Connect",
        "links": [
          {
            "title": "Contact Us",
            "url": "/contact"
          },
          {
            "title": "Get Quote",
            "url": "/quote"
          },
          {
            "title": "Newsletter",
            "url": "/newsletter"
          }
        ]
      }
    ]
  }
}
```

##### Example: SaaS platform footer with comprehensive links

```json
{
  "id": "example-7",
  "type": "footer",
  "props": {
    "variants": [
      "logo-left",
      "multiple-rows"
    ],
    "backgroundColor": "#0f172a",
    "logo": {
      "src": "https://via.placeholder.com/160x50.png?text=SaaS+Platform",
      "alt": "SaaS platform logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Platform",
        "row": 0,
        "links": [
          {
            "title": "Dashboard",
            "url": "/dashboard",
            "column": 1
          },
          {
            "title": "Analytics",
            "url": "/analytics",
            "column": 1
          },
          {
            "title": "Integrations",
            "url": "/integrations",
            "column": 1
          },
          {
            "title": "API",
            "url": "/api",
            "column": 1
          }
        ]
      },
      {
        "sectionTitle": "Solutions",
        "row": 0,
        "links": [
          {
            "title": "For Startups",
            "url": "/solutions/startups",
            "column": 2
          },
          {
            "title": "For Enterprise",
            "url": "/solutions/enterprise",
            "column": 2
          },
          {
            "title": "For Agencies",
            "url": "/solutions/agencies",
            "column": 2
          },
          {
            "title": "For Developers",
            "url": "/solutions/developers",
            "column": 2
          }
        ]
      },
      {
        "sectionTitle": "Resources",
        "row": 1,
        "links": [
          {
            "title": "Blog",
            "url": "/blog",
            "column": 1
          },
          {
            "title": "Documentation",
            "url": "/docs",
            "column": 1
          },
          {
            "title": "Help Center",
            "url": "/help",
            "column": 1
          },
          {
            "title": "Community",
            "url": "/community",
            "column": 1
          }
        ]
      },
      {
        "sectionTitle": "Company",
        "row": 1,
        "links": [
          {
            "title": "About Us",
            "url": "/about",
            "column": 2
          },
          {
            "title": "Careers",
            "url": "/careers",
            "column": 2
          },
          {
            "title": "Press",
            "url": "/press",
            "column": 2
          },
          {
            "title": "Legal",
            "url": "/legal",
            "column": 2
          }
        ]
      }
    ]
  }
}
```

##### Example: Non-profit footer with mission-focused links

```json
{
  "id": "example-8",
  "type": "footer",
  "props": {
    "variants": [
      "logo-center"
    ],
    "backgroundColor": "#059669",
    "logo": {
      "src": "https://via.placeholder.com/140x50.png?text=Non+Profit",
      "alt": "Non-profit organization logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Our Work",
        "links": [
          {
            "title": "Programs",
            "url": "/programs"
          },
          {
            "title": "Impact",
            "url": "/impact"
          },
          {
            "title": "Success Stories",
            "url": "/stories"
          },
          {
            "title": "Research",
            "url": "/research"
          }
        ]
      },
      {
        "sectionTitle": "Get Involved",
        "links": [
          {
            "title": "Donate",
            "url": "/donate"
          },
          {
            "title": "Volunteer",
            "url": "/volunteer"
          },
          {
            "title": "Events",
            "url": "/events"
          },
          {
            "title": "Partner with Us",
            "url": "/partnerships"
          }
        ]
      },
      {
        "sectionTitle": "About",
        "links": [
          {
            "title": "Our Mission",
            "url": "/mission"
          },
          {
            "title": "Leadership",
            "url": "/leadership"
          },
          {
            "title": "Annual Reports",
            "url": "/reports"
          },
          {
            "title": "Contact",
            "url": "/contact"
          }
        ]
      }
    ]
  }
}
```

##### Example: Tech blog footer with right-aligned logo

```json
{
  "id": "example-9",
  "type": "footer",
  "props": {
    "variants": [
      "logo-right"
    ],
    "backgroundColor": "#111827",
    "logo": {
      "src": "https://via.placeholder.com/120x40.png?text=Tech+Blog",
      "alt": "Tech blog logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Categories",
        "links": [
          {
            "title": "Web Development",
            "url": "/category/web-dev"
          },
          {
            "title": "AI & ML",
            "url": "/category/ai-ml"
          },
          {
            "title": "DevOps",
            "url": "/category/devops"
          },
          {
            "title": "Mobile",
            "url": "/category/mobile"
          }
        ]
      },
      {
        "sectionTitle": "Popular",
        "links": [
          {
            "title": "Latest Posts",
            "url": "/latest"
          },
          {
            "title": "Trending",
            "url": "/trending"
          },
          {
            "title": "Best of 2024",
            "url": "/best-2024"
          },
          {
            "title": "Tutorials",
            "url": "/tutorials"
          }
        ]
      },
      {
        "sectionTitle": "Community",
        "links": [
          {
            "title": "Newsletter",
            "url": "/newsletter"
          },
          {
            "title": "Discord",
            "url": "/discord"
          },
          {
            "title": "Contributors",
            "url": "/contributors"
          },
          {
            "title": "Write for Us",
            "url": "/write"
          }
        ]
      }
    ]
  }
}
```

##### Example: Restaurant footer with location and menu links

```json
{
  "id": "example-10",
  "type": "footer",
  "props": {
    "variants": [
      "logo-center"
    ],
    "backgroundColor": "#7c2d12",
    "logo": {
      "src": "https://via.placeholder.com/150x60.png?text=Restaurant",
      "alt": "Restaurant logo"
    },
    "linksSections": [
      {
        "sectionTitle": "Menu",
        "links": [
          {
            "title": "Appetizers",
            "url": "/menu/appetizers"
          },
          {
            "title": "Main Courses",
            "url": "/menu/mains"
          },
          {
            "title": "Desserts",
            "url": "/menu/desserts"
          },
          {
            "title": "Beverages",
            "url": "/menu/drinks"
          }
        ]
      },
      {
        "sectionTitle": "Services",
        "links": [
          {
            "title": "Reservations",
            "url": "/reservations"
          },
          {
            "title": "Catering",
            "url": "/catering"
          },
          {
            "title": "Private Events",
            "url": "/events"
          },
          {
            "title": "Gift Cards",
            "url": "/gift-cards"
          }
        ]
      },
      {
        "sectionTitle": "Info",
        "links": [
          {
            "title": "About Us",
            "url": "/about"
          },
          {
            "title": "Location",
            "url": "/location"
          },
          {
            "title": "Hours",
            "url": "/hours"
          },
          {
            "title": "Contact",
            "url": "/contact"
          }
        ]
      }
    ]
  }
}
```

### Button Brick (`button`)

A button with text and optional icon

#### Button Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `variants`: [required] `array`.  Values: `btn-neutral`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-info`, `btn-success`, `btn-warning`, `btn-error`, `btn-outline`, `btn-dash`, `btn-soft`, `btn-ghost`, `btn-link`, `btn-active`, `btn-disabled`, `btn-icon-left`, `btn-icon-right`, `btn-xs`, `btn-sm`, `btn-md`, `btn-lg`, `btn-xl`, `btn-wide`, `btn-block`, `btn-square`, `btn-circle` 
- `label`: [required] See $ref 'content:text'.  Default: `"My button"`. 
- `type`: [optional] `string`. The type of the button. Default: `"button"`. Values: `button`, `submit`, `reset` 
- `icon`: [optional] `string`. Icon to display (iconify reference). 
- `linkToUrlOrPageId`: [optional] `enum`.  Values: `undefined`, `undefined` 

#### Button Examples

##### Example: Primary button, large size, linking to a URL

```json
{
  "id": "example-1",
  "type": "button",
  "props": {
    "variants": [
      "btn-primary",
      "btn-lg"
    ],
    "label": "Click me",
    "linkToUrlOrPageId": "https://example.com"
  }
}
```

##### Example: Secondary button, small size, linking to a page

```json
{
  "id": "example-2",
  "type": "button",
  "props": {
    "variants": [
      "btn-secondary",
      "btn-sm"
    ],
    "label": "Go to page",
    "linkToUrlOrPageId": "page-id-123"
  }
}
```

##### Example: Disabled button with outline style

```json
{
  "id": "example-3",
  "type": "button",
  "props": {
    "variants": [
      "btn-outline",
      "btn-disabled"
    ],
    "label": "Disabled Button"
  }
}
```

##### Example: Ghost button

```json
{
  "id": "example-4",
  "type": "button",
  "props": {
    "variants": [
      "btn-ghost"
    ],
    "label": "Ghost Button",
    "linkToUrlOrPageId": "https://example.com/ghost"
  }
}
```

##### Example: Submit button in a form

```json
{
  "id": "example-5",
  "type": "button",
  "props": {
    "variants": [
      "btn-primary",
      "btn-md"
    ],
    "label": "Submit form",
    "type": "submit"
  }
}
```

##### Example: Button with icon on the right

```json
{
  "id": "example-6",
  "type": "button",
  "props": {
    "variants": [
      "btn-primary",
      "btn-md",
      "btn-icon-right"
    ],
    "label": "Icon Button",
    "icon": "mdi:check-circle"
  }
}
```

### Icon Brick (`icon`)

An icon with optional text

#### Icon Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `icon`: [required] `string`. Icon to display (iconify reference). 
- `size`: [required] `string`. Size of the icon. Default: `"1em"`. 
- `linkToUrlOrPageId`: [optional] `enum`.  Values: `undefined`, `undefined` 

#### Icon Examples

##### Example: Large heart icon

```json
{
  "id": "example-1",
  "type": "icon",
  "props": {
    "icon": "mdi:heart",
    "size": "2em"
  }
}
```

##### Example: Shopping cart icon

```json
{
  "id": "example-2",
  "type": "icon",
  "props": {
    "icon": "mdi:cart",
    "size": "1.2em"
  }
}
```

##### Example: Email/message icon

```json
{
  "id": "example-3",
  "type": "icon",
  "props": {
    "icon": "mdi:email",
    "size": "1.1em",
    "linkToUrlOrPageId": "mailto:john.doe@example.com"
  }
}
```

##### Example: Phone contact icon

```json
{
  "id": "example-4",
  "type": "icon",
  "props": {
    "icon": "mdi:phone",
    "size": "1em",
    "linkToUrlOrPageId": "tel:+1234567890"
  }
}
```

##### Example: Large download icon

```json
{
  "id": "example-5",
  "type": "icon",
  "props": {
    "icon": "mdi:download",
    "size": "2.5em",
    "linkToUrlOrPageId": "https://example.com/file.zip"
  }
}
```

##### Example: Menu hamburger icon

```json
{
  "id": "example-6",
  "type": "icon",
  "props": {
    "icon": "mdi:menu",
    "size": "1.4em"
  }
}
```

##### Example: Close/X icon

```json
{
  "id": "example-7",
  "type": "icon",
  "props": {
    "icon": "mdi:close",
    "size": "1.2em"
  }
}
```

##### Example: Social media Facebook icon

```json
{
  "id": "example-8",
  "type": "icon",
  "props": {
    "icon": "mdi:facebook",
    "size": "1.4em",
    "linkToUrlOrPageId": "https://www.facebook.com/yourprofile"
  }
}
```

##### Example: Social media Twitter icon

```json
{
  "id": "example-9",
  "type": "icon",
  "props": {
    "icon": "mdi:twitter",
    "size": "1.4em",
    "linkToUrlOrPageId": "https://twitter.com/yourprofile"
  }
}
```

##### Example: Social media Instagram icon

```json
{
  "id": "example-10",
  "type": "icon",
  "props": {
    "icon": "mdi:instagram",
    "size": "1.4em",
    "linkToUrlOrPageId": "https://www.instagram.com/yourprofile"
  }
}
```

### Social links Brick (`social-links`)

A list of social media links

#### Social links Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `links`: [required] `object[]`.  
  * `href`: [required] `string`.  
  * `label`: [optional] `string`.  
  * `icon`: [optional] `string`. Icon to display (iconify reference). 

- `variants`: [required] `array`.  Values: `icon-only` (Display only icons), `display-inline` (Display links inline), `display-block` (Display links as block elements) 

#### Social links Examples

##### Example: Standard social media icons inline

```json
{
  "id": "example-1",
  "type": "social-links",
  "props": {
    "variants": [
      "icon-only",
      "display-inline"
    ],
    "links": [
      {
        "href": "https://facebook.com/company",
        "label": "Facebook",
        "icon": "mdi:facebook"
      },
      {
        "href": "https://twitter.com/company",
        "label": "Twitter",
        "icon": "mdi:twitter"
      },
      {
        "href": "https://instagram.com/company",
        "label": "Instagram",
        "icon": "mdi:instagram"
      },
      {
        "href": "https://linkedin.com/company/company",
        "label": "LinkedIn",
        "icon": "mdi:linkedin"
      }
    ]
  }
}
```

##### Example: Professional social links with labels (block layout)

```json
{
  "id": "example-2",
  "type": "social-links",
  "props": {
    "variants": [
      "display-block"
    ],
    "links": [
      {
        "href": "https://linkedin.com/in/johndoe",
        "label": "Connect on LinkedIn",
        "icon": "mdi:linkedin"
      },
      {
        "href": "https://github.com/johndoe",
        "label": "View GitHub Profile",
        "icon": "mdi:github"
      },
      {
        "href": "https://twitter.com/johndoe",
        "label": "Follow on Twitter",
        "icon": "mdi:twitter"
      },
      {
        "href": "mailto:john@example.com",
        "label": "Send Email",
        "icon": "mdi:email"
      }
    ]
  }
}
```

##### Example: Creative portfolio social links (icon-only inline)

```json
{
  "id": "example-3",
  "type": "social-links",
  "props": {
    "variants": [
      "icon-only",
      "display-inline"
    ],
    "links": [
      {
        "href": "https://dribbble.com/designer",
        "label": "Dribbble",
        "icon": "mdi:dribbble"
      },
      {
        "href": "https://behance.net/designer",
        "label": "Behance",
        "icon": "mdi:behance"
      },
      {
        "href": "https://instagram.com/designer",
        "label": "Instagram",
        "icon": "mdi:instagram"
      },
      {
        "href": "https://pinterest.com/designer",
        "label": "Pinterest",
        "icon": "mdi:pinterest"
      },
      {
        "href": "https://youtube.com/designer",
        "label": "YouTube",
        "icon": "mdi:youtube"
      }
    ]
  }
}
```

##### Example: Developer/tech social links with labels

```json
{
  "id": "example-4",
  "type": "social-links",
  "props": {
    "variants": [
      "display-inline"
    ],
    "links": [
      {
        "href": "https://github.com/developer",
        "label": "GitHub",
        "icon": "mdi:github"
      },
      {
        "href": "https://stackoverflow.com/users/developer",
        "label": "Stack Overflow",
        "icon": "mdi:stack-overflow"
      },
      {
        "href": "https://dev.to/developer",
        "label": "Dev.to",
        "icon": "mdi:dev-to"
      },
      {
        "href": "https://codepen.io/developer",
        "label": "CodePen",
        "icon": "mdi:codepen"
      }
    ]
  }
}
```

##### Example: Music artist social platforms (block layout)

```json
{
  "id": "example-5",
  "type": "social-links",
  "props": {
    "variants": [
      "display-block"
    ],
    "links": [
      {
        "href": "https://spotify.com/artist/musician",
        "label": "Listen on Spotify",
        "icon": "mdi:spotify"
      },
      {
        "href": "https://music.apple.com/artist/musician",
        "label": "Apple Music",
        "icon": "mdi:apple"
      },
      {
        "href": "https://soundcloud.com/musician",
        "label": "SoundCloud",
        "icon": "mdi:soundcloud"
      },
      {
        "href": "https://youtube.com/musician",
        "label": "YouTube Channel",
        "icon": "mdi:youtube"
      },
      {
        "href": "https://bandcamp.com/musician",
        "label": "Bandcamp",
        "icon": "mdi:bandcamp"
      }
    ]
  }
}
```

##### Example: Business contact icons only

```json
{
  "id": "example-6",
  "type": "social-links",
  "props": {
    "variants": [
      "icon-only",
      "display-inline"
    ],
    "links": [
      {
        "href": "tel:+1234567890",
        "label": "Phone",
        "icon": "mdi:phone"
      },
      {
        "href": "mailto:contact@business.com",
        "label": "Email",
        "icon": "mdi:email"
      },
      {
        "href": "https://maps.google.com/business",
        "label": "Location",
        "icon": "mdi:map-marker"
      },
      {
        "href": "https://business.com",
        "label": "Website",
        "icon": "mdi:web"
      }
    ]
  }
}
```

##### Example: Gaming content creator links (inline with labels)

```json
{
  "id": "example-7",
  "type": "social-links",
  "props": {
    "variants": [
      "display-inline"
    ],
    "links": [
      {
        "href": "https://twitch.tv/gamer",
        "label": "Twitch",
        "icon": "mdi:twitch"
      },
      {
        "href": "https://youtube.com/gamer",
        "label": "YouTube",
        "icon": "mdi:youtube"
      },
      {
        "href": "https://discord.gg/gamer",
        "label": "Discord",
        "icon": "mdi:discord"
      },
      {
        "href": "https://tiktok.com/@gamer",
        "label": "TikTok",
        "icon": "mdi:tiktok"
      }
    ]
  }
}
```

##### Example: Restaurant social presence (block layout)

```json
{
  "id": "example-8",
  "type": "social-links",
  "props": {
    "variants": [
      "display-block"
    ],
    "links": [
      {
        "href": "https://facebook.com/restaurant",
        "label": "Follow us on Facebook",
        "icon": "mdi:facebook"
      },
      {
        "href": "https://instagram.com/restaurant",
        "label": "See photos on Instagram",
        "icon": "mdi:instagram"
      },
      {
        "href": "https://yelp.com/restaurant",
        "label": "Review us on Yelp",
        "icon": "mdi:yelp"
      },
      {
        "href": "https://tripadvisor.com/restaurant",
        "label": "TripAdvisor Reviews",
        "icon": "mdi:tripadvisor"
      },
      {
        "href": "tel:+1234567890",
        "label": "Call for Reservations",
        "icon": "mdi:phone"
      }
    ]
  }
}
```

##### Example: Minimal footer social icons

```json
{
  "id": "example-9",
  "type": "social-links",
  "props": {
    "variants": [
      "icon-only",
      "display-inline"
    ],
    "links": [
      {
        "href": "https://twitter.com/company",
        "label": "Twitter",
        "icon": "mdi:twitter"
      },
      {
        "href": "https://linkedin.com/company/company",
        "label": "LinkedIn",
        "icon": "mdi:linkedin"
      },
      {
        "href": "mailto:hello@company.com",
        "label": "Email",
        "icon": "mdi:email"
      }
    ]
  }
}
```

##### Example: E-commerce store social channels (inline with labels)

```json
{
  "id": "example-10",
  "type": "social-links",
  "props": {
    "variants": [
      "display-inline"
    ],
    "links": [
      {
        "href": "https://facebook.com/store",
        "label": "Facebook",
        "icon": "mdi:facebook"
      },
      {
        "href": "https://instagram.com/store",
        "label": "Instagram",
        "icon": "mdi:instagram"
      },
      {
        "href": "https://pinterest.com/store",
        "label": "Pinterest",
        "icon": "mdi:pinterest"
      },
      {
        "href": "https://youtube.com/store",
        "label": "YouTube",
        "icon": "mdi:youtube"
      },
      {
        "href": "https://tiktok.com/@store",
        "label": "TikTok",
        "icon": "mdi:tiktok"
      }
    ]
  }
}
```

### Container Brick (`container`)

A container that can hold other bricks and align them horizontally or vertically
A container acts as a flexbox (default) or a grid and allows you to align bricks horizontally, vertically, or in a grid. 

#### Container Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `layout`: [required] See $ref 'styles:containerLayout'. Settings for the layout of the container.. 
- `background`: [optional] See $ref 'styles:background'.  
- `border`: [optional] See $ref 'styles:border'.  
- `padding`: [optional] See $ref 'styles:padding'.  
- `effects`: [optional] See $ref 'styles:effects'.  
- `datasource`: [optional] `object`. Reference to a data source. Only used for dynamic websites. 
  * `id`: [required] `string`.  
  * `mapping`: [required] `object`. Mapping of data source fields to brick props. 
  * `filters`: [optional] `object`. Filter data source records. 
  * `sort`: [optional] `object`. Sort data source records. 
  * `limit`: [optional] `number`. Limit the number of records to fetch. 
  * `offset`: [optional] `number`. Offset the records to fetch. 
- `$childrenType`: [optional] `string`. Type of the child bricks that will be created when container is dynamic.. 
- `$children`: [required] `array`. List of nested bricks. Default: `[]`. 

#### Container Examples

##### Example: Feature cards grid layout

```json
{
  "id": "example-1",
  "type": "container",
  "props": {
    "preset": "bold-primary",
    "layout": {
      "type": "grid",
      "columns": 3,
      "gap": "gap-4"
    },
    "padding": "p-8",
    "border": {
      "rounding": "rounded-lg"
    },
    "$children": [
      {
        "type": "card",
        "props": {
          "variants": [
            "centered"
          ],
          "cardTitle": {
            "content": "Fast Performance"
          },
          "cardBody": {
            "content": "Lightning-fast load times and optimized performance for the best user experience."
          }
        }
      },
      {
        "type": "card",
        "props": {
          "variants": [
            "centered"
          ],
          "cardTitle": {
            "content": "Secure & Reliable"
          },
          "cardBody": {
            "content": "Enterprise-grade security with 99.9% uptime guarantee and data protection."
          }
        }
      },
      {
        "type": "card",
        "props": {
          "variants": [
            "centered"
          ],
          "cardTitle": {
            "content": "Easy Integration"
          },
          "cardBody": {
            "content": "Simple API integration with comprehensive documentation and support."
          }
        }
      }
    ]
  }
}
```

##### Example: Horizontal hero section with image and text

```json
{
  "id": "example-2",
  "type": "container",
  "props": {
    "preset": "bold-secondary",
    "layout": {
      "type": "flex",
      "direction": "flex-row",
      "alignItems": "items-center",
      "gap": "gap-8"
    },
    "padding": "p-16",
    "effects": {
      "shadow": "shadow-xl"
    },
    "$children": [
      {
        "type": "text",
        "props": {
          "content": "<h1>Transform Your Business</h1><p>Discover how our innovative solutions can streamline your operations and accelerate growth. Join thousands of satisfied customers worldwide.</p>",
          "color": "#ffffff",
          "padding": "p-0"
        }
      },
      {
        "type": "image",
        "props": {
          "image": {
            "src": "https://via.placeholder.com/400x300.png?text=Business+Growth",
            "alt": "Business transformation illustration"
          },
          "border": {
            "borderRadius": "8px"
          }
        }
      }
    ]
  }
}
```

##### Example: Vertical testimonial section

```json
{
  "id": "example-3",
  "type": "container",
  "props": {
    "layout": {
      "type": "flex",
      "direction": "flex-col",
      "alignItems": "items-center",
      "gap": "gap-8"
    },
    "background": {
      "color": "#ffffff"
    },
    "padding": "p-8",
    "$children": [
      {
        "type": "text",
        "props": {
          "content": "<h2 style='text-align: center'>What Our Customers Say</h2>",
          "padding": "p-0"
        }
      },
      {
        "type": "testimonials",
        "props": {
          "orientation": "horizontal",
          "testimonials": [
            {
              "author": "Sarah Johnson",
              "company": "Tech Solutions Inc.",
              "text": "This platform has revolutionized how we manage our projects. Incredible results!",
              "avatar": {
                "src": "https://via.placeholder.com/60x60.png?text=SJ",
                "alt": "Sarah Johnson"
              },
              "socialIcon": "mdi:linkedin"
            },
            {
              "author": "Mike Chen",
              "company": "Digital Agency",
              "text": "Outstanding support and features. Highly recommend to any growing business.",
              "avatar": {
                "src": "https://via.placeholder.com/60x60.png?text=MC",
                "alt": "Mike Chen"
              },
              "socialIcon": "mdi:twitter"
            }
          ]
        }
      }
    ]
  }
}
```

##### Example: Two-column content layout

```json
{
  "id": "example-4",
  "type": "container",
  "props": {
    "layout": {
      "type": "grid",
      "columns": 2,
      "gap": "gap-8"
    },
    "padding": "p-8",
    "$children": [
      {
        "type": "text",
        "props": {
          "content": "<h3>About Our Company</h3><p>We've been providing innovative solutions since 2010, helping businesses across industries achieve their goals through technology and expertise.</p><p>Our team of dedicated professionals works tirelessly to ensure every client receives personalized service and exceptional results.</p>",
          "background": {
            "backgroundColor": "#f0f9ff"
          },
          "padding": "p-6",
          "border": {
            "borderRadius": "8px"
          }
        }
      },
      {
        "type": "container",
        "props": {
          "layout": {
            "type": "flex",
            "flexDirection": "flex-col",
            "gap": "gap-4"
          },
          "$children": [
            {
              "type": "text",
              "props": {
                "content": "<h4>Key Stats</h4>",
                "padding": "p-0"
              }
            },
            {
              "type": "text",
              "props": {
                "content": "<strong>500+</strong> Happy Customers",
                "background": {
                  "backgroundColor": "#dcfce7"
                },
                "padding": "p-3",
                "border": {
                  "borderRadius": "6px"
                }
              }
            },
            {
              "type": "text",
              "props": {
                "content": "<strong>10+</strong> Years Experience",
                "background": {
                  "backgroundColor": "#dbeafe"
                },
                "padding": "p-3",
                "border": {
                  "borderRadius": "6px"
                }
              }
            },
            {
              "type": "text",
              "props": {
                "content": "<strong>99.9%</strong> Uptime Record",
                "background": {
                  "backgroundColor": "#fef3c7"
                },
                "padding": "p-3",
                "border": {
                  "borderRadius": "6px"
                }
              }
            }
          ]
        }
      }
    ]
  }
}
```

##### Example: Call-to-action section with centered alignment

```json
{
  "id": "example-5",
  "type": "container",
  "props": {
    "layout": {
      "type": "flex",
      "direction": "flex-col",
      "alignItems": "items-center",
      "justifyContent": "justify-center",
      "gap": "gap-4"
    },
    "padding": "p-16",
    "effects": {
      "shadow": "shadow-2xl"
    },
    "$children": [
      {
        "type": "hero",
        "props": {
          "content": "Ready to Get Started?",
          "tagline": "Join thousands of satisfied customers and transform your business today",
          "align": "center",
          "color": "#ffffff",
          "padding": "p-0",
          "effects": {
            "textShadow": "2px 2px 4px rgba(0,0,0,0.5)"
          }
        }
      },
      {
        "type": "container",
        "props": {
          "layout": {
            "type": "flex",
            "flexDirection": "flex-row",
            "gap": "gap-4"
          },
          "$children": [
            {
              "type": "text",
              "props": {
                "content": "<a href='/signup' style='text-align: center'><strong>Start Free Trial</strong></a>",
                "background": {
                  "backgroundColor": "#ffffff"
                },
                "color": "#667eea",
                "padding": "p-4",
                "border": {
                  "borderRadius": "8px"
                },
                "effects": {
                  "shadow": "shadow-lg"
                }
              }
            },
            {
              "type": "text",
              "props": {
                "content": "<a href='/demo' style='text-align: center'><strong>Watch Demo</strong></a>",
                "background": {
                  "backgroundColor": "transparent"
                },
                "color": "#ffffff",
                "padding": "p-4",
                "border": {
                  "border": "2px solid #ffffff",
                  "borderRadius": "8px"
                }
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Divider Brick (`divider`)

A horizontal or vertical divider

#### Divider Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `orientation`: [optional] `string`.  Values: `horizontal`, `vertical` 
- `color`: [optional] See $ref 'styles:backgroundColor'.  Default: `"bg-base-300"`. 
- `size`: [optional] `string`. Size of the divider. Default: `"100%"`. 

#### Divider Examples

##### Example: Basic horizontal divider

```json
{
  "id": "example-1",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-base-300",
    "size": "100%"
  }
}
```

##### Example: Accent colored divider for emphasis

```json
{
  "id": "example-2",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-blue-500",
    "size": "100%"
  }
}
```

##### Example: Short horizontal divider for content breaks

```json
{
  "id": "example-3",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-base-300",
    "size": "50%"
  }
}
```

##### Example: Thin vertical divider for compact layouts

```json
{
  "id": "example-4",
  "type": "divider",
  "props": {
    "orientation": "vertical",
    "color": "bg-gray-300",
    "size": "75%"
  }
}
```

##### Example: Bold primary colored section divider

```json
{
  "id": "example-5",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-primary",
    "size": "100%"
  }
}
```

##### Example: Error colored divider for attention

```json
{
  "id": "example-6",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-red-500",
    "size": "100%"
  }
}
```

##### Example: Full height vertical divider for panels

```json
{
  "id": "example-7",
  "type": "divider",
  "props": {
    "orientation": "vertical",
    "color": "bg-base-300",
    "size": "100%"
  }
}
```

##### Example: Secondary colored divider

```json
{
  "id": "example-8",
  "type": "divider",
  "props": {
    "orientation": "horizontal",
    "color": "bg-secondary",
    "size": "100%"
  }
}
```

### Testimonials Brick (`testimonials`)

Display testimonials from users

#### Testimonials Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `orientation`: [optional] `enum`.  Default: `"horizontal"`. Values: `horizontal`, `vertical` 
- `testimonials`: [required] `object[]`.  
  * `author`: [required] `string`.  Default: `"John Doe"`. 
  * `company`: [optional] `string`.  
  * `text`: [required] See $ref 'content:text'.  Default: `"Amazing product!"`. 
  * `avatar`: [optional] See $ref 'assets:image'.  
  * `socialIcon`: [optional] `string`. Iconify reference for the social icon. 


#### Testimonials Examples

##### Example: SaaS platform testimonials with avatars (horizontal)

```json
{
  "id": "example-1",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Sarah Johnson",
        "company": "TechCorp Solutions",
        "text": "This platform has completely transformed how we manage our projects. The intuitive interface and powerful automation features have saved us countless hours.",
        "avatar": {
          "src": "https://via.placeholder.com/80x80.png?text=SJ",
          "alt": "Sarah Johnson profile photo"
        },
        "socialIcon": "mdi:linkedin"
      },
      {
        "author": "Mike Chen",
        "company": "StartupFlow",
        "text": "Outstanding customer support and regular feature updates. We've been using this for over a year and it keeps getting better. Highly recommend!",
        "avatar": {
          "src": "https://via.placeholder.com/80x80.png?text=MC",
          "alt": "Mike Chen profile photo"
        },
        "socialIcon": "mdi:twitter"
      },
      {
        "author": "Emily Rodriguez",
        "company": "Digital Agency Pro",
        "text": "The automation capabilities are game-changing. What used to take us days now happens automatically. It's like having an extra team member.",
        "avatar": {
          "src": "https://via.placeholder.com/80x80.png?text=ER",
          "alt": "Emily Rodriguez profile photo"
        },
        "socialIcon": "mdi:linkedin"
      }
    ]
  }
}
```

##### Example: E-commerce customer reviews (vertical)

```json
{
  "id": "example-2",
  "type": "testimonials",
  "props": {
    "orientation": "vertical",
    "testimonials": [
      {
        "author": "Jessica Williams",
        "company": "Happy Customer",
        "text": "Amazing product quality and fast shipping! The item exceeded my expectations and the customer service was excellent when I had questions.",
        "avatar": {
          "src": "https://via.placeholder.com/60x60.png?text=JW",
          "alt": "Jessica Williams customer photo"
        },
        "socialIcon": "mdi:star"
      },
      {
        "author": "David Park",
        "text": "Five stars! Been using this product for 6 months and it's still going strong. Definitely worth the investment and I've already recommended it to friends.",
        "avatar": {
          "src": "https://via.placeholder.com/60x60.png?text=DP",
          "alt": "David Park customer photo"
        },
        "socialIcon": "mdi:thumbs-up"
      }
    ]
  }
}
```

##### Example: Agency client testimonials with company info

```json
{
  "id": "example-3",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Rachel Thompson",
        "company": "Global Enterprises",
        "text": "The team delivered exceptional results on time and within budget. Their creative approach and attention to detail made all the difference for our brand.",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=RT",
          "alt": "Rachel Thompson headshot"
        },
        "socialIcon": "mdi:briefcase"
      },
      {
        "author": "Alex Kumar",
        "company": "Innovation Labs",
        "text": "Working with this agency was a game-changer for our digital presence. They understood our vision and brought it to life beautifully.",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=AK",
          "alt": "Alex Kumar profile"
        },
        "socialIcon": "mdi:lightbulb"
      },
      {
        "author": "Maria Santos",
        "company": "Retail Plus",
        "text": "Professional, creative, and results-driven. Our website traffic increased by 200% after their redesign. Couldn't be happier!",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=MS",
          "alt": "Maria Santos photo"
        },
        "socialIcon": "mdi:chart-line"
      }
    ]
  }
}
```

##### Example: App user feedback (vertical layout)

```json
{
  "id": "example-4",
  "type": "testimonials",
  "props": {
    "orientation": "vertical",
    "testimonials": [
      {
        "author": "Tom Wilson",
        "text": "This app has made my daily routine so much easier. Love the clean interface and how everything just works seamlessly across all my devices.",
        "avatar": {
          "src": "https://via.placeholder.com/65x65.png?text=TW",
          "alt": "Tom Wilson user photo"
        },
        "socialIcon": "mdi:cellphone"
      },
      {
        "author": "Lisa Chang",
        "text": "Been using this app for months and it's become essential to my workflow. The latest update with AI features is incredibly impressive.",
        "avatar": {
          "src": "https://via.placeholder.com/65x65.png?text=LC",
          "alt": "Lisa Chang profile picture"
        },
        "socialIcon": "mdi:robot"
      },
      {
        "author": "James Miller",
        "text": "Simple, powerful, and reliable. Exactly what I was looking for. The customer support team is also very responsive and helpful.",
        "avatar": {
          "src": "https://via.placeholder.com/65x65.png?text=JM",
          "alt": "James Miller avatar"
        },
        "socialIcon": "mdi:heart"
      }
    ]
  }
}
```

##### Example: Course/education testimonials with social icons

```json
{
  "id": "example-5",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Amanda Foster",
        "company": "UX Designer",
        "text": "This course completely changed my career trajectory. The practical projects and expert feedback helped me land my dream job in just 3 months.",
        "avatar": {
          "src": "https://via.placeholder.com/75x75.png?text=AF",
          "alt": "Amanda Foster student photo"
        },
        "socialIcon": "mdi:school"
      },
      {
        "author": "Carlos Rodriguez",
        "company": "Software Engineer",
        "text": "The instructors are industry experts and the content is always up-to-date. I've taken three courses here and each one exceeded my expectations.",
        "avatar": {
          "src": "https://via.placeholder.com/75x75.png?text=CR",
          "alt": "Carlos Rodriguez profile"
        },
        "socialIcon": "mdi:code-tags"
      }
    ]
  }
}
```

##### Example: Simple testimonials without avatars

```json
{
  "id": "example-6",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Anonymous User",
        "text": "Great service and excellent value for money. Would definitely recommend to others looking for a reliable solution.",
        "socialIcon": "mdi:account-circle"
      },
      {
        "author": "Verified Customer",
        "text": "Quick delivery and exactly as described. Very satisfied with my purchase and the overall experience.",
        "socialIcon": "mdi:check-circle"
      },
      {
        "author": "Beta Tester",
        "text": "Been using the beta version and it's already impressive. Looking forward to the full release with even more features.",
        "socialIcon": "mdi:beta"
      }
    ]
  }
}
```

##### Example: Consultant testimonials with professional focus

```json
{
  "id": "example-7",
  "type": "testimonials",
  "props": {
    "orientation": "vertical",
    "testimonials": [
      {
        "author": "Dr. Patricia Lee",
        "company": "Medical Practice Solutions",
        "text": "The consulting services provided were invaluable to our practice. Revenue increased by 40% and patient satisfaction scores improved significantly.",
        "avatar": {
          "src": "https://via.placeholder.com/80x80.png?text=PL",
          "alt": "Dr. Patricia Lee headshot"
        },
        "socialIcon": "mdi:medical-bag"
      },
      {
        "author": "Robert Kim",
        "company": "Manufacturing Inc.",
        "text": "Their strategic insights helped us streamline operations and reduce costs by 25%. The ROI was evident within the first quarter.",
        "avatar": {
          "src": "https://via.placeholder.com/80x80.png?text=RK",
          "alt": "Robert Kim executive photo"
        },
        "socialIcon": "mdi:factory"
      }
    ]
  }
}
```

##### Example: Event testimonials with social media icons

```json
{
  "id": "example-8",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Jennifer Adams",
        "company": "Marketing Director",
        "text": "Best conference I've attended in years! The networking opportunities were incredible and the speakers were top-notch industry leaders.",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=JA",
          "alt": "Jennifer Adams conference attendee"
        },
        "socialIcon": "mdi:twitter"
      },
      {
        "author": "Michael Brown",
        "company": "Tech Startup Founder",
        "text": "The workshops were incredibly practical and I left with actionable strategies I could implement immediately. Already planning to attend next year!",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=MB",
          "alt": "Michael Brown participant photo"
        },
        "socialIcon": "mdi:linkedin"
      },
      {
        "author": "Sophie Chen",
        "company": "Product Manager",
        "text": "Amazing organization and valuable content. Met so many like-minded professionals and learned cutting-edge techniques I'm excited to try.",
        "avatar": {
          "src": "https://via.placeholder.com/70x70.png?text=SC",
          "alt": "Sophie Chen attendee photo"
        },
        "socialIcon": "mdi:instagram"
      }
    ]
  }
}
```

##### Example: Fitness/wellness testimonials with achievement focus

```json
{
  "id": "example-9",
  "type": "testimonials",
  "props": {
    "orientation": "vertical",
    "testimonials": [
      {
        "author": "Mark Thompson",
        "text": "Lost 30 pounds in 4 months following this program! The personalized approach and constant support made all the difference in achieving my goals.",
        "avatar": {
          "src": "https://via.placeholder.com/75x75.png?text=MT",
          "alt": "Mark Thompson transformation photo"
        },
        "socialIcon": "mdi:dumbbell"
      },
      {
        "author": "Anna Johnson",
        "text": "Finally found a workout routine I actually enjoy! The trainers are motivating and the community support keeps me accountable every day.",
        "avatar": {
          "src": "https://via.placeholder.com/75x75.png?text=AJ",
          "alt": "Anna Johnson fitness photo"
        },
        "socialIcon": "mdi:heart-pulse"
      },
      {
        "author": "Chris Davis",
        "text": "This program completely changed my relationship with fitness. I'm stronger, more confident, and have energy I haven't felt in years.",
        "avatar": {
          "src": "https://via.placeholder.com/75x75.png?text=CD",
          "alt": "Chris Davis success photo"
        },
        "socialIcon": "mdi:trophy"
      }
    ]
  }
}
```

##### Example: Restaurant customer reviews with food focus

```json
{
  "id": "example-10",
  "type": "testimonials",
  "props": {
    "orientation": "horizontal",
    "testimonials": [
      {
        "author": "Food Critic Helen",
        "company": "Local Food Blog",
        "text": "Exceptional cuisine and impeccable service! Every dish was a masterpiece and the attention to detail was remarkable. A true culinary experience.",
        "avatar": {
          "src": "https://via.placeholder.com/65x65.png?text=HC",
          "alt": "Helen food critic photo"
        },
        "socialIcon": "mdi:silverware-fork-knife"
      },
      {
        "author": "Regular Customer Joe",
        "text": "Been coming here for years and it never disappoints. The staff knows my order by heart and the quality is consistently outstanding.",
        "avatar": {
          "src": "https://via.placeholder.com/65x65.png?text=JC",
          "alt": "Joe regular customer"
        },
        "socialIcon": "mdi:food"
      }
    ]
  }
}
```

### Timeline Brick (`timeline`)

A timeline element for showing chronological events
This timeline element displays a series of chronological events, milestones, or processes.
    It can be used for company history, project roadmaps, or any sequential information.
    Each item has a date/time, title, description, and optional icon.

#### Timeline Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `container`: [optional] `object`.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
  * `padding`: [optional] See $ref 'styles:padding'.  
  * `border`: [optional] See $ref 'styles:border'.  
  * `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 
- `items`: [required] `object[]`.  
  * `date`: [required] `string`. Date or time period for this event. Default: `"2024"`. 
  * `title`: [required] See $ref 'content:text'.  Default: `"Event title"`. 
  * `description`: [required] See $ref 'content:text'.  Default: `"Event description"`. 
  * `icon`: [optional] `string`. Icon to display (iconify reference). 

- `variants`: [required] `array`.  Default: `["vertical","with-connectors"]`. Values: `vertical` (Display timeline vertically), `horizontal` (Display timeline horizontally), `alternating` (Alternate items left and right (vertical only)), `with-connectors` (Show connecting lines between items), `minimal` (Simple design with less visual elements), `card-style` (Display each item as a card) 
- `appearance`: [optional] `object`.  
  * `lineColor`: [optional] `string`. Color for the timeline dot/line. Default: `"primary"`. Values: `primary`, `secondary`, `accent` 
  * `lineWidth`: [optional] `enum`.  Default: `"border-2"`. Values: `border-2`, `border-4`, `border-8` 
  * `dotSize`: [optional] `enum`.  Default: `"w-4"`. Values: `w-3`, `w-4`, `w-6`, `w-8` 
  * `datePosition`: [optional] `enum`.  Default: `"above"`. Values: `above`, `below`, `inline` 
- `textStyles`: [optional] `object`.  
  * `dateColor`: [optional] See $ref 'styles:color'.  Default: `"text-base-content/70"`. 
  * `titleColor`: [optional] See $ref 'styles:color'.  Default: `"text-base-content"`. 
  * `descriptionColor`: [optional] See $ref 'styles:color'.  Default: `"text-base-content/80"`. 

#### Timeline Examples

##### Example: Company milestone timeline with alternating layout

```json
{
  "id": "example-1",
  "type": "timeline",
  "props": {
    "container": {
      "backgroundColor": "bg-base-100",
      "padding": "p-8"
    },
    "variants": [
      "vertical",
      "alternating",
      "with-connectors"
    ],
    "appearance": {
      "lineColor": "primary",
      "lineWidth": "border-4",
      "dotSize": "w-6",
      "datePosition": "above"
    },
    "items": [
      {
        "date": "2019",
        "title": "Company Founded",
        "description": "Started our journey with a vision to revolutionize the industry",
        "icon": "mdi:rocket-launch"
      },
      {
        "date": "2020",
        "title": "First Product Launch",
        "description": "Released our flagship product to the market with overwhelming response",
        "icon": "mdi:product-hunt"
      },
      {
        "date": "2021",
        "title": "Series A Funding",
        "description": "Raised $10M in Series A funding to accelerate growth and expansion",
        "icon": "mdi:currency-usd"
      },
      {
        "date": "2023",
        "title": "Global Expansion",
        "description": "Opened offices in Europe and Asia, serving customers worldwide",
        "icon": "mdi:earth"
      },
      {
        "date": "2024",
        "title": "IPO Planning",
        "description": "Preparing for initial public offering and continued growth",
        "icon": "mdi:trending-up"
      }
    ]
  }
}
```

##### Example: Project roadmap with horizontal layout

```json
{
  "id": "example-2",
  "type": "timeline",
  "props": {
    "container": {
      "padding": "p-8"
    },
    "variants": [
      "horizontal",
      "with-connectors",
      "card-style"
    ],
    "appearance": {
      "lineColor": "accent",
      "lineWidth": "border-2",
      "dotSize": "w-4",
      "datePosition": "below"
    },
    "textStyles": {
      "dateColor": "text-primary",
      "titleColor": "text-base-content",
      "descriptionColor": "text-base-content/80"
    },
    "items": [
      {
        "date": "Q1 2024",
        "title": "Planning Phase",
        "description": "Requirements gathering and technical specifications",
        "icon": "mdi:clipboard-text"
      },
      {
        "date": "Q2 2024",
        "title": "Development",
        "description": "Core feature development and testing",
        "icon": "mdi:code-braces"
      },
      {
        "date": "Q3 2024",
        "title": "Beta Testing",
        "description": "User acceptance testing and feedback collection",
        "icon": "mdi:test-tube"
      },
      {
        "date": "Q4 2024",
        "title": "Launch",
        "description": "Production deployment and go-to-market strategy",
        "icon": "mdi:rocket"
      }
    ]
  }
}
```

##### Example: Personal career timeline with minimal design

```json
{
  "id": "example-3",
  "type": "timeline",
  "props": {
    "container": {
      "padding": "p-4"
    },
    "variants": [
      "vertical",
      "minimal"
    ],
    "appearance": {
      "lineColor": "secondary",
      "lineWidth": "border-2",
      "datePosition": "inline"
    },
    "textStyles": {
      "dateColor": "text-base-content/60",
      "titleColor": "text-base-content",
      "descriptionColor": "text-base-content/70"
    },
    "items": [
      {
        "date": "2020-2024",
        "title": "Senior Software Engineer",
        "description": "Led development of microservices architecture at Tech Startup Inc."
      },
      {
        "date": "2018-2020",
        "title": "Full Stack Developer",
        "description": "Built scalable web applications using React and Node.js at Digital Agency"
      },
      {
        "date": "2016-2018",
        "title": "Junior Developer",
        "description": "Started career developing mobile apps and learning modern frameworks"
      },
      {
        "date": "2012-2016",
        "title": "Computer Science Degree",
        "description": "Bachelor's degree in Computer Science from State University"
      }
    ]
  }
}
```

##### Example: Product development phases with card styling

```json
{
  "id": "example-4",
  "type": "timeline",
  "props": {
    "container": {
      "backgroundColor": "bg-base-50",
      "padding": "p-8"
    },
    "variants": [
      "vertical",
      "card-style",
      "with-connectors"
    ],
    "appearance": {
      "lineColor": "accent",
      "lineWidth": "border-4",
      "dotSize": "w-6",
      "datePosition": "above"
    },
    "textStyles": {
      "dateColor": "text-accent",
      "titleColor": "text-base-content",
      "descriptionColor": "text-base-content/80"
    },
    "items": [
      {
        "date": "Phase 1",
        "title": "Research & Discovery",
        "description": "Market research, user interviews, and competitive analysis to understand user needs",
        "icon": "mdi:magnify"
      },
      {
        "date": "Phase 2",
        "title": "Design & Prototyping",
        "description": "Create wireframes, mockups, and interactive prototypes for user testing",
        "icon": "mdi:palette"
      },
      {
        "date": "Phase 3",
        "title": "Development",
        "description": "Build the product using agile methodology with continuous integration",
        "icon": "mdi:hammer-wrench"
      },
      {
        "date": "Phase 4",
        "title": "Testing & QA",
        "description": "Comprehensive testing including unit tests, integration tests, and user acceptance testing",
        "icon": "mdi:bug"
      },
      {
        "date": "Phase 5",
        "title": "Launch & Monitor",
        "description": "Product launch with monitoring, analytics, and continuous improvement based on user feedback",
        "icon": "mdi:rocket-launch"
      }
    ]
  }
}
```

##### Example: Event schedule timeline with large dots

```json
{
  "id": "example-5",
  "type": "timeline",
  "props": {
    "container": {
      "backgroundColor": "bg-primary/5",
      "padding": "p-8"
    },
    "variants": [
      "vertical",
      "with-connectors"
    ],
    "appearance": {
      "lineColor": "primary",
      "lineWidth": "border-8",
      "dotSize": "w-6",
      "datePosition": "above"
    },
    "textStyles": {
      "dateColor": "text-primary",
      "titleColor": "text-primary",
      "descriptionColor": "text-base-content"
    },
    "items": [
      {
        "date": "9:00 AM",
        "title": "Registration & Welcome",
        "description": "Check-in, networking breakfast, and welcome address by the CEO",
        "icon": "mdi:account-check"
      },
      {
        "date": "10:00 AM",
        "title": "Keynote Presentation",
        "description": "Future of Technology: Trends and Innovations Shaping Tomorrow",
        "icon": "mdi:presentation"
      },
      {
        "date": "11:30 AM",
        "title": "Panel Discussion",
        "description": "Industry leaders discuss challenges and opportunities in digital transformation",
        "icon": "mdi:account-group"
      },
      {
        "date": "1:00 PM",
        "title": "Networking Lunch",
        "description": "Catered lunch with opportunities to connect with speakers and attendees",
        "icon": "mdi:food"
      },
      {
        "date": "2:30 PM",
        "title": "Workshop Sessions",
        "description": "Hands-on workshops covering AI, cloud computing, and cybersecurity",
        "icon": "mdi:school"
      },
      {
        "date": "4:00 PM",
        "title": "Closing Remarks",
        "description": "Summary of key insights and announcement of next year's conference",
        "icon": "mdi:microphone"
      }
    ]
  }
}
```

### Accordion Brick (`accordion`)

An accordion/collapse element for expandable content
This accordion element displays content in collapsible panels.
It is typically used for FAQ sections, organized documentation, or to save space.
Each item has a title and expandable content area.
Multiple panels can be open simultaneously or limited to one at a time.

#### Accordion Props

- `hidden`: [optional] See $ref 'styles:hidden'.  
- `preset`: [optional] See $ref 'styles:preset'.  
- `container`: [optional] `object`.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
  * `padding`: [optional] See $ref 'styles:padding'.  
  * `border`: [optional] See $ref 'styles:border'.  
  * `shadow`: [optional] `string`.  Default: `"shadow-none"`. Values: `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` 
- `items`: [required] `object[]`.  
  * `title`: [required] See $ref 'content:text'.  Default: `"My title"`. 
  * `content`: [required] See $ref 'content:text'.  Default: `"Expandable content goes here"`. 
  * `defaultOpen`: [optional] `boolean`.  Default: `false`. 

- `itemsStyles`: [optional] `object`.  
  * `backgroundColor`: [optional] See $ref 'styles:backgroundColor'.  
  * `color`: [optional] See $ref 'styles:color'.  
  * `fontSize`: [required] `enum`.  Default: `"text-base"`. Values: `inherit`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-7xl` 
- `allowMultiple`: [required] `boolean`. Allow multiple accordion items to be open at the same time. Default: `true`. 
- `variants`: [required] `string[]`.  

#### Accordion Examples

##### Example: FAQ section with card styling with single open

```json
{
  "id": "example-1",
  "type": "accordion",
  "props": {
    "container": {
      "backgroundColor": "bg-base-50",
      "padding": "p-8",
      "border": {
        "rounding": "rounded-lg"
      },
      "shadow": "shadow-lg"
    },
    "variants": [
      "collapse-plus"
    ],
    "allowMultiple": false,
    "items": [
      {
        "title": "What is included in the basic plan?",
        "content": "The basic plan includes access to all core features, up to 10 projects, 5GB storage, email support, and basic analytics. You can upgrade at any time to access advanced features like API access, priority support, and unlimited projects.",
        "defaultOpen": true
      },
      {
        "title": "How do I cancel my subscription?",
        "content": "You can cancel your subscription at any time from your account settings. Go to Billing > Manage Subscription > Cancel. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle."
      },
      {
        "title": "Is there a free trial available?",
        "content": "Yes! We offer a 14-day free trial with full access to all premium features. No credit card required to start. You can upgrade to a paid plan anytime during or after the trial period."
      },
      {
        "title": "What payment methods do you accept?",
        "content": "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners."
      },
      {
        "title": "Do you offer refunds?",
        "content": "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund."
      }
    ]
  }
}
```

##### Example: Product features with arrow indicator and multiple open

```json
{
  "id": "example-2",
  "type": "accordion",
  "props": {
    "container": {
      "padding": "p-4"
    },
    "variants": [
      "collapse-arrow"
    ],
    "allowMultiple": true,
    "items": [
      {
        "title": "Advanced Analytics",
        "content": "Get detailed insights into your data with our comprehensive analytics dashboard. Track key metrics, generate custom reports, and identify trends with powerful visualization tools.",
        "defaultOpen": true
      },
      {
        "title": "Team Collaboration",
        "content": "Work seamlessly with your team using real-time collaboration features. Share projects, assign tasks, leave comments, and track progress all in one place."
      },
      {
        "title": "API Integration",
        "content": "Connect with your existing tools and workflows using our robust API. Full documentation, SDKs for popular languages, and webhook support included."
      },
      {
        "title": "Security & Compliance",
        "content": "Enterprise-grade security with SOC 2 compliance, data encryption at rest and in transit, SSO support, and comprehensive audit logs."
      }
    ]
  }
}
```
