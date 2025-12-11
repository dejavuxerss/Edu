
import React from 'react';
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

function App() {
  return (
    <HashRouter>
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