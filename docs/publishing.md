# Publish your template

Once you have finished developing your template, you can publish it to the Upstart Platform.

## Prerequisites

Before you can publish your template, you need to have an Upstart account. If you don't have one yet, you can [sign up here](https://upstart.gg).


## Publishing

To publish your template, follow these steps:

1. Log in to the Upstart Platform using the CLI:

:::code-group

```bash [npm]
npm run upstart:login
```

```bash [pnpm]
pnpm upstart:login
```

```bash [yarn]
yarn upstart:login
```
:::

2. Publish your template:

:::code-group

```bash [npm]
npm run enpage:publish
```

```bash [pnpm]
pnpm enpage:publish
```

```bash [yarn]
yarn enpage:publish
```
:::

3. Follow the instructions in the CLI to complete the publishing process.


## Publishing Settings

### Privacy

When you publish a template, you can choose whether it should be public or private.
Public templates can be used by anyone, while private templates are only accessible to you or your organization.

### Category

You have to assign your template to a category. This helps users filter templates when searching for a template to use. The Enpage team will review the category you choose and may change it if it doesn't fit the template.
If you can't find a suitable category, you can suggest a new one or use the "Other" category.

### Readme file

You can include a `README.enpage.md` file with your template. This file will be displayed on the template page in the Upstart Editor. If you don't include a `README.enpage.md` file, the Upstart Editor will display a default message. The `README.enpage.md` file should be written in Markdown format and in English. If you want to provide translations, you can include additional `README.enpage.<lang>.md` files, where `<lang>` is the language code (e.g., `README.enpage.fr.md` for French).

### Premium templates

If you want to sell your template on the Enpage Marketplace, you can mark it as a premium template. Premium templates are only accessible to users with paid Enpage accounts. Templates are not sold. Instead, users pay a subscription fee to access premium templates.

You can learn more about the revenue share model on [the Enpage website](https://enpage.co/publishing).

### Validation


Before a public template is effectively published, the Enpage team will validate it to ensure that it meets the requirements. If the validation fails, you will receive an error message with details on what needs to be fixed.

Private templates are not validated by the Enpage team. You can publish them immediately.

:::warning
Private templates are not available yet. This feature will be available soon.
:::

