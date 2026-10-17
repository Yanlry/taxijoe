/**
 * Types partagés du site Taxi Joe.
 * Ce fichier ne dépend ni de React ni du DOM : il est aussi lu par vite.config.ts.
 */

/** Image servie depuis le dossier public/, avec ses dimensions réelles (évite les sauts de mise en page). */
export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

/** Informations de l'entreprise, modifiables dans src/config/business.ts. */
export interface BusinessConfig {
  name: string;
  /** Numéro tel qu'affiché sur le site (le lien tel: est calculé automatiquement). */
  phone: string;

  /** Adresse postale (pied de page, mentions légales, données structurées). Vide = non affichée. */
  streetAddress: string;
  postalCode: string;
  city: string;
  /** Zone desservie, affichée dans le pied de page. */
  serviceArea: string;
  licenseNumber: string;
  siret: string;
  /** Si true : mention « Taxi conventionné CPAM » (carte Transport médical + pied de page). */
  isCpamApproved: boolean;
  /** Lignes affichées dans la colonne « Horaires » du pied de page. */
  hours: readonly string[];
  /** Horaires au format schema.org pour les données structurées (ex. « Mo-Su 00:00-23:59 »). */
  openingHoursSchema: string;
  /** URL publique du site (ex. « https://taxi-joe.fr »). Vide = liens relatifs. */
  siteUrl: string;
  legalNoticeUrl: string;
  /** Logo affiché sur le site (version recadrée et allégée). */
  logo: ImageAsset;
  /** Image utilisée pour les aperçus de liens (Open Graph). */
  ogImage: ImageAsset;
}

/** Tarifs du taxi, en euros TTC. */
export interface FareConfig {
  priseEnCharge: number;
  prixKmJour: number;
  prixKmNuit: number;
}

/** Réglages du curseur de distance du compteur. */
export interface MeterConfig {
  minKm: number;
  maxKm: number;
  defaultKm: number;
}

/** Icônes disponibles pour les cartes de service (associées à Lucide dans ServiceCard). */
export type ServiceIconName = 'plane' | 'stethoscope' | 'moon' | 'route';

export interface ServiceItem {
  id: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  /** Affiche « Taxi conventionné CPAM » sur cette carte si business.isCpamApproved est vrai. */
  showCpamBadge?: boolean;
}

/** Détail d'une estimation de course. */
export interface FareEstimate {
  km: number;
  isNight: boolean;
  base: number;
  perKm: number;
  total: number;
}
