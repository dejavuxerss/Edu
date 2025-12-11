
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
      {/* --- HERO SECTION WITH WAVES --- */}
      <section className="relative overflow-hidden bg-brand-50 pt-32 pb-48 lg:pt-40 lg:pb-64">
          
          {/* Animated Blobs Background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
              <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  
                  {/* Left Text */}
                  <div className="flex-1 text-center lg:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 shadow-sm text-brand-600 text-sm font-bold mb-6 animate-fade-in-up">
                          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                          Yeni Nesil Eğitim Platformu
                      </div>
                      
                      <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                          Geleceği <span className="text-brand-500 relative inline-block">
                              İnşa Et
                              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                          </span><br/>
                          Hayalleri Büyüt.
                      </h1>
                      
                      <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                          {settings.siteDescription}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                          <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1">
                              Derslere Başla
                          </button>
                          <div className="relative group">
                              <div className="absolute inset-0 bg-brand-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                              <div className="relative flex items-center bg-white rounded-full p-1 pl-4 shadow-md border border-slate-100">
                                  <input 
                                    type="text" 
                                    placeholder="Konu ara..." 
                                    className="bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-40 sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                  <button className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
                                      <Search className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Right Image */}
                  <div className="flex-1 relative">
                      <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-900/10 border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                          <img 
                            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="Education" 
                            className="w-full h-auto object-cover"
                          />
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -bottom-10 -left-10 z-20 bg-white p-4 rounded-2xl shadow-xl animate-float">
                          <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-3 rounded-full text-green-600">
                                  <BookOpen className="w-6 h-6" />
                              </div>
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase">Toplam İçerik</p>
                                  <p className="text-xl font-bold text-slate-900">500+</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="absolute -top-6 -right-6 z-0">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-300 animate-spin-slow">
                              <path d="M50 0L61.2 38.8L100 50L61.2 61.2L50 100L38.8 61.2L0 50L38.8 38.8L50 0Z" fill="currentColor"/>
                          </svg>
                      </div>
                  </div>
              </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
              <svg className="relative block w-[calc(100%+1.3px)] h-[100px] text-white" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
              </svg>
          </div>
      </section>

      {/* --- CATEGORIES & CONTENT --- */}
      <section className="py-20 bg-white relative z-20">
         <div className="container mx-auto px-4 lg:px-8">
            
            {/* Categories Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                <button 
                    onClick={() => setActiveCategory('Tümü')}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${activeCategory === 'Tümü' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700'}`}
                >
                    Tümü
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${activeCategory === cat.name ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Featured Post (Card Style 1) */}
            {featuredPost && (
                <div className="mb-20">
                    <Link to={`/post/${featuredPost.slug}`} className="group block relative rounded-[2rem] bg-slate-900 overflow-hidden shadow-2xl hover:shadow-brand-900/20 transition-all duration-500">
                        <div className="grid lg:grid-cols-2">
                            <div className="p-8 lg:p-16 flex flex-col justify-center relative z-10">
                                <div className="absolute top-0 right-0 p-32 bg-brand-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                                
                                <span className="inline-block text-brand-300 font-bold tracking-wider uppercase text-xs mb-4">Günün Önerisi</span>
                                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight group-hover:text-brand-300 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                    <span className="text-white font-bold group-hover:underline decoration-brand-500 underline-offset-4">Hemen Oku</span>
                                </div>
                            </div>
                            <div className="relative h-[400px] lg:h-auto overflow-hidden">
                                <img 
                                    src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r"></div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Grid Posts (Card Style 2 - Playful) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, idx) => (
                    <Link to={`/post/${post.slug}`} key={post.id} className="group h-full">
                        <article className="h-full bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                            
                            {/* Image Area */}
                            <div className="h-56 relative overflow-hidden m-2 rounded-[1.5rem]">
                                <img 
                                    src={post.featuredImage || `https://images.unsplash.com/photo-${idx % 2 === 0 ? '1509062522246-3755977927d7' : '1503676260728-1c00da094a0b'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-sm border border-slate-100">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-3 uppercase tracking-wide">
                                    <Calendar className="w-3 h-3" /> 
                                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })}
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-brand-600 transition-colors">
                                    {post.title}
                                </h3>
                                
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>
                                
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">Dilek Öğretmen</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            <AdUnit className="mt-20 mb-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200" />
         </div>
      </section>
    </Layout>
  );
};