import React from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { normalizeProductDescription, normalizeProductName } from '../lib/productText';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { addToCart } = useCart();
  const displayName = normalizeProductName(product.name);
  const displayDescription = normalizeProductDescription(product.description);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const price = product.prices && product.prices.length > 0 ? product.prices[0].value : product.price || 0;
    const label = product.prices && product.prices.length > 0 ? product.prices[0].label : undefined;

    addToCart({
      productId: product.id,
      name: displayName,
      price: price,
      imageUrl: product.image_url,
      selectedVariation: label
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
    >
      <Link to={`/produit/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <img
          src={product.image_url || '/static/placeholder.jpg'}
          alt={displayName}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:saturate-[1.1] group-hover:brightness-[1.02]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-brand-green shadow-sm uppercase tracking-widest">
            {product.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
          <span className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span>Détails</span>
            <ArrowRight size={14} />
          </span>
        </div>
      </Link>

      <div className="p-4 sm:p-8 flex flex-col flex-grow">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-display font-bold text-sm sm:text-xl text-slate-900 mb-1 sm:mb-2 group-hover:text-brand-green transition-colors leading-tight tracking-tight line-clamp-1 sm:line-clamp-none">
            {displayName}
          </h3>
        </Link>
        <p className="text-slate-500 text-[10px] sm:text-xs line-clamp-2 mb-4 sm:mb-8 flex-grow leading-relaxed">
          {displayDescription || "Découvrez le goût authentique de nos produits locaux."}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col group-hover:-translate-y-1 transition-transform duration-300">
            {product.prices && product.prices.length > 0 ? (
              <>
                <span className="text-sm sm:text-xl font-black text-brand-green group-hover:brightness-110 transition-all duration-300">
                  {formatCurrency(Math.min(...product.prices.map(p => p.value)))}
                  <span className="text-[10px] sm:text-sm font-normal text-slate-400 ml-1">+</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                  Plusieurs options
                </span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-xl font-black text-brand-green group-hover:brightness-110 transition-all duration-300">
                  {formatCurrency(product.price || 0)}
                </span>
                {product.unit && (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5 sm:mt-1">
                    par {product.unit}
                  </span>
                )}
              </>
            )}
          </div>

          <button 
            onClick={handleQuickAdd}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-brand-green hover:scale-110 transition-all shadow-lg hover:shadow-brand-green/20 group/btn"
            title="Ajout rapide"
          >
            <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
