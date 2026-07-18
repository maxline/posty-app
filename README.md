# Markdown Blog

A tiny Node.js + Express blog that reads posts from Markdown files.

## Features

- Lists all posts from the `posts/` folder
- Renders Markdown to HTML with front matter support (`title`, `date`)
- Web form to add new posts at `/posts/new`

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:3000

## Adding posts

Either use the "+ New Post" form in the app, or drop a `.md` file into `posts/`
with optional front matter:

```markdown
---
title: "My Post"
date: "2026-07-18"
---

Your **markdown** content here.
```
