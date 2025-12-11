
import { SiteSettings, Category, Post, Tag, Backlink, KeywordRank, AnalyticsGoal, AdUnitConfig, User, LoginLog, Session, ApiKey } from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  // General
  siteName: "Dilek Öğretmen",
  siteTagline: "Yeni Nesil Eğitim Platformu",
  siteDescription: "Geleceği şekillendiren zihinler için modern eğitim materyalleri, yeni nesil sınav rehberleri ve ilham veren içerikler.",
  logoUrl: "",
  faviconUrl: "",
  bannerUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  footerText: "Bilgi paylaştıkça çoğalır. Öğrencilerim için sevgiyle hazırlandı.",
  language: "tr",
  timezone: "Europe/Istanbul",

  // SEO
  googleSearchConsoleId: "GSC-Verification-Token-123",
  bingWebmasterId: "",
  googleAnalyticsId: "G-XXXXXXXXXX",
  robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://dilekogretmen.com/sitemap.xml",

  // Adsense
  adsensePublisherId: "pub-xxxxxxxxxxxxxxxx",
  adsenseApiKey: "",
  enableAds: false,
  adsenseConnected: false,

  // Social
  facebookPixelId: "",
  twitterHandle: "@dilekogretmen",
  instagramProfile: "instagram.com/dilekogretmen",
  linkedinProfile: "",
  ogImage: "",

  // Email
  smtpServer: "smtp.gmail.com",
  smtpPort: "587",
  smtpUser: "info@dilekogretmen.com",
  adminEmail: "admin@dilekogretmen.com",
  enableCommentNotifications: true,

  // Performance
  cdnUrl: "",
  enableCache: true,
  enableImageOptimization: true,
  enableGzip: true
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: "LGS Kampı", slug: 'lgs-kampi', description: 'LGS hazırlık süreci notları', seoDescription: '8. Sınıf LGS hazırlık ders notları ve testleri.' },
  { id: '2', name: "Matematik Dünyası", slug: 'matematik-dunyasi', description: 'Matematik konu anlatımları', seoDescription: 'İlkokul ve ortaokul matematik konu anlatımları.' },
  { id: '3', name: "Fen Deneyleri", slug: 'fen-deneyleri', description: 'Evde yapılabilecek deneyler', seoDescription: 'Eğlenceli ve öğretici fen bilimleri deneyleri.' },
  { id: '4', name: "Sınav Taktikleri", slug: 'sinav-taktikleri', description: 'Rehberlik ve motivasyon', seoDescription: 'LGS ve YKS sınavları için taktikler.' },
  { id: '5', name: "Rehberlik", slug: 'rehberlik', description: 'Genel rehberlik yazıları', seoDescription: 'Öğrenci koçluğu ve rehberlik servisi.' },
  { id: '6', name: "Teknoloji & Eğitim", slug: 'teknoloji-egitim', description: 'Eğitimde teknoloji kullanımı', seoDescription: 'Yapay zeka ve dijital eğitim araçları.' },
  { id: '7', name: "8. Sınıf Matematik", slug: '8-sinif-matematik', description: 'LGS Matematik konuları', parentId: '2', seoDescription: '8. sınıf matematik müfredatı ve konu anlatımları.' },
  { id: '8', name: "7. Sınıf Matematik", slug: '7-sinif-matematik', description: '7. sınıf konuları', parentId: '2', seoDescription: '7. sınıf matematik ders notları.' },
  { id: '9', name: "Veli Köşesi", slug: 'veli-kosesi', description: 'Veliler için bilgilendirme', parentId: '5', seoDescription: 'Ebeveynlere özel eğitim rehberliği.' },
  { id: '10', name: "Motivasyon", slug: 'motivasyon', description: 'Başarı hikayeleri', parentId: '5', seoDescription: 'Öğrenciler için motivasyon kaynakları.' }
];

