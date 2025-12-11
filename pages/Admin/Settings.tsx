
import React, { useEffect, useState } from 'react';
import { 
    Save, LayoutTemplate, Globe, DollarSign, Share2, Mail, Zap, 
    CheckCircle, AlertCircle, Image as ImageIcon, Palette
} from 'lucide-react';
import { Layout, notify } from '../../components/Layout';
import { getSettings, saveSettings } from '../../services/storage';
import { SiteSettings, ThemeColor } from '../../types';

type Tab = 'general' | 'appearance' | 'seo' | 'adsense' | 'social' | 'email' | 'performance';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!settings) return;
      const { name, value, type } = e.target;
      setSettings(prev => {
          if (!prev) return null;
          return {
              ...prev,
              [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
          };
      });
  };

  const handleColorSelect = (color: ThemeColor) => {
      if (!settings) return;
      setSettings(prev => prev ? ({ ...prev, themeColor: color }) : null);
  };

  const handleSave = () => {
      if (settings) {
          // Simple validation
          if (activeTab === 'email' && settings.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.adminEmail)) {
              notify('error', 'Geçersiz Admin Email adresi.');
              return;
          }

          saveSettings(settings);
          // Trigger custom event for immediate theme update in App.tsx
          window.dispatchEvent(new Event('settingsUpdated'));
          
          setSaved(true);
          notify('success', 'Ayarlar başarıyla kaydedildi.');
          setTimeout(() => setSaved(false), 2000);
      }
  };

  if (!settings) return null;

  return (
    <Layout isAdmin>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                <p className="text-gray-400 text-sm">Sitenizin tüm yapılandırmasını tek bir yerden yönetin.</p>
            </div>
            <button 
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 font-bold ${saved ? 'bg-green-600 text-white' : 'bg-wp-accent hover:bg-blue-600 text-white hover:shadow-lg'}`}
            >
                <Save className="w-5 h-5" /> {saved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-wp-card border border-gray-700 rounded-xl overflow-hidden sticky top-6">
                    <nav className="flex flex-col p-2 space-y-1">
                        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <LayoutTemplate className="w-5 h-5" /> Genel Ayarlar
                        </button>
                        <button onClick={() => setActiveTab('appearance')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Palette className="w-5 h-5" /> Görünüm
                        </button>
                        <button onClick={() => setActiveTab('seo')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'seo' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Globe className="w-5 h-5" /> SEO Ayarları
                        </button>
                        <button onClick={() => setActiveTab('adsense')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'adsense' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <DollarSign className="w-5 h-5" /> Adsense
                        </button>
                        <button onClick={() => setActiveTab('social')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'social' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Share2 className="w-5 h-5" /> Sosyal Medya
                        </button>
                        <button onClick={() => setActiveTab('email')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'email' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Mail className="w-5 h-5" /> Email
                        </button>
                        <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'performance' ? 'bg-wp-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Zap className="w-5 h-5" /> Performans
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
                
                {/* 1. GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Site Kimliği</h3>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Site Adı</label>
                                        <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Slogan (Tagline)</label>
                                        <input type="text" name="siteTagline" value={settings.siteTagline} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Site Açıklaması</label>
                                    <textarea name="siteDescription" rows={3} value={settings.siteDescription} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none" maxLength={160}></textarea>
                                    <p className="text-xs text-gray-500 mt-1 text-right">{settings.siteDescription.length}/160</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Yerelleştirme</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Dil</label>
                                    <select name="language" value={settings.language} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none">
                                        <option value="tr">Türkçe (TR)</option>
                                        <option value="en">English (EN)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Zaman Dilimi</label>
                                    <select name="timezone" value={settings.timezone} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none">
                                        <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 1.5 APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Site Teması</h3>
                            <p className="text-gray-400 text-sm mb-6">Sitenizin ana renk tonunu seçin. Bu değişiklik tüm sitede anında uygulanır.</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <button 
                                    onClick={() => handleColorSelect('ocean')}
                                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.themeColor === 'ocean' ? 'border-teal-500 bg-teal-900/20' : 'border-gray-700 hover:border-teal-500/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-teal-500 shadow-lg shadow-teal-500/30"></div>
                                    <span className="text-sm font-bold text-white">Okyanus</span>
                                    {settings.themeColor === 'ocean' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-teal-500" />}
                                </button>

                                <button 
                                    onClick={() => handleColorSelect('candy')}
                                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.themeColor === 'candy' ? 'border-pink-500 bg-pink-900/20' : 'border-gray-700 hover:border-pink-500/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-pink-500 shadow-lg shadow-pink-500/30"></div>
                                    <span className="text-sm font-bold text-white">Şeker</span>
                                    {settings.themeColor === 'candy' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-pink-500" />}
                                </button>

                                <button 
                                    onClick={() => handleColorSelect('nature')}
                                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.themeColor === 'nature' ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 hover:border-emerald-500/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"></div>
                                    <span className="text-sm font-bold text-white">Doğa</span>
                                    {settings.themeColor === 'nature' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />}
                                </button>

                                <button 
                                    onClick={() => handleColorSelect('sunset')}
                                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.themeColor === 'sunset' ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 hover:border-amber-500/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
                                    <span className="text-sm font-bold text-white">Güneş</span>
                                    {settings.themeColor === 'sunset' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-amber-500" />}
                                </button>

                                <button 
                                    onClick={() => handleColorSelect('royal')}
                                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.themeColor === 'royal' ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-violet-500/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-violet-500 shadow-lg shadow-violet-500/30"></div>
                                    <span className="text-sm font-bold text-white">Uzay</span>
                                    {settings.themeColor === 'royal' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-violet-500" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Görseller</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Logo URL</label>
                                    <div className="flex gap-4">
                                        <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleChange} className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                        <div className="w-12 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                                            {settings.logoUrl ? <img src={settings.logoUrl} className="max-w-full max-h-full"/> : <ImageIcon className="w-5 h-5 text-gray-600"/>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Favicon URL</label>
                                    <div className="flex gap-4">
                                        <input type="text" name="faviconUrl" value={settings.faviconUrl} onChange={handleChange} className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                        <div className="w-10 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                                            {settings.faviconUrl ? <img src={settings.faviconUrl} className="max-w-full max-h-full"/> : <ImageIcon className="w-5 h-5 text-gray-600"/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SEO TAB */}
                {activeTab === 'seo' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Doğrulama Kodları</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Google Search Console ID</label>
                                    <input type="text" name="googleSearchConsoleId" value={settings.googleSearchConsoleId} onChange={handleChange} placeholder="google-site-verification=..." className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Bing Webmaster Tools ID</label>
                                    <input type="text" name="bingWebmasterId" value={settings.bingWebmasterId} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Google Analytics Tracking ID (GA4)</label>
                                    <input type="text" name="googleAnalyticsId" value={settings.googleAnalyticsId} onChange={handleChange} placeholder="G-XXXXXXXXXX" className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Tarama Ayarları</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sitemap URL</label>
                                    <div className="flex items-center bg-gray-800 rounded px-4 py-2 border border-gray-700">
                                        <span className="text-gray-400 text-sm flex-1">{window.location.origin}/sitemap.xml</span>
                                        <span className="text-xs text-green-500 font-bold bg-green-900/30 px-2 py-1 rounded border border-green-900/50">Aktif</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Robots.txt Custom Rules</label>
                                    <textarea name="robotsTxt" rows={6} value={settings.robotsTxt} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. ADSENSE TAB */}
                {activeTab === 'adsense' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Google Adsense Hesabı</h3>
                                <p className="text-gray-400 text-sm">Adsense hesabınızı bağlayarak reklam gelirlerinizi artırın ve otomatik yerleşimleri kullanın.</p>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, adsenseConnected: !settings.adsenseConnected})}
                                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${settings.adsenseConnected ? 'bg-green-600 text-white' : 'bg-white text-slate-900 hover:bg-gray-100'}`}
                            >
                                {settings.adsenseConnected ? <CheckCircle className="w-5 h-5"/> : <Globe className="w-5 h-5"/>}
                                {settings.adsenseConnected ? 'Hesap Bağlandı' : 'Adsense Hesabını Bağla'}
                            </button>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Yapılandırma</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <span className="block font-bold text-white text-sm">Reklamları Göster</span>
                                        <span className="text-xs text-gray-500">Global reklam gösterim anahtarı.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enableAds" checked={settings.enableAds} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Publisher ID</label>
                                    <input type="text" name="adsensePublisherId" value={settings.adsensePublisherId} onChange={handleChange} placeholder="pub-xxxxxxxxxxxxxxxx" className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Site API Key (İsteğe Bağlı)</label>
                                    <input type="password" name="adsenseApiKey" value={settings.adsenseApiKey} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. SOCIAL MEDIA TAB */}
                {activeTab === 'social' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Takip Kodları</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Facebook Pixel ID</label>
                                <input type="text" name="facebookPixelId" value={settings.facebookPixelId} onChange={handleChange} placeholder="XXXXXXXXXXXXXXX" className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none font-mono text-sm"/>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Sosyal Medya Profilleri</h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-gray-500"><i className="fab fa-twitter"></i></div>
                                    <input type="text" name="twitterHandle" value={settings.twitterHandle} onChange={handleChange} placeholder="@kullaniciadi" className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-gray-500"><i className="fab fa-instagram"></i></div>
                                    <input type="text" name="instagramProfile" value={settings.instagramProfile} onChange={handleChange} placeholder="instagram.com/kullaniciadi" className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-gray-500"><i className="fab fa-linkedin"></i></div>
                                    <input type="text" name="linkedinProfile" value={settings.linkedinProfile} onChange={handleChange} placeholder="linkedin.com/in/kullaniciadi" className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Open Graph</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Varsayılan Paylaşım Görseli (OG:Image)</label>
                                <div className="flex gap-4">
                                    <input type="text" name="ogImage" value={settings.ogImage} onChange={handleChange} placeholder="https://..." className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                    <div className="w-20 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                                        {settings.ogImage ? <img src={settings.ogImage} className="w-full h-full object-cover"/> : <ImageIcon className="w-5 h-5 text-gray-600"/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. EMAIL TAB */}
                {activeTab === 'email' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">SMTP Yapılandırması</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">SMTP Sunucu</label>
                                    <input type="text" name="smtpServer" value={settings.smtpServer} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Port</label>
                                    <input type="text" name="smtpPort" value={settings.smtpPort} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kullanıcı Adı (Email)</label>
                                <input type="text" name="smtpUser" value={settings.smtpUser} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Şifre</label>
                                <input type="password" value="********" readOnly className="w-full bg-gray-900 border border-gray-700 text-gray-500 px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none cursor-not-allowed"/>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Bildirimler</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Admin Email</label>
                                    <input type="text" name="adminEmail" value={settings.adminEmail} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <span className="block font-bold text-white text-sm">Yorum Bildirimleri</span>
                                        <span className="text-xs text-gray-500">Yeni yorum geldiğinde e-posta gönder.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enableCommentNotifications" checked={settings.enableCommentNotifications} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. PERFORMANCE TAB */}
                {activeTab === 'performance' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Önbellek & Optimizasyon</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <span className="block font-bold text-white text-sm">Browser Caching</span>
                                        <span className="text-xs text-gray-500">Statik dosyalar için tarayıcı önbelleklemesini aktif et.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enableCache" checked={settings.enableCache} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <span className="block font-bold text-white text-sm">Gzip Sıkıştırma</span>
                                        <span className="text-xs text-gray-500">HTML, CSS ve JS dosyalarını sıkıştırarak gönder.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enableGzip" checked={settings.enableGzip} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <span className="block font-bold text-white text-sm">Görsel Optimizasyonu</span>
                                        <span className="text-xs text-gray-500">Resimleri otomatik olarak WebP formatına dönüştür.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enableImageOptimization" checked={settings.enableImageOptimization} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-wp-card border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">CDN Ayarları</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">CDN URL</label>
                                <input type="text" name="cdnUrl" value={settings.cdnUrl} onChange={handleChange} placeholder="https://cdn.mysite.com" className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:border-wp-accent outline-none"/>
                                <p className="text-xs text-gray-500 mt-2">Statik dosyalarınız bu URL üzerinden sunulacaktır.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </Layout>
  );
};