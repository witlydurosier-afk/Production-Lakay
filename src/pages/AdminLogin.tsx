import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogIn, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if is admin
      const adminRef = doc(db, 'admins', user.uid);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        navigate('/admin/dashboard');
      } else {
        // Not an admin
        // For development/first-time setup: 
        // If the email matches the owner's email, we can seed it
        if (user.email === 'witlydurosier@gmail.com') {
           await setDoc(adminRef, {
             email: user.email,
             role: 'admin',
             createdAt: new Date().toISOString()
           });
           navigate('/admin/dashboard');
        } else {
          setError("Accès refusé. Vous n'avez pas les droits d'administrateur.");
          await auth.signOut();
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  if (user && isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
          <CheckCircle2 size={64} className="text-brand-green mx-auto mb-6" />
          <h1 className="font-display font-bold text-2xl mb-4">Déjà Connecté</h1>
          <p className="text-slate-500 mb-8">Vous êtes déjà connecté en tant qu'administrateur.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-light-green transition-all"
          >
            Aller au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-green text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
            <LogIn size={32} />
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Espace Admin</h1>
          <p className="text-slate-500">Connectez-vous pour gérer votre boutique Production Lakay.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3 text-sm"
          >
            <ShieldAlert size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:border-brand-green hover:text-brand-green transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              <span>Continuer avec Google</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-center text-xs text-slate-400 leading-relaxed uppercase tracking-widest">
            Accès sécurisé réservé au propriétaire du business.
            L'accès nécessite un compte administrateur vérifié.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
