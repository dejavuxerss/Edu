
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { PostView } from './pages/PostView';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminEditor } from './pages/Admin/Editor';
import { AdminSettings } from './pages/Admin/Settings';
import { AdminTaxonomy } from './pages/Admin/Taxonomy';
import { MediaLibrary } from './pages/Admin/MediaLibrary';
import { AdminSEO } from './pages/Admin/SEO';
import { AdminAnalytics } from './pages/Admin/Analytics';
import { AdminAdsense } from './pages/Admin/Adsense';
import { AdminTeam } from './pages/Admin/Team';
import { AdminReports } from './pages/Admin/Reports';
import { getSettings } from './services/storage';
import { ThemeColor } from './types';

// Theme Color Palettes (RGB values for Tailwind variable injection)
const THEMES: Record<ThemeColor, Record<string, string>> = {
  ocean: { // Teal/Cyan (Default)
    50: '240 253 250', 100: '204 251 241', 200: '153 246 228', 300: '94 234 212', 
    400: '45 212 191', 500: '20 184 166', 600: '13 148 136', 700: '15 118 110', 
    800: '17 94 89', 900: '19 78 74', 950: '4 47 46'
  },
  candy: { // Pink/Rose
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
    400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
    800: '159 18 57', 900: '136 19 55', 950: '76 5 25'
  },
  nature: { // Green/Emerald
    50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183',
    400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87',
    800: '6 95 70', 900: '6 78 59', 950: '2 44 34'
  },
  sunset: { // Orange/Amber
    50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77',
    400: '251 191 36', 500: '245 158 11', 600: '217 119 6', 700: '180 83 9',
    800: '146 64 14', 900: '120 53 15', 950: '69 26 3'
  },
  royal: { // Purple/Violet
    50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253',
    400: '167 139 250', 500: '139 92 246', 600: '124 58 237', 700: '109 40 217',
    800: '91 33 182', 900: '76 29 149', 950: '46 16 101'
  }
};

const ThemeInjector = () => {
  const settings = getSettings();
  
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES[settings.themeColor] || THEMES.ocean;

    // Inject CSS variables for the brand color
    Object.keys(theme).forEach(shade => {
      root.style.setProperty(`--color-brand-${shade}`, theme[shade]);
    });
  }, [settings.themeColor]); // Re-run when themeColor changes

  // Listen for storage events to update theme across tabs or after save
  useEffect(() => {
      const handleStorage = () => {
          const s = getSettings();
          const theme = THEMES[s.themeColor] || THEMES.ocean;
          Object.keys(theme).forEach(shade => {
            document.documentElement.style.setProperty(`--color-brand-${shade}`, theme[shade]);
          });
      };
      window.addEventListener('storage', handleStorage);
      // Custom event for immediate update within same tab
      window.addEventListener('settingsUpdated', handleStorage);
      
      return () => {
          window.removeEventListener('storage', handleStorage);
          window.removeEventListener('settingsUpdated', handleStorage);
      };
  }, []);

  return null;
}

function App() {
  return (
    <HashRouter>
      <ThemeInjector />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostView />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/posts" element={<AdminDashboard />} /> {/* Filter handled inside */}
        <Route path="/admin/pages" element={<AdminDashboard />} /> {/* Filter handled inside */}
        
        <Route path="/admin/editor" element={<AdminEditor />} />
        <Route path="/admin/editor/:id" element={<AdminEditor />} />
        
        <Route path="/admin/taxonomy" element={<AdminTaxonomy />} />
        <Route path="/admin/categories" element={<Navigate to="/admin/taxonomy" replace />} />
        
        <Route path="/admin/seo" element={<AdminSEO />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/adsense" element={<AdminAdsense />} />
        <Route path="/admin/team" element={<AdminTeam />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/media" element={<MediaLibrary />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;