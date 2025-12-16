# Ideaforge Site

This repository hosts the public website for the Ideaforge app using GitHub Pages.

## Structure

- `index.md` — Home page
- `privacy-policy.md` — Privacy Policy (required for App Store)
- `_config.yml` — Jekyll site configuration (theme, title, description)

## Publish with GitHub Pages

1. Create a GitHub repository named `ideaforge-site` and push this folder as the root.
2. In GitHub: Settings → Pages → Build and deployment
	- Source: Deploy from a branch
	- Branch: `main` (root)
3. Optional: Set a custom domain (add `CNAME`) and configure DNS.

The site will be available at `https://<your-username>.github.io/ideaforge-site/`.

## Customize

- Replace `support@example.com` and `privacy@example.com` with your real contacts.
- Update `_config.yml` `url` with your actual GitHub Pages URL.
- Adjust content and add more pages as needed (e.g., Terms of Service, FAQs).

## Local preview (optional)

If you want to preview locally with Jekyll:

1. Install Ruby and Bundler.
2. Add a `Gemfile` with `github-pages` gem, run `bundle install`.
3. Run `bundle exec jekyll serve` and open `http://127.0.0.1:4000`.

GitHub Pages can build this site without a custom workflow.

