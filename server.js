const express = require('express');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3050;
const POSTS_DIR = path.join(__dirname, 'posts');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Ensure the posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Turn "My First Post" into "my-first-post"
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'untitled';
}

// Read and parse every markdown file in the posts folder
function getAllPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date) : null,
      excerpt: content.trim().slice(0, 160).replace(/\n+/g, ' '),
      content,
    };
  });

  // Newest first (posts without a date sort last)
  posts.sort((a, b) => (b.date || 0) - (a.date || 0));
  return posts;
}

function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date) : null,
    html: marked.parse(content),
  };
}

// List all posts
app.get('/', (req, res) => {
  const posts = getAllPosts();
  res.render('index', { posts });
});

// Show the "new post" form
app.get('/posts/new', (req, res) => {
  res.render('new', { error: null, formData: { title: '', date: '', content: '' } });
});

// Handle new post submission
app.post('/posts/new', (req, res) => {
  const { title, date, content } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).render('new', {
      error: 'Title and content are required.',
      formData: { title: title || '', date: date || '', content: content || '' },
    });
  }

  const slug = slugify(title);
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  const frontMatter = [
    '---',
    `title: "${title.trim().replace(/"/g, '\\"')}"`,
    `date: "${date && date.trim() ? date.trim() : new Date().toISOString().slice(0, 10)}"`,
    '---',
    '',
    content.trim(),
    '',
  ].join('\n');

  fs.writeFileSync(filePath, frontMatter, 'utf-8');
  res.redirect(`/posts/${slug}`);
});

// Render a single post
app.get('/posts/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).render('404', { slug: req.params.slug });
  }
  res.render('post', { post });
});

app.listen(PORT, () => {
  console.log(`Markdown blog running at http://localhost:${PORT}`);
});
