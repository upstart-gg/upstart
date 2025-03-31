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

### Schema of a theme

{{THEME_JSON_SCHEMA}}

## Template

### Properties

- `manifest`: template manifest object
    - `name`: template name (`string`)
    - `tags`: template tags (`string[]`)
- `themes`: available themes for the website (`array`). See [Theme](#theme) for more details.
- `attributes`: Attributes schema of all available attributes. Those contains the default attributes. See [Attributes](#attributes) for more details.
- `attr`: Attributes default *values* (key/value map) to set for the template.
- `pages`: Pages schema of all available pages. Those contains the default pages. See [Page](#page) for more details.


## Attributes

Both `site` and `page` have attributes. Some attributes are shared between `site` and `page`, while others are specific to one of them. Pages can override site attributes, but not the other way around. The attributes are defined in the template manifest.

Attributes prefixed with `$` are considered as "predefined" attributes and reserved for the SDK. The others are considered as "custom" attributes defined by the template designer or developer.


### Schema of predefined attributes

{{ATTRIBUTES_JSON_SCHEMA}}


## Page

A page is made of sections. Each section can contain bricks. The page is described by a set of attributes, which are defined in the template manifest.

### Props

{{PAGE_JSON_SCHEMA}}

## Sections

A section is a part of a page. A page is organized vertically in sections. A page has one or more sections. Each section can contain bricks.

### Section properties

{{SECTION_JSON_SCHEMA}}


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

{{BRICK_POSITION_JSON_SCHEMA}}


#### Common style props

The following props are commonly used in most bricks.

{{COMMON_STYLES}}


### Available bricks & widgets

{{AVAILABLE_BRICKS}}


## Template examples:

```json
{{TEMPLATE_EXAMPLE}}
```
