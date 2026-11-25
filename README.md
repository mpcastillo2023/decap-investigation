# Aurora Hall — Decap CMS demo

A fictional, multilingual venue guide built with Docusaurus and Decap CMS. Both the guide and editor are served by one Render Static Site: the guide is at `/` and the editor is at `/admin/`. Spanish content is in `docs/`, English in `i18n/en/docusaurus-plugin-content-docs/current/`, and Catalan in `i18n/ca/docusaurus-plugin-content-docs/current/`.

## Publish the first version

1. Push this repository to `mpcastillo2023/decap-investigation` on `main`.
2. Create a Render Static Site connected to that repository and branch. For manual setup, enter these values in the dashboard; manual creation does not import `render.yaml` automatically:
   - Build command: `npm ci && npm run build`
   - Publish directory: `build`
   - Node version: 24.22.1
   - `SKIP_INSTALL_DEPS=true` (the build command runs `npm ci` itself)
3. Open the assigned Render URL and confirm `/admin/index.html` loads. It is an editor shell at this point; repository login is not configured yet.

Alternatively, create a Render Blueprint from the repository to apply `render.yaml`. Keep the declared service name `decap-investigation` to match the URL fallback used in the site config. Render free tier availability and account limits are controlled by Render.

## Connect DecapBridge

1. Create a DecapBridge site using GitHub repository `mpcastillo2023/decap-investigation`, branch `main`, and the deployed CMS login URL `https://<your-render-host>/admin/index.html`.
2. Create a fine-grained GitHub token limited to this repository with Contents read/write access. If using Decap editorial workflow, also grant Pull requests access. Enter the token only in DecapBridge. Never commit it or put it in Render variables or browser code.
3. Copy the backend/authentication block generated for this DecapBridge site into `cms/admin/config.yml`, replacing the current sample `backend` block. Keep the existing collections and remaining CMS settings.
4. Commit and push the config update. Render rebuilds the site; then sign in at the deployed `/admin/` page. Invite editors from DecapBridge.

DecapBridge generates backend settings for the registered site, so use its block as-is rather than guessing endpoint values. The CMS page and documentation share the same Render domain.

## Local development

Use Node 24.22.1 and run `npm ci` followed by `npm start`. The generated admin shell is copied from `cms/admin/` to `static/admin/` during `npm run build`. Local preview is not a substitute for the configured DecapBridge repository login.

## Content and privacy

All venue details and the SVG illustration are fictional sample content. The deployed site is public, including its docs and editor shell. DecapBridge controls editor sign-in and repository access; it does not make published documentation private. Review content before adding anything private.

## Category visibility

Each language has an independent **Show in menu** toggle in its category settings. Turning it off removes that category and its nested categories from that language's sidebar only; it does not remove the documents from the build, search results, or direct URLs, and it does not restrict access. New categories need the same `customProps.showInMenu` metadata and Decap field in their locale's category collection to use this toggle.

Category forms expose only the menu name, position, and visibility. Collapse behavior and category landing-page configuration are hidden fields: existing values are preserved, and technical changes remain developer-managed.

The document editor's **Folder** field selects the actual directory relative to that language's content root. For example, `affiliates` saves a Spanish document under `docs/affiliates/` and an English document under `i18n/en/docusaurus-plugin-content-docs/current/affiliates/`. Changing this field moves the document; it does not define a second navigation tree. Decap's nested editor uses this path field to choose locations, while Docusaurus builds navigation from the resulting folders.
