
import React, { useEffect, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, FileText, File, Copy, Check } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { getMedia, saveMedia, deleteMedia, fileToBase64 } from '../../services/storage';
import { MediaItem } from '../../types';

export const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMediaList(getMedia());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    // Simple Size Validation for localStorage (Max 500KB for Demo)
    if (file.size > 500 * 1024) {
        alert("Demo sürümünde maksimum 500KB dosya yüklenebilir.");
        setIsUploading(false);
        return;
    }

    try {
        const base64 = await fileToBase64(file);
        const newItem: MediaItem = {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: base64,
            createdAt: new Date().toISOString()
        };

        saveMedia(newItem);
        setMediaList(getMedia());
    } catch (error) {
        console.error("Upload error", error);
        alert("Dosya yüklenirken hata oluştu.");
    } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
      if (window.confirm("Bu dosyayı kalıcı olarak silmek istiyor musunuz?")) {
          deleteMedia(id);
          setMediaList(getMedia());
      }
  };

  const handleCopyUrl = (url: string, id: string) => {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-brand-500" />;
      if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
      return <File className="w-8 h-8 text-slate-500" />;
  };

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Medya Kütüphanesi</h1>
        <p className="text-slate-500">Ders notları, resimler ve dokümanlar.</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-slate-300 hover:border-brand-500 transition-colors mb-8 text-center group relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={isUploading}
            accept="image/*,application/pdf,.doc,.docx"
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="p-4 bg-brand-50 text-brand-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className={`w-8 h-8 ${isUploading ? 'animate-bounce' : ''}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {isUploading ? 'Yükleniyor...' : 'Dosya Yüklemek İçin Tıkla veya Sürükle'}
              </h3>
              <p className="text-slate-500 text-sm">PNG, JPG, PDF, DOCX (Max 500KB - Demo)</p>
          </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mediaList.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                  {/* Preview */}
                  <div className="aspect-square bg-slate-50 relative border-b border-slate-100 flex items-center justify-center overflow-hidden">
                      {item.type.startsWith('image/') ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                          getFileIcon(item.type)
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleCopyUrl(item.url, item.id)}
                            className="p-2 bg-white rounded-full hover:bg-brand-50 text-slate-800"
                            title="URL Kopyala"
                          >
                             {copiedId === item.id ? <Check className="w-4 h-4 text-green-600"/> : <Copy className="w-4 h-4"/>}
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600"
                            title="Sil"
                          >
                             <Trash2 className="w-4 h-4"/>
                          </button>
                      </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                      <p className="text-sm font-semibold text-slate-700 truncate" title={item.name}>{item.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-400 uppercase">{item.type.split('/')[1] || 'FILE'}</span>
                        <span className="text-xs text-slate-400">{(item.size / 1024).toFixed(0)} KB</span>
                      </div>
                  </div>
              </div>
          ))}
          
          {mediaList.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                  Henüz dosya yüklemediniz.
              </div>
          )}
      </div>
    </Layout>
  );
};
