import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServicesSection';
import CTASection from '../components/CTASection';
import JsonLd from '../components/JsonLd';
import { getLandingContent } from '@/lib/landing';
import {
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
  SITE_NAME,
} from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent();

  return buildPageMetadata({
    title: `${SITE_NAME} - ${content.hero.titleLine1} & ${content.hero.titleLine2}`,
    description: content.hero.subtitle,
    path: '/',
  });
}

export default async function Home() {
  const content = await getLandingContent();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <JsonLd data={[buildWebSiteJsonLd(), buildLocalBusinessJsonLd(content)]} />
      <Navbar landingContent={content} />
      <main className="flex-1 pt-16">
        <Hero content={content} />
        <ServicesSection content={content} />
        <CTASection content={content} />
      </main>
      <Footer landingContent={content} />
    </div>
  );
}
