
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { getPosts, deletePost, getCategories } from '../../services/storage';
import { Post, Category, PostStatus } from '../../types';
import { Search, Filter, Calendar as CalendarIcon, ChevronDown, MoreHorizontal, Edit, Trash2, Eye, BarChart2, CheckCircle, XCircle } from 'lucide-react';

// Declare Chart.js globally
declare global {
    interface Window {
        Chart: any;
    }
}

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filters State
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const location = useLocation();
  const visitorsChartRef = useRef<HTMLCanvasElement>(null);
  const trafficChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance1 = useRef<any>(null);
  const chartInstance2 = useRef<any>(null);
  
  const isPagesView = location.pathname.includes('/admin/pages');
  const isPostsView = location.pathname.includes('/admin/posts');
  const isDashboardView = !isPagesView && !isPostsView;

  useEffect(() => {
    setPosts(getPosts());
    setCategories(getCategories());
  }, [location.pathname]);

  // Chart Initialization for Dashboard View
  useEffect(() => {
    if (isDashboardView && window.Chart) {
        if (chartInstance1.current) chartInstance1.current.destroy();
        if (chartInstance2.current) chartInstance2.current.destroy();

        // Visitors Chart
        if (visitorsChartRef.current) {
            const ctx1 = visitorsChartRef.current.getContext('2d');
            window.Chart.defaults.color = '#94a3b8';
            window.Chart.defaults.borderColor = '#334155';
            chartInstance1.current = new window.Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                    datasets: [{
                        label: 'Ziyaretçiler',
                        data: [1200, 1900, 1700, 2400, 2100, 1500, 1850],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { color: '#1e293b' } }, x: { grid: { display: false } } }
                }
            });
        }

        // Traffic Chart
        if (trafficChartRef.current) {
            const ctx2 = trafficChartRef.current.getContext('2d');
            chartInstance2.current = new window.Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Google', 'Direkt', 'Sosyal', 'Referral'],
                    datasets: [{
                        data: [65, 15, 12, 8],
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10 } } } },
                    cutout: '70%'
                }
            });
        }
    }
  }, [isDashboardView]);

  const handleDelete = (id: string) => {
      if(window.confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
          deletePost(id);
          setPosts(getPosts());
      }
  }

  // --- Filter Logic ---
  const filteredPosts = posts.filter(p => {
      // 1. Type Filter
      if (isPagesView && p.type !== 'page') return false;
      if (isPostsView && p.type !== 'post') return false;

      // 2. Search Filter (Title or Keyword)
      if (filterSearch) {
          const searchLower = filterSearch.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(searchLower);
          const matchesKeyword = p.focusKeyword?.toLowerCase().includes(searchLower);
          if (!matchesTitle && !matchesKeyword) return false;
      }

      // 3. Status Filter
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;

      // 4. Category Filter
      if (!isPagesView && filterCategory !== 'all' && p.category !== filterCategory) return false;

      // 5. Date Filter
      if (dateStart) {
          if (new Date(p.createdAt) < new Date(dateStart)) return false;
      }
      if (dateEnd) {
          const endDate = new Date(dateEnd);
          endDate.setDate(endDate.getDate() + 1);
          if (new Date(p.createdAt) > endDate) return false;
      }

      return true;
  });

  const getSeoScoreColor = (post: Post) => {
      if (!post.focusKeyword) return 'text-gray-500';
      const inTitle = post.title.toLowerCase().includes(post.focusKeyword.toLowerCase());
      const inDesc = post.seoDescription?.toLowerCase().includes(post.focusKeyword.toLowerCase());
      
      if (inTitle && inDesc) return 'text-green-500';
      if (inTitle || inDesc) return 'text-yellow-500';
      return 'text-red-500';
  }

  const getStatusBadge = (status: PostStatus) => {
      switch(status) {
          case 'published': return <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-900/50">Yayında</span>;
          case 'draft': return <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-bold border border-gray-600">Taslak</span>;
          case 'review': return <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-900/50">İnceleme</span>;
          case 'scheduled': return <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-900/50">Zamanlandı</span>;
          default: return null;
      }
  }

  // --- DASHBOARD VIEW ---
  if (isDashboardView) {
      const postCount = posts.filter(p => p.type === 'post').length;
      return (
        <Layout isAdmin>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-wp-card p-5 rounded-xl border border-gray-700 shadow-lg">
                  <p className="text-gray-400 text-sm font-medium">Toplam Yazı</p>
                  <h4 className="text-2xl font-bold text-white mt-1">{postCount}</h4>
              </div>
              <div className="bg-wp-card p-5 rounded-xl border border-gray-700 shadow-lg">
                  <p className="text-gray-400 text-sm font-medium">Bekleyen</p>
                  <h4 className="text-2xl font-bold text-white mt-1">{posts.filter(p => p.status === 'review').length}</h4>
              </div>
               <div className="bg-wp-card p-5 rounded-xl border border-gray-700 shadow-lg">
                  <p className="text-gray-400 text-sm font-medium">Toplam Sayfa</p>
                  <h4 className="text-2xl font-bold text-white mt-1">{posts.filter(p => p.type === 'page').length}</h4>
              </div>
              <div className="bg-wp-card p-5 rounded-xl border border-gray-700 shadow-lg">
                  <p className="text-gray-400 text-sm font-medium">Bu Ay Yayınlanan</p>
                  <h4 className="text-2xl font-bold text-white mt-1">12</h4>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-wp-card p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h3 className="text-white font-semibold mb-4">Ziyaretçi Grafiği</h3>
                  <div className="relative h-64 w-full">
                      <canvas ref={visitorsChartRef}></canvas>
                  </div>
              </div>
              <div className="bg-wp-card p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h3 className="text-white font-semibold mb-4">Trafik Kaynakları</h3>
                  <div className="h-40 flex justify-center">
                      <canvas ref={trafficChartRef}></canvas>
                  </div>
              </div>
          </div>
        </Layout>
      );
  }

  // --- TABLE VIEW (Content Management) ---
  const typeUrlParam = isPagesView ? 'page' : 'post';

  return (
      <Layout isAdmin>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white">
                {isPagesView ? 'Sayfalar' : 'İçerik Yönetimi'}
            </h1>
            <Link to={`/admin/editor?type=${typeUrlParam}`} className="bg-wp-accent hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm font-bold flex items-center gap-2 transition-colors">
                <i className="fa-solid fa-plus"></i> Yeni Ekle
            </Link>
        </div>

        {/* --- FILTERS TOOLBAR --- */}
        <div className="bg-wp-card p-4 rounded-lg border border-gray-700 mb-6 flex flex-wrap gap-4 items-end">
             {/* Search */}
             <div className="flex-1 min-w-[200px]">
                 <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Ara</label>
                 <div className="relative">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                     <input 
                        type="text" 
                        placeholder="Başlık veya Keyword..." 
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-gray-300 pl-9 pr-3 py-2 rounded text-sm outline-none focus:border-wp-accent"
                     />
                 </div>
             </div>

             {/* Filters Group */}
             <div className="flex gap-2 flex-wrap">
                 {/* Status */}
                 <div>
                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Durum</label>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-sm outline-none focus:border-wp-accent"
                    >
                        <option value="all">Tümü</option>
                        <option value="published">Yayında</option>
                        <option value="draft">Taslak</option>
                        <option value="review">İnceleme</option>
                        <option value="scheduled">Zamanlanmış</option>
                    </select>
                 </div>

                 {/* Category - Hide for Pages */}
                 {!isPagesView && (
                     <div>
                        <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Kategori</label>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-sm outline-none focus:border-wp-accent max-w-[150px]"
                        >
                            <option value="all">Tümü</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                     </div>
                 )}

                 {/* Date Range */}
                 <div>
                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Tarih Aralığı</label>
                    <div className="flex items-center gap-1">
                        <input 
                            type="date" 
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-gray-300 px-2 py-2 rounded text-xs outline-none focus:border-wp-accent w-28" 
                        />
                        <span className="text-gray-500">-</span>
                        <input 
                            type="date" 
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-gray-300 px-2 py-2 rounded text-xs outline-none focus:border-wp-accent w-28" 
                        />
                    </div>
                 </div>
             </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-wp-card shadow-sm border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                        <tr>
                            <th className="p-4 w-10 text-center text-xs text-gray-500">ID</th>
                            <th className="p-4 w-1/4">Başlık</th>
                            {isPagesView ? (
                                <>
                                    <th className="p-4 w-1/4">Meta Açıklama</th>
                                    <th className="p-4">İndeksleme</th>
                                </>
                            ) : (
                                <th className="p-4">SEO Bilgisi</th>
                            )}
                            <th className="p-4">Slug</th>
                            <th className="p-4">Tarih</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredPosts.length > 0 ? filteredPosts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-800/50 transition-colors group">
                                <td className="p-4 text-center text-xs text-gray-500 font-mono">#{post.id}</td>
                                <td className="p-4">
                                    <Link to={`/admin/editor/${post.id}`} className="font-bold text-white hover:text-wp-accent text-base block mb-1">
                                        {post.title || '(Başlıksız)'}
                                    </Link>
                                    {!isPagesView && (
                                        <div className="flex items-center gap-2">
                                            {post.category && (
                                                <span className="text-xs bg-gray-700 text-gray-300 px-1.5 rounded">{post.category}</span>
                                            )}
                                            {post.focusKeyword && (
                                                <span className="text-[10px] text-gray-500 border border-gray-700 px-1 rounded flex items-center gap-1">
                                                    <i className="fa-solid fa-key"></i> {post.focusKeyword}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                
                                {isPagesView ? (
                                    <>
                                        <td className="p-4">
                                            <p className="text-xs text-gray-400 line-clamp-2 w-48" title={post.seoDescription}>{post.seoDescription || '-'}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className={`flex items-center gap-1 ${post.robotsIndex === 'noindex' ? 'text-red-400' : 'text-green-400'}`}>
                                                    {post.robotsIndex === 'noindex' ? <XCircle className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                                                    {post.robotsIndex || 'Index'}
                                                </span>
                                                <span className={`flex items-center gap-1 ${post.robotsFollow === 'nofollow' ? 'text-gray-500' : 'text-blue-400'}`}>
                                                     {post.robotsFollow === 'nofollow' ? 'NoFollow' : 'Follow'}
                                                </span>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <td className="p-4">
                                        <div className="max-w-[200px]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-3 h-3 rounded-full ${getSeoScoreColor(post).replace('text-', 'bg-')}`}></div>
                                                <span className={`text-xs font-bold ${getSeoScoreColor(post)}`}>
                                                    {getSeoScoreColor(post).includes('green') ? 'İyi' : getSeoScoreColor(post).includes('yellow') ? 'Orta' : 'Kötü'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate" title={post.seoDescription}>{post.seoDescription || 'Meta açıklama yok.'}</p>
                                        </div>
                                    </td>
                                )}

                                <td className="p-4">
                                    <span className="font-mono text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded select-all">/{post.slug}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col text-xs">
                                        <span className="text-gray-300 font-medium">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                        <span className="text-gray-500">{new Date(post.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(post.status)}
                                </td>
                                <td className="p-4 text-right">
                                     <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/post/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Önizle">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link to={`/admin/editor/${post.id}`} className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded" title="Düzenle">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded" title="Sil">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                     </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={isPagesView ? 8 : 7} className="p-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <Filter className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-lg">Kriterlere uygun içerik bulunamadı.</p>
                                        <button onClick={() => {setFilterSearch(''); setFilterStatus('all'); setFilterCategory('all'); setDateStart(''); setDateEnd('');}} className="mt-2 text-wp-accent hover:underline">Filtreleri Temizle</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between items-center">
                <span>Toplam {filteredPosts.length} içerik gösteriliyor.</span>
                <div className="flex gap-2">
                    <button className="px-2 py-1 bg-gray-700 rounded text-gray-300 hover:bg-gray-600" disabled>Önceki</button>
                    <button className="px-2 py-1 bg-gray-700 rounded text-gray-300 hover:bg-gray-600" disabled>Sonraki</button>
                </div>
            </div>
        </div>
      </Layout>
  );
};