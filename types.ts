
export type PostType = 'post' | 'page';

export type PostStatus = 'draft' | 'published' | 'review' | 'scheduled';

export interface Post {
  id: string;
  title: string;
  content: string; // Supports basic HTML/Markdown structure simulation
  excerpt: string;
  slug: string;
  category: string;
  tags?: string; // Comma separated tags
  type: PostType; // 'post' or 'page'
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  views: number;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  keywords?: string; // JSON string or comma separated
  // Page Specific
  canonicalUrl?: string;
  robotsIndex?: 'index' | 'noindex';
  robotsFollow?: 'follow' | 'nofollow';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // For Hierarchy
  seoDescription?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoDescription?: string;
  count?: number;
}

export interface Backlink {
  id: string;
  domain: string;
  pageUrl: string;
  domainAuthority: number;
  spamScore: number;
  backlinkCount: number;
  firstSeen: string;
  lastSeen: string;
}

export interface KeywordRank {
  id: string;
  keyword: string;
  rank: number;
  previousRank: number;
  volume: number; // Search volume
  traffic: number; // Estimated traffic
  difficulty: number;
  url: string;
}

export interface AnalyticsGoal {
  id: string;
  name: string;
  type: 'destination' | 'duration' | 'pages_per_session' | 'event';
  targetValue: string | number;
  completed: number;
  conversionRate: number;
  status: 'active' | 'paused';
}

export interface AdUnitConfig {
  id: string;
  name: string;
  size: string; // 'Responsive', '728x90', '300x250', '160x600'
  type: 'display' | 'feed' | 'article' | 'multiplex';
  placement: string; // 'Header', 'Sidebar', 'In-Content', 'Footer'
  status: 'active' | 'paused' | 'archived';
  earnings: number; // Last 30 days
  impressions: number;
  ctr: number;
  codeSnippet?: string;
}

export type ThemeColor = 'ocean' | 'candy' | 'nature' | 'sunset' | 'royal';

export interface SiteSettings {
  // General
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  bannerUrl: string; // Keep for backward compatibility
  footerText: string;
  language: string;
  timezone: string;
  themeColor: ThemeColor; // Added Theme Color

  // SEO
  googleSearchConsoleId: string;
  bingWebmasterId: string;
  googleAnalyticsId: string;
  robotsTxt: string;

  // Adsense
  adsensePublisherId: string;
  adsenseApiKey: string;
  enableAds: boolean;
  adsenseConnected: boolean;

  // Social
  facebookPixelId: string;
  twitterHandle: string;
  instagramProfile: string;
  linkedinProfile: string;
  ogImage: string;

  // Email
  smtpServer: string;
  smtpPort: string;
  smtpUser: string;
  adminEmail: string;
  enableCommentNotifications: boolean;

  // Performance
  cdnUrl: string;
  enableCache: boolean;
  enableImageOptimization: boolean;
  enableGzip: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string; // Base64 for demo, Real URL for prod
  type: string; // 'image/png', 'application/pdf' etc.
  size: number;
  createdAt: string;
}

export interface GenerationRequest {
  topic: string;
  type: 'outline' | 'article' | 'seo';
}

export enum AnalyticsPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

// --- TEAM & USER TYPES ---
export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'invited';
  lastLogin: string;
  avatar?: string;
  twoFactorEnabled: boolean;
}

export interface LoginLog {
    id: string;
    userId: string; // Reference to User.id or email for external
    userName: string;
    ip: string;
    device: string;
    location: string;
    timestamp: string;
    status: 'success' | 'failed';
}

export interface Session {
    id: string;
    userId: string;
    device: string;
    ip: string;
    lastActive: string;
    isCurrent: boolean;
}

export interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
    scopes: string[];
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}