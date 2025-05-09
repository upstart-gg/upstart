# Upstart SDK

The Upstart SDK allows users to create and manage websites using a structured JSON format.
It is later converted into a website.
It provides various *bricks* (predefined components) that can be used to build a website. It also
allows users to define themes, site & pages attributes, and other configurations in a structured way.

## Terms
- *Theme*: a set of available colors and fonts
- *Page*: a web page, described by a set of attributes and organized vertically into sections
- *Section*: a logical or aesthetic part of a page
- *Brick*: an element within a section, such as a text block, image, video, etc. Also called *widgets* for some specific types of complex bricks
- *Container*: a specific brick that can contain other bricks within their `$children` prop
- *Datasource*: a defined source of dynamic data that can be consumed by pages.
- *Datarecord*: a defined destination of user submitted data through forms.

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

## PagesMap
The `pagesMap` is a simple map referencing all pages from the site.
The pagesMap does not contain error pages or legal pages, those being auto-generated.

## Page
A page is made of sections. Each section can contain bricks. The page is described by a set of attributes, a list of `sections`, and a list of `bricks`.

## Bricks
There is a large number of available bricks. Each brick has its own set of attributes.
Bellow is a list of available bricks with their properties (aka props). Bricks can share common styles properties but not necessarily with the same names. Also note that several properties are required but have a default value. This means that the default value will be used if the property is not set.
Widgets are spcific types of bricks used to create more complex layouts and interactions. Widgets can be used to create navigation elements, galleries, carousels, etc.

The brick array of a page is composed of brick objects containing the following properties:
- `type`: the type of the brick (e.g. `text`, `image`, `video`, etc.)
- `position`: the brick position (`desktop` and `mobile`) within its section.
- `props`: the properties of the brick (e.g. `text`, `image`, `video`, etc.). See below for the available props per brick type.
- `mobileProps`: the properties of the brick for mobile devices. Merged with the `props` object. This is useful for bricks that have different properties for mobile devices.
- `$children`: For container-bricks only. An array of child bricks. Bricks inside a container do not have a position property.

### Presets
Most of the bricks have a `preset` prop that will help you style it. When present, you MUST use it.
List of presets:

{{PRESETS}}

## Variants
Some bricks have `variants` that can be used to change the look and/or layout of the brick.
You can specify multiple variants if they don't share the same prefix.
For example, you can use `variants: ["with-logo-left", "align-h"]` to apply both variants to the brick.

### Positioning a brick
All bricks are positioned relatively to their section grid.
- The position of a brick relative to its section is defined by the `position` prop.
- Sections grid are:
  * 48 columns wide on desktop
  * 24 columns wide on mobile
- The row height is a fixed 20px on both mobile and desktop
- `x` and `w` properties are specified using grid (columns) units, not pixels! You can also use aliases like `half`, `third`,  `twoThird`, `quarter`, `threeQuarter`, and `full`.
- `y` and  `h` are specifiew in rows, given that a row is always 20px. So `h=2` equals `40px` and `h=30` equals `600px` height. So you should not have bricks higher than `h=30` (600px) for most cases except long texts.
- Children (`$children`) of a `container` are positionned automatically, they don't need the `position` property.
- It's important to compute precisely bricks position so they don't overlap with each other.
- Default values:
  * `x` is `0`
  * `y` is `0`
  * `w` is `full`
  * `h` has no default value so it should always be set
- You can partially set the position of a brick. For example, you can set `h` and `y` only, and the other properties will be set to their default values.

## Available bricks
{{AVAILABLE_BRICKS_SUMMARY}}

{{AVAILABLE_BRICKS}}
