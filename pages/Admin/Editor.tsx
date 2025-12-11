
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Save, Wand2, ArrowLeft, Loader2, Image as ImageIcon, ExternalLink, Calendar, Link as LinkIcon, X, Check, AlignLeft, AlignCenter, AlignRight, Tag, Gauge, AlertCircle, Globe, Search } from 'lucide-react';
import { Layout, notify } from '../../components/Layout';
import { getPosts, savePost, deletePost, getCategories, getMedia } from '../../services/storage';
import { generateContent } from '../../services/gemini';
import { Post, PostType, Category, MediaItem, PostStatus } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';

export const AdminEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<'featured' | 'content'>('featured'); 
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'right'>('center');

  // Determine Type (Post or Page)
  const queryType = searchParams.get('type') as PostType;
  
  const [formData, setFormData] = useState<Post>({
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Genel',
    tags: '',
    type: queryType || 'post',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    robotsIndex: 'index',
    robotsFollow: 'follow'
  });

  useEffect(() => {
    setCategories(getCategories());
    setMediaList(getMedia());

    if (id) {
        const posts = getPosts();
        const found = posts.find(p => p.id === id);
        if (found) setFormData(found);
    } else if (queryType) {
        setFormData(prev => ({...prev, type: queryType}));
    }

    // Keyboard shortcut for Save (Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, queryType, formData]); // Dependency on formData for closure

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (html: string) => {
      setFormData(prev => ({ ...prev, content: html }));
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      if (!id || !formData.slug) {
         const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
         setFormData(prev => ({ ...prev, title, slug }));
      } else {
         setFormData(prev => ({ ...prev, title }));
      }
  };

  const handleSave = async () => {
      if (!formData.title.trim()) {
          notify('error', 'Başlık alanı zorunludur.');
          return;
      }

      setIsSaving(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      savePost({
          ...formData,
          updatedAt: new Date().toISOString()
      });
      setIsSaving(false);
      notify('success', 'İçerik başarıyla kaydedildi.');
      
      if (!id) {
          // If new post, redirect to list
          navigate(formData.type === 'page' ? '/admin/pages' : '/admin/posts');
      }
  };

  const handleDelete = () => {
      if (!id) return;
      if(window.confirm('Bu içeriği kalıcı olarak silmek istediğinize emin misiniz?')) {
          deletePost(id);
          notify('success', 'İçerik silindi.');
          navigate(formData.type === 'page' ? '/admin/pages' : '/admin/posts');
      }
  };

  const openMediaForContent = () => {
      setMediaMode('content');
      setIsMediaModalOpen(true);
  }

  const openMediaForFeatured = () => {
      setMediaMode('featured');
      setIsMediaModalOpen(true);
  }

  const handleMediaSelect = () => {
      if (selectedMediaUrl) {
          if (mediaMode === 'featured') {
              setFormData(prev => ({ ...prev, featuredImage: selectedMediaUrl }));
          } else {
              let className = 'rounded-lg max-w-full h-auto ';
              if (imageAlignment === 'left') className += 'float-left mr-6 mb-4';
              else if (imageAlignment === 'right') className += 'float-right ml-6 mb-4';
              else className += 'align-center block mx-auto my-4';

              const imgTag = `<img src="${selectedMediaUrl}" class="${className}" alt="İçerik görseli" />`;
              setFormData(prev => ({ ...prev, content: prev.content + imgTag }));
          }
          setIsMediaModalOpen(false);
          setSelectedMediaUrl(null);
      }
  };

  const handleAIGenerate = async (type: 'outline' | 'article' | 'seo') => {
      if (!formData.title) {
          notify('warning', 'AI kullanmadan önce bir başlık girin.');
          return;
      }
      setAiLoading(true);
      const result = await generateContent({ topic: formData.title, type });
      setAiLoading(false);

      if (type === 'seo') {
          try {
              const jsonStr = result.replace(/```json\n|\n```/g, '').trim();
              const seoData = JSON.parse(jsonStr);
              setFormData(prev => ({
                  ...prev,
                  seoTitle: seoData.title || prev.title,
                  seoDescription: seoData.description || prev.excerpt,
                  keywords: seoData.keywords
              }));
              notify('success', 'SEO verileri oluşturuldu.');
          } catch (e) {
              console.error("JSON Parse Error", e);
              notify('error', 'SEO verisi ayrıştırılamadı. Lütfen tekrar deneyin.');
          }
      } else {
          const htmlResult = result.replace(/\n/g, '<br/>').replace(/### (.*)/g, '<h3>$1</h3>');
          setFormData(prev => ({
              ...prev,
              content: prev.content + htmlResult
          }));
          notify('success', 'İçerik taslağı oluşturuldu.');
      }
  };

  // --- SEO Analysis Logic ---
  const calculateSeoScore = () => {
      if (!formData.focusKeyword && formData.type === 'post') return { score: 0, color: 'text-gray-400', label: 'Analiz Yok' };
      
      let points = 50; 
      const kw = (formData.focusKeyword || '').toLowerCase();
      
      if (kw) {
        if (formData.title.toLowerCase().includes(kw)) points += 20;
        if (formData.seoDescription?.toLowerCase().includes(kw)) points += 10;
        if (formData.content.toLowerCase().includes(kw)) points += 10;
      }
      
      if (formData.seoDescription && formData.seoDescription.length > 50) points += 5;
      if (formData.slug.length < 60) points += 5;

      points = Math.min(100, points);

      if (points >= 80) return { score: points, color: 'text-green-500', label: 'Mükemmel' };
      if (points >= 60) return { score: points, color: 'text-yellow-500', label: 'İyi' };
      return { score: points, color: 'text-red-500', label: 'Zayıf' };
  };

  const seoScore = calculateSeoScore();

  return (
    <Layout isAdmin>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-20">
        
        {/* --- LEFT COLUMN (MAIN EDITOR) --- */}
        <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400" aria-label="Geri">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-white">
                    {id ? (formData.type === 'page' ? 'Sayfayı Düzenle' : 'Yazıyı Düzenle') : (formData.type === 'page' ? 'Yeni Sayfa Ekle' : 'Yeni Yazı Ekle')}
                </h1>
            </div>

            {/* Title Input */}
            <div className="bg-wp-card p-6 rounded-lg shadow-sm border border-gray-700 focus-within:border-wp-accent transition-colors">
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleTitleChange} 
                    className="w-full text-3xl font-bold text-white placeholder:text-gray-600 outline-none bg-transparent"
                    placeholder={formData.type === 'page' ? "Sayfa İsmi" : "Yazı Başlığı"}
                    required
                />
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <LinkIcon className="w-3 h-3" />
                    <span>Kalıcı Bağlantı:</span>
                    <input 
                        type="text" 
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="font-mono bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-300 border border-gray-700 outline-none focus:border-wp-accent" 
                    />
                </div>
            </div>

            {/* AI Toolbar */}
            <div className="flex items-center gap-2">
                 <button onClick={() => handleAIGenerate('outline')} disabled={aiLoading} className="text-sm flex items-center gap-1 px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-full transition-colors border border-purple-800 disabled:opacity-50">
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>} Yapay Zeka Taslak
                </button>
                <button onClick={() => handleAIGenerate('article')} disabled={aiLoading} className="text-sm flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-full transition-colors border border-blue-800 disabled:opacity-50">
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>} Makale Yazdır
                </button>
            </div>

            {/* Rich Text Editor */}
            <RichTextEditor 
                value={formData.content} 
                onChange={handleContentChange}
                onImageRequest={openMediaForContent}
            />

            {/* SEO Box */}
            <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-200 text-sm">Arama Motoru Optimizasyonu (SEO)</h3>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-900 ${seoScore.color}`}>
                            <Gauge className="w-3 h-3" /> {seoScore.score}/100 - {seoScore.label}
                        </div>
                    </div>
                    <button onClick={() => handleAIGenerate('seo')} className="text-xs text-wp-accent hover:text-white font-medium flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> AI ile Doldur
                    </button>
                </div>
                <div className="p-4 space-y-4">
                     {formData.type === 'post' && (
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Odak Anahtar Kelime (Focus Keyword)</label>
                            <input 
                                type="text" 
                                name="focusKeyword" 
                                value={formData.focusKeyword || ''} 
                                onChange={handleChange} 
                                placeholder="Örn: lgs matematik"
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded text-sm focus:border-wp-accent outline-none" 
                            />
                            <p className="text-xs text-gray-500 mt-1">İçeriğinizin ana konusunu yazın. SEO puanı buna göre hesaplanır.</p>
                        </div>
                     )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Başlığı</label>
                        <input 
                            type="text" 
                            name="seoTitle" 
                            value={formData.seoTitle} 
                            onChange={handleChange} 
                            placeholder={formData.title}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded text-sm focus:border-wp-accent outline-none" 
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Meta Açıklaması</label>
                            <span className={`text-xs ${(formData.seoDescription?.length || 0) > 155 ? 'text-red-500' : 'text-gray-500'}`}>
                                {formData.seoDescription?.length || 0}/155
                            </span>
                        </div>
                        <textarea 
                            name="seoDescription" 
                            value={formData.seoDescription} 
                            onChange={handleChange} 
                            maxLength={160}
                            rows={2} 
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded text-sm focus:border-wp-accent outline-none"
                        ></textarea>
                         {(formData.seoDescription?.length || 0) > 155 && (
                             <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Google genelde 155 karakterden sonrasını keser.</p>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="w-full lg:w-80 space-y-6">
            
            {/* Publish Box */}
            <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden sticky top-6 z-20">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 font-bold text-gray-200 text-sm">
                    Yayımla
                </div>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-bold uppercase">Durum</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-sm outline-none focus:border-wp-accent"
                        >
                            <option value="draft">Taslak (Draft)</option>
                            <option value="review">İnceleme Bekliyor</option>
                            <option value="published">Yayında (Published)</option>
                            <option value="scheduled">Zamanlanmış (Scheduled)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs text-gray-500 font-bold uppercase">Yayın Tarihi</label>
                         <input 
                            type="datetime-local" 
                            value={formData.createdAt.slice(0, 16)}
                            onChange={(e) => setFormData(p => ({...p, createdAt: new Date(e.target.value).toISOString()}))}
                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-sm outline-none focus:border-wp-accent"
                         />
                    </div>
                </div>
                <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 flex justify-between items-center">
                    {id ? (
                        <button 
                            onClick={handleDelete}
                            className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline"
                        >
                            Sil
                        </button>
                    ) : (
                        <span className="text-xs text-gray-500 italic">Taslak</span>
                    )}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-wp-accent hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Kaydet
                    </button>
                </div>
            </div>

            {/* Page SEO & Crawling (Only for Pages) */}
            {formData.type === 'page' && (
                <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 font-bold text-gray-200 text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-wp-green" /> Tarama ve İndeksleme
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canonical URL</label>
                            <input 
                                type="text" 
                                name="canonicalUrl" 
                                value={formData.canonicalUrl || ''} 
                                onChange={handleChange} 
                                placeholder="https://..."
                                className="w-full bg-gray-900 text-gray-300 px-3 py-2 border border-gray-700 rounded text-xs outline-none focus:border-wp-accent"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Yinelenen içerik sorununu önlemek için.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İndeksleme</label>
                                <select 
                                    name="robotsIndex"
                                    value={formData.robotsIndex || 'index'}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-2 py-1.5 rounded text-xs outline-none focus:border-wp-accent"
                                >
                                    <option value="index">Index</option>
                                    <option value="noindex">NoIndex</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Takip Etme</label>
                                <select 
                                    name="robotsFollow"
                                    value={formData.robotsFollow || 'follow'}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-2 py-1.5 rounded text-xs outline-none focus:border-wp-accent"
                                >
                                    <option value="follow">Follow</option>
                                    <option value="nofollow">NoFollow</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories (Only for Posts) */}
            {formData.type === 'post' && (
                <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 font-bold text-gray-200 text-sm">
                        Kategoriler
                    </div>
                    <div className="p-4 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                        {categories.map(cat => (
                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group hover:bg-gray-800 p-1 rounded -ml-1">
                                <input 
                                    type="radio" 
                                    name="category" 
                                    value={cat.name} 
                                    checked={formData.category === cat.name} 
                                    onChange={handleChange}
                                    className="text-wp-accent focus:ring-wp-accent bg-gray-700 border-gray-600"
                                />
                                <span className="text-sm text-gray-300 group-hover:text-white">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

             {/* Tags */}
             <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 font-bold text-gray-200 text-sm">
                    Etiketler (Tags)
                </div>
                <div className="p-4">
                    <div className="relative">
                        <Tag className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            name="tags"
                            value={formData.tags || ''} 
                            onChange={handleChange} 
                            placeholder="lgs, matematik, sınav..."
                            className="w-full bg-gray-900 text-gray-300 pl-9 pr-3 py-2 border border-gray-700 rounded text-sm outline-none focus:border-wp-accent"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Etiketleri virgül ile ayırın.</p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="bg-wp-card rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 font-bold text-gray-200 text-sm">
                    Öne Çıkan Görsel
                </div>
                <div className="p-4">
                    {formData.featuredImage ? (
                        <div className="relative group">
                            <img src={formData.featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-md border border-gray-600" />
                            <button 
                                onClick={() => setFormData(p => ({...p, featuredImage: ''}))}
                                className="absolute top-1 right-1 bg-gray-900/90 text-red-500 p-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Kaldır
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-32 bg-gray-900 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-gray-500 transition-colors cursor-pointer" onClick={openMediaForFeatured}>
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-xs">Görsel Seç</span>
                        </div>
                    )}
                    
                    <div className="mt-3">
                        <button 
                            onClick={openMediaForFeatured}
                            className="w-full bg-gray-700 text-gray-200 text-xs font-bold py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Kütüphaneden Seç
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MEDIA MODAL --- */}
        {isMediaModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-wp-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up border border-gray-700">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                        <h3 className="font-bold text-white">
                            {mediaMode === 'featured' ? 'Öne Çıkan Görsel Seç' : 'İçeriğe Görsel Ekle'}
                        </h3>
                        <button onClick={() => setIsMediaModalOpen(false)} className="p-1 hover:bg-gray-700 rounded-full text-gray-400"><X className="w-5 h-5"/></button>
                    </div>
                    
                    {/* Alignment Options for Content Mode */}
                    {mediaMode === 'content' && (
                         <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700 flex items-center gap-4">
                             <span className="text-sm font-semibold text-gray-400">Hizalama:</span>
                             <div className="flex bg-gray-900 rounded-lg border border-gray-700 p-1">
                                 <button 
                                    onClick={() => setImageAlignment('left')}
                                    className={`p-1.5 rounded ${imageAlignment === 'left' ? 'bg-wp-accent text-white' : 'text-gray-500 hover:bg-gray-800'}`}
                                 >
                                     <AlignLeft className="w-4 h-4" />
                                 </button>
                                 <button 
                                    onClick={() => setImageAlignment('center')}
                                    className={`p-1.5 rounded ${imageAlignment === 'center' ? 'bg-wp-accent text-white' : 'text-gray-500 hover:bg-gray-800'}`}
                                 >
                                     <AlignCenter className="w-4 h-4" />
                                 </button>
                                 <button 
                                    onClick={() => setImageAlignment('right')}
                                    className={`p-1.5 rounded ${imageAlignment === 'right' ? 'bg-wp-accent text-white' : 'text-gray-500 hover:bg-gray-800'}`}
                                 >
                                     <AlignRight className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {mediaList.filter(m => m.type.startsWith('image/')).map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedMediaUrl(item.url)}
                                    className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 ${selectedMediaUrl === item.url ? 'border-wp-accent ring-2 ring-blue-900' : 'border-transparent hover:border-gray-600'}`}
                                >
                                    <div className="aspect-square bg-gray-800">
                                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    {selectedMediaUrl === item.url && (
                                        <div className="absolute top-2 right-2 bg-wp-accent text-white rounded-full p-1">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {mediaList.filter(m => m.type.startsWith('image/')).length === 0 && (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Kütüphanede resim bulunamadı.</p>
                                    <Link to="/admin/media" className="text-wp-accent underline text-sm">Medya Yükle</Link>
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="p-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-800">
                        <button 
                            onClick={() => setIsMediaModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:bg-gray-700 rounded font-medium"
                        >
                            İptal
                        </button>
                        <button 
                            onClick={handleMediaSelect}
                            disabled={!selectedMediaUrl}
                            className="px-6 py-2 bg-wp-accent text-white rounded font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mediaMode === 'featured' ? 'Öne Çıkan Yap' : 'İçeriğe Ekle'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};