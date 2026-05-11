import { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants/products';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Search, LayoutGrid, Pizza, Utensils, CupSoda, Apple, X } from 'lucide-react';
import { motion } from 'motion/react';

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = useMemo(() => [
    { name: 'Tous', icon: <LayoutGrid size={16} /> },
    { name: 'Cornet', icon: <Pizza size={16} /> },
    { name: 'Saucisse', icon: <Utensils size={16} /> },
    { name: 'Fresco', icon: <CupSoda size={16} /> },
    { name: 'Jus Naturel', icon: <Apple size={16} /> }
  ], []);

  const popularSearches = ['Jus Melon', 'Jus Cerise', 'Jus Grenadia', 'Jus Mandarine', 'Jus Citron', 'Cornet boîte'];

  const searchableProducts = useMemo(() => {
    return PRODUCTS.map((product) => {
      const prices = product.prices?.map((price) => `${price.label} ${price.value}`).join(' ') ?? '';
      const text = [
        product.id,
        product.name,
        product.category,
        product.description,
        product.unit,
        product.price,
        prices
      ].filter(Boolean).join(' ');

      return {
        product,
        searchText: normalizeSearch(text)
      };
    });
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { Tous: PRODUCTS.length };
    categories.forEach(cat => {
      if (cat.name !== 'Tous') {
        map[cat.name] = PRODUCTS.filter(p => p.category === cat.name).length;
      }
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const tokens = normalizeSearch(searchQuery).split(' ').filter(Boolean);

    return searchableProducts
      .filter(({ product, searchText }) => {
        const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
        const matchesSearch = tokens.length === 0 || tokens.every(token => searchText.includes(token));
        return matchesCategory && matchesSearch;
      })
      .map(({ product }) => product);
  }, [searchQuery, selectedCategory, searchableProducts]);

  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Menu Artisanal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 tracking-tight"
          >
            Nos <span className="text-brand-green">Délices</span> Locaux
          </motion.h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Savourez l'authenticité d'Haïti avec chaque bouchée. Des produits frais, préparés chaque jour.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative w-full lg:flex-grow max-w-2xl group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-green transition-colors">
                <Search size={20} />
              </div>
              <input
                type="search"
                placeholder="Rechercher: jus melon, boîte, 250, fresco..."
                className="w-full pl-14 pr-12 py-5 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/30 outline-none transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {hasActiveSearch && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  title="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="hidden lg:flex items-center bg-white px-6 py-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-x-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total</span>
                <span className="text-xl font-black text-brand-green">{PRODUCTS.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Résultats</span>
                <span className="text-xl font-black text-brand-orange">{filteredProducts.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularSearches.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="px-4 py-2 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-brand-green/30 hover:text-brand-green transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex overflow-x-auto w-full pb-4 sm:pb-0 space-x-3 no-scrollbar snap-x">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`group relative flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap snap-start border-2 ${
                      isActive
                        ? 'bg-brand-green border-brand-green text-white shadow-lg shadow-brand-green/20'
                        : 'bg-white border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {cat.icon}
                    </span>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                        {cat.name}
                      </span>
                      <span className={`text-[9px] mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-400 font-bold'}`}>
                        {counts[cat.name]} produits
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full shadow-lg"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx * 0.05} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-6"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <ShoppingBag size={48} />
            </div>
            <div>
              <h3 className="font-display font-black text-3xl text-slate-900 mb-2">Aucun délice trouvé</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Aucun produit ne correspond à "<span className="font-bold text-brand-orange">{searchQuery}</span>" dans cette catégorie.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tous');
              }}
              className="bg-brand-green text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-xl shadow-brand-green/20"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
