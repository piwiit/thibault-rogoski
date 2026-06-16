'use client';

import { useEffect, useState } from 'react';
import { defaultLandingContent, type LandingContent } from '@/lib/landing';

export function useLandingContent(initialContent?: LandingContent) {
  const [content, setContent] = useState<LandingContent>(initialContent ?? defaultLandingContent);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      return;
    }

    async function fetchContent() {
      try {
        const res = await fetch('/api/settings/landing');
        if (res.ok) {
          setContent(await res.json());
        }
      } catch {
        // keep defaults
      }
    }

    fetchContent();
  }, [initialContent]);

  return content;
}
