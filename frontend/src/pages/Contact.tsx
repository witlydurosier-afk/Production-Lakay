import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, Instagram } from 'lucide-react';

export default function Contact() {
  const whatsappNumber = "50941103400";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Bonjour Production Lakay, je souhaiterais obtenir des informations sur vos produits.`;
  const instagramUrl = "https://www.instagram.com/__produc.tion_lakay__?igsh=MXhmNnpnd25rYjgxeA==";

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4"
          >
            Contactez <span className="text-brand-green">Nous</span>
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Une question ? Une commande spéciale ? Notre équipe est à votre écoute pour vous offrir le meilleur service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 sm:mb-8 flex items-center space-x-3">
                <span className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                  <MessageSquare size={20} />
                </span>
                <span>Nos Coordonnées</span>
              </h2>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-4 sm:space-x-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-green flex-shrink-0">
                    <Phone size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Téléphone Principal</p>
                    <p className="text-lg sm:text-xl font-display font-bold text-slate-800">+509 41 10 34 00</p>
                    <p className="text-lg sm:text-xl font-display font-bold text-slate-800">+509 49 45 03 19</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-green flex-shrink-0">
                    <Clock size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Heures d'Ouverture</p>
                    <p className="text-base sm:text-lg font-medium text-slate-700">Lundi - Samedi : 8h00 - 18h00</p>
                    <p className="text-xs sm:text-sm text-slate-400">Dimanche : Sur rendez-vous</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-green flex-shrink-0">
                    <MapPin size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Localisation</p>
                    <p className="text-base sm:text-lg font-medium text-slate-700">Port-au-Prince, Haïti</p>
                    <p className="text-xs sm:text-sm text-slate-400">Livraison disponible partout dans la zone métropolitaine.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-green text-white py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-brand-orange hover:shadow-brand-orange/20 active:scale-95 transition-all shadow-xl shadow-brand-green/20"
                >
                  <MessageSquare size={20} />
                  <span>WhatsApp</span>
                </a>
                <a 
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border-2 border-slate-100 text-slate-900 py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:border-brand-green hover:text-brand-green active:scale-95 transition-all"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Illustration / Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-brand-green rounded-[40px] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light-green rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
              
              <h2 className="font-display font-bold text-3xl mb-6 relative z-10">Production Lakay</h2>
              <p className="text-white/80 mb-10 leading-relaxed max-w-sm relative z-10 text-lg">
                Nous sommes fiers de promouvoir la production locale haïtienne. Votre retour est précieux pour nous aider à grandir et à mieux vous servir.
              </p>
              
              <div className="space-y-6 relative z-10">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <Sparkles className="text-brand-yellow mb-3" size={32} />
                  <p className="font-display font-bold text-xl">Qualité Premium</p>
                  <p className="text-sm text-white/70">Nous ne sélectionnons que les meilleurs ingrédients pour nos jus.</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <Leaf className="text-brand-yellow mb-3" size={32} />
                  <p className="font-display font-bold text-xl">100% Naturel</p>
                  <p className="text-sm text-white/70">Aucun produit chimique, juste la pureté de nos fruits.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

function Leaf({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C10.7 14.33 13.5 14 13.5 14"/>
    </svg>
  );
}
