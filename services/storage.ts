
import { Post, SiteSettings, Category, MediaItem, Tag, Backlink, KeywordRank } from '../types';
import { DEFAULT_SETTINGS, MOCK_INITIAL_POSTS, DEFAULT_CATEGORIES, DEFAULT_TAGS, MOCK_BACKLINKS, MOCK_KEYWORDS } from '../constants';

const STORAGE_KEYS = {
  POSTS: 'edupress_posts',
  SETTINGS: 'edupress_settings',
  CATEGORIES: 'edupress_categories',
  TAGS: 'edupress_tags',
  MEDIA: 'edupress_media',
  BACKLINKS: 'edupress_backlinks',
  KEYWORDS: 'edupress_keywords'
};

// --- POSTS & PAGES ---
export const getPosts = (): Post[] => {
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(MOCK_INITIAL_POSTS));
    return MOCK_INITIAL_POSTS;
  }
  return JSON.parse(data);
};

export const savePost = (post: Post): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const newPosts = posts.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));
};

export const getPostBySlug = (slug: string): Post | undefined => {
  const posts = getPosts();
  return posts.find((p) => p.slug === slug);
};

// --- CATEGORIES ---
export const getCategories = (): Category[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(data);
};

export const saveCategory = (category: Category): void => {
    const categories = getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);

    if (existingIndex >= 0) {
        categories[existingIndex] = category;
    } else {
        categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export const deleteCategory = (id: string): void => {
    const categories = getCategories();
    const newCategories = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
}

// --- TAGS ---
export const getTags = (): Tag[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(DEFAULT_TAGS));
      return DEFAULT_TAGS;
    }
    return JSON.parse(data);
};
  
export const saveTag = (tag: Tag): void => {
    const tags = getTags();
    const existingIndex = tags.findIndex(t => t.id === tag.id);

    if (existingIndex >= 0) {
        tags[existingIndex] = tag;
    } else {
        tags.push(tag);
    }
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export const deleteTag = (id: string): void => {
    const tags = getTags();
    const newTags = tags.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(newTags));
};

// --- SEO DATA (BACKLINKS & KEYWORDS) ---
export const getBacklinks = (): Backlink[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BACKLINKS);
    if (!data) {
        localStorage.setItem(STORAGE_KEYS.BACKLINKS, JSON.stringify(MOCK_BACKLINKS));
        return MOCK_BACKLINKS;
    }
    return JSON.parse(data);
};

export const getKeywords = (): KeywordRank[] => {
    const data = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
    if (!data) {
        localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(MOCK_KEYWORDS));
        return MOCK_KEYWORDS;
    }
    return JSON.parse(data);
};

export const saveKeyword = (keyword: KeywordRank): void => {
    const keywords = getKeywords();
    keywords.push(keyword);
    localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
};

// --- SITEMAP GENERATION ---
export const generateSitemapXML = (): string => {
    const posts = getPosts().filter(p => p.status === 'published');
    const categories = getCategories();
    const baseUrl = window.location.origin;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Home
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;

    // Categories
    categories.forEach(cat => {
        xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    // Posts & Pages
    posts.forEach(post => {
        const priority = post.type === 'page' ? '0.7' : '0.9';
        const date = new Date(post.updatedAt).toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${baseUrl}/post/${post.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>${priority}</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
};

// --- MEDIA LIBRARY ---
export const getMedia = (): MediaItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
  return data ? JSON.parse(data) : [];
};

export const saveMedia = (media: MediaItem): void => {
  const list = getMedia();
  list.unshift(media);
  // LocalStorage capacity protection (Demo only)
  if (list.length > 20) list.pop(); 
  localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(list));
};

export const deleteMedia = (id: string): void => {
  const list = getMedia();
  const newList = list.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(newList));
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- SETTINGS ---
export const getSettings = (): SiteSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: SiteSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};