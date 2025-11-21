"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 py-20 px-4">
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-green-800 bg-green-200 rounded-full">
            Artisan Professionnel
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl"
        >
          <span className="block">Terrassement, VRD</span>
          <span className="block text-green-600">Entretien Paysager</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8 text-lg text-gray-700 md:text-xl"
        >
          Expert en aménagement extérieur, je réalise vos projets de terrassement, VRD et entretien paysager avec professionnalisme et qualité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/contact"
            className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl hover:scale-105"
          >
            Demander un devis gratuit
          </Link>
          <Link
            href="/projets"
            className="px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:border-green-600 hover:shadow-lg"
          >
            Voir nos réalisations
          </Link>
        </motion.div>

        {/* Points forts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-3"
        >
          <div className="flex flex-col items-center p-4">
            <div className="mb-2 text-3xl">✓</div>
            <p className="font-semibold text-gray-900">Intervention rapide</p>
            <p className="text-sm text-gray-600">Sous 48h</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="mb-2 text-3xl">✓</div>
            <p className="font-semibold text-gray-900">Devis gratuit</p>
            <p className="text-sm text-gray-600">Sans engagement</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="mb-2 text-3xl">✓</div>
            <p className="font-semibold text-gray-900">Qualité garantie</p>
            <p className="text-sm text-gray-600">100% satisfait</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
