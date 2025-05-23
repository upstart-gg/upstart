# Upstart SDK

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
We distinguish 2 types of datasources: *internal* (data is stored in the Upstart platform) and *external* (data is stored in an external service, and accessed through an API).
Upstart provides ready-to-use datasources for common use cases, for both internal and external types, such as a blog, a portfolio, or a Youtube playlist. You can also define your own datasources using JSON schemas.

### Datasources Providers
Here are the built-in providers with their schemas:
{{DATASOURCES_PROVIDERS}}

## Bricks
There is a large number of available bricks. Each brick has its own set of attributes.
Bricks can share common styles properties but not necessarily with the same names.
Also note that several properties are required but have a default value.
This means that the default value will be used if the property is not set.

A brick is mainly defined by those properties (non exhaustive):
- `type`: the type of the brick (e.g. `text`, `image`, `video`, `container` etc.)
- `props`: the properties of the brick (e.g. `text`, `image`, `video`, etc.). See below for the available props per brick type.
- `mobileProps`: the optional properties of the brick for mobile devices. Merged with the `props` object. This is useful for bricks that have different properties for mobile devices.
- `$children`: For container-bricks only. An array of children bricks.

### Presets
Most of the bricks have a `preset` prop that will help you style it. When present, you MUST use it.
List of presets:

- `surface-1`: Surface 1. Surface elevation 1
- `surface-2`: Surface 2. Surface elevation 2
- `surface-3`: Surface 3. Surface elevation 3
- `bold-primary`: Bold Primary. Bold display on primary-700 background
- `bold-secondary`: Bold Secondary. Bold display on secondary-700 background
- `bold-accent`: Bold Accent. Bold display on accent-700 background
- `medium-primary`: Medium Primary. Filled display on primary-200 background
- `medium-secondary`: Medium Secondary. Medium display on secondary-200 background
- `medium-accent`: Medium Accent. Medium display on accent-200 background
- `subtle-primary`: Subtle Primary. Subtle display on primary-100 background and 1px border
- `subtle-secondary`: Subtle Secondary. Subtle display on secondary-100 background and 1px border
- `subtle-accent`: Subtle Accent. Subtle display on accent-100 background and 1px border
- `preset-none`: None. No background and no border. This is useful for bricks inside a card or a container that already have a surface/background.


## Variants
Some bricks have `variants` that can be used to change the look and/or layout of the brick.
You can specify multiple variants if they don't share the same prefix.
For example, you can use `variants: ["with-logo-left", "align-h"]` to apply both variants to the brick.

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

### Text (`text`)
Text with formatting options
Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.


Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `content`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>..

### Hero (`hero`)
A big textual element for home pages
This hero element is a large text element that can be used to display a title and an optional tagline.
      It is typically used on home pages to grab the user's attention.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `content`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"I'm a big text"`.
- `tagline`: optional `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"I'm a tagline"`.
- `align`: optional `object`.  Default: `{"horizontal":"justify-start","vertical":"items-center"}`.
  - `horizontal`: required `enum`.  Values: `justify-start`, `justify-center`, `justify-end`
  - `vertical`: required `enum`.  Values: `items-start`, `items-center`, `items-end`

### Image (`image`)
An image brick

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `image`: required `object`.  Default: `{"alt":"Image","fit":"object-cover","position":"object-center"}`.
  - `src`: required `string`. Image URL. Can be a link to an image or a data URI.
  - `alt`: optional `string`. Alternative text for the image. Recommended for screen readers and SEO.
  - `fit`: optional `enum`. How the image should be resized to fit its container. Values: `object-none`, `object-contain`, `object-cover`, `object-fill`, `object-scale-down`
  - `position`: optional `enum`. The position of the image inside its container. Values: `object-top`, `object-center`, `object-bottom`, `object-left`, `object-right`, `object-left-top`, `object-right-top`, `object-left-bottom`, `object-right-bottom`
