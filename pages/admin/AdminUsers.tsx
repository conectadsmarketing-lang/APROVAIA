
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Search, MoreVertical, Shield, Ban, Crown } from 'lucide-react';
import { db } from '../../services/mockDb';
import { User, UserRole } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUsers(db.getAllUsers());
  }, []);

  const handleBan = (id: string) => {
    if (window.confirm('Banir usuário permanentemente?')) {
      db.banUser(id);
      setUsers(db.getAllUsers()); // Refresh
    }
  };

  const handlePromote = (id: string) => {
    if (window.confirm('Promover para Admin?')) {
      db.promoteUser(id);
      setUsers(db.getAllUsers()); // Refresh
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h1>
         <Button size="sm">Exportar CSV</Button>
      </div>

      <Card className="bg-[#111] border-white/5" noPadding>
        <div className="p-4 border-b border-white/5">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input 
               className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
               placeholder="Buscar por nome ou email..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-3">Usuário</th>
                <th className="px-6 py-3">Plano</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">XP</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                         {user.avatarUrl ? <img src={user.avatarUrl} /> : user.name[0]}
                       </div>
                       <div>
                         <p className="text-white font-medium">{user.name}</p>
                         <p className="text-xs">{user.email}</p>
                         {user.role === UserRole.ADMIN && <span className="text-[10px] bg-blue-500/20 text-blue-500 px-1 rounded ml-1">ADMIN</span>}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{user.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.isBanned ? 'bg-red-500/20 text-red-500' : 
                      user.subscriptionStatus === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {user.isBanned ? 'BANIDO' : user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{user.xp}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!user.isBanned && (
                         <button onClick={() => handleBan(user.id)} className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded" title="Banir">
                           <Ban size={16} />
                         </button>
                      )}
                      {user.role !== UserRole.ADMIN && (
                         <button onClick={() => handlePromote(user.id)} className="p-1.5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-500 rounded" title="Promover Admin">
                           <Shield size={16} />
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
