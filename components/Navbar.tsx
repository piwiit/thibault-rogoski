"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white shadow-lg py-3'
        : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">TR</span>
            <span className="hidden text-xl font-semibold text-gray-900 sm:block">
              Thibault Rogoski
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="items-center hidden space-x-8 md:flex">
            <li>
              <Link
                href="/"
                className="font-medium text-gray-700 transition-colors hover:text-green-600"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/projets"
                className="font-medium text-gray-700 transition-colors hover:text-green-600"
              >
                Projets
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="p-2 text-gray-700 md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
