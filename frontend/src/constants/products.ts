/// <reference types="vite/client" />

import { Product } from '../types';

const productImages = import.meta.glob('../../produits/**/*.{jpeg,jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const productImage = (path: string) => {
  const imageUrl = productImages[`../../produits/${path}`];

  if (!imageUrl) {
    throw new Error(`Image produit introuvable: ${path}`);
  }

  return imageUrl;
};

const juicePrices = [
  { label: 'Cup 250', value: 250 },
  { label: 'Cup 300', value: 300 },
  { label: 'Cup 350', value: 350 }
];

export const PRODUCTS: Product[] = [
  {
    id: 'cornet-unite',
    name: 'Cornet (Unité)',
    category: 'Cornet',
    price: 100,
    unit: 'unité',
    description: 'Cornet artisanal croustillant, préparé avec soin pour une pause gourmande simple, fraîche et authentique.',
    imageUrl: productImage('cornet/cornet(unique)/WhatsApp Image 2026-05-08 at 3.01.13 PM.jpeg'),
    gallery: [
      productImage('cornet/cornet(unique)/WhatsApp Image 2026-05-08 at 3.01.13 PM.jpeg'),
      productImage('cornet/cornet(unique)/WhatsApp Image 2026-05-08 at 3.01.12 PM.jpeg'),
      productImage('cornet/cornet(unique)/WhatsApp Image 2026-05-08 at 2.52.39 PM.jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'cornet-boite',
    name: 'Cornet (Boîte)',
    category: 'Cornet',
    price: 550,
    unit: 'boîte',
    description: 'Une boîte généreuse de cornets maison, idéale pour partager en famille, au bureau ou pendant un événement.',
    imageUrl: productImage('cornet/cornet(boite)/WhatsApp Image 2026-05-08 at 2.52.17 PM.jpeg'),
    gallery: [
      productImage('cornet/cornet(boite)/WhatsApp Image 2026-05-08 at 2.52.17 PM.jpeg'),
      productImage('cornet/cornet(boite)/WhatsApp Image 2026-05-08 at 2.52.39 PM.jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'saucisse-enroulee',
    name: 'Saucisse enroulée',
    category: 'Saucisse',
    prices: [
      { label: 'Unité', value: 100 },
      { label: 'Boîte', value: 550 }
    ],
    description: 'Saucisse savoureuse enroulée dans une pâte dorée, pratique pour les petites faims comme pour les commandes de groupe.',
    imageUrl: productImage('saucisse_enroulee/WhatsApp Image 2026-05-08 at 2.33.55 PM.jpeg'),
    gallery: [
      productImage('saucisse_enroulee/WhatsApp Image 2026-05-08 at 2.33.55 PM.jpeg'),
      productImage('saucisse_enroulee/WhatsApp Image 2026-05-08 at 2.33.55 PM (1).jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'fresco-artisanal',
    name: 'Fresco Artisanal',
    category: 'Fresco',
    prices: [
      { label: 'Cup 150', value: 150 },
      { label: 'Cup 200', value: 200 }
    ],
    description: 'Fresco glacé aux sirops maison, préparé pour apporter une vraie fraîcheur locale à chaque commande.',
    imageUrl: productImage('Fresco/WhatsApp Image 2026-05-08 at 3.03.11 PM.jpeg'),
    gallery: [
      productImage('Fresco/WhatsApp Image 2026-05-08 at 3.03.11 PM.jpeg'),
      productImage('Fresco/WhatsApp Image 2026-05-08 at 3.02.30 PM.jpeg'),
      productImage('Fresco/WhatsApp Image 2026-05-08 at 3.02.30 PM (1).jpeg'),
      productImage('Fresco/WhatsApp Image 2026-05-08 at 3.02.30 PM (2).jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jus-melon',
    name: 'Jus Melon',
    category: 'Jus Naturel',
    prices: juicePrices,
    description: 'Jus naturel de melon, doux et rafraîchissant, préparé avec des fruits frais pour une saveur légère.',
    imageUrl: productImage('jus/jus_melon/WhatsApp Image 2026-05-08 at 2.20.43 PM.jpeg'),
    gallery: [
      productImage('jus/jus_melon/WhatsApp Image 2026-05-08 at 2.20.43 PM.jpeg'),
      productImage('jus/jus_melon/WhatsApp Image 2026-05-08 at 2.22.21 PM.jpeg'),
      productImage('jus/jus_melon/WhatsApp Image 2026-05-08 at 2.22.20 PM.jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jus-cerise',
    name: 'Jus Cerise',
    category: 'Jus Naturel',
    prices: juicePrices,
    description: 'Jus naturel de cerise, fruité et généreux, parfait pour accompagner vos repas ou une pause fraîcheur.',
    imageUrl: productImage('jus/jus_cerise/WhatsApp Image 2026-05-08 at 2.15.52 PM.jpeg'),
    gallery: [
      productImage('jus/jus_cerise/WhatsApp Image 2026-05-08 at 2.15.52 PM.jpeg'),
      productImage('jus/jus_cerise/WhatsApp Image 2026-05-08 at 2.16.13 PM.jpeg'),
      productImage('jus/jus_cerise/WhatsApp Image 2026-05-08 at 2.16.13 PM (1).jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jus-grenadia',
    name: 'Jus Grenadia',
    category: 'Jus Naturel',
    prices: juicePrices,
    description: 'Jus naturel Grenadia, parfumé et tropical, avec une belle intensité de fruit frais.',
    imageUrl: productImage('jus/jus_grenadia/WhatsApp Image 2026-05-08 at 2.29.49 PM.jpeg'),
    gallery: [
      productImage('jus/jus_grenadia/WhatsApp Image 2026-05-08 at 2.29.49 PM.jpeg'),
      productImage('jus/jus_grenadia/WhatsApp Image 2026-05-08 at 2.29.49 PM (1).jpeg'),
      productImage('jus/jus_grenadia/WhatsApp Image 2026-05-08 at 2.29.48 PM.jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jus-mandarine',
    name: 'Jus Mandarine',
    category: 'Jus Naturel',
    prices: juicePrices,
    description: 'Jus naturel de mandarine, vif et équilibré, pressé pour garder un goût net et très frais.',
    imageUrl: productImage('jus/jus_mandarine/WhatsApp Image 2026-05-08 at 2.30.40 PM.jpeg'),
    gallery: [
      productImage('jus/jus_mandarine/WhatsApp Image 2026-05-08 at 2.30.40 PM.jpeg'),
      productImage('jus/jus_mandarine/WhatsApp Image 2026-05-08 at 2.30.39 PM.jpeg'),
      productImage('jus/jus_mandarine/WhatsApp Image 2026-05-08 at 2.30.39 PM (1).jpeg')
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jus-citron',
    name: 'Jus Citron',
    category: 'Jus Naturel',
    prices: juicePrices,
    description: 'Jus naturel de citron, frais et tonique, idéal pour ceux qui aiment une boisson vive et désaltérante.',
    imageUrl: productImage('jus/jus_citron/WhatsApp Image 2026-05-08 at 2.26.19 PM.jpeg'),
    gallery: [
      productImage('jus/jus_citron/WhatsApp Image 2026-05-08 at 2.26.19 PM.jpeg'),
      productImage('jus/jus_citron/WhatsApp Image 2026-05-08 at 2.26.19 PM (1).jpeg'),
      productImage('jus/jus_citron/WhatsApp Image 2026-05-08 at 2.26.19 PM (2).jpeg')
    ],
    createdAt: new Date().toISOString()
  }
];
