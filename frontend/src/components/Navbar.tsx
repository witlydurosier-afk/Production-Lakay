import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, LayoutGrid, Info, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { BRAND_LOGO_URL } from '../constants/brand';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const logoUrl = settings?.site_logo_url || BRAND_LOGO_URL;

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home size={22} /> },
    { name: 'Produits', path: '/produits', icon: <LayoutGrid size={22} /> },
    { name: 'À Propos', path: '/a-propos', icon: <Info size={22} /> },
    { name: 'Contact', path: '/contact', icon: <Send size={22} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white/85 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-100 group-hover:ring-brand-green/25 transition-all">
                  <img
                    src={logoUrl}
                    alt="Production Lakay"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl tracking-tighter text-slate-900 leading-none">
                    PRODUCTION
                  </span>
                  <span className="font-display font-medium text-lg tracking-[0.2em] text-brand-green leading-none">
                    LAKAY
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'font-bold uppercase tracking-widest text-[10px] transition-colors hover:text-brand-orange',
                    isActive(link.path) ? 'text-brand-green' : 'text-brand-green/50'
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-brand-green/70 hover:text-brand-green transition-colors"
                title="Ouvrir le panier"
              >
                <ShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/20 animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </button>
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-brand-green/5 rounded-2xl text-brand-green border border-brand-green/10"
                title="Ouvrir le panier"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
