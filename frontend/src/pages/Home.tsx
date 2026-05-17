import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Sparkles, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));

    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(console.error);
  }, []);
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-28 pb-20 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.hero_image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000"} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-sm font-bold mb-6">
              <Leaf size={16} />
              <span>100% Naturel & Local</span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-slate-900 leading-tight mb-6">
              L'essence de la <span className="text-brand-green">Nature</span> dans chaque bouchée.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              Production Lakay vous apporte le goût authentique d'Haïti à travers nos jus naturels fraîchement pressés et nos délices artisanaux.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/produits" 
                className="bg-brand-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-light-green hover:shadow-xl hover:shadow-brand-green/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Découvrez nos trésors</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/contact" 
                className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-brand-green hover:text-brand-green transition-all flex items-center justify-center"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl ">
               <img 
                src={settings?.hero_secondary_image_url || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000"} 
                alt="Fruits frais" 
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 sm:-bottom-10 left-4 sm:-left-10 z-20 bg-brand-yellow p-6 sm:p-8 rounded-2xl shadow-xl max-w-[240px]">
              <Sparkles className="text-brand-orange mb-3" size={28} />
              <p className="font-display font-bold text-brand-green text-base sm:text-lg leading-tight">
                Sans additifs, sans conservateurs. Juste le naturel.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-slate-900 mb-4">Pourquoi choisir Production Lakay ?</h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Leaf />, title: "100% Haïtien", desc: "Produits issus directement de nos terres fertiles." },
            { icon: <Truck />, title: "Livraison Rapide", desc: "Vos produits frais livrés à votre porte en un rien de temps." },
            { icon: <ShieldCheck />, title: "Qualité Garantie", desc: "Sécurité alimentaire et hygiène irréprochable." },
            { icon: <Sparkles />, title: "Soutien Direct", desc: "Chaque achat soutient l'économie locale et les artisans." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 text-brand-green mb-4">
                <ShoppingBag size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Favoris de la Maison</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">
                Nos Meilleurs Choix
              </h2>
            </div>
            <Link 
              to="/produits" 
              className="inline-flex items-center space-x-2 text-brand-green font-black text-sm uppercase tracking-widest group"
            >
              <span>Tout le menu</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Replaced CTA Section with something else or just removed if 4 products are enough */}
      {/* But I'll add a smaller CTA footer section for professional look */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-6">Prêt à commander ?</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Profitez du goût authentique de nos produits artisanaux livrés directement chez vous.
          </p>
          <Link 
            to="/produits" 
            className="inline-block bg-brand-green text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-brand-green/20"
          >
            Commencer ma commande
          </Link>
        </div>
      </section>
    </div>
  );
}
