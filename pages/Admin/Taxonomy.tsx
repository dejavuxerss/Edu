
import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, FolderTree, Tag, Save, X } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { getCategories, saveCategory, deleteCategory, getTags, saveTag, deleteTag, getPosts } from '../../services/storage';
import { Category, Tag as TagType } from '../../types';

type Tab = 'categories' | 'tags';

export const AdminTaxonomy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [postsCount, setPostsCount] = useState<Record<string, number>>({});
  
  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<Partial<Category>>({ name: '', slug: '', description: '', parentId: '', seoDescription: '' });
  const [tagForm, setTagForm] = useState<Partial<TagType>>({ name: '', slug: '', description: '', seoDescription: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const cats = getCategories();
    const tgs = getTags();
    const posts = getPosts();

    // Calculate Counts dynamically based on actual posts
    const counts: Record<string, number> = {};
    
    // Category Counts
    cats.forEach(c => {
        counts[`cat_${c.name}`] = posts.filter(p => p.category === c.name).length;
    });

    // Tag Counts
    tgs.forEach(t => {
        counts[`tag_${t.name}`] = posts.filter(p => p.tags?.toLowerCase().includes(t.name.toLowerCase())).length;
    });

    setCategories(cats);
    setTags(tgs);
    setPostsCount(counts);
  };

  const resetForms = () => {
      setEditingId(null);
      setCatForm({ name: '', slug: '', description: '', parentId: '', seoDescription: '' });
      setTagForm({ name: '', slug: '', description: '', seoDescription: '' });
  };

  // --- HANDLERS ---
  const handleSaveCategory = () => {
      if (!catForm.name) return;
      const slugToUse = catForm.slug || catForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const newCat: Category = {
          id: editingId || crypto.randomUUID(),
          name: catForm.name!,
          slug: slugToUse,
          description: catForm.description,
          parentId: catForm.parentId === '' ? undefined : catForm.parentId,
          seoDescription: catForm.seoDescription
      };
      saveCategory(newCat);
      refreshData();
      resetForms();
  };

  const handleSaveTag = () => {
      if (!tagForm.name) return;
      const slugToUse = tagForm.slug || tagForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const newTag: TagType = {
          id: editingId || crypto.randomUUID(),
          name: tagForm.name!,
          slug: slugToUse,
          description: tagForm.description,
          seoDescription: tagForm.seoDescription
      };
      saveTag(newTag);
      refreshData();
      resetForms();
  };

  const handleEdit = (item: Category | TagType, type: Tab) => {
      setEditingId(item.id);
      if (type === 'categories') {
          const cat = item as Category;
          setCatForm({ ...cat, parentId: cat.parentId || '' });
          setActiveTab('categories');
      } else {
          setTagForm(item as TagType);
          setActiveTab('tags');
      }
  };

  const handleDelete = (id: string, type: Tab) => {
      if (confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
          if (type === 'categories') deleteCategory(id);
          else deleteTag(id);
          refreshData();
      }
  };

  return (
    <Layout isAdmin>
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Kategoriler & Etiketler</h1>
            <p className="text-gray-400 text-sm">Site hiyerarşinizi ve taksonomilerinizi yönetin.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-800 p-1 rounded-lg">
            <button 
                onClick={() => { setActiveTab('categories'); resetForms(); }}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'categories' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
                <FolderTree className="w-4 h-4" /> Kategoriler
            </button>
            <button 
                onClick={() => { setActiveTab('tags'); resetForms(); }}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'tags' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
                <Tag className="w-4 h-4" /> Etiketler
            </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* --- LEFT COLUMN: FORM --- */}
          <div className="w-full xl:w-1/3">
              <div className="bg-wp-card p-6 rounded-lg border border-gray-700 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white">
                          {editingId ? (activeTab === 'categories' ? 'Kategoriyi Düzenle' : 'Etiketi Düzenle') : (activeTab === 'categories' ? 'Yeni Kategori Ekle' : 'Yeni Etiket Ekle')}
                      </h3>
                      {editingId && (
                          <button onClick={resetForms} className="text-xs text-red-400 hover:underline flex items-center gap-1">
                              <X className="w-3 h-3" /> İptal
                          </button>
                      )}
                  </div>

                  {activeTab === 'categories' ? (
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">İsim</label>
                              <input 
                                  type="text" 
                                  value={catForm.name}
                                  onChange={e => setCatForm({...catForm, name: e.target.value})}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                                  placeholder="Örn: Matematik"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kısa İsim (Slug)</label>
                              <input 
                                  type="text" 
                                  value={catForm.slug}
                                  onChange={e => setCatForm({...catForm, slug: e.target.value})}
                                  className="w-full bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded text-sm focus:border-wp-accent outline-none font-mono"
                                  placeholder="matematik"
                              />
                              <p className="text-[10px] text-gray-500 mt-1">URL'de görünecek isim. Boş bırakılırsa otomatik üretilir.</p>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Ebeveyn Kategori</label>
                              <select 
                                  value={catForm.parentId}
                                  onChange={e => setCatForm({...catForm, parentId: e.target.value})}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                              >
                                  <option value="">Yok (Ana Kategori)</option>
                                  {categories.filter(c => c.id !== editingId).map(c => (
                                      <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Açıklama</label>
                              <textarea 
                                  value={catForm.description}
                                  onChange={e => setCatForm({...catForm, description: e.target.value})}
                                  rows={3}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                              ></textarea>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Meta Açıklama (SEO)</label>
                              <textarea 
                                  value={catForm.seoDescription}
                                  onChange={e => setCatForm({...catForm, seoDescription: e.target.value})}
                                  rows={2}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                                  placeholder="Arama motorları için açıklama..."
                              ></textarea>
                          </div>
                          <button onClick={handleSaveCategory} className="w-full bg-wp-accent hover:bg-blue-600 text-white py-2 rounded font-bold transition-colors flex items-center justify-center gap-2">
                              <Save className="w-4 h-4" /> {editingId ? 'Güncelle' : 'Kategori Ekle'}
                          </button>
                      </div>
                  ) : (
                      // TAG FORM
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Etiket Adı</label>
                              <input 
                                  type="text" 
                                  value={tagForm.name}
                                  onChange={e => setTagForm({...tagForm, name: e.target.value})}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                                  placeholder="Örn: lgs 2024"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kısa İsim (Slug)</label>
                              <input 
                                  type="text" 
                                  value={tagForm.slug}
                                  onChange={e => setTagForm({...tagForm, slug: e.target.value})}
                                  className="w-full bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded text-sm focus:border-wp-accent outline-none font-mono"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Meta Açıklama (SEO)</label>
                              <textarea 
                                  value={tagForm.seoDescription}
                                  onChange={e => setTagForm({...tagForm, seoDescription: e.target.value})}
                                  rows={2}
                                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-wp-accent outline-none"
                              ></textarea>
                          </div>
                          <button onClick={handleSaveTag} className="w-full bg-wp-accent hover:bg-blue-600 text-white py-2 rounded font-bold transition-colors flex items-center justify-center gap-2">
                              <Save className="w-4 h-4" /> {editingId ? 'Güncelle' : 'Etiket Ekle'}
                          </button>
                      </div>
                  )}
              </div>
          </div>

          {/* --- RIGHT COLUMN: LIST --- */}
          <div className="w-full xl:w-2/3">
              <div className="bg-wp-card shadow-sm border border-gray-700 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                          <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                              <tr>
                                  <th className="p-4 w-1/4">İsim</th>
                                  <th className="p-4">Açıklama</th>
                                  <th className="p-4">Slug</th>
                                  <th className="p-4 text-center">Yazı</th>
                                  <th className="p-4 text-right">İşlemler</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                              {activeTab === 'categories' ? (
                                  categories.length > 0 ? categories.map(cat => {
                                      // Hierarchy visual helper
                                      const isChild = !!cat.parentId;
                                      const postCount = postsCount[`cat_${cat.name}`] || 0;
                                      
                                      return (
                                          <tr key={cat.id} className="hover:bg-gray-800/50 group">
                                              <td className="p-4">
                                                  <div className="flex items-center gap-2">
                                                      {isChild && <span className="text-gray-600">└──</span>}
                                                      <span className={`font-bold ${isChild ? 'text-gray-300' : 'text-white'}`}>{cat.name}</span>
                                                  </div>
                                              </td>
                                              <td className="p-4 text-gray-400 text-xs max-w-xs truncate">{cat.description || '-'}</td>
                                              <td className="p-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                                              <td className="p-4 text-center">
                                                  <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs">{postCount}</span>
                                              </td>
                                              <td className="p-4 text-right">
                                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button onClick={() => handleEdit(cat, 'categories')} className="text-blue-400 hover:text-white p-1"><Edit2 className="w-4 h-4"/></button>
                                                      <button onClick={() => handleDelete(cat.id, 'categories')} className="text-red-400 hover:text-white p-1"><Trash2 className="w-4 h-4"/></button>
                                                  </div>
                                              </td>
                                          </tr>
                                      );
                                  }) : <tr><td colSpan={5} className="p-8 text-center text-gray-500">Kategori bulunamadı.</td></tr>
                              ) : (
                                  tags.length > 0 ? tags.map(tag => {
                                      const postCount = postsCount[`tag_${tag.name}`] || tag.count || 0;
                                      return (
                                          <tr key={tag.id} className="hover:bg-gray-800/50 group">
                                              <td className="p-4 font-bold text-white">{tag.name}</td>
                                              <td className="p-4 text-gray-400 text-xs max-w-xs truncate">{tag.seoDescription || '-'}</td>
                                              <td className="p-4 font-mono text-xs text-gray-500">{tag.slug}</td>
                                              <td className="p-4 text-center">
                                                  <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs">{postCount}</span>
                                              </td>
                                              <td className="p-4 text-right">
                                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button onClick={() => handleEdit(tag, 'tags')} className="text-blue-400 hover:text-white p-1"><Edit2 className="w-4 h-4"/></button>
                                                      <button onClick={() => handleDelete(tag.id, 'tags')} className="text-red-400 hover:text-white p-1"><Trash2 className="w-4 h-4"/></button>
                                                  </div>
                                              </td>
                                          </tr>
                                      );
                                  }) : <tr><td colSpan={5} className="p-8 text-center text-gray-500">Etiket bulunamadı.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  );
};