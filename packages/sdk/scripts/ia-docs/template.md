# Upstart SDK

This document describes how to generate websites using the Upstart SDK.

## Terms

- *Theme*: a set of available colors and fonts.
- *Template*: a ready to use website that can be customized.
- *Page*: a web page, described by a set of attributes.
- *Section*: a part of a page, a page being organized vertically in sections. A page has one or more sections.
- *Brick*: an element within a section, such as a text block, image, video, etc. Also called *widgets* for some specific types of complex bricks.
- *Container*: a specific brick that can contain other bricks within theur `$children` prop.

## Theme

A theme is a set of available colors and fonts. It can be used to customize the look and feel of the website. Each template can provide one or more themes. The first theme is the default theme.

### Instructions:
- Theme names should be creative and related to the site description.
- Use google fonts as much as possible

### Schema of a theme

```json
// JSON Schema for themes
{{THEME_JSON_SCHEMA}}
```

## Attributes

We distinguish 2 types of attributes: *Site* attributes and *page* attributes.
Some attributes are shared between them, while others are specific to one of them. Pages can override site attributes, but not the other way around. Attributes prefixed with `$` are considered as "predefined" attributes and reserved for the SDK. The others are considered as "custom" attributes defined by the template designer or developer.

### Site attributes

```json
// JSON Schema for site attributes
{{SITE_ATTRIBUTES_JSON_SCHEMA}}
```


### PagesMap

The `pagesMap` is a simple map referencing all pages from the site.

#### Instructions
- Don't generate 404, errors pages, or legal pages, they are auto-generated.
- Don't generate optional properties

#### PagesMap JSON Schema

```json
// JSON Schema for pagesMap
{{PAGES_MAP_JSON_SCHEMA}}
```


## Page

A page is made of sections. Each section can contain bricks. The page is described by a set of attributes, which are defined in the template manifest.

### Instructions
- Do not generate undefined or null values
- Generate substancial pages content with textual content using writting style that fits the page/site
- Do not generate empty image values
- Use brick of type "container" to arrange bricks as well as "position" to position them.
- Bricks inside a container do not need a "position" property, they are arranged by the container.
- A section is a part of a page. A page is organized vertically in sections. A page has one or more sections. Each section can contain bricks. Generate pages with at least 3 sections.
- Use beautiful colors for backgrounds and modern design
- Only use images URLs that I will provide you with


### Page Schema

```json
// JSON Schema for a page
{{PAGE_JSON_SCHEMA}}
```


## Bricks & widgets

There is a large number of available bricks. Each brick has its own set of attributes. The attributes are defined in the template manifest.

Bellow is a list of available bricks with their properties (aka props). Bricks can share common styles properties but not necessarily with the same names. Also note that several properties are required but have a default value. This means that the default value will be used if the property is not set.

Widgets are spcific types of bricks used to create more complex layouts and interactions. Widgets can be used to create navigation elements, galleries, carousels, etc.

Some bricks or widgets have `presets` that can be used to quickly apply a set of styles.

The brick array of a page is composed of brick objects containing the following properties:

- `type`: the type of the brick (e.g. `text`, `image`, `video`, etc.)
- `position`: the position of the brick in the section. See below for the available positions.
- `props`: the properties of the brick (e.g. `text`, `image`, `video`, etc.). See below for the available props per brick type.
- `mobileProps`: the properties of the brick for mobile devices. Merged with the `props` object. This is useful for bricks that have different properties for mobile devices.
- `$children`: For container-bricks only. An array of child bricks. Bricks inside a container do not have a position property.


### Positioning a brick

The position of a brick in a section is defined by the `position` property.

#### Brick `position` object

```json
// JSON Schema for brick position
{{BRICK_POSITION_JSON_SCHEMA}}
```


#### Common style props

The following props are commonly used in most bricks.

```json
{{COMMON_STYLES}}
```

### Available bricks & widgets

{{AVAILABLE_BRICKS}}
