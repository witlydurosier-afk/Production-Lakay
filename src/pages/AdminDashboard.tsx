import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/utils';
import { OperationType, type Product, type ProductPrice } from '../types';
import { 
  Plus, Edit2, Trash2, LogOut, Package, Image as ImageIcon, 
  Tag as TagIcon, DollarSign, LayoutDashboard, Search, X, Check, AlertCircle, Save, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const INITIAL_PRODUCTS = [
  { name: "Cornet Unité", category: "Cornet", price: 100, unit: "Unité", description: "Croustillant et délicieux." },
  { name: "Cornet Boîte", category: "Cornet", price: 550, unit: "Boîte", description: "Format familial." },
  { name: "Saucisse enroulée Unité", category: "Saucisse", price: 100, unit: "Unité", description: "Le snack parfait." },
  { name: "Saucisse enroulée Boîte", category: "Saucisse", price: 550, unit: "Boîte", description: "Idéal pour les fêtes." },
  { name: "Fresco Cup Small", category: "Fresco", price: 150, unit: "Cup", description: "Rafraîchissant et fruité." },
  { name: "Fresco Cup Large", category: "Fresco", price: 200, unit: "Cup", description: "Double plaisir." },
  { name: "Jus Naturel (Melon, Cerise...)", category: "Jus Naturel", prices: [
    { label: "Small", value: 250 },
    { label: "Medium", value: 300 },
    { label: "Large", value: 350 }
  ], description: "Jus 100% naturel pressé à froid." }
];

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cornet',
    unit: '',
    imageUrl: '',
  });
  const [variationData, setVariationData] = useState<ProductPrice[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin');
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category,
        unit: product.unit || '',
        imageUrl: product.imageUrl || '',
      });
      setVariationData(product.prices || []);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Cornet',
        unit: '',
        imageUrl: '',
      });
      setVariationData([]);
    }
    setIsModalOpen(true);
  };

  const handleAddVariation = () => {
    setVariationData([...variationData, { label: '', value: 0 }]);
  };

  const handleRemoveVariation = (index: number) => {
    setVariationData(variationData.filter((_, i) => i !== index));
  };

  const handleUpdateVariation = (index: number, field: keyof ProductPrice, value: string | number) => {
    const updated = [...variationData];
    if (field === 'value') {
      updated[index].value = typeof value === 'string' ? parseFloat(value) : value;
    } else {
      updated[index].label = value as string;
    }
    setVariationData(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        prices: variationData.length > 0 ? variationData : null,
        category: formData.category,
        unit: formData.unit,
        imageUrl: formData.imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, data);
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'products');
      }
    }
  };

  const seedData = async () => {
    if (products.length > 0) return;
    setLoading(true);
    try {
      for (const p of INITIAL_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...p,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900 flex items-center space-x-3">
              <LayoutDashboard className="text-brand-green" />
              <span>Tableau de Bord</span>
            </h1>
            <p className="text-slate-500">Gérez vos produits et mettez à jour votre boutique en temps réel.</p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <button
               onClick={() => handleOpenModal()}
               className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-brand-light-green transition-all shadow-lg shadow-brand-green/20"
            >
              <Plus size={20} />
              <span>Nouveau Produit</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-red-600 hover:border-red-100 transition-all"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats & Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Produits</p>
            <p className="text-3xl font-display font-bold text-slate-900">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 flex items-center space-x-4">
            <Search className="text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Rechercher un produit dans l'inventaire..." 
              className="flex-grow bg-transparent border-none outline-none text-slate-700 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {loading && products.length === 0 ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green mx-auto mb-4"></div>
              <p className="text-slate-400">Chargement de l'inventaire...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Produit</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Catégorie</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Prix</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop'} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1">{p.unit || 'Standard'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">
                          {p.price ? `${p.price} HTG` : (p.prices ? 'Varié' : 'N/A')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleOpenModal(p)}
                            className="p-2 text-slate-400 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center">
              <Package size={64} className="mx-auto text-slate-100 mb-6" />
              <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Aucun produit dans l'inventaire</h3>
              <p className="text-slate-400 mb-8">Commencez par ajouter votre premier produit.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button
                  onClick={() => handleOpenModal()}
                  className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-brand-light-green transition-all"
                >
                  <Plus size={20} />
                  <span>Ajouter Manuellement</span>
                </button>
                 <button
                  onClick={seedData}
                  className="bg-brand-yellow text-brand-green px-8 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-white hover:shadow-lg transition-all"
                >
                  <Database size={20} />
                  <span>Importer les Exemples</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tool */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom du Produit</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catégorie</label>
                    <div className="relative">
                      <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none appearance-none"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option>Cornet</option>
                        <option>Saucisse</option>
                        <option>Fresco</option>
                        <option>Jus Naturel</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prix (HTG)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unité (ex: Unité, Boîte)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="Unité, Boîte, Cup..."
                    />
                  </div>
                </div>

                {/* Variation/Multi-prices Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Variations de prix (ex: Petit, Moyen, Grand)</label>
                    <button 
                      type="button" 
                      onClick={handleAddVariation}
                      className="text-brand-green hover:text-brand-light-green flex items-center space-x-1 text-sm font-bold"
                    >
                      <Plus size={16} />
                      <span>Ajouter</span>
                    </button>
                  </div>
                  
                  {variationData.length > 0 ? (
                    <div className="space-y-3">
                      {variationData.map((v, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            placeholder="Label (ex: Petit)" 
                            className="flex-grow bg-white px-3 py-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-brand-green outline-none shadow-sm"
                            value={v.label}
                            onChange={(e) => handleUpdateVariation(i, 'label', e.target.value)}
                          />
                          <input 
                            type="number"
                            placeholder="Prix" 
                            className="w-32 bg-white px-3 py-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-brand-green outline-none shadow-sm"
                            value={v.value}
                            onChange={(e) => handleUpdateVariation(i, 'value', e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveVariation(i)}
                            className="p-2 text-slate-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aucune variation (utile pour les jus Naturels).</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL de l'image (Optionnel)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="url" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-green outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="flex-1 px-4 py-4 rounded-xl bg-brand-green text-white font-bold hover:bg-brand-light-green transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Enregistrer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