export const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'lgs 2024', slug: 'lgs-2024', count: 15 },
  { id: '2', name: 'matematik', slug: 'matematik', count: 42 },
  { id: '3', name: 'fen bilimleri', slug: 'fen-bilimleri', count: 35 },
  { id: '4', name: 'deneme sınavı', slug: 'deneme-sinavi', count: 20 },
  { id: '5', name: 'yeni nesil sorular', slug: 'yeni-nesil-sorular', count: 18 },
  { id: '6', name: 'pomodoro', slug: 'pomodoro', count: 5 },
  { id: '7', name: 'ders çalışma programı', slug: 'ders-calisma-programi', count: 12 },
  { id: '8', name: 'sınav stresi', slug: 'sinav-stresi', count: 8 },
  { id: '9', name: 'okul öncesi', slug: 'okul-oncesi', count: 4 },
  { id: '10', name: 'eğitim teknolojileri', slug: 'egitim-teknolojileri', count: 9 },
  { id: '11', name: 'yapay zeka', slug: 'yapay-zeka', count: 6 },
  { id: '12', name: 'öğretmen', slug: 'ogretmen', count: 11 },
  { id: '13', name: 'öğrenci', slug: 'ogrenci', count: 25 },
  { id: '14', name: 'veli', slug: 'veli', count: 7 },
  { id: '15', name: 'kitap önerisi', slug: 'kitap-onerisi', count: 3 },
  { id: '16', name: 'motivasyon', slug: 'motivasyon', count: 14 },
  { id: '17', name: 'başarı', slug: 'basari', count: 10 },
  { id: '18', name: 'lgs matematik', slug: 'lgs-matematik', count: 22 },
  { id: '19', name: 'lgs fen', slug: 'lgs-fen', count: 19 },
  { id: '20', name: 'online eğitim', slug: 'online-egitim', count: 8 }
];

export const MOCK_BACKLINKS: Backlink[] = [
    { id: '1', domain: 'meb.gov.tr', pageUrl: '/egitim-haberleri/yeni-mufredat', domainAuthority: 91, spamScore: 1, backlinkCount: 3, firstSeen: '2023-11-15', lastSeen: '2024-03-10' },
    { id: '2', domain: 'eba.gov.tr', pageUrl: '/icerik/matematik-materyalleri', domainAuthority: 88, spamScore: 0, backlinkCount: 12, firstSeen: '2023-09-01', lastSeen: '2024-03-12' },
    { id: '3', domain: 'egitimhane.com', pageUrl: '/forum/8-sinif-lgs', domainAuthority: 45, spamScore: 5, backlinkCount: 8, firstSeen: '2024-01-20', lastSeen: '2024-03-05' },
    { id: '4', domain: 'sorubak.com', pageUrl: '/lgs-puan-hesaplama', domainAuthority: 38, spamScore: 12, backlinkCount: 2, firstSeen: '2024-02-15', lastSeen: '2024-02-15' },
    { id: '5', domain: 'medium.com', pageUrl: '/@egitimgonullusu/en-iyi-bloglar', domainAuthority: 95, spamScore: 2, backlinkCount: 1, firstSeen: '2023-12-05', lastSeen: '2023-12-05' },
    { id: '6', domain: 'facebook.com', pageUrl: '/groups/lgsanneleri', domainAuthority: 96, spamScore: 8, backlinkCount: 45, firstSeen: '2023-05-10', lastSeen: '2024-03-13' }
];

export const MOCK_KEYWORDS: KeywordRank[] = [
    { id: '1', keyword: 'lgs matematik konu anlatımı', rank: 3, previousRank: 5, volume: 12000, traffic: 3400, difficulty: 65, url: '/post/matematik-konu-anlatimi' },
    { id: '2', keyword: '8. sınıf fen deneyleri', rank: 8, previousRank: 12, volume: 5400, traffic: 850, difficulty: 40, url: '/post/evde-fen-deneyleri' },
    { id: '3', keyword: 'sınav stresi ile başa çıkma', rank: 1, previousRank: 2, volume: 2100, traffic: 980, difficulty: 30, url: '/post/sinav-stresi' },
    { id: '4', keyword: 'pomodoro tekniği', rank: 15, previousRank: 14, volume: 45000, traffic: 120, difficulty: 85, url: '/post/pomodoro-teknigi' },
    { id: '5', keyword: 'yeni nesil soru çözüm taktikleri', rank: 4, previousRank: 4, volume: 3200, traffic: 1100, difficulty: 55, url: '/post/yeni-nesil-sorular' },
    { id: '6', keyword: 'lgs puan hesaplama', rank: 102, previousRank: 0, volume: 150000, traffic: 0, difficulty: 98, url: '/page/home' }
];

