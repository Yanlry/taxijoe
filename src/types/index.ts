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

/**
 * Tarifs kilométriques réglementés :
 * A = jour, aller-retour avec le client ; B = nuit, dimanche ou férié, aller-retour avec le client ;
 * C = jour, aller simple (retour à vide) ; D = nuit, dimanche ou férié, aller simple (retour à vide).
 */
export type TariffCode = 'A' | 'B' | 'C' | 'D';

/** Tarifs maxima du taxi fixés par arrêté préfectoral, en euros TTC. */
export interface FareConfig {
  /** Référence de l'arrêté, affichée sous le compteur. */
  source: string;
  priseEnCharge: number;
  /** Valeur d'une chute : le compteur avance par pas de ce montant. */
  chute: number;
  /** Prix au kilomètre de chaque tarif. */
  prixKm: Record<TariffCode, number>;
  /** Prix minimum d'une course, suppléments inclus. */
  courseMinimum: number;
  /** Attente ou marche lente, prix de l'heure (jour 7h-19h / nuit 19h-7h). */
  attenteHeureJour: number;
  attenteHeureNuit: number;
  /** Par bagage hors coffre ou au-delà de trois valises. */
  supplementBagage: number;
  /** Par passager à partir du 5e. */
  supplementPassager: number;
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
  isRoundTrip: boolean;
  tariff: TariffCode;
  base: number;
  perKm: number;
  total: number;
  /** Course minimum réglementaire. */
  minimum: number;
  /** true si le montant au compteur était inférieur à la course minimum, appliquée à la place. */
  isMinimum: boolean;
}
