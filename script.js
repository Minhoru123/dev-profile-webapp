const siteConfig = {
  brandHref: "./index.html",
  navLinks: [
    { label: "Blog", href: "./blog.html" },
    { label: "Research", href: "./research.html" },
    { label: "Projects", href: "./projects.html" },
    { label: "Public Speaking", href: "./speaking.html" },
    { label: "Archive", href: "./archive.html" }
  ]
};

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Minhoru123", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/minhoru-cotache/", icon: "linkedin" },
  { label: "X", href: "https://x.com/minhorucotache", icon: "x" },
  { label: "Blog", href: "./blog.html", icon: "blog", external: false },
  {
    label: "Email",
    href: "mailto:minhorucotacheleon@gmail.com",
    icon: "mail",
    external: false
  }
];

const speakingItems = [
  {
    title: "Talk Title Placeholder",
    event: "Meetup Name",
    date: "2026",
    summary: "Add your talk summary and what audience learned.",
    slideHref: "#"
  },
  {
    title: "Workshop Placeholder",
    event: "Community Workshop",
    date: "2025",
    summary: "Add details, recording links, and key takeaways.",
    slideHref: "#"
  }
];

const archiveItems = [
  {
    year: "2026",
    item: "Started publishing weekly learning notes on minhorucotache.dev"
  },
  {
    year: "2025",
    item: "Expanded project portfolio with full-stack and cloud-focused work"
  },
  {
    year: "2024",
    item: "Built foundations in web development and engineering workflow"
  }
];

const contentState = {
  blogPosts: [],
  researchItems: [],
  projects: []
};

const dataPaths = {
  blogPosts: "./data/blog.json",
  researchItems: "./data/research.json",
  projects: "./data/projects.json"
};

const articleTypes = {
  blog: {
    collection: "blogPosts",
    label: "Blog",
    listingHref: "./blog.html"
  },
  research: {
    collection: "researchItems",
    label: "Research",
    listingHref: "./research.html"
  }
};

function getCurrentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function renderSiteHeader() {
  const currentPage = getCurrentPage();
  const nav = siteConfig.navLinks
    .map((item) => {
      const hrefPage = item.href.replace("./", "");
      const isActive = hrefPage === currentPage ? "is-active" : "";
      return `<a class="${isActive}" href="${item.href}">${item.label}</a>`;
    })
    .join("");

  return `
    <header class="site-header">
      <a class="brand brand-home" href="${siteConfig.brandHref}" aria-label="Home">
        ${iconSVG("home")}
        <span class="sr-only">Home</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        ${nav}
      </nav>
    </header>
  `;
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <p>&copy; <span id="year"></span> minhorucotache.dev</p>
    </footer>
  `;
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = renderSiteHeader();
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = renderSiteFooter();
  }
}

if (!customElements.get("site-header")) {
  customElements.define("site-header", SiteHeader);
}

if (!customElements.get("site-footer")) {
  customElements.define("site-footer", SiteFooter);
}

function iconSVG(name) {
  const icons = {
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2-6-2m12 4v-3.4a3 3 0 0 0-.8-2.1c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.2-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.3 1.2a11.4 11.4 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.3 4.3 0 0 0-.1 3.2 4.7 4.7 0 0 0-1.2 3.2c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.1V21"></path></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l7.2 9.6L4.3 20h3.2l5.2-5.4 4.1 5.4H20l-7.5-9.8L19.1 4h-3.2l-4.8 5-3.8-5z"></path></svg>',
    blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"></path><path d="M22 7l-10 7L2 7"></path></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path></svg>'
  };

  return icons[name] || icons.blog;
}

function renderSocialLinks() {
  const socialListEl = document.getElementById("social-links");
  if (!socialListEl) return;

  socialListEl.innerHTML = socialLinks
    .map((item) => {
      const externalAttrs = item.external === false ? "" : ' target="_blank" rel="noreferrer"';
      return `
        <li>
          <a href="${item.href}"${externalAttrs} aria-label="${item.label}" title="${item.label}">
            ${iconSVG(item.icon)}
            <span class="sr-only">${item.label}</span>
          </a>
        </li>
      `;
    })
    .join("");
}

function emptyStateCard(message) {
  return `
    <article class="card">
      <h3>No items yet</h3>
      <p>${message}</p>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBodyText(body) {
  if (!body) return "";

  const paragraphs = String(body)
    .split(/\r?\n\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return paragraphs
    .map((part) => `<p>${escapeHtml(part).replaceAll(/\r?\n/g, "<br />")}</p>`)
    .join("");
}

function getArticleHref(type, slug) {
  return `./article.html?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`;
}

async function loadJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function loadContent() {
  const [blogPosts, researchItems, projects] = await Promise.all([
    loadJson(dataPaths.blogPosts),
    loadJson(dataPaths.researchItems),
    loadJson(dataPaths.projects)
  ]);

  contentState.blogPosts = Array.isArray(blogPosts) ? blogPosts : [];
  contentState.researchItems = Array.isArray(researchItems) ? researchItems : [];
  contentState.projects = Array.isArray(projects) ? projects : [];
}

function renderBlogPreview() {
  const previewEl = document.getElementById("post-preview-list");
  if (!previewEl) return;

  const posts = contentState.blogPosts.slice(0, 3);
  if (posts.length === 0) {
    previewEl.innerHTML = emptyStateCard("Add published blog markdown files under content/blog/ to populate this section.");
    return;
  }

  previewEl.innerHTML = posts
    .map(
      (post) => `
        <a class="card card-link" href="${getArticleHref("blog", post.slug)}">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="card-meta">${post.date}</div>
        </a>
      `
    )
    .join("");
}

function renderBlogList() {
  const blogListEl = document.getElementById("blog-post-list");
  if (!blogListEl) return;

  const posts = contentState.blogPosts;
  if (posts.length === 0) {
    blogListEl.innerHTML = emptyStateCard("No published blog posts yet. Create markdown files in content/blog/.");
    return;
  }

  blogListEl.innerHTML = posts
    .map(
      (post) => `
        <a class="card card-link" href="${getArticleHref("blog", post.slug)}">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="card-meta">${post.date}</div>
        </a>
      `
    )
    .join("");
}

function renderProjects() {
  const projectListEl = document.getElementById("project-list");
  if (!projectListEl) return;

  const projects = contentState.projects;
  if (projects.length === 0) {
    projectListEl.innerHTML = emptyStateCard("No published projects yet. Create markdown files in content/projects/.");
    return;
  }

  projectListEl.innerHTML = projects
    .map(
      (project) => `
        <article class="card">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="pill-row">
            ${(project.stack || []).map((item) => `<span class="pill">${item}</span>`).join("")}
          </div>
          <div class="card-links">
            <a href="${project.liveHref}">Live Page</a>
            <a href="${project.githubHref}" target="_blank" rel="noreferrer">GitHub Repo</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSpeaking() {
  const speakingListEl = document.getElementById("speaking-list");
  if (!speakingListEl) return;

  speakingListEl.innerHTML = speakingItems
    .map(
      (talk) => `
        <article class="card">
          <h3>${talk.title}</h3>
          <p>${talk.summary}</p>
          <div class="card-meta">${talk.event} | ${talk.date}</div>
          <div class="card-links">
            <a href="${talk.slideHref}" target="_blank" rel="noreferrer">Slides / Recording</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderArchive() {
  const archiveListEl = document.getElementById("archive-list");
  if (!archiveListEl) return;

  archiveListEl.innerHTML = archiveItems
    .map(
      (entry) => `
        <article class="card">
          <h3>${entry.year}</h3>
          <p>${entry.item}</p>
        </article>
      `
    )
    .join("");
}

function renderResearch() {
  const researchListEl = document.getElementById("research-list");
  if (!researchListEl) return;

  const researchItems = contentState.researchItems;
  if (researchItems.length === 0) {
    researchListEl.innerHTML = emptyStateCard("No published research items yet. Create markdown files in content/research/.");
    return;
  }

  researchListEl.innerHTML = researchItems
    .map(
      (item) => `
        <a class="card card-link" href="${getArticleHref("research", item.slug)}">
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <div class="card-meta">${item.focus} | ${item.date}</div>
        </a>
      `
    )
    .join("");
}

function renderArticlePage() {
  const articleEl = document.getElementById("article-detail");
  if (!articleEl) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const slug = params.get("slug");

  if (!type || !slug || !articleTypes[type]) {
    articleEl.innerHTML = emptyStateCard("Missing or invalid article link.");
    return;
  }

  const config = articleTypes[type];
  const collection = contentState[config.collection];
  const item = collection.find((entry) => entry.slug === slug);

  if (!item) {
    articleEl.innerHTML = emptyStateCard(`Could not find that ${config.label.toLowerCase()} article.`);
    return;
  }

  const summary = item.excerpt || item.summary || "";
  const secondaryMeta = item.focus ? `${escapeHtml(item.focus)} | ` : "";
  const tags = Array.isArray(item.tags) && item.tags.length > 0
    ? `
      <div class="pill-row article-tags">
        ${item.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
    `
    : "";

  articleEl.innerHTML = `
    <article class="article-detail">
      <a class="text-link article-back" href="${config.listingHref}">Back to ${config.label}</a>
      <p class="article-kicker">${config.label}</p>
      <h1 id="article-title">${escapeHtml(item.title)}</h1>
      ${summary ? `<p class="article-summary">${escapeHtml(summary)}</p>` : ""}
      <div class="card-meta">${secondaryMeta}${escapeHtml(item.date || "")}</div>
      ${tags}
      <div class="post-body article-body">${renderBodyText(item.body)}</div>
    </article>
  `;

  document.title = `${item.title} | minhorucotache.dev`;
}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupProfileImageFallback() {
  const imageEl = document.getElementById("profile-image");
  const avatarEl = document.getElementById("profile-avatar");
  if (!imageEl || !avatarEl) return;

  function showFallback() {
    avatarEl.classList.remove("has-image");
    avatarEl.classList.add("no-image");
  }

  imageEl.addEventListener("load", () => {
    avatarEl.classList.add("has-image");
    avatarEl.classList.remove("no-image");
  });

  imageEl.addEventListener("error", showFallback);

  if (!imageEl.getAttribute("src")) {
    showFallback();
  }
}

async function init() {
  renderSocialLinks();
  await loadContent();
  renderBlogPreview();
  renderBlogList();
  renderProjects();
  renderSpeaking();
  renderArchive();
  renderResearch();
  renderArticlePage();
  setCurrentYear();
  setupProfileImageFallback();
}

init();