export const MOCK_ANALYTICS_GOALS: AnalyticsGoal[] = [
    { id: '1', name: 'Bülten Aboneliği', type: 'event', targetValue: 'subscribe', completed: 145, conversionRate: 2.4, status: 'active' },
    { id: '2', name: 'PDF İndirme', type: 'event', targetValue: 'download_pdf', completed: 320, conversionRate: 5.8, status: 'active' },
    { id: '3', name: 'İletişim Formu', type: 'destination', targetValue: '/iletisim-tesekkur', completed: 25, conversionRate: 0.5, status: 'active' },
    { id: '4', name: '5 dk+ Oturum', type: 'duration', targetValue: 300, completed: 850, conversionRate: 15.2, status: 'paused' }
];

export const MOCK_AD_UNITS: AdUnitConfig[] = [
    { id: '1', name: 'Anasayfa Banner', size: 'Responsive', type: 'display', placement: 'Header', status: 'active', earnings: 145.50, impressions: 25000, ctr: 1.2 },
    { id: '2', name: 'Sidebar Kare', size: '300x250', type: 'display', placement: 'Sidebar', status: 'active', earnings: 85.20, impressions: 18000, ctr: 0.8 },
    { id: '3', name: 'Makale İçi (In-Article)', size: 'Fluid', type: 'article', placement: 'In-Content', status: 'active', earnings: 210.00, impressions: 12000, ctr: 2.4 },
    { id: '4', name: 'Makale Sonu (Matched)', size: 'Responsive', type: 'multiplex', placement: 'Below Content', status: 'paused', earnings: 12.00, impressions: 4000, ctr: 0.5 },
];

export const MOCK_USERS: User[] = [
    { id: '1', name: 'Dilek Öğretmen', email: 'dilek@ornek.com', role: 'admin', status: 'active', lastLogin: '2024-03-25T09:30:00', avatar: '', twoFactorEnabled: true },
    { id: '2', name: 'Mehmet Yılmaz', email: 'mehmet@ornek.com', role: 'editor', status: 'active', lastLogin: '2024-03-24T14:20:00', avatar: '', twoFactorEnabled: false },
    { id: '3', name: 'Ayşe Demir', email: 'ayse@ornek.com', role: 'author', status: 'active', lastLogin: '2024-03-23T10:15:00', avatar: '', twoFactorEnabled: false },
    { id: '4', name: 'Fatma Kaya', email: 'fatma@ornek.com', role: 'author', status: 'inactive', lastLogin: '2024-02-15T16:45:00', avatar: '', twoFactorEnabled: false },
    { id: '5', name: 'Ahmet Can', email: 'ahmet@stajyer.com', role: 'viewer', status: 'active', lastLogin: '2024-03-25T11:00:00', avatar: '', twoFactorEnabled: false },
    { id: '6', name: 'Zeynep Su', email: 'zeynep@misafir.com', role: 'viewer', status: 'invited', lastLogin: '', avatar: '', twoFactorEnabled: false }
];

