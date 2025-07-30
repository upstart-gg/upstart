# Data Sources

Data sources are a way to provide dynamic content to your templates.

Data Sources are defined in the `enpage.config.js` file using the `defineDataSources()` function.
All data sources have a schema associated with them. This schema is used to validate data and provide a better editing experience in the Upstart Editor.

We can distinguish 2 types of data sources:

- **Internal**: Holds data that is managed and edited within the Upstart Editor by the site owner.
- **External**:  Holds data that comes from external sources, such as Social Media websites or APIs. They can be fetched manualy or refreshed automatically at a regular interval.

Enpage provides a large number of built-in data sources that can be used with minimal configuration.

And of course — you can also define your own custom data sources!



## Internal Data Sources

### Using a Built-In Internal Data Source

The following example shows how to define an Internal Data Source that will be used in the
template to display a list of links.


#### Declare your data source in the `enpage.config.js` file

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@upstart.gg/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "mylinks" using the "links" provider
  mylinks: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "Links",
    // use the built-in "links" provider
    provider: "links"
  }
});
```
:::

#### Or use the Enpage CLI

If you don't feel like writing the code manually, you can use the Enpage CLI to add a data source to your project.


::: code-group
```bash [npm]
# Add a data source named "mylinks" using the "links" provider
npm run add-datasource mylinks links
```

```bash [pnpm]
# Add a data source named "mylinks" using the "links" provider
pnpm add-datasource mylinks links
```

```bash [yarn]
# Add a data source named "mylinks" using the "links" provider
yarn add-datasource mylinks links
```
:::

### Using a Custom Internal Data Source

In this example, we define an Internal Data Source that will be used in the template as a list of people.

:::tip
In the example below, we use the helper object `ds` to facilitate the declaration of the Data Source JSON schema.
This helper directly binds the `@sinclair/typebox` library.
See the [typebox documentation](https://github.com/sinclairzx81/typebox) for more information.
:::


::: code-group

```javascript [enpage.config.js]
import { defineDataSources, ds } from "@upstart.gg/sdk/datasources";

// Define an internal data source that will be used
// in the template as a list of links
export const datasources = defineDataSources({
  people: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "People",
    // Schema of the data source
    schema: ds.Array(
      ds.Object({
        firstName: ds.String(),
        lastName: ds.String(),
        rank: ds.Optional(ds.Number()),
      }),
    ),
  }
});
```

:::

## External Data Sources


Enpage provides a large range of built-in External Data Sources that you can use with minimal configuration (such as Youtube, Instagram, etc.). See the [complete list here](./external/).

### Example of External Data Sources

#### `youtube-feed` Data Source

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@upstart.gg/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of videos
export const datasources = defineDataSources({
  videos: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "My Videos",
    // use the built-in youtube-feed provider
    provider: "youtube-feed"
  }
});
```

:::

#### `json` Data Source for fetching data from an API

::: code-group

```javascript [enpage.config.js]
import { defineDataSources, ds } from "@upstart.gg/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of posts
export const datasources = defineDataSources({
  posts: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "My Posts",
    provider: "json",
    options: {
      // URL of the API
      url: "https://api.example.com/blogs/{{ attr.blogId }}/posts",
      // HTTP headers
      headers: {
        Authorization: "Bearer {{ attr.authToken }}"
      }
    },
    // (Optional) JSON schema of the data source (here declared using Typebox)
    // When providibg a schema, Enpage will validate the data
    // before using it in the template. If the data does not match
    // the schema, an error will be displayed in the Upstart Editor.
    // This is useful to prevent errors when the API changes.
    // So it's recommended to define the schema.
    schema: ds.Array(
      ds.Object({
        title: ds.String(),
        body: ds.String(),
      }),
    ),
  },
});
```

:::

> [!TIP]
> You can reference the attributes of the template in the the `url` and `headers` properties.
This way, you can pass dynamic values to your API and have the site owner configure them in the Upstart Editor.
Use the notation <code v-pre>{{ attr.attributeName }}</code> to reference an attribute.