- `blurHash`: optional `string`. A placeholder for the image while it is loading. Use a blur hash string..
- `author`: optional `object`.
  - `name`: required `string`. Image author. Use this to give credit to the author of the image..
  - `url`: required `string`. Image author URL. Use this to give credit to the author of the image..
- `provider`: optional `string`. Image provider. Use this to give credit to the author of the image..

### Video (`video`)
Youtube video

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `youtubeUrl`: required `string`.

### Card (`card`)
A multi-purpose card that can have a title, subtitle, image, and content

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `variants`: required `array`.  Values: `image-first`, `image-last`, `image-overlay`, `image-left-side`, `image-right-side`, `centered`, `large-padding`
- `cardTitle`: optional `object`.
  - `content`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>..
- `cardImage`: optional `object`.
  - `image`: required `object`.  Default: `{"alt":"Image","fit":"object-cover","position":"object-center"}`.
    - `src`: required `string`. Image URL. Can be a link to an image or a data URI.
    - `alt`: optional `string`. Alternative text for the image. Recommended for screen readers and SEO.
    - `fit`: optional `enum`. How the image should be resized to fit its container. Values: `object-none`, `object-contain`, `object-cover`, `object-fill`, `object-scale-down`
    - `position`: optional `enum`. The position of the image inside its container. Values: `object-top`, `object-center`, `object-bottom`, `object-left`, `object-right`, `object-left-top`, `object-right-top`, `object-left-bottom`, `object-right-bottom`
- `cardBody`: optional `object`.
  - `content`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>..

### Map (`map`)
A map element showing a location
This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `location`: required `object`. The location to display on the map.
  - `lat`: required `number`.
  - `lng`: required `number`.
  - `tooltip`: optional `string`.

### Form (`form`)
A form element
The form brick takes a JSON schema as input and generates a form based on it.
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
The form will be rendered with the specified fields and will handle user input accordingly.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `title`: optional `string`.  The title of the form. Default: `"My form"`.
- `intro`: optional `string`.  The intro text of the form.
- `fields`: required `object`. The JSON schema of the form fields.
- `align`: optional `enum`. The alignment of the form fields. Default is vertical. Only use horizotal for very short forms.. Default: `"vertical"`. Values: `vertical`, `horizontal`

### Sidebar (`sidebar`)
A sidebard element
This brick should be used on most sites/pages for navigation. By deault, it will display links
    to the main pages of the site. You can customize the links by using the 'navigation.navItems' prop.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `container`: required `object`.
  - `fixedPositioned`: optional `boolean`.  Default: `false`.
- `navigation`: required `object`.
  - `datasource`: optional `object`. Reference to a data source. Only used for dynamic websites..
    - `mapping`: required `object`. Mapping of data source fields to brick props.
    - `filters`: optional `object`. Filter data source records.
    - `sort`: optional `object`. Sort data source records.
    - `limit`: optional `number`. Limit the number of records to fetch.
    - `offset`: optional `number`. Offset the records to fetch.
  - `navItems`: optional `object[]`.  Default: `[]`.
    - `urlOrPageId`: required `enum`.  Values: `undefined`, `undefined`


### Gallery (`images-gallery`)
An image collection
This brick should mostly be used for image galleries and collections.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `content`: optional `object`. Reference to a data source. Only used for dynamic websites..
  - `mapping`: required `object`. Mapping of data source fields to brick props.
  - `filters`: optional `object`. Filter data source records.
  - `sort`: optional `object`. Sort data source records.
  - `limit`: optional `number`. Limit the number of records to fetch.
  - `offset`: optional `number`. Offset the records to fetch.
