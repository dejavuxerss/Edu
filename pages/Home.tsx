
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, User, BookOpen, Clock, Star, Sparkles, Search, PlayCircle, Users, Download, ChevronRight } from 'lucide-react';
import { getPosts, getSettings, getCategories } from '../services/storage';
import { Post, Category } from '../types';
import { Layout } from '../components/Layout';
import { AdUnit } from '../components/AdUnit';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const settings = getSettings();

  useEffect(() => {
    // Only get Published Posts (not Pages)
    const allPosts = getPosts();
    const publishedPosts = allPosts.filter(p => p.status === 'published' && p.type === 'post');
    
    setPosts(publishedPosts);
    setFilteredPosts(publishedPosts);
    setCategories(getCategories());
    
    document.title = settings.siteName;
  }, [settings.siteName]);

  useEffect(() => {
    let result = posts;
    if (activeCategory !== 'Tümü') {
      result = result.filter(post => post.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(result);
  }, [activeCategory, searchTerm, posts]);

  const featuredPost = filteredPosts.length > 0 && activeCategory === 'Tümü' && !searchTerm ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <Layout>
      {/* --- MODERN HERO SECTION --- */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
             <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8 animate-fade-in-up">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Yeni Eğitim Dönemi İçerikleri Yayında!
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                  Geleceği <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Şekillendiren</span><br/>
                  Eğitim Materyalleri
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {settings.siteDescription}
              </p>
              
              <div className="max-w-2xl mx-auto relative group mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl shadow-brand-900/5 ring-1 ring-slate-100">
                      <div className="pl-4 text-slate-400">
                          <Search className="w-6 h-6" />
                      </div>
                      <input
                        type="text"
                        placeholder="Matematik, Fen, LGS veya bir konu arayın..."
                        className="flex-1 py-3 px-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold transition-transform active:scale-95">
                          Ara
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white relative z-20 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] pt-16 pb-20 min-h-screen">
         <div className="container mx-auto px-4 lg:px-8">
            
            {/* Billboard Ad Slot */}
            <div className="mb-16">
               <AdUnit format="auto" className="h-32 rounded-2xl bg-slate-50 border border-dashed border-slate-200" />
            </div>

            {/* Categories */}
            <div className="mb-12">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Popüler Kategoriler</h2>
                    <a href="#" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">Tümünü Gör <ChevronRight className="w-4 h-4"/></a>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setActiveCategory('Tümü')}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${activeCategory === 'Tümü' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200 hover:text-brand-600'}`}
                    >
                        Tümü
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${activeCategory === cat.name ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200 hover:text-brand-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Main Content Grid */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">İçerik bulunamadı</h3>
                    <p className="text-slate-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                </div>
            ) : (
                <>
                    {/* Featured Post */}
                    {featuredPost && (
                        <Link to={`/post/${featuredPost.slug}`} className="group relative block mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                             <div className="grid md:grid-cols-2 h-full bg-slate-900">
                                 <div className="relative h-[300px] md:h-auto overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 md:hidden"></div>
                                     <img 
                                        src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
                                        alt="Featured" 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                     />
                                     <div className="absolute top-6 left-6 z-20">
                                          <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                              Günün Önerisi
                                          </span>
                                     </div>
                                 </div>
                                 
                                 <div className="p-8 md:p-16 flex flex-col justify-center relative z-20">
                                     <div className="flex items-center gap-3 mb-6 text-brand-300 text-sm font-semibold">
                                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(featuredPost.createdAt).toLocaleDateString('tr-TR')}</span>
                                         <span className="w-1 h-1 bg-brand-300/50 rounded-full"></span>
                                         <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 dk okuma</span>
                                     </div>
                                     <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-brand-300 transition-colors">
                                         {featuredPost.title}
                                     </h2>
                                     <p className="text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                                         {featuredPost.excerpt}
                                     </p>
                                     <div className="flex items-center gap-4">
                                         <span className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-500 transition-colors">
                                             Dersi İncele <ArrowRight className="w-5 h-5" />
                                         </span>
                                     </div>
                                 </div>
                             </div>
                        </Link>
                    )}

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridPosts.map((post, idx) => (
                            <Link to={`/post/${post.slug}`} key={post.id} className="group flex flex-col h-full">
                                <article className="bg-white h-full rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col">
                                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                                        <img 
                                            src={post.featuredImage || `https://images.unsplash.com/photo-${idx % 2 === 0 ? '1509062522246-3755977927d7' : '1503676260728-1c00da094a0b'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`} 
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-3 leading-tight line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-semibold text-brand-600">
                                            <span>Devamını Oku</span>
                                            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    <AdUnit className="mt-20 mb-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200" />
                </>
            )}
         </div>
      </div>
    </Layout>
  );
};
