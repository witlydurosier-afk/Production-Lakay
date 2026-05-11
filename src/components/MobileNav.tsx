import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Info, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function MobileNav() {
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home size={22} /> },
    { name: 'Produits', path: '/produits', icon: <LayoutGrid size={22} /> },
    { name: 'À Propos', path: '/a-propos', icon: <Info size={22} /> },
    { name: 'Contact', path: '/contact', icon: <Send size={22} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-slate-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-20 px-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 relative text-brand-green",
                  active ? "opacity-100" : "opacity-40 hover:opacity-100"
                )}
              >
                {active && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-8 h-1 bg-brand-green rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  active ? "bg-brand-green/10" : ""
                )}>
                  {link.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
