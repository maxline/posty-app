# Contributing to Posty

Thanks for your interest in contributing! This guide focuses on the most common
contribution: adding a new blog post.

## Adding a new post

You can add a post in one of two ways:

### Option 1: Use the web form

1. Start the app: `npm install && npm start`
2. Open http://localhost:3050/posts/new
3. Fill in a title, optional date, and Markdown content, then submit.

The app will slugify the title (e.g. "My First Post" becomes `my-first-post`)
and save it as a new `.md` file in the `posts/` folder.

### Option 2: Add a Markdown file manually

1. Create a new file in the `posts/` folder. The filename (without `.md`)
   becomes the post's URL slug, so use lowercase, hyphen-separated names,
   e.g. `posts/my-new-post.md`.
2. Add front matter at the top of the file, followed by your content:

   ```markdown
   ---
   title: "My New Post"
   date: "2026-07-18"
   ---

   Your **Markdown** content goes here.
   ```

   - `title` is shown on the post list and post page.
   - `date` (format `YYYY-MM-DD`) controls sort order; posts without a date
     sort last.
3. Save the file and restart the server if it's not already running with a
   file watcher. The post will appear automatically on the homepage.

## Guidelines

- Keep filenames unique — an existing slug will be overwritten.
- Write content in standard Markdown (headings, lists, code blocks, etc. are
  all supported).
- Double-check that front matter uses valid YAML (matching quotes, no tabs).

## Submitting changes

1. Create a branch for your change.
2. Commit your changes with a clear message.
3. Open a pull request describing what you added or changed.
