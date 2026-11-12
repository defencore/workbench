# GitHub Pages deployment

Production address: https://workbench.defencore.com

Source repository: https://github.com/defencore/workbench

The application is a static Vite build. It needs no backend, database, account system, or production secrets. Personal preferences and learning progress stay in the visitor's browser.

## Publication

The workflow in `.github/workflows/deploy.yml` builds on every push to `main`, and can also run from the Actions tab. It installs the committed lockfile with `npm ci`, runs the TypeScript checks and production build, uploads `dist`, then publishes it to the `github-pages` environment. Official GitHub actions are pinned to verified commit SHAs. Node.js 24 is used for a consistent build.

In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source. Set **Custom domain** to `workbench.defencore.com`. `public/CNAME` is copied into the build as a record of the intended address; GitHub Actions publishing still requires the custom domain to be configured in Pages settings or through the GitHub API.

For the subdomain, use the DNS record:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | workbench | defencore.github.io |

The target excludes the repository name. If Cloudflare manages DNS, DNS-only mode is the simplest way to let GitHub validate the hostname and issue its HTTPS certificate. After validation, enable **Enforce HTTPS** in Pages settings. GitHub notes that DNS and certificate provisioning can take up to 24 hours.

Do not point the subdomain at a `*.pages.github.io` deployment hostname. If the domain is already proxied through Cloudflare, public DNS may show only Cloudflare IP addresses; verify the underlying CNAME in the DNS provider before changing it.

## Local development and verification

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

The production files are in `dist/`. All application navigation uses URL fragments, so lesson links reload correctly on a static GitHub Pages host without rewrite rules.

## Release verification

1. Confirm the latest **Deploy Workbench to GitHub Pages** workflow succeeds.
2. Open the production address and verify that its assets load over HTTPS.
3. Check Ukrainian and English, search, a lesson, a project, and the interactive 3D viewer.
4. Save a lesson and reload; confirm that the saved state remains in the same browser.
5. Use the application's data-reset controls to confirm that its locally stored preferences and progress can be removed.

## Official documentation

- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Securing a GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
