import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </Router>
  );
}