- `styles`: required `object`.
  - `layout`: required `object`.
    - `type`: required `enum`. Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid. Default: `"flex"`. Values: `flex`, `grid`
    - `gap`: required `enum`. Space between items. Values: `gap-0`, `gap-1`, `gap-2`, `gap-4`, `gap-8`, `gap-16`
    - `direction`: optional `enum`. The direction of the container. Only applies to flex layout. Default: `"flex-row"`. Values: `flex-row`, `flex-col`
    - `columns`: optional `number`. Number of columns. Only applies to grid layout.. Default: `2`.
    - `wrap`: required `boolean`. Wrap items.. Default: `true`.
    - `fillSpace`: required `boolean`. Makes items of the container fill the available space.. Default: `false`.
    - `justifyContent`: optional `enum`. Justify content along the main axis (horizontal for row, vertical for column).. Default: `"justify-stretch"`. Values: `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly`, `justify-stretch`
    - `alignItems`: optional `enum`. Align items along the cross axis (vertical for row, horizontal for column).. Default: `"items-stretch"`. Values: `items-start`, `items-center`, `items-end`, `items-stretch`

### Carousel (`carousel`)
A carousel element

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `variants`: required `array`.  Values: `pager-arrows`, `pager-numbers`, `pager-dots`

### Navbar (`navbar`)
A navigation bar with logo and navigation
This brick should be used on most sites/pages.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `container`: required `object`.
  - `fixedPositioned`: optional `boolean`.  Default: `false`.
- `brand`: required `object`.
  - `name`: optional `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Acme Inc."`.
  - `logo`: optional `object`.  Default: `{"alt":"Image","fit":"object-cover","position":"object-center"}`.
    - `src`: required `string`. Image URL. Can be a link to an image or a data URI.
    - `alt`: optional `string`. Alternative text for the image. Recommended for screen readers and SEO.
    - `fit`: optional `enum`. How the image should be resized to fit its container. Values: `object-none`, `object-contain`, `object-cover`, `object-fill`, `object-scale-down`
    - `position`: optional `enum`. The position of the image inside its container. Values: `object-top`, `object-center`, `object-bottom`, `object-left`, `object-right`, `object-left-top`, `object-right-top`, `object-left-bottom`, `object-right-bottom`
  - `hideText`: optional `boolean`.  Default: `false`.
- `navigation`: required `object`.
  - `position`: required `enum`.  Default: `"right"`. Values: `left`, `center`, `right`
  - `datasource`: optional `object`. Reference to a data source. Only used for dynamic websites..
    - `mapping`: required `object`. Mapping of data source fields to brick props.
    - `filters`: optional `object`. Filter data source records.
    - `sort`: optional `object`. Sort data source records.
    - `limit`: optional `number`. Limit the number of records to fetch.
    - `offset`: optional `number`. Offset the records to fetch.
  - `staticItems`: optional `object[]`.  Default: `[]`.
    - `urlOrPageId`: required `enum`.  Values: `undefined`, `undefined`


### Footer (`footer`)
A footer with links and an optional logo

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `variants`: required `array`.  Values: `logo-left` (Logo on the left), `logo-right` (Logo on the right), `logo-center` (Logo at center), `multiple-rows` (Span on multiple rows. Use when there a a lot of links sections)
- `logo`: optional `object`.  Default: `{"alt":"Image","fit":"object-cover","position":"object-center"}`.
  - `src`: required `string`. Image URL. Can be a link to an image or a data URI.
  - `alt`: optional `string`. Alternative text for the image. Recommended for screen readers and SEO.
  - `fit`: optional `enum`. How the image should be resized to fit its container. Values: `object-none`, `object-contain`, `object-cover`, `object-fill`, `object-scale-down`
  - `position`: optional `enum`. The position of the image inside its container. Values: `object-top`, `object-center`, `object-bottom`, `object-left`, `object-right`, `object-left-top`, `object-right-top`, `object-left-bottom`, `object-right-bottom`
- `linksSections`: required `object[]`.
  - `sectionTitle`: required `string`.
  - `row`: optional `number`. Row number of the section. Default: `0`.
  - `links`: required `object[]`.
    - `title`: required `string`.
    - `url`: required `enum`.  Values: `undefined`, `undefined`
    - `column`: optional `number`.  Default: `1`.



