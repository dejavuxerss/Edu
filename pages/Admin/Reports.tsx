
import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/Layout';
import { 
    FileText, Download, TrendingUp, Search, DollarSign, Filter, 
    Calendar, Mail, AlertTriangle, CheckCircle, BarChart2
} from 'lucide-react';

// Declare Chart.js globally
declare global {
    interface Window {
        Chart: any;
    }
}

type Tab = 'monthly' | 'content' | 'seo' | 'adsense' | 'custom';

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Charts Refs
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);
  const adsenseChartRef = useRef<HTMLCanvasElement>(null);
  const seoChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any[]>([]);

  useEffect(() => {
    // Cleanup previous charts
    chartInstances.current.forEach(c => c.destroy());
    chartInstances.current = [];

    // --- MONTHLY SUMMARY CHART ---
    if (activeTab === 'monthly' && monthlyChartRef.current && window.Chart) {
        const ctx = monthlyChartRef.current.getContext('2d');
        const chart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['H1', 'H2', 'H3', 'H4'],
                datasets: [
                    {
                        label: 'Trafik',
                        data: [3500, 4200, 3800, 5100],
                        backgroundColor: '#3b82f6',
                        yAxisID: 'y',
                    },
                    {
                        label: 'Gelir ($)',
                        data: [120, 145, 130, 185],
                        type: 'line',
                        borderColor: '#10b981',
                        borderWidth: 2,
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { type: 'linear', display: true, position: 'left', grid: { color: '#1e293b' } },
                    y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
                    x: { grid: { display: false } }
                }
            }
        });
        chartInstances.current.push(chart);
    }

    // --- ADSENSE CHART ---
    if (activeTab === 'adsense' && adsenseChartRef.current && window.Chart) {
        const ctx = adsenseChartRef.current.getContext('2d');
        const chart = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1 Mar', '5 Mar', '10 Mar', '15 Mar', '20 Mar', '25 Mar'],
                datasets: [{
                    label: 'Günlük Gelir ($)',
                    data: [12, 15, 11, 22, 18, 25],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { beginAtZero: true, grid: { color: '#1e293b' } },
                    x: { grid: { display: false } }
                }
            }
        });
        chartInstances.current.push(chart);
    }

    // --- SEO CHART ---
    if (activeTab === 'seo' && seoChartRef.current && window.Chart) {
        const ctx = seoChartRef.current.getContext('2d');
        const chart = new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['İlk 3', '4-10. Sıra', '11-20. Sıra', '20+ Sıra'],
                datasets: [{
                    data: [15, 35, 25, 25],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
            }
        });
        chartInstances.current.push(chart);
    }

  }, [activeTab]);

  const handleExport = (format: 'pdf' | 'csv') => {
      alert(`Rapor hazırlanıyor ve ${format.toUpperCase()} olarak indirilecek...`);
  };

  return (
    <Layout isAdmin>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
              <h1 className="text-2xl font-bold text-white mb-2">Rapor Merkezi</h1>
              <p className="text-gray-400 text-sm">Site performansını analiz edin ve dışa aktarın.</p>
          </div>
          <div className="flex gap-2">
              <input type="month" className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm outline-none focus:border-wp-accent" defaultValue="2024-03" />
              <button onClick={() => handleExport('pdf')} className="bg-wp-accent hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                  <Download className="w-4 h-4"/> Raporu İndir (PDF)
              </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
            <button onClick={() => setActiveTab('monthly')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'monthly' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Calendar className="w-4 h-4" /> Aylık Özet
            </button>
            <button onClick={() => setActiveTab('content')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'content' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <FileText className="w-4 h-4" /> Content Perf.
            </button>
            <button onClick={() => setActiveTab('seo')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'seo' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Search className="w-4 h-4" /> SEO Raporu
            </button>
            <button onClick={() => setActiveTab('adsense')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'adsense' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <DollarSign className="w-4 h-4" /> Adsense
            </button>
            <button onClick={() => setActiveTab('custom')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'custom' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Filter className="w-4 h-4" /> Özel Rapor
            </button>
      </div>

      {/* 1. MONTHLY SUMMARY TAB */}
      {activeTab === 'monthly' && (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-wp-card p-5 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-xs uppercase font-bold">Toplam Trafik</p>
                      <h3 className="text-2xl font-bold text-white mt-1">154,200</h3>
                      <span className="text-green-400 text-xs font-bold">+12% geçen aya göre</span>
                  </div>
                  <div className="bg-wp-card p-5 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-xs uppercase font-bold">Yeni İçerik</p>
                      <h3 className="text-2xl font-bold text-white mt-1">12</h3>
                      <span className="text-gray-500 text-xs font-bold">Hedef: 15</span>
                  </div>
                  <div className="bg-wp-card p-5 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-xs uppercase font-bold">Gelir (Adsense)</p>
                      <h3 className="text-2xl font-bold text-white mt-1">$452.70</h3>
                      <span className="text-green-400 text-xs font-bold">+5.4% artış</span>
                  </div>
                  <div className="bg-wp-card p-5 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-xs uppercase font-bold">SEO Görünürlük</p>
                      <h3 className="text-2xl font-bold text-white mt-1">%68</h3>
                      <span className="text-blue-400 text-xs font-bold">Stabil</span>
                  </div>
              </div>

              <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-white mb-6">Trafik ve Gelir Karşılaştırması</h3>
                  <div className="h-72">
                      <canvas ref={monthlyChartRef}></canvas>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                      <h3 className="font-bold text-white mb-4">Öne Çıkan Başarılar</h3>
                      <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5"/>
                              <span>"LGS Matematik" kelimesinde 1. sıraya yükselindi.</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5"/>
                              <span>Hemen çıkma oranı %45'in altına düştü.</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5"/>
                              <span>Sosyal medya trafiği %20 arttı.</span>
                          </li>
                      </ul>
                  </div>
                  <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                      <h3 className="font-bold text-white mb-4">Gelişim Alanları</h3>
                      <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm text-gray-300">
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5"/>
                              <span>Mobil sayfa yüklenme hızı yavaş (LCP 3.2s).</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-300">
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5"/>
                              <span>3 adet kırık link tespit edildi.</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      )}

      {/* 2. CONTENT PERFORMANCE TAB */}
      {activeTab === 'content' && (
          <div className="space-y-8">
              <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-white">Top 10 En İyi Performans Gösteren İçerik</h3>
                      <button className="text-xs text-wp-accent" onClick={() => handleExport('csv')}>CSV İndir</button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                          <thead className="bg-gray-800 text-gray-400">
                              <tr>
                                  <th className="p-4">Başlık</th>
                                  <th className="p-4 text-center">Görüntülenme</th>
                                  <th className="p-4 text-center">Ort. Süre</th>
                                  <th className="p-4 text-center">Bounce Rate</th>
                                  <th className="p-4 text-right">Gelir</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                              {[1,2,3,4,5].map((i) => (
                                  <tr key={i} className="hover:bg-gray-800/50">
                                      <td className="p-4 font-medium text-white truncate max-w-xs">LGS 2024 Matematik Konu Anlatımı - Bölüm {i}</td>
                                      <td className="p-4 text-center">{10000 - (i * 1200)}</td>
                                      <td className="p-4 text-center">0{6-i}:45</td>
                                      <td className="p-4 text-center text-green-400">{30 + i}%</td>
                                      <td className="p-4 text-right">${(50 - i*5).toFixed(2)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-white text-red-400">Geliştirilmesi Gereken İçerikler (Düşük Performans)</h3>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                          <thead className="bg-gray-800 text-gray-400">
                              <tr>
                                  <th className="p-4">Başlık</th>
                                  <th className="p-4 text-center">Görüntülenme</th>
                                  <th className="p-4 text-center">Bounce Rate</th>
                                  <th className="p-4 text-right">Öneri</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                              <tr className="hover:bg-gray-800/50">
                                  <td className="p-4 font-medium text-white">Eski Müfredat Analizi</td>
                                  <td className="p-4 text-center">45</td>
                                  <td className="p-4 text-center text-red-400">85%</td>
                                  <td className="p-4 text-right text-yellow-500">Güncelle veya Sil</td>
                              </tr>
                              <tr className="hover:bg-gray-800/50">
                                  <td className="p-4 font-medium text-white">Hatalı Soru Çözümü</td>
                                  <td className="p-4 text-center">12</td>
                                  <td className="p-4 text-center text-red-400">92%</td>
                                  <td className="p-4 text-right text-yellow-500">İçeriği Zenginleştir</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* 3. SEO REPORT TAB */}
      {activeTab === 'seo' && (
          <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                  <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                      <h3 className="font-bold text-white mb-6">Anahtar Kelime Sıralaması</h3>
                      <div className="h-64 flex justify-center">
                          <canvas ref={seoChartRef}></canvas>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded border border-gray-700 text-center">
                          <p className="text-xs text-gray-400">İndekslenen Sayfa</p>
                          <p className="text-xl font-bold text-white">142</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded border border-gray-700 text-center">
                          <p className="text-xs text-gray-400">404 Hataları</p>
                          <p className="text-xl font-bold text-red-400">5</p>
                      </div>
                  </div>
              </div>

              <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-white mb-4">Son Tarama Hataları</h3>
                  <div className="space-y-4">
                      <div className="p-3 bg-red-900/20 border border-red-900/50 rounded flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-red-400">404 Not Found</p>
                              <p className="text-xs text-gray-400">/eski-sayfa-v1</p>
                          </div>
                          <button className="text-xs bg-red-900/40 hover:bg-red-900/60 text-red-300 px-2 py-1 rounded">Düzelt</button>
                      </div>
                      <div className="p-3 bg-red-900/20 border border-red-900/50 rounded flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-red-400">500 Server Error</p>
                              <p className="text-xs text-gray-400">/api/search-test</p>
                          </div>
                          <button className="text-xs bg-red-900/40 hover:bg-red-900/60 text-red-300 px-2 py-1 rounded">İncele</button>
                      </div>
                      <div className="p-3 bg-yellow-900/20 border border-yellow-900/50 rounded flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-yellow-500">Duplicate Title Tag</p>
                              <p className="text-xs text-gray-400">/kategori/matematik</p>
                          </div>
                          <button className="text-xs bg-yellow-900/40 hover:bg-yellow-900/60 text-yellow-300 px-2 py-1 rounded">Düzenle</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 4. ADSENSE REPORT TAB */}
      {activeTab === 'adsense' && (
          <div className="space-y-6">
              <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-white mb-6">Günlük Kazanç Trendi</h3>
                  <div className="h-72">
                      <canvas ref={adsenseChartRef}></canvas>
                  </div>
              </div>

              <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 bg-gray-800">
                      <h3 className="font-bold text-white">Reklam Birimi Performansı</h3>
                  </div>
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="bg-gray-800 text-gray-400">
                          <tr>
                              <th className="p-4">Reklam Birimi</th>
                              <th className="p-4 text-center">Gösterim</th>
                              <th className="p-4 text-center">Tıklama</th>
                              <th className="p-4 text-center">CTR</th>
                              <th className="p-4 text-right">Kazanç</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                          <tr className="hover:bg-gray-800/50">
                              <td className="p-4 text-white font-bold">Header Leaderboard</td>
                              <td className="p-4 text-center">25,000</td>
                              <td className="p-4 text-center">300</td>
                              <td className="p-4 text-center text-green-400">1.2%</td>
                              <td className="p-4 text-right">$145.50</td>
                          </tr>
                          <tr className="hover:bg-gray-800/50">
                              <td className="p-4 text-white font-bold">In-Article Native</td>
                              <td className="p-4 text-center">12,000</td>
                              <td className="p-4 text-center">288</td>
                              <td className="p-4 text-center text-green-400">2.4%</td>
                              <td className="p-4 text-right">$210.00</td>
                          </tr>
                          <tr className="hover:bg-gray-800/50">
                              <td className="p-4 text-white font-bold">Sidebar Rectangle</td>
                              <td className="p-4 text-center">18,000</td>
                              <td className="p-4 text-center">144</td>
                              <td className="p-4 text-center text-yellow-500">0.8%</td>
                              <td className="p-4 text-right">$85.20</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* 5. CUSTOM REPORT TAB */}
      {activeTab === 'custom' && (
          <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-wp-card p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-white mb-4">Özel Rapor Oluşturucu</h3>
                  
                  <div className="space-y-6">
                      {/* Date Range */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tarih Aralığı</label>
                          <div className="flex gap-4">
                              <input type="date" className="flex-1 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none" />
                              <span className="text-gray-500 self-center">-</span>
                              <input type="date" className="flex-1 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none" />
                          </div>
                      </div>

                      {/* Metrics */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Metrikler</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {['Sayfa Görüntüleme', 'Tekil Ziyaretçi', 'Hemen Çıkma Oranı', 'Ortalama Süre', 'Adsense Geliri', 'Adsense CTR', 'SEO Sıralaması', 'Sosyal Paylaşım'].map(m => (
                                  <label key={m} className="flex items-center gap-2 cursor-pointer bg-gray-800 p-2 rounded border border-gray-700 hover:border-gray-500">
                                      <input type="checkbox" className="rounded bg-gray-900 border-gray-600 text-wp-accent focus:ring-wp-accent" />
                                      <span className="text-sm text-gray-300">{m}</span>
                                  </label>
                              ))}
                          </div>
                      </div>

                      {/* Filter */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Filtre (Opsiyonel)</label>
                          <select className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none">
                              <option>Tüm Kategoriler</option>
                              <option>Matematik</option>
                              <option>Fen Bilimleri</option>
                              <option>LGS Kampı</option>
                          </select>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded bg-gray-900 border-gray-600 text-wp-accent" />
                              <span className="text-sm text-gray-400">Raporu E-posta ile gönder</span>
                          </label>
                          <button onClick={() => alert('Özel rapor oluşturuluyor...')} className="bg-wp-accent hover:bg-blue-600 text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" /> Raporu Oluştur
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </Layout>
  );
};