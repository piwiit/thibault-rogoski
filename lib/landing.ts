import { prisma } from './prisma';
import { defaultLandingContent, type LandingContent } from './landing.types';

// Re-export types and defaults so existing server-side imports keep working.
export { defaultLandingContent, type LandingContent, type ServiceItem } from './landing.types';

export const LANDING_SETTING_KEY = 'landing_content';

function mergeLandingContent(partial: Partial<LandingContent>): LandingContent {
  return {
    site: { ...defaultLandingContent.site, ...partial.site },
    hero: {
      ...defaultLandingContent.hero,
      ...partial.hero,
      highlights: partial.hero?.highlights ?? defaultLandingContent.hero.highlights,
    },
    services: {
      ...defaultLandingContent.services,
      ...partial.services,
      items: partial.services?.items ?? defaultLandingContent.services.items,
    },
    cta: { ...defaultLandingContent.cta, ...partial.cta },
    footer: { ...defaultLandingContent.footer, ...partial.footer },
    social: { ...defaultLandingContent.social, ...partial.social },
  };
}

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: LANDING_SETTING_KEY },
    });

    if (!setting?.value) {
      return defaultLandingContent;
    }

    const parsed = JSON.parse(setting.value) as Partial<LandingContent>;
    return mergeLandingContent(parsed);
  } catch {
    return defaultLandingContent;
  }
}

export async function saveLandingContent(content: LandingContent): Promise<void> {
  await prisma.setting.upsert({
    where: { key: LANDING_SETTING_KEY },
    update: { value: JSON.stringify(content) },
    create: { key: LANDING_SETTING_KEY, value: JSON.stringify(content) },
  });
}
