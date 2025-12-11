
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { 
    getPosts, getSettings, generateSitemapXML, saveSettings, 
    getBacklinks, getKeywords, saveKeyword 
} from '../../services/storage';
import { Post, SiteSettings, Backlink, KeywordRank } from '../../types';
import { 
    FileText, Globe, Search, BarChart2, ExternalLink, 
    CheckCircle, AlertTriangle, XCircle, ArrowUp, ArrowDown, Minus, Save, Plus
} from 'lucide-react';

type SEOTab = 'sitemap' | 'meta' | 'backlinks' | 'keywords';

export const AdminSEO: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SEOTab>('sitemap');
    const [posts, setPosts] = useState<Post[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [sitemapXML, setSitemapXML] = useState('');
    const [robotsTxt, setRobotsTxt] = useState('');
    const [backlinks, setBacklinks] = useState<Backlink[]>([]);
    const [keywords, setKeywords] = useState<KeywordRank[]>([]);
    
    // New Keyword Form
    const [newKeyword, setNewKeyword] = useState('');

    useEffect(() => {
        const p = getPosts();
        const s = getSettings();
        setPosts(p);
        setSettings(s);
        setSitemapXML(generateSitemapXML());
        setRobotsTxt(s.robotsTxt || 'User-agent: *\nAllow: /');
        setBacklinks(getBacklinks());
        setKeywords(getKeywords());
    }, []);

    const handleRobotsSave = () => {
        if (settings) {
            const updated = { ...settings, robotsTxt };
            saveSettings(updated);
            alert('Robots.txt kaydedildi.');
        }
    };

    const handleKeywordAdd = () => {
        if (!newKeyword) return;
        const newK: KeywordRank = {
            id: crypto.randomUUID(),
            keyword: newKeyword,
            rank: 100, // default start
            previousRank: 0,
            volume: 0,
            traffic: 0,
            difficulty: 0,
            url: '/'
        };
        saveKeyword(newK);
        setKeywords(getKeywords());
        setNewKeyword('');
    };

    const getMetaStatus = (length: number, min: number, max: number) => {
        if (length === 0) return <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3"/> Yok</span>;
        if (length < min) return <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Kısa</span>;
        if (length > max) return <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Uzun</span>;
        return <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Uygun</span>;
    };

    const getTrendIcon = (current: number, prev: number) => {
        if (prev === 0) return <Minus className="w-4 h-4 text-gray-500" />;
        if (current < prev) return <ArrowUp className="w-4 h-4 text-green-500" />; // Lower rank is better
        if (current > prev) return <ArrowDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-500" />;
    };

    return (
        <Layout isAdmin>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">SEO Merkezi</h1>
                <p className="text-gray-400 text-sm">Arama motoru optimizasyonu ve site performansı.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
                <button onClick={() => setActiveTab('sitemap')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'sitemap' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                    <Globe className="w-4 h-4" /> Sitemap & Robots
                </button>
                <button onClick={() => setActiveTab('meta')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'meta' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                    <FileText className="w-4 h-4" /> Başlık & Meta Analizi
                </button>
                <button onClick={() => setActiveTab('backlinks')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'backlinks' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                    <ExternalLink className="w-4 h-4" /> Backlink Takibi
                </button>
                <button onClick={() => setActiveTab('keywords')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'keywords' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                    <BarChart2 className="w-4 h-4" /> Keyword Sıralaması
                </button>
            </div>

            {/* --- TAB CONTENT --- */}
            
            {/* 1. SITEMAP MANAGEMENT */}
            {activeTab === 'sitemap' && (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400"/> Sitemap.xml</h3>
                            <p className="text-sm text-gray-400 mb-4">Otomatik oluşturulan site haritanız. Arama motorlarının içeriğinizi keşfetmesine yardımcı olur.</p>
                            <div className="bg-gray-900 p-4 rounded-md border border-gray-800 font-mono text-xs text-gray-300 h-48 overflow-y-auto mb-4 custom-scrollbar">
                                <pre>{sitemapXML}</pre>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => window.open('https://search.google.com/search-console', '_blank')} className="px-4 py-2 bg-white text-slate-900 rounded font-bold text-sm hover:bg-gray-200 transition-colors">
                                    Google Search Console'a Git
                                </button>
                                <button onClick={() => alert('Sitemap Google\'a pinglendi!')} className="px-4 py-2 bg-wp-accent text-white rounded font-bold text-sm hover:bg-blue-600 transition-colors">
                                    Sitemap Gönder
                                </button>
                            </div>
                        </div>

                        <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-[10px] font-bold text-white">RSS</div> RSS Feed</h3>
                            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded border border-gray-800">
                                <span className="text-gray-400 text-sm truncate flex-1">{window.location.origin}/rss.xml</span>
                                <button className="text-wp-accent text-xs font-bold hover:underline" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/rss.xml`)}>Kopyala</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-wp-card p-6 rounded-lg border border-gray-700 h-fit">
                         <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-yellow-400"/> Robots.txt Editörü</h3>
                         <p className="text-sm text-gray-400 mb-4">Botların sitenizi nasıl tarayacağını kontrol edin.</p>
                         <textarea 
                            value={robotsTxt}
                            onChange={(e) => setRobotsTxt(e.target.value)}
                            className="w-full h-64 bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded font-mono text-sm outline-none focus:border-wp-accent resize-none mb-4"
                         ></textarea>
                         <button onClick={handleRobotsSave} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors">
                             <Save className="w-4 h-4"/> Kaydet
                         </button>
                    </div>
                </div>
            )}

            {/* 2. META ANALYSIS */}
            {activeTab === 'meta' && (
                <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                                <tr>
                                    <th className="p-4 w-1/4">Sayfa / İçerik</th>
                                    <th className="p-4 w-1/4">SEO Başlığı (Max 60)</th>
                                    <th className="p-4 w-1/4">Meta Açıklama (Max 160)</th>
                                    <th className="p-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {posts.map(post => {
                                    const titleLen = (post.seoTitle || post.title).length;
                                    const descLen = (post.seoDescription || post.excerpt).length;
                                    return (
                                        <tr key={post.id} className="hover:bg-gray-800/50">
                                            <td className="p-4">
                                                <div className="font-bold text-white truncate max-w-xs">{post.title}</div>
                                                <div className="text-xs text-gray-500 font-mono">/{post.slug}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-400">{titleLen} kr.</span>
                                                    {getMetaStatus(titleLen, 30, 60)}
                                                </div>
                                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${titleLen > 60 || titleLen < 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (titleLen/60)*100)}%`}}></div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-400">{descLen} kr.</span>
                                                    {getMetaStatus(descLen, 120, 160)}
                                                </div>
                                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${descLen > 160 || descLen < 120 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (descLen/160)*100)}%`}}></div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link to={`/admin/editor/${post.id}`} className="text-wp-accent hover:underline text-xs font-bold">Düzenle</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 3. BACKLINK TRACKING */}
            {activeTab === 'backlinks' && (
                <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                     <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                         <h3 className="font-bold text-white">Referrer Domains</h3>
                         <span className="text-xs text-gray-400">Son güncelleme: Bugün</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-800/50 text-gray-400 font-semibold border-b border-gray-700">
                                <tr>
                                    <th className="p-4">Domain</th>
                                    <th className="p-4 text-center">DA</th>
                                    <th className="p-4 text-center">Spam</th>
                                    <th className="p-4 text-center">Link Sayısı</th>
                                    <th className="p-4">Hedef Sayfa</th>
                                    <th className="p-4 text-right">Son Görülme</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {backlinks.map(link => (
                                    <tr key={link.id} className="hover:bg-gray-800/50">
                                        <td className="p-4 font-bold text-white">{link.domain}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${link.domainAuthority > 50 ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-300'}`}>{link.domainAuthority}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${link.spamScore > 5 ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>{link.spamScore}%</span>
                                        </td>
                                        <td className="p-4 text-center">{link.backlinkCount}</td>
                                        <td className="p-4 text-xs text-gray-500 truncate max-w-[150px]">{link.pageUrl}</td>
                                        <td className="p-4 text-right text-xs text-gray-400">{link.lastSeen}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {/* 4. KEYWORD RANKING */}
            {activeTab === 'keywords' && (
                <div className="space-y-6">
                     <div className="bg-wp-card border border-gray-700 rounded-lg p-4 flex gap-4 items-center">
                        <input 
                            type="text" 
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Takip edilecek kelime (örn: lgs matematik)"
                            className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded outline-none focus:border-wp-accent"
                        />
                        <button onClick={handleKeywordAdd} className="bg-wp-accent hover:bg-blue-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                            <Plus className="w-4 h-4"/> Ekle
                        </button>
                     </div>

                     <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                                    <tr>
                                        <th className="p-4">Anahtar Kelime</th>
                                        <th className="p-4 text-center">Sıralama</th>
                                        <th className="p-4 text-center">Değişim</th>
                                        <th className="p-4 text-center">Hacim</th>
                                        <th className="p-4 text-center">Zorluk</th>
                                        <th className="p-4 text-center">Est. Trafik</th>
                                        <th className="p-4 text-right">URL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {keywords.sort((a,b) => a.rank - b.rank).map(kw => (
                                        <tr key={kw.id} className="hover:bg-gray-800/50">
                                            <td className="p-4 font-bold text-white">{kw.keyword}</td>
                                            <td className="p-4 text-center text-lg font-bold">{kw.rank}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {getTrendIcon(kw.rank, kw.previousRank)}
                                                    <span className="text-xs text-gray-400">{kw.previousRank > 0 ? Math.abs(kw.previousRank - kw.rank) : '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-gray-400">{kw.volume.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1 max-w-[60px] mx-auto">
                                                    <div className={`h-full ${kw.difficulty > 60 ? 'bg-red-500' : kw.difficulty > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${kw.difficulty}%`}}></div>
                                                </div>
                                                <span className="text-[10px] text-gray-500">{kw.difficulty}/100</span>
                                            </td>
                                            <td className="p-4 text-center font-mono text-green-400">{kw.traffic}</td>
                                            <td className="p-4 text-right text-xs text-gray-500">{kw.url}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </div>
                </div>
            )}

        </Layout>
    );
};