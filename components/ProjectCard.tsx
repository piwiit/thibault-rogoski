"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  index?: number;
}

export default function ProjectCard({ title, category, description, imageUrl, index = 0 }: ProjectCardProps) {
  const categoryColors: Record<string, string> = {
    'Terrassement': 'bg-blue-100 text-blue-800',
    'VRD': 'bg-orange-100 text-orange-800',
    'Entretien paysager': 'bg-green-100 text-green-800',
  };

  const categoryColor = categoryColors[category] || 'bg-gray-100 text-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-2xl"
    >
      {imageUrl ? (
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100">
          <span className="text-6xl">🏗️</span>
        </div>
      )}
      <div className="p-6">
        <span className={`inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full ${categoryColor}`}>
          {category}
        </span>
        <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
        <p className="leading-relaxed text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}
