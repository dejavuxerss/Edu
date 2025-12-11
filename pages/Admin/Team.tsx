
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { 
    Users, Shield, Lock, Plus, Mail, Edit, Trash2, 
    CheckCircle, XCircle, MoreHorizontal, User as UserIcon,
    Smartphone, Globe, Key, Monitor
} from 'lucide-react';
import { UserRole, User, LoginLog, Session, ApiKey } from '../../types';
import { MOCK_USERS, MOCK_LOGIN_LOGS, MOCK_SESSIONS, MOCK_API_KEYS } from '../../constants';

type Tab = 'users' | 'permissions' | 'security';

export const AdminTeam: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [invitedEmail, setInvitedEmail] = useState('');
  
  // Security Tab States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const getRoleBadge = (role: UserRole) => {
      switch(role) {
          case 'admin': return <span className="bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 rounded text-xs font-bold uppercase">Admin</span>;
          case 'editor': return <span className="bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-1 rounded text-xs font-bold uppercase">Editör</span>;
          case 'author': return <span className="bg-green-900/30 text-green-400 border border-green-900/50 px-2 py-1 rounded text-xs font-bold uppercase">Yazar</span>;
          case 'viewer': return <span className="bg-gray-700 text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">İzleyici</span>;
      }
  };

  const getStatusBadge = (status: User['status']) => {
      switch(status) {
          case 'active': return <span className="flex items-center gap-1 text-green-400 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-green-500"></div> Aktif</span>;
          case 'inactive': return <span className="flex items-center gap-1 text-red-400 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-red-500"></div> Pasif</span>;
          case 'invited': return <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div> Davet Edildi</span>;
      }
  };

  const handleInvite = () => {
      if (!invitedEmail) return;
      alert(`${invitedEmail} adresine davetiye gönderildi.`);
      setInvitedEmail('');
  };

  const toggleUserStatus = (id: string) => {
      setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <Layout isAdmin>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Takım Yönetimi</h1>
            <p className="text-gray-400 text-sm">Kullanıcıları, rolleri ve güvenlik ayarlarını yönetin.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Users className="w-4 h-4" /> Kullanıcılar
            </button>
            <button onClick={() => setActiveTab('permissions')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'permissions' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Shield className="w-4 h-4" /> İzinler
            </button>
            <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'security' ? 'bg-wp-accent text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <Lock className="w-4 h-4" /> Güvenlik
            </button>
        </div>

        {/* 1. USERS TAB */}
        {activeTab === 'users' && (
            <div className="space-y-6">
                {/* Invite Box */}
                <div className="bg-wp-card p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row items-end md:items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Yeni Kullanıcı Davet Et</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                <input 
                                    type="email" 
                                    placeholder="ornek@email.com" 
                                    value={invitedEmail}
                                    onChange={(e) => setInvitedEmail(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 text-white pl-9 pr-3 py-2 rounded text-sm outline-none focus:border-wp-accent"
                                />
                            </div>
                            <select className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-sm outline-none focus:border-wp-accent">
                                <option value="editor">Editör</option>
                                <option value="author">Yazar</option>
                                <option value="viewer">İzleyici</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleInvite} className="bg-wp-accent hover:bg-blue-600 text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 h-[38px]">
                        <Plus className="w-4 h-4" /> Davet Gönder
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-800 text-white font-semibold border-b border-gray-700">
                                <tr>
                                    <th className="p-4">Kullanıcı</th>
                                    <th className="p-4">Rol</th>
                                    <th className="p-4">Durum</th>
                                    <th className="p-4">Son Giriş</th>
                                    <th className="p-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-800/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold border border-gray-600">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRoleBadge(user.role)}</td>
                                        <td className="p-4">{getStatusBadge(user.status)}</td>
                                        <td className="p-4 text-gray-400 text-xs">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded" title="Düzenle">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => toggleUserStatus(user.id)}
                                                    className={`p-2 rounded ${user.status === 'active' ? 'text-red-400 hover:bg-red-900/30' : 'text-green-400 hover:bg-green-900/30'}`} 
                                                    title={user.status === 'active' ? 'Devre Dışı Bırak' : 'Etkinleştir'}
                                                >
                                                    {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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

        {/* 2. PERMISSIONS TAB */}
        {activeTab === 'permissions' && (
            <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-700 bg-gray-800">
                    <h3 className="font-bold text-white">Rol İzinleri Matrisi</h3>
                    <p className="text-xs text-gray-400 mt-1">Hangi rolün hangi kaynaklara erişebileceğini yapılandırın.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-800/50 text-gray-400 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="p-4 w-1/4">Kaynak / Yetki</th>
                                <th className="p-4 text-center text-red-400">Admin</th>
                                <th className="p-4 text-center text-blue-400">Editör</th>
                                <th className="p-4 text-center text-green-400">Yazar</th>
                                <th className="p-4 text-center text-gray-400">İzleyici</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {/* CONTENT */}
                            <tr className="bg-gray-800/30">
                                <td className="p-4 font-bold text-white" colSpan={5}>İçerik Yönetimi</td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">Okuma (Read)</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">Yazma/Düzenleme (Write)</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">Silme (Delete)</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                            </tr>

                            {/* ANALYTICS & SEO */}
                            <tr className="bg-gray-800/30">
                                <td className="p-4 font-bold text-white" colSpan={5}>Growth & Gelir (Analytics, Adsense, SEO)</td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">Raporları Görüntüle</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                            </tr>
                             <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">SEO Ayarlarını Yönet</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                            </tr>

                             {/* SYSTEM */}
                            <tr className="bg-gray-800/30">
                                <td className="p-4 font-bold text-white" colSpan={5}>Sistem & Ayarlar</td>
                            </tr>
                            <tr className="hover:bg-gray-800/50">
                                <td className="p-4 pl-8">Site Ayarları</td>
                                <td className="p-4 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                                <td className="p-4 text-center"><XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* 3. SECURITY TAB */}
        {activeTab === 'security' && (
            <div className="space-y-8">
                {/* 2FA Card */}
                <div className="bg-wp-card p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-4 items-start">
                        <div className="p-3 bg-blue-900/30 rounded-xl text-blue-400">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">İki Faktörlü Doğrulama (2FA)</h3>
                            <p className="text-gray-400 text-sm max-w-lg">Hesabınızın güvenliğini artırmak için giriş yaparken telefonunuza gönderilen kodu girmenizi ister.</p>
                        </div>
                    </div>
                    <div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={twoFactorEnabled}
                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                     <div className="p-4 border-b border-gray-700 bg-gray-800">
                        <h3 className="font-bold text-white">Aktif Oturumlar</h3>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                             <tbody className="divide-y divide-gray-700">
                                {MOCK_SESSIONS.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-800/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                 {session.device.includes('iPhone') || session.device.includes('Android') ? (
                                                     <Smartphone className="w-5 h-5 text-gray-500" />
                                                 ) : (
                                                     <Monitor className="w-5 h-5 text-gray-500" />
                                                 )}
                                                 <div>
                                                     <div className="font-bold text-white">{session.device}</div>
                                                     <div className="text-xs text-gray-500">{session.ip} • {session.lastActive}</div>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {session.isCurrent ? (
                                                <span className="text-green-500 text-xs font-bold border border-green-900/50 bg-green-900/20 px-2 py-1 rounded">Bu Cihaz</span>
                                            ) : (
                                                <button className="text-red-400 hover:text-red-300 text-xs font-bold">Çıkış Yap</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                     </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Login Logs */}
                    <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">Son Giriş Hareketleri</h3>
                            <button className="text-xs text-wp-accent">Tümünü Gör</button>
                        </div>
                        <div className="overflow-y-auto max-h-64">
                             <table className="w-full text-left text-sm text-gray-300">
                                 <tbody className="divide-y divide-gray-700">
                                     {MOCK_LOGIN_LOGS.map(log => (
                                         <tr key={log.id} className="hover:bg-gray-800/50">
                                             <td className="p-4">
                                                 <div className="flex items-center gap-3">
                                                     <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                     <div>
                                                         <div className="font-bold text-white text-xs">{log.userName}</div>
                                                         <div className="text-[10px] text-gray-500">{log.ip}</div>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="p-4 text-right">
                                                 <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleDateString('tr-TR')}</div>
                                                 <div className="text-[10px] text-gray-600">{new Date(log.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                        </div>
                    </div>

                    {/* API Keys */}
                    <div className="bg-wp-card border border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">API Anahtarları</h3>
                            <button className="bg-wp-accent hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                                <Plus className="w-3 h-3"/> Yeni Oluştur
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                             {MOCK_API_KEYS.map(apiKey => (
                                 <div key={apiKey.id} className="bg-gray-900 rounded border border-gray-700 p-3 flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                         <Key className="w-4 h-4 text-yellow-500" />
                                         <div>
                                             <div className="font-bold text-white text-sm">{apiKey.name}</div>
                                             <div className="text-xs text-gray-500 font-mono">{apiKey.prefix}****************</div>
                                         </div>
                                     </div>
                                     <button className="text-gray-400 hover:text-red-400">
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

            </div>
        )}
    </Layout>
  );
};