### Button (`button`)
A button with text and optional icon

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `variants`: required `array`.  Values: `btn-neutral`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-info`, `btn-success`, `btn-warning`, `btn-error`, `btn-outline`, `btn-dash`, `btn-soft`, `btn-ghost`, `btn-link`, `btn-active`, `btn-disabled`, `btn-xs`, `btn-sm`, `btn-md`, `btn-lg`, `btn-xl`, `btn-wide`, `btn-block`, `btn-square`, `btn-circle`
- `label`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"My button"`.
- `type`: required `enum`. The type of the button. Default: `"button"`. Values: `button`, `submit`, `reset`
- `linkToUrlOrPageId`: optional `enum`.  Values: `undefined`, `undefined`

### Icon (`icon`)
An icon with optional text

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `icon`: required `string`. Icon to display (iconify reference).
- `size`: required `string`. Size of the icon. Default: `"1em"`.

### Social links (`social-links`)
A list of social media links

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `links`: required `object[]`.
  - `href`: required `string`.
  - `label`: optional `string`.
  - `icon`: optional `string`. Icon to display (iconify reference).

- `variants`: required `array`.  Values: `icon-only` (Display only icons), `display-inline` (Display links inline), `display-block` (Display links as block elements)

### Container (`container`)
A container that can hold other bricks and align them horizontally or vertically
A container acts as a flexbox (default) or a grid and allows you to align bricks horizontally, vertically, or in a grid.
Here is an example of a container with a background image and padding, displaying a text and a image horizontaly:

```json
{
"type": "container",
"props": {
  "preset": "bold-primary",
  "layout": {
    "direction": "row",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "$children": [
    {
      "type": "text",
      "preset": "ghost",
      "props": {
        "content": "Hello World"
      }
    },
    {
      "type": "image",
      "props": {
        "src": "https://example.com/image.png",
        // [...]
      }
    }
  ]
}
```


Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `layout`: required `object`.
  - `type`: required `enum`. Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid. Default: `"flex"`. Values: `flex`, `grid`
  - `gap`: required `enum`. Space between items. Values: `gap-0`, `gap-1`, `gap-2`, `gap-4`, `gap-8`, `gap-16`
  - `direction`: optional `enum`. The direction of the container. Only applies to flex layout. Default: `"flex-row"`. Values: `flex-row`, `flex-col`
  - `columns`: optional `number`. Number of columns. Only applies to grid layout.. Default: `2`.
  - `wrap`: required `boolean`. Wrap items.. Default: `true`.
  - `fillSpace`: required `boolean`. Makes items of the container fill the available space.. Default: `false`.
  - `justifyContent`: optional `enum`. Justify content along the main axis (horizontal for row, vertical for column).. Default: `"justify-stretch"`. Values: `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly`, `justify-stretch`
  - `alignItems`: optional `enum`. Align items along the cross axis (vertical for row, horizontal for column).. Default: `"items-stretch"`. Values: `items-start`, `items-center`, `items-end`, `items-stretch`
- `datasource`: optional `object`. Reference to a data source. Only used for dynamic websites..
  - `mapping`: required `object`. Mapping of data source fields to brick props.
  - `filters`: optional `object`. Filter data source records.
  - `sort`: optional `object`. Sort data source records.
  - `limit`: optional `number`. Limit the number of records to fetch.
  - `offset`: optional `number`. Offset the records to fetch.
- `$childrenType`: optional `string`. Type of the child bricks that will be created when container is dynamic..
- `$children`: required `array`. List of nested bricks. Default: `[]`.

### Divider (`divider`)
A horizontal or vertical divider

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `orientation`: optional `enum`. Orientation of the divider. Default: `"horizontal"`. Values: `horizontal`, `vertical`
- `size`: optional `string`. Size of the divider. Default: `"100%"`.