export const MOCK_LOGIN_LOGS: LoginLog[] = [
    { id: '1', userId: '1', userName: 'Dilek Öğretmen', ip: '192.168.1.1', device: 'MacBook Pro / Chrome', location: 'İstanbul, TR', timestamp: '2024-03-25T09:30:00', status: 'success' },
    { id: '2', userId: '2', userName: 'Mehmet Yılmaz', ip: '85.100.x.x', device: 'Windows 10 / Edge', location: 'Ankara, TR', timestamp: '2024-03-24T14:20:00', status: 'success' },
    { id: '3', userId: '1', userName: 'Dilek Öğretmen', ip: '192.168.1.1', device: 'iPhone 13 / Safari', location: 'İstanbul, TR', timestamp: '2024-03-24T08:15:00', status: 'success' },
    { id: '4', userId: '?', userName: 'unknown@admin.com', ip: '45.33.x.x', device: 'Linux / Firefox', location: 'Frankfurt, DE', timestamp: '2024-03-23T03:40:00', status: 'failed' },
    { id: '5', userId: '3', userName: 'Ayşe Demir', ip: '176.23.x.x', device: 'Android / Chrome', location: 'İzmir, TR', timestamp: '2024-03-23T10:15:00', status: 'success' },
];

export const MOCK_SESSIONS: Session[] = [
    { id: 's1', userId: '1', device: 'MacBook Pro / Chrome', ip: '192.168.1.1', lastActive: '2 dk önce', isCurrent: true },
    { id: 's2', userId: '1', device: 'iPhone 13 / Safari', ip: '192.168.1.1', lastActive: '1 gün önce', isCurrent: false },
];

