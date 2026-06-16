'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
}

export default function ProjectCard({
  id,
  title,
  category,
  description,
  imageUrl,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !imageError;

  return (
    <Link
      href={`/projets/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-gradient-to-br from-green-100 to-emerald-100">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🏗️</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-6">
        <span className="mb-3 inline-block self-start rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
          {category}
        </span>
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900">{title}</h3>
        <p className="line-clamp-4 flex-1 break-words text-sm leading-relaxed text-gray-600 whitespace-pre-line">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:text-green-700">
          Voir le projet
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
