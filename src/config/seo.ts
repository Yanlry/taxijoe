/**
 * Génère les balises <head> (SEO, Open Graph, JSON-LD) à partir de la configuration.
 * Utilisé au moment du build par vite.config.ts : rien à modifier ici,
 * tout se règle dans src/config/business.ts.
 */
import type { BusinessConfig, ServiceItem } from '../types/index.ts';
import { toInternationalPhone } from '../utils/format.ts';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Valeur à publier, ou undefined si elle est vide ou encore un « [À COMPLÉTER] » (JSON.stringify l'omet). */
const filled = (value: string): string | undefined => (value && !/^\[.*\]$/.test(value) ? value : undefined);

/** Transforme un chemin en URL absolue si l'URL du site est connue. */
const toAbsoluteUrl = (siteUrl: string, path: string): string =>
  siteUrl ? new URL(path, siteUrl).href : path;

// Le barré de « pas » n'existe pas dans un onglet : on garde le vrai message, « il va partout ».
const getPageTitle = (b: BusinessConfig): string => `Joe le taxi, il va partout — Taxi à ${b.city}`;

const getPageDescription = (b: BusinessConfig): string =>
  `${b.name}, votre taxi à ${b.city} 7 jours sur 7, jour et nuit sur réservation : ` +
  'gares et aéroports, transport médical, soirées et longues distances. ' +
  'Estimez le prix de votre course et réservez par téléphone.';

/** Données structurées schema.org de type TaxiService. */
function buildJsonLd(b: BusinessConfig, services: readonly ServiceItem[]): Record<string, unknown> {
  const url = b.siteUrl || undefined;
  const telephone = filled(toInternationalPhone(b.phone));
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: b.name,
    description: getPageDescription(b),
    url,
    areaServed: { '@type': 'City', name: b.city },
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone,
        contactType: 'reservations',
        availableLanguage: 'French',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de taxi',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.title, description: service.description },
      })),
    },
    provider: {
      '@type': 'LocalBusiness',
      name: b.name,
      url,
      telephone,
      image: toAbsoluteUrl(b.siteUrl, b.ogImage.src),
      address: {
        '@type': 'PostalAddress',
        streetAddress: filled(b.streetAddress),
        postalCode: filled(b.postalCode),
        addressLocality: b.city,
        addressCountry: 'FR',
      },
      openingHours: b.openingHoursSchema,
      ...(b.isCpamApproved ? { knowsAbout: 'Transport médical conventionné CPAM' } : {}),
    },
  };
}

/** Balises à insérer dans le <head> de index.html. */
export function buildHeadTags(b: BusinessConfig, services: readonly ServiceItem[]): string {
  const title = escapeHtml(getPageTitle(b));
  const description = escapeHtml(getPageDescription(b));
  const ogImage = escapeHtml(toAbsoluteUrl(b.siteUrl, b.ogImage.src));
  const siteUrl = escapeHtml(b.siteUrl);
  // « < » échappé pour qu'aucune valeur ne puisse fermer la balise <script>.
  const jsonLd = JSON.stringify(buildJsonLd(b, services)).replace(/</g, '\\u003c');

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    siteUrl && `<link rel="canonical" href="${siteUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:site_name" content="${escapeHtml(b.name)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    siteUrl && `<meta property="og:url" content="${siteUrl}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="${b.ogImage.width}" />`,
    `<meta property="og:image:height" content="${b.ogImage.height}" />`,
    `<meta property="og:image:alt" content="Logo ${escapeHtml(b.name)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="preload" as="image" href="${escapeHtml(b.logo.src)}" fetchpriority="high" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');
}
