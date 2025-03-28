# Upstart SDK

This document describes how to generate websites using the Upstart SDK.

## Terms

- Theme: a set of available colors and fonts.
- Template: a ready to use website that can be customized.
- Page: a web page, described by a set of attributes.
- Section: a part of a page
- Brick: an element within a section, such as a text block, image, or video.
- Container: a specific brick that can contain other bricks.





## Theme

A theme is a set of available colors and fonts. It can be used to customize the look and feel of the website.

### JSON schema of a theme

```json
{{THEME_JSON_SCHEMA}}
```


## Attributes

Both `site` and `page` have attributes. Some attributes are shared between `site` and `page`, while others are specific to one of them. Pages can override site attributes, but not the other way around. The attributes are defined in the template manifest.

Attributes prefixed with `$` are considered as "predefined" attributes and reserved for the SDK. The others are considered as "custom" attributes defined by the template designer or developer.


### JSON schema of predefined attributes

```json
{{ATTRIBUTES_JSON_SCHEMA}}
```


## Page

A page is made of sections. Each section can contain bricks. The page is described by a set of attributes, which are defined in the template manifest.

### JSON schema of a page

```json
{{PAGE_JSON_SCHEMA}}
```


## Bricks

There is a large number of available bricks. Each brick has its own set of attributes. The attributes are defined in the template manifest.

Here is a list of available bricks:

{{AVAILABLE_BRICKS}}

## Template

### Properties

- `manifest`: template manifest
    - `name`: template name (`string`)
    - `tags`: template tags (`string[]`)
- `themes`: available themes for the website (`array`). See [Theme](#theme) for more details.
- `attributes`: Attributes schema of all available attributes. Those contains the [default attributes](#site-attributes).
- `attr`: Attributes values of the template. Those are the default values.
- `pages`: Pages schema of all available pages. Those contains the default pages. See [Page](#page) for more details.

### Template example:

```json
{{TEMPLATE_EXAMPLE}}
```
