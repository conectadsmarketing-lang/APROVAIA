
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { ShoppingBag, Coins } from 'lucide-react';
import { db } from '../services/mockDb';

export const StorePage: React.FC = () => {
  const [user, setUser] = useState(db.getUser());
  const [items, setItems] = useState(db.getStoreItems());

  const handleBuy = (id: string) => {
    if(db.buyStoreItem(id)) {
      setUser(db.getUser());
      setItems(db.getStoreItems());
      alert("Item comprado com sucesso!");
    } else {
      alert("Saldo insuficiente.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton className="mb-4" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Loja Premium</h1>
          <p className="text-gray-400">Use suas moedas para personalizar seu perfil.</p>
        </div>
        <div className="bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-yellow-500/20">
           <Coins fill="currentColor" /> {user.coins}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className={`flex flex-col items-center text-center ${item.owned ? 'opacity-50' : ''}`}>
             <div className="text-4xl mb-4 bg-[#18181B] p-6 rounded-full border border-white/5">
               {item.icon}
             </div>
             <h3 className="font-bold text-white mb-1">{item.name}</h3>
             <p className="text-xs text-gray-500 uppercase font-bold mb-4">{item.type}</p>
             
             {item.owned ? (
               <Button disabled variant="outline" className="w-full">Comprado</Button>
             ) : (
               <Button onClick={() => handleBuy(item.id)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                 Comprar {item.price}
               </Button>
             )}
          </Card>
        ))}
      </div>
    </div>
  );
};
