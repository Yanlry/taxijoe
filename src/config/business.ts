/**
 * ============================================================================
 *  CONFIGURATION DE TAXI JOE : TOUT SE MODIFIE ICI
 * ============================================================================
 *  Remplacez chaque valeur entre crochets [ ... ] par vos propres informations.
 *  Le titre de la page, la description Google, les aperçus de liens (Open Graph)
 *  et les données structurées (JSON-LD) sont générés à partir de ce fichier.
 * ============================================================================
 */
import type { BusinessConfig, FareConfig, MeterConfig, ServiceItem } from '../types/index.ts';

/** Ville principale : reprise dans le titre, le texte d'accueil et la zone desservie. */
const CITY = 'Lys-lez-Lannoy';

export const business: BusinessConfig = {
  name: 'Taxi Joe',

  // Numéro affiché et appelé (le lien tel: passe automatiquement au format +33).
  phone: '06 46 56 38 46',


  // Laisser streetAddress vide ('') pour ne pas afficher la rue sur le site.
  streetAddress: '196 rue Jean-Baptiste Lebas',
  postalCode: '59390',
  city: CITY,
  serviceArea: `${CITY} , Roubaix , Lille et ses environs`,

  // À REMPLACER : numéro de licence / autorisation de stationnement
  licenseNumber: '[À COMPLÉTER]',

  siret: '101 684 512 00011',

  // Passez à true si vous êtes conventionné : la mention s'affiche automatiquement.
  isCpamApproved: false,

  hours: ['7 jours sur 7', 'Jour et nuit, sur réservation'],
  openingHoursSchema: 'Mo-Su 00:00-23:59',

  // À REMPLACER une fois le site en ligne, ex. 'https://taxi-joe.fr' (sans / final).
  siteUrl: '',

  legalNoticeUrl: '/mentions-legales.html',

  logo: { src: '/logo-taxi-joe-web.png', width: 960, height: 543 },
  ogImage: { src: '/logo-taxi-joe.png', width: 1448, height: 1086 },
};

/**
 * TARIFS : À REMPLACER PAR VOS TARIFS
 * ----------------------------------------------------------------------------
 * Valeurs d'EXEMPLE uniquement (euros TTC). Reportez ici les tarifs réglementés
 * en vigueur dans votre département. Le compteur du site s'en sert pour estimer :
 *   prix = prise en charge + distance (km) x prix au km
 */
export const fares: FareConfig = {
  priseEnCharge: 2.6, // À REMPLACER PAR VOS TARIFS
  prixKmJour: 1.25, // À REMPLACER PAR VOS TARIFS
  prixKmNuit: 1.85, // À REMPLACER PAR VOS TARIFS (nuit, dimanche et jours fériés)
};

/** Bornes et valeur de départ du curseur de distance. */
export const meterSettings: MeterConfig = {
  minKm: 1,
  maxKm: 150,
  defaultKm: 12,
};

/** Cartes de la section « Où Joe vous emmène » (affichées dans cet ordre). */
export const services: readonly ServiceItem[] = [
  {
    id: 'gares-aeroports',
    icon: 'plane',
    title: 'Gares et aéroports',
    description:
      'Train à l’aube ou vol en soirée : réservez votre trajet à l’avance, Joe vous attend à l’heure convenue.',
  },
  {
    id: 'transport-medical',
    icon: 'stethoscope',
    title: 'Transport médical',
    description:
      'Consultation, examen, hospitalisation : un trajet calme et attentionné, de votre porte à celle de l’établissement.',
    showCpamBadge: true,
  },
  {
    id: 'soirees-nuits',
    icon: 'moon',
    title: 'Soirées et nuits',
    description:
      'Dîner, concert, mariage ou retour tardif : rentrez sereinement, sans penser au stationnement ni au dernier train.',
  },
  {
    id: 'longues-distances',
    icon: 'route',
    title: 'Longues distances',
    description:
      'Une autre ville, un aéroport éloigné, un rendez-vous important : demandez une estimation et partez l’esprit tranquille.',
  },
];
