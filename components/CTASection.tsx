"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { LandingContent } from '@/lib/landing';

interface CTASectionProps {
    content: LandingContent;
}

export default function CTASection({ content }: CTASectionProps) {
    const { cta } = content;

    return (
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="mb-4 text-4xl font-bold text-white">
                        {cta.title}
                    </h2>
                    <p className="mb-8 text-xl text-green-50">
                        {cta.subtitle}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/contact"
                            className="px-8 py-4 text-lg font-semibold text-green-600 transition-all duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-50 hover:scale-105"
                        >
                            {cta.buttonPrimary}
                        </Link>
                        <Link
                            href="/projets"
                            className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white/10"
                        >
                            {cta.buttonSecondary}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
