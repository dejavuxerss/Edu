
import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/Layout';
import { 
    BarChart2, PieChart, Users, Clock, MousePointer, 
    Target, ArrowUp, ArrowDown, Activity, Globe, Monitor, Map, Plus
} from 'lucide-react';
import { AnalyticsGoal } from '../../types';
import { MOCK_ANALYTICS_GOALS } from '../../constants';

// Declare Chart.js globally
declare global {
    interface Window {
        Chart: any;
    }
}

type Tab = 'summary' | 'traffic' | 'pages' | 'behavior' | 'conversions';
type TimeRange = 'today' | 'week' | 'month';

export const AdminAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [goals, setGoals] = useState<AnalyticsGoal[]>(MOCK_ANALYTICS_GOALS);
  const [newGoal, setNewGoal] = useState<Partial<AnalyticsGoal>>({name: '', type: 'destination', targetValue: '', conversionRate: 0, completed: 0, status: 'active'});

  // Chart Refs
  const summaryChartRef = useRef<HTMLCanvasElement>(null);
  const trafficChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any[]>([]);

  useEffect(() => {
    // Cleanup previous charts
    chartInstances.current.forEach(c => c.destroy());
    chartInstances.current = [];

    if (activeTab === 'summary' && summaryChartRef.current && window.Chart) {
        const ctx = summaryChartRef.current.getContext('2d');
        const chart = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                datasets: [
                    {
                        label: 'Ziyaretçiler',
                        data: [150, 230, 180, 320, 290, 140, 190],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Sayfa Görüntüleme',
                        data: [450, 680, 540, 960, 870, 420, 570],
                        borderColor: '#10b981',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: '#94a3b8' } } },
                scales: { 
                    y: { beginAtZero: true, grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }, 
                    x: { grid: { display: false }, ticks: { color: '#64748b' } } 
                }
            }
        });
        chartInstances.current.push(chart);
    }

    if (activeTab === 'traffic' && trafficChartRef.current && window.Chart) {
        const ctx = trafficChartRef.current.getContext('2d');
        const chart = new window.Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Organik Arama', 'Direkt', 'Sosyal Medya', 'Referral'],
                datasets: [{
                    data: [65, 15, 12, 8],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: '#cbd5e1', padding: 20 } } },
                cutout: '70%'
            }
        });
        chartInstances.current.push(chart);
    }

  }, [activeTab, timeRange]);

  const handleAddGoal = () => {
      if(!newGoal.name || !newGoal.targetValue) return;
      setGoals([...goals, { ...newGoal, id: crypto.randomUUID(), completed: 0, conversionRate: 0, status: 'active' } as AnalyticsGoal]);
      setNewGoal({name: '', type: 'destination', targetValue: '', conversionRate: 0, completed: 0, status: 'active'});
  };

  return (
    <Layout isAdmin>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-gray-400 text-sm">Site trafiği ve kullanıcı davranışları analizi.</p>
            </div>
            
            <div className="bg-gray-800 p-1 rounded-lg flex items-center">
                <button onClick={() => setTimeRange('today')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${timeRange === 'today' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Bugün</button>
                <button onClick={() => setTimeRange('week')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${timeRange === 'week' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Bu Hafta</button>
                <button onClick={() => setTimeRange('month')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${timeRange === 'month' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Bu Ay</button>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
            <button onClick={() => setActiveTab('summary')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'summary' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Activity className="w-4 h-4" /> Özet
            </button>
            <button onClick={() => setActiveTab('traffic')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'traffic' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Globe className="w-4 h-4" /> Trafik Kaynağı
            </button>
            <button onClick={() => setActiveTab('pages')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'pages' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Monitor className="w-4 h-4" /> Sayfalar
            </button>
            <button onClick={() => setActiveTab('behavior')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'behavior' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <MousePointer className="w-4 h-4" /> Davranış
            </button>
            <button onClick={() => setActiveTab('conversions')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'conversions' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Target className="w-4 h-4" /> Dönüşüm
            </button>
        </div>

        {/* --- CONTENT --- */}
        
        {/* 1. SUMMARY TAB */}
        {activeTab === 'summary' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Ziyaretçiler</p>
                                <h3 className="text-3xl font-bold text-white mt-1">12,540</h3>
                            </div>
                            <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400"><Users className="w-5 h-5"/></div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                            <ArrowUp className="w-3 h-3"/> +12.5% <span className="text-gray-500 font-normal ml-1">geçen haftaya göre</span>
                        </div>
                    </div>
                    
                    <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Page Views</p>
                                <h3 className="text-3xl font-bold text-white mt-1">45,210</h3>
                            </div>
                            <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><Monitor className="w-5 h-5"/></div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                            <ArrowUp className="w-3 h-3"/> +8.2% <span className="text-gray-500 font-normal ml-1">geçen haftaya göre</span>
                        </div>
                    </div>

                    <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Bounce Rate</p>
                                <h3 className="text-3xl font-bold text-white mt-1">42.3%</h3>
                            </div>
                            <div className="p-2 bg-red-900/30 rounded-lg text-red-400"><Activity className="w-5 h-5"/></div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                            <ArrowDown className="w-3 h-3"/> -2.1% <span className="text-gray-500 font-normal ml-1">iyileşme</span>
                        </div>
                    </div>

                    <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Ort. Süre</p>
                                <h3 className="text-3xl font-bold text-white mt-1">04:12</h3>
                            </div>
                            <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400"><Clock className="w-5 h-5"/></div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                            <span className="text-gray-500 font-normal">Stabil</span>
                        </div>
                    </div>
                </div>

                <div className="bg-wp-card p-6 rounded-xl border border-gray-700 h-96">
                    <h3 className="text-white font-bold mb-6">Trafik Grafiği</h3>
                    <div className="h-72 w-full">
                        <canvas ref={summaryChartRef}></canvas>
                    </div>
                </div>
            </div>
        )}

        {/* 2. TRAFFIC SOURCE TAB */}
        {activeTab === 'traffic' && (
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                    <h3 className="text-white font-bold mb-6">Kaynak Dağılımı</h3>
                    <div className="h-64 flex justify-center">
                        <canvas ref={trafficChartRef}></canvas>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                         <div className="bg-gray-800 p-4 rounded border border-gray-700">
                             <p className="text-xs text-gray-400">Organik Arama</p>
                             <p className="text-xl font-bold text-green-400 mt-1">65%</p>
                         </div>
                         <div className="bg-gray-800 p-4 rounded border border-gray-700">
                             <p className="text-xs text-gray-400">Sosyal Medya</p>
                             <p className="text-xl font-bold text-yellow-500 mt-1">12%</p>
                         </div>
                    </div>
                </div>

                <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                     <h3 className="text-white font-bold mb-6">Detaylı Kaynak Raporu</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-800 text-gray-400 font-semibold border-b border-gray-700">
                                <tr>
                                    <th className="p-4">Kaynak</th>
                                    <th className="p-4 text-center">Ziyaretçi</th>
                                    <th className="p-4 text-center">Yüzde</th>
                                    <th className="p-4 text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-green-500"/> Google Organic</td>
                                    <td className="p-4 text-center">8,150</td>
                                    <td className="p-4 text-center">65%</td>
                                    <td className="p-4 text-right text-green-400"><ArrowUp className="w-4 h-4 inline"/> 5%</td>
                                </tr>
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-blue-500"/> Direct</td>
                                    <td className="p-4 text-center">1,880</td>
                                    <td className="p-4 text-center">15%</td>
                                    <td className="p-4 text-right text-gray-400">-</td>
                                </tr>
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-bold text-white flex items-center gap-2"><Target className="w-4 h-4 text-yellow-500"/> Instagram</td>
                                    <td className="p-4 text-center">1,500</td>
                                    <td className="p-4 text-center">12%</td>
                                    <td className="p-4 text-right text-red-400"><ArrowDown className="w-4 h-4 inline"/> 2%</td>
                                </tr>
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-bold text-white flex items-center gap-2"><Map className="w-4 h-4 text-indigo-500"/> MEB & EBA</td>
                                    <td className="p-4 text-center">1,010</td>
                                    <td className="p-4 text-center">8%</td>
                                    <td className="p-4 text-right text-green-400"><ArrowUp className="w-4 h-4 inline"/> 12%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* 3. PAGES PERFORMANCE TAB */}
        {activeTab === 'pages' && (
            <div className="bg-wp-card border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-white">En Çok Görüntülenen Sayfalar</h3>
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Raporu İndir</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-800 text-gray-400 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="p-4 w-1/3">Sayfa URL</th>
                                <th className="p-4 text-center">Page Views</th>
                                <th className="p-4 text-center">Ort. Süre</th>
                                <th className="p-4 text-center">Bounce Rate</th>
                                <th className="p-4 text-center">Conversion</th>
                                <th className="p-4 text-right">Öneri</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 font-mono text-xs text-white">/post/lgs-maratonu-son-3-ay</td>
                                <td className="p-4 text-center font-bold">12,500</td>
                                <td className="p-4 text-center">05:30</td>
                                <td className="p-4 text-center text-green-400">35%</td>
                                <td className="p-4 text-center">4.5%</td>
                                <td className="p-4 text-right"><span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded border border-green-900/50">Optimal</span></td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 font-mono text-xs text-white">/post/matematik-korkusunu-yenmek</td>
                                <td className="p-4 text-center font-bold">8,200</td>
                                <td className="p-4 text-center">03:15</td>
                                <td className="p-4 text-center text-yellow-400">55%</td>
                                <td className="p-4 text-center">2.1%</td>
                                <td className="p-4 text-right"><span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-1 rounded border border-blue-900/50">Görsel Ekle</span></td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 font-mono text-xs text-white">/post/evde-fen-deneyleri</td>
                                <td className="p-4 text-center font-bold">6,150</td>
                                <td className="p-4 text-center">06:45</td>
                                <td className="p-4 text-center text-green-400">28%</td>
                                <td className="p-4 text-center">8.4%</td>
                                <td className="p-4 text-right"><span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded border border-green-900/50">Mükemmel</span></td>
                            </tr>
                             <tr className="hover:bg-gray-800/50">
                                <td className="p-4 font-mono text-xs text-white">/post/yeni-nesil-sorular</td>
                                <td className="p-4 text-center font-bold">4,800</td>
                                <td className="p-4 text-center">01:20</td>
                                <td className="p-4 text-center text-red-400">82%</td>
                                <td className="p-4 text-center">0.5%</td>
                                <td className="p-4 text-right"><span className="text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded border border-red-900/50">Güncelle</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* 4. USER BEHAVIOR TAB */}
        {activeTab === 'behavior' && (
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><MousePointer className="w-5 h-5 text-red-400"/> Tıklama Isı Haritası (Heatmap)</h3>
                    <div className="relative bg-gray-800 rounded-lg aspect-video border border-gray-700 overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-lg pointer-events-none z-10">
                            Site Önizleme (Dummy)
                        </div>
                        {/* Heatmap blobs */}
                        <div className="absolute top-[20%] left-[30%] w-20 h-20 bg-red-500/60 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute top-[50%] left-[60%] w-32 h-32 bg-red-500/40 rounded-full blur-2xl"></div>
                        <div className="absolute top-[80%] left-[20%] w-16 h-16 bg-yellow-500/50 rounded-full blur-xl"></div>
                        <div className="absolute top-[10%] right-[10%] w-24 h-24 bg-red-600/50 rounded-full blur-xl"></div>
                        
                        <div className="absolute bottom-4 left-4 z-20 bg-black/70 px-3 py-1 rounded text-xs text-white">
                            En yoğun: Ana Menü & 'Dersi İncele' Butonu
                        </div>
                    </div>
                </div>

                <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                    <h3 className="text-white font-bold mb-6">En Sık Çıkış Yapılan Sayfalar (Exit Pages)</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                            <div>
                                <p className="text-sm font-bold text-white">/iletisim-tesekkur</p>
                                <p className="text-xs text-gray-500">Normal (Form sonrası)</p>
                            </div>
                            <span className="text-red-400 font-bold text-sm">92%</span>
                        </li>
                        <li className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                            <div>
                                <p className="text-sm font-bold text-white">/post/yeni-nesil-sorular</p>
                                <p className="text-xs text-gray-500">Dikkat: Yüksek çıkış oranı</p>
                            </div>
                            <span className="text-red-400 font-bold text-sm">78%</span>
                        </li>
                        <li className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                            <div>
                                <p className="text-sm font-bold text-white">/kategori/lgs-kampi</p>
                                <p className="text-xs text-gray-500">Liste sayfası</p>
                            </div>
                            <span className="text-yellow-500 font-bold text-sm">45%</span>
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {/* 5. CONVERSION TRACKING TAB */}
        {activeTab === 'conversions' && (
             <div className="space-y-8">
                {/* Goals List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {goals.map(goal => (
                        <div key={goal.id} className="bg-wp-card p-6 rounded-xl border border-gray-700 relative overflow-hidden group">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold">{goal.type}</p>
                                    <h3 className="text-lg font-bold text-white mt-1 truncate">{goal.name}</h3>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${goal.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'}`}></div>
                             </div>
                             <div className="grid grid-cols-2 gap-4 mt-6">
                                 <div>
                                     <p className="text-xs text-gray-500">Tamamlanan</p>
                                     <p className="text-xl font-bold text-white">{goal.completed}</p>
                                 </div>
                                 <div>
                                     <p className="text-xs text-gray-500">Conv. Rate</p>
                                     <p className="text-xl font-bold text-green-400">{goal.conversionRate}%</p>
                                 </div>
                             </div>
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                 <div className="h-full bg-wp-accent" style={{width: `${Math.min(100, goal.conversionRate * 10)}%`}}></div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Add Goal Form */}
                <div className="bg-wp-card p-6 rounded-xl border border-gray-700 max-w-3xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-wp-accent"/> Yeni Hedef Oluştur</h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hedef Adı</label>
                            <input 
                                type="text" 
                                value={newGoal.name}
                                onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                placeholder="Örn: E-bülten Kayıt"
                                className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hedef Tipi</label>
                            <select 
                                value={newGoal.type}
                                onChange={e => setNewGoal({...newGoal, type: e.target.value as any})}
                                className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                            >
                                <option value="destination">Hedef Sayfa (URL)</option>
                                <option value="event">Etkinlik (Tıklama)</option>
                                <option value="duration">Süre (Saniye)</option>
                                <option value="pages_per_session">Sayfa/Oturum</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-6">
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hedef Değeri</label>
                         <input 
                                type="text" 
                                value={newGoal.targetValue}
                                onChange={e => setNewGoal({...newGoal, targetValue: e.target.value})}
                                placeholder={newGoal.type === 'destination' ? '/tesekkur-sayfasi' : newGoal.type === 'duration' ? '300' : 'subscribe_button'}
                                className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                            />
                         <p className="text-[10px] text-gray-500 mt-1">
                             {newGoal.type === 'destination' && 'Kullanıcı bu sayfaya ulaştığında hedef tamamlanır.'}
                             {newGoal.type === 'event' && 'Belirtilen ID veya Class\'a sahip elemente tıklandığında.'}
                             {newGoal.type === 'duration' && 'Kullanıcı sitede belirtilen saniyeden fazla kaldığında.'}
                         </p>
                    </div>
                    <button onClick={handleAddGoal} className="bg-wp-accent hover:bg-blue-600 text-white px-6 py-2 rounded font-bold transition-colors">
                        Hedefi Kaydet
                    </button>
                </div>
             </div>
        )}

    </Layout>
  );
};