# FAQ Data Source

This built-in data source allows you to create a list of frequently asked questions.

## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@upstart.gg/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "myfaq" using the "faq" provider
  myfaq: {
    name: "Frequently Asked Questions",
    provider: "faq",

  }
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

```typescript
<!--@include: ../../../../packages/sdk/src/shared/datasources/internal/faq/schema.ts -->
```