export const MOCK_API_KEYS: ApiKey[] = [
    { id: '1', name: 'Mobil Uygulama', prefix: 'edupress_live_', created: '2023-11-01', lastUsed: '2024-03-25', scopes: ['read:posts', 'read:categories'] },
    { id: '2', name: 'Zapier Entegrasyonu', prefix: 'edupress_zap_', created: '2024-01-15', lastUsed: '2024-03-20', scopes: ['write:posts', 'read:analytics'] }
];

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [
    // --- POSTS ---
    {
      id: "1",
      title: "2024 LGS Maratonu: Son 3 Ayda Netleri Artırmanın Yolları",
      slug: "lgs-maratonu-son-3-ay",
      excerpt: "Sınav yaklaşıyor ve heyecan dorukta! Peki, bu kritik virajda çalışma stratejinizi nasıl değiştirmelisiniz? İşte derece yaptıran taktikler.",
      content: "<p>LGS hazırlık süreci uzun bir maratondur. Bu süreçte sadece çok çalışmak değil, verimli çalışmak da önemlidir.</p><h3>1. Planlı Olun</h3><p>Her gün ne çalışacağınızı önceden belirleyin.</p><h3>2. Uyku Düzeni</h3><p>Zihnin bilgiyi işlemesi için uyku şarttır.</p>",
      category: "Sınav Taktikleri",
      type: 'post',
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 8540,
      featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      seoTitle: "LGS Başarı Rehberi - Dilek Öğretmen",
      seoDescription: "LGS öğrencileri için son 3 ayda net arttırma taktikleri ve çalışma programı.",
      focusKeyword: "LGS 2024",
      tags: "lgs, sınav, motivasyon"
    },
    {
      id: "2",
      title: "Evdeki Malzemelerle Yapabileceğiniz 5 Çılgın Fen Deneyi",
      slug: "evde-fen-deneyleri",
      excerpt: "Bilimi sadece kitaplardan öğrenmek sıkıcı değil mi? Mutfağınızdaki malzemelerle fiziği ve kimyayı keşfetmeye hazır olun.",
      content: "<p>Deney yapmak çocukların merak duygusunu geliştirir.</p>",
      category: "Fen Deneyleri",
      type: 'post',
      status: "published",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 3250,
      featuredImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      seoTitle: "Evde Fen Deneyleri - Eğlenceli Bilim",
      seoDescription: "Çocuklar için evde yapılabilecek güvenli ve eğitici 5 fen deneyi.",
      focusKeyword: "fen deneyi",
      tags: "bilim, deney, evde etkinlik"
    },
    {
      id: "3",
      title: "Matematik Korkusunu Yenmenin 7 Altın Kuralı",
      slug: "matematik-korkusunu-yenmek",
      excerpt: "Matematik zor değil, sadece yanlış anlaşılmış bir derstir. Ön yargılarınızı kırmaya hazır mısınız?",
      content: "<p>Matematik hayatın kendisidir.</p>",
      category: "Matematik Dünyası",
      type: 'post',
      status: "published",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1200,
      featuredImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      seoTitle: "Matematik Korkusu Nasıl Yenilir?",
      seoDescription: "Öğrencilerin matematik ön yargısını kırmak için 7 etkili yöntem.",
      focusKeyword: "matematik korkusu",
      tags: "matematik, psikoloji, başarı"
    },
    {
      id: "4",
      title: "Yeni Nesil Sorular Nasıl Çözülür?",
      slug: "yeni-nesil-sorular-cozum-teknikleri",
      excerpt: "Uzun paragraflar, karmaşık şekiller... Yeni nesil sorular kabusunuz olmasın. Okuduğunu anlama teknikleri burada.",
      content: "<p>Yeni nesil sorular aslında okuduğunu anlama sınavıdır.</p>",
      category: "Sınav Taktikleri",
      type: 'post',
      status: "published",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 4500,
      featuredImage: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      seoTitle: "Yeni Nesil Soru Çözüm Taktikleri",
      seoDescription: "LGS ve YKS için yeni nesil matematik ve fen soruları nasıl çözülür?",
      focusKeyword: "yeni nesil soru",
      tags: "lgs, yks, soru çözümü"
    },
    {
      id: "5",
      title: "Pomodoro Tekniği ile Verimli Ders Çalışma",
      slug: "pomodoro-teknigi",
      excerpt: "25 dakika çalış, 5 dakika mola. Basit ama etkili bu yöntemle odaklanma sorununuzu çözün.",
      content: "<p>Zaman yönetimi başarının anahtarıdır.</p>",
      category: "Rehberlik",
      type: 'post',
      status: "review",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      featuredImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      seoTitle: "Pomodoro ile Odaklanma",
      seoDescription: "Pomodoro tekniği nedir ve öğrenciler için nasıl uygulanır?",
      focusKeyword: "pomodoro",
      tags: "verimli çalışma, zaman yönetimi"
    },
    {
      id: "7",
      title: "Yapay Zeka Destekli Eğitim Araçları",
      slug: "yapay-zeka-egitim",
      excerpt: "Eğitimde devrim yaratan AI araçlarını keşfedin.",
      content: "<p>ChatGPT, Gemini ve daha fazlası...</p>",
      category: "Teknoloji & Eğitim",
      type: 'post',
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      seoTitle: "Eğitimde Yapay Zeka",
      seoDescription: "Öğretmenler ve öğrenciler için en iyi yapay zeka araçları.",
      focusKeyword: "yapay zeka",
      tags: "ai, teknoloji"
    },
    {
      id: "8",
      title: "Hız ve Renk Problemleri Nasıl Çözülür?",
      slug: "hiz-renk-problemleri",
      excerpt: "Fizik dersinin zorlu konusu optik artık çok kolay.",
      content: "...",
      category: "Fen Deneyleri",
      type: 'post',
      status: "scheduled",
      createdAt: new Date(Date.now() + 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      seoTitle: "Optik Konu Anlatımı",
      seoDescription: "Fizik dersi optik ve renkler konusu detaylı anlatım.",
      focusKeyword: "optik",
      tags: "fizik, fen"
    },
    {
      id: "9",
      title: "Paragraf Sorularında Hız Kazanma",
      slug: "paragraf-hiz",
      excerpt: "Türkçe netlerinizi uçuracak taktikler.",
      content: "...",
      category: "Sınav Taktikleri",
      type: 'post',
      status: "published",
      createdAt: new Date(Date.now() - 500000000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 2100,
      seoTitle: "Paragraf Hız Taktikleri",
      seoDescription: "Paragraf sorularını hızlı çözmek için okuma teknikleri.",
      focusKeyword: "paragraf",
      tags: "türkçe, lgs"
    },
    {
      id: "10",
      title: "Üslü Sayılar Konu Anlatımı",
      slug: "uslu-sayilar",
      excerpt: "Matematiğin temeli üslü sayılar.",
      content: "...",
      category: "Matematik Dünyası",
      type: 'post',
      status: "published",
      createdAt: new Date(Date.now() - 600000000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 3400,
      seoTitle: "Üslü Sayılar 8. Sınıf",
      seoDescription: "8. sınıf matematik üslü sayılar konu anlatımı ve örnek sorular.",
      focusKeyword: "üslü sayılar",
      tags: "matematik, 8.sınıf"
    },
    
    // --- PAGES ---
    {
      id: "100",
      title: "Ana Sayfa",
      slug: "home",
      excerpt: "Eğitim materyalleri ve rehberlik.",
      content: "Ana sayfa içeriği...",
      category: "System",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 999999999).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 15000,
      featuredImage: "",
      seoTitle: "Dilek Öğretmen - Eğitim ve Rehberlik",
      seoDescription: "Öğrenciler için ders notları, LGS rehberliği ve motivasyon yazıları.",
      robotsIndex: 'index',
      robotsFollow: 'follow'
    },
    {
      id: "101",
      title: "Hakkımızda",
      slug: "hakkimizda",
      excerpt: "Biz kimiz? Eğitim felsefemiz.",
      content: "Merhaba, ben Dilek. 15 yıllık eğitim tecrübemle buradayım...",
      category: "Kurumsal",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 888888888).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 4500,
      featuredImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      seoTitle: "Hakkımızda - Dilek Öğretmen",
      seoDescription: "Dilek Öğretmen kimdir? Vizyonumuz ve eğitim materyallerimiz hakkında bilgi alın.",
      robotsIndex: 'index',
      robotsFollow: 'follow'
    },
    {
      id: "102",
      title: "İletişim",
      slug: "iletisim",
      excerpt: "Bize ulaşın.",
      content: "<p>Email: info@dilekogretmen.com</p><p>Adres: İstanbul, Türkiye</p>",
      category: "Kurumsal",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 777777777).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1200,
      featuredImage: "",
      seoTitle: "İletişim - Bize Ulaşın",
      seoDescription: "Soru ve görüşleriniz için iletişim formunu kullanabilirsiniz.",
      robotsIndex: 'index',
      robotsFollow: 'follow'
    },
    {
      id: "103",
      title: "Gizlilik Politikası",
      slug: "gizlilik-politikasi",
      excerpt: "Veri güvenliğiniz.",
      content: "<p>Kişisel verileriniz bizim için önemlidir...</p>",
      category: "Yasal",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 666666666).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 300,
      featuredImage: "",
      seoTitle: "Gizlilik Politikası",
      seoDescription: "Web sitemizin gizlilik ve çerez politikası.",
      robotsIndex: 'index',
      robotsFollow: 'nofollow'
    },
    {
      id: "104",
      title: "Kullanım Şartları",
      slug: "kullanim-sartlari",
      excerpt: "Site kuralları.",
      content: "<p>Bu siteyi kullanarak şu şartları kabul etmiş sayılırsınız...</p>",
      category: "Yasal",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 555555555).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 250,
      featuredImage: "",
      seoTitle: "Kullanım Şartları",
      seoDescription: "Site kullanım koşulları ve yasal uyarılar.",
      robotsIndex: 'noindex',
      robotsFollow: 'nofollow'
    },
    {
      id: "105",
      title: "Site Haritası",
      slug: "sitemap",
      excerpt: "Tüm içerikler.",
      content: "<p>Otomatik oluşturulan site haritası...</p>",
      category: "System",
      type: 'page',
      status: "published",
      createdAt: new Date(Date.now() - 444444444).toISOString(),
      updatedAt: new Date().toISOString(),
      views: 800,
      featuredImage: "",
      seoTitle: "Site Haritası",
      seoDescription: "Tüm sayfalar ve yazılar.",
      robotsIndex: 'index',
      robotsFollow: 'follow'
    }
  ];
  return posts;
};

export const MOCK_INITIAL_POSTS: Post[] = generateMockPosts();