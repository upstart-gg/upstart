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

{{PRESETS}}

## Variants
Some bricks have `variants` that can be used to change the look and/or layout of the brick.
You can specify multiple variants if they don't share the same prefix.
For example, you can use `variants: ["with-logo-left", "align-h"]` to apply both variants to the brick.

## Available bricks
{{AVAILABLE_BRICKS_SUMMARY}}

{{AVAILABLE_BRICKS}}