### Testimonials (`testimonials`)
Display testimonials from users

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `orientation`: optional `enum`.  Default: `"horizontal"`. Values: `horizontal`, `vertical`
- `testimonials`: required `object[]`.
  - `author`: required `string`.  Default: `"John Doe"`.
  - `company`: optional `string`.
  - `text`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Amazing product!"`.
  - `avatar`: optional `object`.  Default: `{"alt":"Image","fit":"object-cover","position":"object-center"}`.
    - `src`: required `string`. Image URL. Can be a link to an image or a data URI.
    - `alt`: optional `string`. Alternative text for the image. Recommended for screen readers and SEO.
    - `fit`: optional `enum`. How the image should be resized to fit its container. Values: `object-none`, `object-contain`, `object-cover`, `object-fill`, `object-scale-down`
    - `position`: optional `enum`. The position of the image inside its container. Values: `object-top`, `object-center`, `object-bottom`, `object-left`, `object-right`, `object-left-top`, `object-right-top`, `object-left-bottom`, `object-right-bottom`
  - `socialIcon`: optional `string`. Iconify reference for the social icon.


### Timeline (`timeline`)
A timeline element for showing chronological events
This timeline element displays a series of chronological events, milestones, or processes.
    It can be used for company history, project roadmaps, or any sequential information.
    Each item has a date/time, title, description, and optional icon.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `container`: optional `object`.
- `items`: required `object[]`.
  - `date`: required `string`. Date or time period for this event. Default: `"2024"`.
  - `title`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Event title"`.
  - `description`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Event description"`.
  - `icon`: optional `string`. Icon to display (iconify reference).

- `variants`: required `array`.  Default: `["vertical","with-connectors"]`. Values: `vertical` (Display timeline vertically), `horizontal` (Display timeline horizontally), `alternating` (Alternate items left and right (vertical only)), `with-connectors` (Show connecting lines between items), `minimal` (Simple design with less visual elements), `card-style` (Display each item as a card)
- `appearance`: optional `object`.
  - `lineColor`: optional `string`.  Default: `"bg-base-300"`.
  - `lineWidth`: optional `enum`.  Default: `"border-2"`. Values: `border-2`, `border-4`, `border-8`
  - `dotSize`: optional `enum`.  Default: `"w-4 h-4"`. Values: `w-3 h-3`, `w-4 h-4`, `w-6 h-6`
  - `datePosition`: optional `enum`.  Default: `"above"`. Values: `above`, `below`, `inline`
- `textStyles`: optional `object`.
  - `dateColor`: optional `string`.  Default: `"text-base-content/70"`.
  - `titleColor`: optional `string`.  Default: `"text-base-content"`.
  - `descriptionColor`: optional `string`.  Default: `"text-base-content/80"`.

### Accordion (`accordion`)
An accordion/collapse element for expandable content
This accordion element displays content in collapsible panels.
    It is typically used for FAQ sections, organized documentation, or to save space.
    Each item has a title and expandable content area.
    Multiple panels can be open simultaneously or limited to one at a time.

Props:
- `hidden`: optional `object`.
  - `desktop`: required `boolean`.
  - `mobile`: required `boolean`.
- `preset`: optional `enum` (see docs)
- `container`: optional `object`.
- `items`: required `object[]`.
  - `title`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Section title"`.
  - `content`: required `string`. Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.. Default: `"Expandable content goes here"`.
  - `defaultOpen`: optional `boolean`.  Default: `false`.
  - `icon`: optional `string`. Icon to display (iconify reference).
  - `disabled`: optional `boolean`.  Default: `false`.

- `behavior`: optional `object`.
  - `allowMultiple`: optional `boolean`. Allow multiple accordion items to be open at the same time. Default: `true`.
  - `collapsible`: optional `boolean`. Allow opened items to be collapsed. Default: `true`.
  - `animation`: optional `enum`.  Default: `"slide"`. Values: `none`, `slide`, `fade`
- `variants`: required `array`.  Default: `["bordered","with-icon"]`. Values: `bordered` (Add borders around accordion items), `separated` (Add space between accordion items), `minimal` (Simple design with minimal styling), `card-style` (Display each item as a card), `with-icon` (Show expand/collapse icon), `icon-left` (Position expand icon on the left), `flush` (Remove outer borders and padding)
