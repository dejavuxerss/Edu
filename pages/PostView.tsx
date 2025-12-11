
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, Share2, Clock, ChevronLeft, User, Facebook, Twitter, Linkedin, Tag } from 'lucide-react';
import { getPostBySlug, getSettings } from '../services/storage';
import { Post } from '../types';
import { Layout } from '../components/Layout';
import { AdUnit } from '../components/AdUnit';

export const PostView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const settings = getSettings();

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        document.title = foundPost.seoTitle || foundPost.title;
        
        // Basic meta description update (simulation)
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', foundPost.seoDescription || foundPost.excerpt);
        
        window.scrollTo(0, 0);
      } else {
        navigate('/');
      }
    }
  }, [slug, navigate]);

  if (!post) return null;

  // --- CONTENT RENDER WITH AD INJECTION ---
  const renderContentWithAds = (htmlContent: string) => {
    // This is a simplified ad injection logic. 
    // It splits the HTML by closing paragraph tags </p> and inserts ads.
    const parts = htmlContent.split('</p>');
    return parts.map((part, index) => {
      // Re-add the closing tag stripped by split, except for the last empty part
      const contentChunk = index < parts.length - 1 ? part + '</p>' : part;
      
      // Inject Ad after 2nd and 6th paragraph
      const showAd = (index === 1 || index === 5);

      return (
        <React.Fragment key={index}>
          <div dangerouslySetInnerHTML={{ __html: contentChunk }} />
          {showAd && (
             <div className="my-8">
                 <AdUnit format="auto" className="w-full rounded-lg" />
             </div>
          )}
        </React.Fragment>
      );
    });
  };

  // --- STRUCTURED DATA FOR GOOGLE ---
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seoTitle || post.title,
    "image": post.featuredImage ? [post.featuredImage] : [],
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": [{
        "@type": "Person",
        "name": "Dilek Öğretmen",
        "url": window.location.origin
    }],
    "publisher": {
        "@type": "Organization",
        "name": settings.siteName,
        "logo": {
            "@type": "ImageObject",
            "url": settings.logoUrl || ""
        }
    }
  };

  return (
    <Layout>
      {/* Inject JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Progress bar visual */}
      <div className="fixed top-20 left-0 w-full h-1 z-40 bg-slate-100">
          <div className="h-full bg-brand-600 w-1/3"></div>
      </div>

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
            
            {/* Top Billboard Ad */}
            <div className="max-w-5xl mx-auto mb-8">
                <AdUnit format="auto" className="h-24 rounded-lg" />
            </div>

            <div className="max-w-4xl mx-auto mb-8">
                <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-brand-200 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> 
                    </div>
                    Ana Sayfaya Dön
                </button>
            </div>

            {/* Header */}
            <header className="text-center mb-12 max-w-4xl mx-auto">
                <div className="inline-block mb-6">
                    <span className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-100">
                        {post.category}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                    {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 font-medium">
                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="text-slate-700">Dilek Öğretmen</span>
                     </div>
                     <span className="text-slate-300">|</span>
                     <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                     <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" /> 5 dk okuma
                    </span>
                     <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-slate-400" /> {post.views}
                    </span>
                </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="max-w-5xl mx-auto w-full h-[300px] md:h-[500px] bg-slate-100 rounded-3xl mb-12 overflow-hidden relative shadow-lg">
                    <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                {/* Left Sidebar / Share (Desktop) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-32 flex flex-col gap-4">
                        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center transition-all shadow-sm"><Facebook className="w-5 h-5"/></button>
                        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 flex items-center justify-center transition-all shadow-sm"><Twitter className="w-5 h-5"/></button>
                        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-700 hover:border-blue-200 flex items-center justify-center transition-all shadow-sm"><Linkedin className="w-5 h-5"/></button>
                        <div className="h-px w-full bg-slate-200 my-2"></div>
                        <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"><Share2 className="w-5 h-5"/></button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8">
                    {/* Render HTML content with Ads injected */}
                    <div className="editor-content prose prose-lg md:prose-xl prose-slate max-w-none 
                        prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 
                        prose-p:text-slate-600 prose-p:leading-8 prose-p:font-normal
                        prose-a:text-brand-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-brand-700 hover:prose-a:underline
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-img:rounded-2xl prose-img:shadow-md">
                    
                        {renderContentWithAds(post.content)}

                    </div>
                    
                    {/* Tags */}
                    {post.tags && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {post.tags.split(',').map((tag, idx) => (
                                <span key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer">
                                    <Tag className="w-3 h-3" /> {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Author Box */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-100">
                        <div className="w-20 h-20 rounded-full bg-white border-2 border-brand-200 p-1 shrink-0">
                            <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                <User className="w-10 h-10 text-slate-400" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Dilek Öğretmen Hakkında</h4>
                            <p className="text-slate-600 leading-relaxed">
                                15 yıllık eğitim tecrübemle, öğrencilerimin karmaşık konuları en basit haliyle anlamalarını sağlamayı hedefliyorum.
                            </p>
                        </div>
                    </div>
                    
                    <AdUnit format="rectangle" className="mt-12 rounded-xl" />
                </div>

                 {/* Right Sidebar (Ads) */}
                 <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-32 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Popüler Kategoriler</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer">LGS Kampı</span>
                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer">Matematik</span>
                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer">Fen Bilimleri</span>
                            </div>
                        </div>

                        {/* Sticky Ad */}
                        <AdUnit format="vertical" className="rounded-xl shadow-sm" />
                    </div>
                 </div>
            </div>

        </div>
      </div>
    </Layout>
  );
};
