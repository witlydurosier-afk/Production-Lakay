import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, Sun, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    const list = items.map(i => {
      let itemText = `• ${i.quantity}x *${i.name}*`;
      if (i.selectedVariation) itemText += ` (${i.selectedVariation})`;
      itemText += ` - ${formatCurrency(i.price * i.quantity)}`;
      if (i.note) itemText += `\n  _Note: ${i.note}_`;
      return itemText;
    }).join('\n\n');
    
    const message = encodeURIComponent(
      `Salut Production Lakay! 🌴🥥\n\nNouvelle commande de votre site web:\n\n${list}\n\n━━━━━━━━━━━━━━━━━━━━\n*TOTAL: ${formatCurrency(totalPrice)}*\n━━━━━━━━━━━━━━━━━━━━\n\nMerci de me confirmer la réception !`
    );
    window.open(`https://wa.me/50941103400?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-none">Votre Panier</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green mr-2 animate-pulse" />
                    {totalItems} {totalItems > 1 ? 'articles' : 'article'} sélectionnés
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {items.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    title="Vider le panier"
                  >
                    <RotateCcw size={20} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto px-8 py-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                      <ShoppingBag size={64} />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-50"
                    >
                      <Sun className="text-brand-yellow" size={24} />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-slate-900">Votre panier est vide</h3>
                    <p className="text-slate-400 max-w-[240px] mx-auto text-sm leading-relaxed">
                      Nos délicieux cornets et jus frais n'attendent que votre commande !
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-green transition-all shadow-xl hover:shadow-brand-green/20"
                  >
                    Découvrir notre carte
                  </button>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {items.map((item) => (
                    <motion.div 
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="flex space-x-5 p-4 rounded-[2rem] bg-white border border-slate-50 hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-grow flex flex-col py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-display font-bold text-slate-900 leading-tight tracking-tight text-base">
                              {item.name}
                            </h4>
                            {item.selectedVariation && (
                              <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em] block mt-1.5 bg-brand-green/5 px-2 py-0.5 rounded-full w-fit">
                                {item.selectedVariation}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {item.note && (
                          <div className="mt-3 bg-slate-50 px-3 py-2 rounded-xl italic text-[10px] text-slate-400 border border-slate-100/50">
                            "{item.note}"
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4">
                          <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-10 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-brand-green"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
                            <span className="font-display font-black text-slate-900 text-lg">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-green/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-brand-green"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Sous-total</span>
                    <span className="font-bold text-slate-600 text-sm">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-display font-black text-xl mb-1">Total à payer</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                        <Info className="mr-1" size={10} />
                        À régler à la livraison
                      </span>
                    </div>
                    <span className="text-3xl font-display font-black text-brand-green tracking-tight">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full bg-slate-900 text-white h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center space-x-3 transition-all shadow-2xl shadow-slate-900/20 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="relative flex items-center space-x-3">
                      <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                      <span>Confirmer via WhatsApp</span>
                    </div>
                  </motion.button>
                  <div className="flex items-center justify-center space-x-4 opacity-50">
                    <p className="flex items-center text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">
                      <CheckCircle2 size={10} className="text-brand-green mr-1.5" />
                      Livraison Rapide
                    </p>
                    <p className="flex items-center text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">
                      <CheckCircle2 size={10} className="text-brand-green mr-1.5" />
                      Produits Frais
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Info({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
