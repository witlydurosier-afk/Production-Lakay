import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, Clock } from 'lucide-react';
import { BRAND_LOGO_URL } from '../constants/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const instagramUrl = 'https://www.instagram.com/__produc.tion_lakay__?igsh=MXhmNnpnd25rYjgxeA==';
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <footer className="bg-brand-green text-white/70 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group mb-8">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg ring-1 ring-white/20 group-hover:ring-brand-yellow/50 transition-all">
                <img
                  src={settings?.site_logo_url || BRAND_LOGO_URL}
                  alt="Production Lakay"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tighter text-white leading-none">
                  PRODUCTION
                </span>
                <span className="font-display font-medium text-lg tracking-[0.2em] text-brand-yellow leading-none">
                  LAKAY
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 font-medium text-white/80">
              Production Lakay vous propose le meilleur des produits artisanaux et naturels d'Haïti.
              Qualité, fraîcheur et authenticité.
            </p>
            <div className="flex space-x-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-brand-green transition-all"
                title="Suivez-nous sur Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1 hidden md:block">
            <h3 className="text-white font-display font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-brand-yellow transition-colors">Accueil</Link></li>
              <li><Link to="/produits" className="hover:text-brand-yellow transition-colors">Produits</Link></li>
              <li><Link to="/a-propos" className="hover:text-brand-yellow transition-colors">À Propos</Link></li>
              <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1 hidden md:block">
            <h3 className="text-white font-display font-black text-xs uppercase tracking-[0.2em] mb-8">Nos Produits</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/produits" className="hover:text-brand-yellow transition-colors">Cornet</Link></li>
              <li><Link to="/produits" className="hover:text-brand-yellow transition-colors">Saucisse enroulée</Link></li>
              <li><Link to="/produits" className="hover:text-brand-yellow transition-colors">Fresco</Link></li>
              <li><Link to="/produits" className="hover:text-brand-yellow transition-colors">Jus naturels</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-display font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-yellow" />
                <span>{settings?.site_phone || '+509 41 10 34 00'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-brand-yellow" />
                <span>{settings?.site_address || 'Port-au-Prince, Haïti'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock size={18} className="text-brand-yellow" />
                <span>Lun-Sam: 8h - 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p><span onClick={() => window.open('https://production-lakay-backend.onrender.com/admin?shop=' + encodeURIComponent(window.location.origin), '_blank')} className="hover:text-white transition-colors cursor-pointer font-medium text-xs text-white/40" title="Informations de licence">Licence</span> © {currentYear} Production Lakay. Tous droits réservés.</p>
          </div>
          <p className="mt-4 md:mt-0 italic opacity-60">Fait avec passion pour Haïti</p>
        </div>
      </div>
    </footer>
  );
}
