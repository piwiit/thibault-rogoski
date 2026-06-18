"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { LandingContent } from "@/lib/landing";
import { useLandingContent } from "@/hooks/useLandingContent";

interface NavbarProps {
  landingContent?: LandingContent;
}

export default function Navbar({ landingContent }: NavbarProps) {
  const content = useLandingContent(landingContent);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "bg-white shadow-lg py-3"
            : "bg-white/95 backdrop-blur-sm py-4"
          }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{content.site.brandInitials}</span>
              <span className="hidden text-xl font-semibold text-gray-900 sm:block">
                {content.site.brandName}
              </span>
            </Link>

            <ul className="items-center hidden space-x-8 md:flex">
              <li>
                <Link
                  href="/"
                  className={`font-medium transition-colors ${isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/projets"
                  className={`font-medium transition-colors ${isActive('/projets') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Projets
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className={`font-medium transition-colors ${pathname.startsWith('/admin') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`px-4 py-2 font-semibold text-white transition-colors rounded-lg shadow-md ${isActive('/contact') ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <button
              className="p-2 text-gray-700 md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Menu"
            >
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-[72px] bg-white shadow-lg px-6 py-4 fixed w-full z-40"
          >
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`block font-medium transition-colors ${isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/projets"
                  onClick={() => setIsOpen(false)}
                  className={`block font-medium transition-colors ${isActive('/projets') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Projets
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block font-medium transition-colors ${pathname.startsWith('/admin') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`block font-medium transition-colors ${isActive('/contact') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
