import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palmtree, Heart, Users, Star, Camera } from 'lucide-react';

export default function About() {
  const [galleryImages, setGalleryImages] = useState<{id: number, url: string, title: string, category: string, image_url: string}[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));

    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setGalleryImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.about_hero_image_url || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000"} 
            alt="Production Lakay" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-brand-green text-white text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Notre Histoire
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
              Production Lakay
            </h1>
            <p className="text-xl text-white/80 font-medium leading-relaxed">
              L'excellence du goût haïtien, de nos mains à votre cœur. 
              Découvrez la passion derrière chaque bouchée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-brand-green/10 rounded-3xl flex items-center justify-center text-brand-green mx-auto">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Passion</h3>
              <p className="text-slate-500 leading-relaxed">
                Chaque cornet et chaque jus est préparé avec l'amour des traditions et le respect des recettes authentiques.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-brand-orange/10 rounded-3xl flex items-center justify-center text-brand-orange mx-auto">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Communauté</h3>
              <p className="text-slate-500 leading-relaxed">
                Nous sommes fiers de soutenir les producteurs locaux en utilisant des fruits frais de nos terres haïtiennes.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow mx-auto">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Excellence</h3>
              <p className="text-slate-500 leading-relaxed">
                La qualité n'est pas une option. Nous visons la perfection dans chaque service pour votre satisfaction totale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 text-brand-green mb-4">
                <Camera size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Moments Lakay</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">
                Galerie Photos
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
              Un aperçu visuel de notre univers artisanal et de la fraîcheur de nos produits.
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-12">
               <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
             </div>
          ) : galleryImages.length === 0 ? (
             <div className="text-center py-12 text-slate-400 font-medium">
               La galerie est vide pour le moment.
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={img.id || idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx % 6) * 0.1 }}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <img 
                    src={img.image_url} 
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-slate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
                    <span className="text-brand-green text-[10px] font-black uppercase tracking-widest mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {img.category}
                    </span>
                    <h3 className="text-white text-2xl font-display font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Palmtree size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-black mb-8 tracking-tight">
            Envie de goûter à l'authenticité ?
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
            Parcourez nos produits et commandez dès maintenant pour une livraison rapide à votre porte.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/produits" 
              className="px-12 py-5 bg-brand-green text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-orange transition-all shadow-xl shadow-brand-green/20"
            >
              Voir le Menu
            </Link>
            <Link 
              to="/contact" 
              className="px-12 py-5 bg-white/10 backdrop-blur-md text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
