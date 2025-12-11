import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PenTool, Settings, ExternalLink, Menu, X, User, 
  ChevronRight, GraduationCap, FileText, ImageIcon, ChevronDown, Moon, Sun, Search,
  CheckCircle, AlertTriangle, XCircle, Info
} from 'lucide-react';
import { getSettings } from '../services/storage';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

// Notification Event Helper
export const notify = (type: Notification['type'], message: string) => {
    window.dispatchEvent(new CustomEvent('notify', { detail: { type, message } }));
};

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();

  // --- THEME & INIT ---
  useEffect(() => {
    // Theme Check
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
    }

    // Scroll
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+K for Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            setIsSearchOpen(prev => !prev);
        }
        // Esc to close search
        if (e.key === 'Escape') {
            setIsSearchOpen(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Notification Listener
    const handleNotification = (e: any) => {
        const newNotif: Notification = {
            id: crypto.randomUUID(),
            type: e.detail.type,
            message: e.detail.message
        };
        setNotifications(prev => [...prev, newNotif]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 4000);
    };
    window.addEventListener('notify', handleNotification);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('notify', handleNotification);
    };
  }, []);

  const toggleTheme = () => {
      if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          setIsDark(false);
      } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          setIsDark(true);
      }
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearchNavigate = (path: string) => {
      navigate(path);
      setIsSearchOpen(false);
      setSearchQuery('');
  };

  // --- ADMIN LAYOUT (DARK THEME PRESERVED BUT RESPONSIVE) ---
  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-900 font-sans text-gray-300">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e1e1e] flex flex-col border-r border-gray-800 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shadow-xl lg:shadow-none`}>
          
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-[#1e1e1e]">
             <i className="fa-brands fa-wordpress text-2xl text-white mr-3"></i>
             <span className="text-white font-bold text-lg tracking-wide">SEO Master</span>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-3 border-l-4 transition-colors ${location.pathname === '/admin' ? 'bg-wp-accent text-white border-white' : 'border-transparent hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-gauge-high w-6"></i>
                        <span className="font-medium">Dashboard</span>
                    </Link>
                </li>

                {/* Content Group */}
                <li className="px-6 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">İçerik Yönetimi</li>
                <li>
                    <Link to="/admin/posts" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/posts') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-pen-nib w-6 group-hover:text-wp-accent"></i>
                        <span>Yazılar</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/pages" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/pages') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-copy w-6 group-hover:text-wp-accent"></i>
                        <span>Sayfalar</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/media" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/media') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-photo-film w-6 group-hover:text-wp-accent"></i>
                        <span>Medya</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/taxonomy" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/taxonomy') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-tags w-6 group-hover:text-wp-accent"></i>
                        <span>Taksonomi</span>
                    </Link>
                </li>

                {/* Growth Group */}
                <li className="px-6 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Growth & Gelir</li>
                <li>
                    <Link to="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/analytics') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-chart-line w-6 group-hover:text-wp-accent"></i>
                        <span>Analytics</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/seo" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/seo') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-brands fa-searchengin w-6 group-hover:text-wp-accent"></i>
                        <span>SEO Merkezi</span>
                    </Link>
                </li>
                 <li>
                    <Link to="/admin/adsense" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/adsense') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-sack-dollar w-6 group-hover:text-wp-green"></i>
                        <span>Adsense</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/reports" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/reports') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-file-contract w-6 group-hover:text-wp-accent"></i>
                        <span>Raporlar</span>
                    </Link>
                </li>

                {/* System Group */}
                <li className="px-6 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Sistem</li>
                <li>
                    <Link to="/admin/team" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/team') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-users w-6 group-hover:text-wp-accent"></i>
                        <span>Takım</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-6 py-2.5 transition-colors group ${location.pathname.includes('/settings') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                        <i className="fa-solid fa-sliders w-6 group-hover:text-wp-accent"></i>
                        <span>Ayarlar</span>
                    </Link>
                </li>
            </ul>
          </nav>

          {/* User Mini */}
          <div className="p-4 border-t border-gray-800">
             <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-wp-accent flex items-center justify-center text-white font-bold">
                    A
                 </div>
                 <div>
                     <p className="text-sm font-medium text-white">Admin</p>
                     <p className="text-xs text-gray-500">Webmaster</p>
                 </div>
             </div>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* Top Admin Bar */}
          <header className="bg-[#1e293b] border-b border-gray-800 h-16 flex items-center justify-between px-6 shadow-md z-20 sticky top-0">
             <div className="flex items-center gap-4">
                 <button onClick={toggleMenu} className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 focus:outline-none" aria-label="Menu">
                     <Menu className="w-6 h-6" />
                 </button>
                 <h2 className="text-xl font-semibold text-white hidden sm:block">
                    {location.pathname === '/admin' ? 'Dashboard' : 
                     location.pathname.includes('posts') ? 'Yazılar' :
                     location.pathname.includes('pages') ? 'Sayfalar' :
                     location.pathname.includes('media') ? 'Medya' :
                     location.pathname.includes('editor') ? 'Editör' :
                     location.pathname.includes('taxonomy') ? 'Taksonomi' :
                     location.pathname.includes('seo') ? 'SEO Araçları' : 
                     location.pathname.includes('analytics') ? 'Analytics' :
                     location.pathname.includes('adsense') ? 'Adsense' :
                     location.pathname.includes('team') ? 'Takım' :
                     location.pathname.includes('reports') ? 'Raporlar' : 'Panel'}
                 </h2>
             </div>
             
             <div className="flex items-center gap-4">
                <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex items-center gap-2 bg-gray-800 text-gray-400 px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:border-gray-600 hover:text-gray-300 transition-colors" title="Ara (Ctrl+K)">
                    <Search className="w-4 h-4"/> <span className="text-xs">Ara...</span> <span className="text-[10px] border border-gray-600 px-1 rounded ml-2">Ctrl+K</span>
                </button>
                <button onClick={() => setIsSearchOpen(true)} className="md:hidden text-gray-400 hover:text-white" aria-label="Search">
                    <Search className="w-5 h-5"/>
                </button>

                <Link to="/admin/editor" className="hidden md:flex items-center gap-2 bg-wp-accent hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none">
                    <i className="fa-solid fa-plus"></i> Yeni Yazı
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1 group" title="Siteyi Görüntüle">
                    <span className="hidden sm:inline">Site</span> <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                </Link>
             </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 text-slate-300 relative">
            {children}
          </main>
        </div>

        {/* Command Palette Modal */}
        {isSearchOpen && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setIsSearchOpen(false)}>
                <div className="bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Gitmek istediğiniz yeri yazın..." 
                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto py-2">
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Sayfalar</div>
                        <button onClick={() => handleSearchNavigate('/admin')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-wp-accent hover:text-white flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4"/> Dashboard
                        </button>
                        <button onClick={() => handleSearchNavigate('/admin/posts')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-wp-accent hover:text-white flex items-center gap-2">
                            <PenTool className="w-4 h-4"/> Yazılar
                        </button>
                        <button onClick={() => handleSearchNavigate('/admin/editor')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-wp-accent hover:text-white flex items-center gap-2">
                            <FileText className="w-4 h-4"/> Yeni İçerik Oluştur
                        </button>
                        <button onClick={() => handleSearchNavigate('/admin/settings')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-wp-accent hover:text-white flex items-center gap-2">
                            <Settings className="w-4 h-4"/> Ayarlar
                        </button>
                        
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-2">Hızlı İşlemler</div>
                        <button onClick={() => { notify('success', 'Önbellek temizlendi!'); setIsSearchOpen(false); }} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-wp-accent hover:text-white flex items-center gap-2">
                            <ExternalLink className="w-4 h-4"/> Önbelleği Temizle
                        </button>
                    </div>
                    <div className="p-2 bg-gray-800 text-center text-xs text-gray-500 border-t border-gray-700">
                        Seçmek için <span className="font-bold text-gray-400">Enter</span>, kapatmak için <span className="font-bold text-gray-400">Esc</span>
                    </div>
                </div>
            </div>
        )}

        {/* Notifications Container */}
        <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
            {notifications.map(notif => (
                <div key={notif.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-in-right ${
                    notif.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' :
                    notif.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-100' :
                    notif.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100' :
                    'bg-gray-800 border-gray-700 text-white'
                }`}>
                    {notif.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {notif.type === 'error' && <XCircle className="w-5 h-5" />}
                    {notif.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {notif.type === 'info' && <Info className="w-5 h-5" />}
                    <span className="text-sm font-medium">{notif.message}</span>
                </div>
            ))}
        </div>

      </div>
    );
  }

  // --- PUBLIC LAYOUT ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-brand-500 selection:text-white text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'glass-nav h-20 border-slate-200/50 dark:border-slate-800/50 shadow-sm' : 'bg-transparent h-24 border-transparent'}`}>
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-10 w-auto object-contain" />
            ) : (
                <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className={`text-2xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white md:text-slate-800 dark:md:text-white'}`}>
                        {settings.siteName}
                    </span>
                </div>
            )}
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
             <Link to="/" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-white/20'}`}>
               Ana Sayfa
             </Link>
             <Link to="/post/hakkimda" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-white/20'}`}>
               Hakkımda
             </Link>
             <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors mx-2" aria-label="Toggle Theme">
                 {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
             </button>
             <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2 opacity-50"></div>
             <Link to="/admin" className="pl-6 pr-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
               Giriş Yap <ChevronRight className="w-3 h-3" />
             </Link>
          </nav>

          <div className="md:hidden flex items-center gap-2 relative z-50">
              <button onClick={toggleTheme} className="p-2 bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-sm" aria-label="Toggle Theme Mobile">
                 {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-800" />}
              </button>
              <button className="p-2 text-slate-800 dark:text-white bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
          </div>
        </div>

        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center space-y-8 animate-fade-in-up md:hidden">
                 <Link to="/" className="text-2xl font-bold text-white hover:text-brand-400" onClick={() => setIsMobileMenuOpen(false)}>Ana Sayfa</Link>
                 <Link to="/post/hakkimda" className="text-2xl font-bold text-white hover:text-brand-400" onClick={() => setIsMobileMenuOpen(false)}>Hakkımda</Link>
                 <Link to="/admin" className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold text-lg shadow-lg shadow-brand-500/30" onClick={() => setIsMobileMenuOpen(false)}>Öğretmen Girişi</Link>
            </div>
        )}
      </header>

      <main className="flex-1 w-full relative z-0">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} {settings.siteName}. {settings.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};