import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Plus, Minus, MessageCircle, Info, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../constants/products';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { normalizeProductDescription, normalizeProductName } from '../lib/productText';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [note, setNote] = useState('');
  const [selectedVariationIdx, setSelectedVariationIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(undefined);

  const product = PRODUCTS.find(p => p.id === id);
  const relatedProducts = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  const displayName = product ? normalizeProductName(product.name) : '';
  const displayDescription = product ? normalizeProductDescription(product.description) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImageUrl(product.imageUrl);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Produit non trouvé</h2>
        <Link to="/produits" className="text-brand-green font-bold flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Retour aux produits</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const hasVariations = product.prices && product.prices.length > 0;
    const price = hasVariations ? product.prices![selectedVariationIdx].value : product.price || 0;
    const label = hasVariations ? product.prices![selectedVariationIdx].label : undefined;

    addToCart({
      productId: product.id,
      name: displayName,
      price: price,
      imageUrl: product.imageUrl,
      selectedVariation: label,
      note: note.trim() || undefined
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/produits" 
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-brand-green transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Retour aux produits</span>
        </Link>

        {/* Main Product Section */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row border border-slate-100 mb-20">
          {/* Image & Gallery Section */}
          <div className="lg:w-3/5 p-3 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Gallery Thumbnails (Side) */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="order-2 sm:order-1 flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-2 sm:pb-0 snap-x">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImageUrl(img)}
                    className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 snap-start ${
                      mainImageUrl === img 
                      ? 'border-brand-green ring-4 ring-brand-green/10' 
                      : 'border-transparent hover:border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${displayName} shadow-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image View */}
            <div className="order-1 sm:order-2 flex-grow aspect-square sm:aspect-auto sm:h-[600px] relative rounded-2xl sm:rounded-[2rem] overflow-hidden bg-slate-50">
              <img 
                src={mainImageUrl || product.imageUrl} 
                alt={displayName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-brand-green text-white px-4 py-2 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-2/5 p-6 sm:p-12 lg:pl-0 flex flex-col">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]">
                {displayName}
              </h1>
              
              <div className="flex items-center space-x-2 text-brand-green mb-4 sm:mb-6">
                <div className="w-6 sm:w-8 h-px bg-brand-green/30" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Détails du produit</span>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 whitespace-pre-wrap">
                {displayDescription || "Découvrez le goût authentique de nos produits locaux, préparés avec passion selon les traditions haïtiennes."}
              </p>
            </div>

            <div className="space-y-8 sm:space-y-10 mt-auto">
              {/* Variations / Pricing */}
              <div>
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
                  Sélectionner l'option
                </label>
                {product.prices && product.prices.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {product.prices.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariationIdx(idx)}
                        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col text-left group ${
                          selectedVariationIdx === idx 
                          ? 'border-brand-green bg-brand-green/5 ring-4 sm:ring-8 ring-brand-green/5' 
                          : 'border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${
                          selectedVariationIdx === idx ? 'text-brand-green' : 'text-slate-400'
                        }`}>
                          {p.label}
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-slate-900">
                          {formatCurrency(p.value)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-brand-green">
                        {formatCurrency(product.price || 0)}
                      </span>
                      {product.unit && (
                        <span className="text-slate-400 font-bold ml-2 sm:ml-3 uppercase text-[10px] sm:text-xs tracking-[0.2em]">
                          par {product.unit}
                        </span>
                      )}
                    </div>
                    <div className="bg-brand-green/10 p-2.5 rounded-full text-brand-green">
                      <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block">
                  Instructions de commande
                </label>
                <div className="relative group">
                  <MessageCircle size={18} className="absolute left-4 sm:left-5 top-5 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={2000}
                    placeholder="Précisez vos préférences ici..."
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl text-sm text-slate-600 focus:ring-2 focus:ring-brand-green/20 focus:bg-white focus:border-brand-green outline-none resize-none transition-all h-28 sm:h-32"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold tracking-tighter">{note.length}/2000</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-grow h-16 sm:h-20 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 sm:space-x-4 transition-all shadow-xl active:scale-95 ${
                    added 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-brand-green text-white hover:bg-brand-orange shadow-brand-green/20'
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
                      <span>Ajouté !</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} className="sm:w-6 sm:h-6" />
                      <span>Ajouter</span>
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/30 rounded-full" />
                      <span className="opacity-80">
                        {formatCurrency(product.prices && product.prices.length > 0 ? product.prices[selectedVariationIdx].value : product.price || 0)}
                      </span>
                    </>
                  )}
                </button>
                <a 
                  href={`https://wa.me/50941103400?text=Je souhaite commander: ${displayName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center hover:bg-brand-green transition-all shadow-lg active:scale-95 group"
                  title="Commander directement"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                  >
                    <MessageCircle size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                  </motion.div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="py-12 border-t border-slate-100">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-brand-orange">
                  <div className="w-8 h-px bg-brand-orange/30" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Découvrir plus</span>
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
                  Produits similaires
                </h2>
              </div>
              <Link to="/produits" className="hidden sm:block text-sm font-bold text-brand-green hover:text-brand-orange transition-colors">
                Tout voir →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} delay={idx * 0.1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
