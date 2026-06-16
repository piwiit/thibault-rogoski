import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Test Facebook',
  description: 'Page de test.',
  path: '/test-facebook',
  noIndex: true,
});

export default function TestFacebookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
