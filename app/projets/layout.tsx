import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Nos réalisations',
  description:
    'Découvrez nos projets de terrassement, VRD et entretien paysager. Photos avant/après et réalisations professionnelles par Thibault Rogoski.',
  path: '/projets',
  keywords: [
    'réalisations terrassement',
    'projets VRD',
    'portfolio paysagiste',
    'travaux extérieurs',
    'Thibault Rogoski',
  ],
});

export default function ProjetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
