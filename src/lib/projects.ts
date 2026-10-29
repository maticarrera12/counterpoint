export interface Project {
  name: string;
  category: string;
  format: string;
  year: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  href?: string;
}

// Order matters: it drives the numbering in both the featured grid and the full list.
export const projects: Project[] = [
  { name: 'Portfolio Matías Carrera', category: 'Sitio personal', format: 'Landing page', year: '2026', src: '/img/portfolio.webp', alt: 'Portfolio de Matías Carrera', width: 1200, height: 630, href: 'https://mcarreradev.com' },
  { name: 'Estudio jurídico Lasalle', category: 'Primer sitio institucional', format: 'Institucional', year: '2026', src: '/img/lasalle.webp', alt: 'Sitio del Estudio jurídico Lasalle', width: 1600, height: 1004, href: 'https://estudiolasalle.com/' },
  { name: 'Migala', category: 'CRM para salones de eventos', format: 'Aplicación', year: '2026', src: '/img/migala.webp', alt: 'CRM Migala', width: 1800, height: 1129 },
  { name: 'OneProdex', category: 'Plataforma interactiva — Mundial 2026', format: 'Aplicación', year: '2026', src: '/img/oneprodex.webp', alt: 'Plataforma OneProdex', width: 1800, height: 959, href: 'https://oneprodex.vercel.app' },
  { name: 'KiritaAI', category: 'Producto con IA — análisis de reseñas', format: 'Aplicación', year: '2025', src: '/img/kiritaai.webp', alt: 'Producto KiritaAI', width: 1800, height: 1130, href: 'https://kiritaai.com/' },
  { name: 'Fuera©', category: 'Sitio conceptual — streetwear', format: 'Concepto', year: '2026', src: '/img/fuera.webp', alt: 'Sitio conceptual Fuera', width: 1800, height: 1129, href: 'https://fuera-streetwear.vercel.app/' },
  { name: 'MIMI & CO.', category: 'Sitio conceptual — heladería', format: 'Concepto', year: '2026', src: '/img/mimi.webp', alt: 'Sitio conceptual MIMI & CO.', width: 1800, height: 1130, href: 'https://gelato-landing-mu.vercel.app/' },
  { name: 'pausa', category: 'Sitio conceptual — muebles de autor', format: 'Concepto', year: '2026', src: '/img/pausa.webp', alt: 'Sitio conceptual pausa', width: 1800, height: 1130, href: 'https://pausa-sigma.vercel.app/' },
  { name: 'UMBRAL', category: 'Sitio conceptual — estudio de arquitectura', format: 'Concepto', year: '2026', src: '/img/umbral.webp', alt: 'Sitio conceptual UMBRAL', width: 1800, height: 1130, href: 'https://umbral-eight-theta.vercel.app/' },
];

// Staggered 12-col layout, repeated every four cards.
export const layouts = [
  'md:col-[1/8]',
  'md:col-[9/13] md:mt-[clamp(0px,14vw,220px)]',
  'md:col-[1/6] md:mt-[clamp(0px,4vw,60px)]',
  'md:col-[7/13]',
];
