
import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/Layout';
import { 
    DollarSign, BarChart2, Layout as LayoutIcon, Zap, Settings, 
    Plus, Copy, MoreHorizontal, ArrowUp, ArrowDown, Smartphone, Monitor, CheckCircle, AlertTriangle, MousePointer
} from 'lucide-react';
import { AdUnitConfig } from '../../types';
import { MOCK_AD_UNITS } from '../../constants';

// Declare Chart.js globally
declare global {
    interface Window {
        Chart: any;
    }
}

type Tab = 'summary' | 'adunits' | 'placements' | 'performance' | 'optimization';

export const AdminAdsense: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [adUnits, setAdUnits] = useState<AdUnitConfig[]>(MOCK_AD_UNITS);
  
  // Charts
  const hourlyChartRef = useRef<HTMLCanvasElement>(null);
  const dailyChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any[]>([]);

  useEffect(() => {
    // Cleanup previous charts
    chartInstances.current.forEach(c => c.destroy());
    chartInstances.current = [];

    if (activeTab === 'performance' && window.Chart) {
        // Hourly Chart
        if (hourlyChartRef.current) {
            const ctx = hourlyChartRef.current.getContext('2d');
            const chart = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    datasets: [{
                        label: 'Kazanç ($)',
                        data: [1.2, 0.8, 3.5, 5.2, 4.8, 2.9],
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                        y: { beginAtZero: true, grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }, 
                        x: { grid: { display: false }, ticks: { color: '#64748b' } } 
                    }
                }
            });
            chartInstances.current.push(chart);
        }

        // Daily Chart
        if (dailyChartRef.current) {
            const ctx = dailyChartRef.current.getContext('2d');
            const chart = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1 Mar', '5 Mar', '10 Mar', '15 Mar', '20 Mar', '25 Mar', '30 Mar'],
                    datasets: [{
                        label: 'Günlük Gelir',
                        data: [12, 15, 11, 22, 18, 25, 20],
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
                    scales: { 
                        y: { beginAtZero: true, grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }, 
                        x: { grid: { display: false }, ticks: { color: '#64748b' } } 
                    }
                }
            });
            chartInstances.current.push(chart);
        }
    }
  }, [activeTab]);

  const copyCode = (id: string) => {
      // Simulate copy
      alert(`Ad Unit ID: ${id} kodu kopyalandı!`);
  };

  const toggleStatus = (id: string) => {
      setAdUnits(prev => prev.map(unit => 
          unit.id === id ? { ...unit, status: unit.status === 'active' ? 'paused' : 'active' } : unit
      ));
  };

  return (
    <Layout isAdmin>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Adsense Gelir Yönetimi</h1>
        <p className="text-gray-400 text-sm">Reklam birimlerini yönetin, gelirinizi analiz edin ve optimize edin.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
            <button onClick={() => setActiveTab('summary')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'summary' ? 'bg-wp-green text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <DollarSign className="w-4 h-4" /> Özet Panosu
            </button>
            <button onClick={() => setActiveTab('adunits')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'adunits' ? 'bg-wp-green text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <LayoutIcon className="w-4 h-4" /> Ad Units
            </button>
            <button onClick={() => setActiveTab('placements')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'placements' ? 'bg-wp-green text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Settings className="w-4 h-4" /> Yerleşim
            </button>
            <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'performance' ? 'bg-wp-green text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <BarChart2 className="w-4 h-4" /> Performance
            </button>
            <button onClick={() => setActiveTab('optimization')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'optimization' ? 'bg-wp-green text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Zap className="w-4 h-4" /> Optimizasyon
            </button>
      </div>

      {/* 1. SUMMARY TAB */}
      {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-wp-card p-6 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-400 text-sm font-medium">Bugünün Kazancı</p>
                          <h3 className="text-3xl font-bold text-white mt-1">$18.45</h3>
                      </div>
                      <div className="p-2 bg-green-900/30 rounded-lg text-green-400"><DollarSign className="w-6 h-6"/></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                      <ArrowUp className="w-3 h-3"/> +5.2% <span className="text-gray-500 font-normal ml-1">düne göre</span>
                  </div>
              </div>

               {/* Card 2 */}
               <div className="bg-wp-card p-6 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-400 text-sm font-medium">Bu Ay Toplam</p>
                          <h3 className="text-3xl font-bold text-white mt-1">$452.70</h3>
                      </div>
                      <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400"><BarChart2 className="w-6 h-6"/></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                      <ArrowUp className="w-3 h-3"/> +12% <span className="text-gray-500 font-normal ml-1">geçen aya göre</span>
                  </div>
              </div>

               {/* Card 3 */}
               <div className="bg-wp-card p-6 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-400 text-sm font-medium">CPM (BGBG)</p>
                          <h3 className="text-3xl font-bold text-white mt-1">$1.42</h3>
                      </div>
                      <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400"><Settings className="w-6 h-6"/></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-red-400">
                      <ArrowDown className="w-3 h-3"/> -2.1% <span className="text-gray-500 font-normal ml-1">düşüş</span>
                  </div>
              </div>

               {/* Card 4 */}
               <div className="bg-wp-card p-6 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-400 text-sm font-medium">Tahmini Aylık</p>
                          <h3 className="text-3xl font-bold text-white mt-1">$580.00</h3>
                      </div>
                      <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><Zap className="w-6 h-6"/></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                      CTR Oranı: <span className="text-white font-bold">2.4%</span>
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                      <h4 className="font-bold text-white">Otomatik Reklamlar</h4>
                      <p className="text-sm text-gray-400">Google'ın en iyi yerleşimleri sizin için seçmesine izin verin.</p>
                  </div>
                  <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Aktif</span>
                      <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white font-medium">Ayarları Yapılandır</button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. AD UNITS TAB */}
      {activeTab === 'adunits' && (
          <div className="space-y-6">
              <div className="flex justify-end">
                  <button className="bg-wp-green hover:bg-green-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                      <Plus className="w-4 h-4"/> Yeni Ad Unit Ekle
                  </button>
              </div>

              <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                          <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                              <tr>
                                  <th className="p-4">Ad Unit Adı</th>
                                  <th className="p-4">Boyut</th>
                                  <th className="p-4">Yerleşim</th>
                                  <th className="p-4">Kazanç (30G)</th>
                                  <th className="p-4">CTR</th>
                                  <th className="p-4">Durum</th>
                                  <th className="p-4 text-right">İşlemler</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                              {adUnits.map(unit => (
                                  <tr key={unit.id} className="hover:bg-gray-800/50">
                                      <td className="p-4">
                                          <div className="font-bold text-white">{unit.name}</div>
                                          <div className="text-xs text-gray-500">ID: {unit.id}</div>
                                      </td>
                                      <td className="p-4 text-gray-400">{unit.size}</td>
                                      <td className="p-4">
                                          <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{unit.placement}</span>
                                      </td>
                                      <td className="p-4 font-bold text-green-400">${unit.earnings.toFixed(2)}</td>
                                      <td className="p-4 text-white">{unit.ctr}%</td>
                                      <td className="p-4">
                                          <button 
                                            onClick={() => toggleStatus(unit.id)}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${unit.status === 'active' ? 'bg-green-500' : 'bg-gray-600'}`}
                                          >
                                              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${unit.status === 'active' ? 'left-4.5' : 'left-0.5'}`}></span>
                                          </button>
                                      </td>
                                      <td className="p-4 text-right">
                                          <div className="flex justify-end gap-2">
                                              <button onClick={() => copyCode(unit.id)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300" title="Kodu Kopyala">
                                                  <Copy className="w-4 h-4"/>
                                              </button>
                                              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300" title="A/B Testi Başlat">
                                                  <Zap className="w-4 h-4"/>
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* 3. PLACEMENT TAB */}
      {activeTab === 'placements' && (
          <div className="flex flex-col lg:flex-row gap-8">
              {/* Controls */}
              <div className="w-full lg:w-1/3 space-y-6">
                  <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                      <h3 className="font-bold text-white mb-4">Görünüm Ayarları</h3>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                               <div className="flex items-center gap-2 text-gray-300">
                                   <Smartphone className="w-5 h-5"/> Mobil Reklamlar
                               </div>
                               <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                               <div className="flex items-center gap-2 text-gray-300">
                                   <Monitor className="w-5 h-5"/> Masaüstü Reklamlar
                               </div>
                               <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                      <h3 className="font-bold text-white mb-4">Bloklanan Kategoriler</h3>
                      <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                              <input type="checkbox" className="form-checkbox text-wp-green rounded bg-gray-800 border-gray-600"/>
                              <span>Kumar & Bahis</span>
                          </label>
                          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                              <input type="checkbox" className="form-checkbox text-wp-green rounded bg-gray-800 border-gray-600"/>
                              <span>Politika</span>
                          </label>
                          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                              <input type="checkbox" className="form-checkbox text-wp-green rounded bg-gray-800 border-gray-600"/>
                              <span>Duygusal & Dramatik</span>
                          </label>
                      </div>
                  </div>
              </div>

              {/* Visual Layout */}
              <div className="w-full lg:w-2/3 bg-gray-900 p-8 rounded-xl border border-gray-700 flex justify-center">
                   <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col min-h-[600px] relative">
                       {/* Header Ad Slot */}
                       <div className="bg-gray-100 p-2 border-b border-gray-200">
                           <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                           <div className="w-full h-16 bg-green-100 border-2 border-dashed border-green-400 rounded flex items-center justify-center text-green-700 text-xs font-bold relative group cursor-grab active:cursor-grabbing">
                               Header Leaderboard (728x90)
                               <div className="absolute top-1 right-1 hidden group-hover:block bg-green-600 text-white p-1 rounded"><Settings className="w-3 h-3"/></div>
                           </div>
                       </div>
                       
                       <div className="flex flex-1">
                           {/* Main Content */}
                           <div className="flex-1 p-4">
                               <div className="h-6 w-3/4 bg-gray-800 rounded mb-4"></div>
                               <div className="space-y-2 mb-4">
                                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                                   <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                               </div>
                               
                               {/* In-Article Ad Slot */}
                               <div className="w-full h-24 bg-green-100 border-2 border-dashed border-green-400 rounded flex items-center justify-center text-green-700 text-xs font-bold mb-4 relative group cursor-grab active:cursor-grabbing">
                                    In-Article Ad (Fluid)
                                    <div className="absolute top-1 right-1 hidden group-hover:block bg-green-600 text-white p-1 rounded"><Settings className="w-3 h-3"/></div>
                               </div>

                               <div className="space-y-2">
                                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                               </div>
                           </div>

                           {/* Sidebar */}
                           <div className="w-1/3 bg-gray-50 border-l border-gray-200 p-2">
                               <div className="w-full h-32 bg-green-100 border-2 border-dashed border-green-400 rounded flex items-center justify-center text-green-700 text-xs font-bold mb-4 text-center relative group cursor-grab active:cursor-grabbing">
                                    Sidebar Rect (300x250)
                                    <div className="absolute top-1 right-1 hidden group-hover:block bg-green-600 text-white p-1 rounded"><Settings className="w-3 h-3"/></div>
                               </div>
                               <div className="space-y-2">
                                   <div className="h-2 w-full bg-gray-200 rounded"></div>
                                   <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                               </div>
                           </div>
                       </div>
                   </div>
              </div>
          </div>
      )}

      {/* 4. PERFORMANCE TAB */}
      {activeTab === 'performance' && (
          <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                  <h3 className="text-white font-bold mb-4">Saatlik Kazanç (Bugün)</h3>
                  <div className="h-64">
                      <canvas ref={hourlyChartRef}></canvas>
                  </div>
              </div>

              <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                  <h3 className="text-white font-bold mb-4">Günlük Kazanç (Son 7 Gün)</h3>
                  <div className="h-64">
                      <canvas ref={dailyChartRef}></canvas>
                  </div>
              </div>

              <div className="bg-wp-card p-6 rounded-xl border border-gray-700 lg:col-span-2">
                   <h3 className="text-white font-bold mb-4">En İyi Performans Gösteren Sayfalar</h3>
                   <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-800 text-gray-400 font-semibold border-b border-gray-700">
                                <tr>
                                    <th className="p-4">Sayfa URL</th>
                                    <th className="p-4 text-center">Page Views</th>
                                    <th className="p-4 text-center">Reklam Gösterimi</th>
                                    <th className="p-4 text-center">CTR</th>
                                    <th className="p-4 text-right">Tahmini Kazanç</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-mono text-xs text-white">/post/lgs-maratonu-son-3-ay</td>
                                    <td className="p-4 text-center">12,500</td>
                                    <td className="p-4 text-center">35,200</td>
                                    <td className="p-4 text-center text-green-400">2.1%</td>
                                    <td className="p-4 text-right font-bold text-white">$45.20</td>
                                </tr>
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-mono text-xs text-white">/post/matematik-korkusunu-yenmek</td>
                                    <td className="p-4 text-center">8,200</td>
                                    <td className="p-4 text-center">21,050</td>
                                    <td className="p-4 text-center text-yellow-500">1.4%</td>
                                    <td className="p-4 text-right font-bold text-white">$22.15</td>
                                </tr>
                                <tr className="hover:bg-gray-800/50">
                                    <td className="p-4 font-mono text-xs text-white">/post/evde-fen-deneyleri</td>
                                    <td className="p-4 text-center">6,150</td>
                                    <td className="p-4 text-center">18,200</td>
                                    <td className="p-4 text-center text-green-400">3.8%</td>
                                    <td className="p-4 text-right font-bold text-white">$38.90</td>
                                </tr>
                            </tbody>
                        </table>
                   </div>
              </div>
          </div>
      )}

      {/* 5. OPTIMIZATION TAB */}
      {activeTab === 'optimization' && (
          <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-800/50 flex items-start gap-4">
                  <div className="p-3 bg-blue-500 rounded-full text-white">
                      <Zap className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white mb-2">Kazançlarınızı %25 Artırın</h3>
                      <p className="text-gray-300 mb-4">Otomatik reklamları aktifleştirerek ve sayfa yüklenme hızını optimize ederek gelirinizi artırabilirsiniz.</p>
                      <button className="bg-white text-blue-900 px-6 py-2 rounded font-bold hover:bg-gray-100">Otomatik Reklamları Aç</button>
                  </div>
              </div>

              <div className="bg-wp-card p-6 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-6">İyileştirme Kontrol Listesi</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
                          <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-300 line-through">ads.txt dosyası doğrulandı</span>
                          </div>
                          <span className="text-xs text-gray-500">Tamamlandı</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700 border-l-4 border-l-yellow-500">
                          <div className="flex items-center gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-500" />
                              <span className="text-white font-medium">Satıcı (Sellers.json) bilgilerinizi şeffaf yapın</span>
                          </div>
                          <button className="text-xs bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded hover:bg-yellow-600/30">Düzelt</button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                          <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
                              <span className="text-gray-300">Anchor reklamları mobil için aktifleştir</span>
                          </div>
                          <button className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600">Aktifleştir</button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                          <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
                              <span className="text-gray-300">GDPR mesajını göster (Avrupa trafiği için)</span>
                          </div>
                          <button className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600">Ayarlar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </Layout>
  );
};