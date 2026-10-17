import { useMemo } from 'react';
import { fares } from '../config/business';
import type { FareConfig, FareEstimate } from '../types';

/**
 * Calcule une estimation : prise en charge + distance x prix au km.
 * Le total est arrondi au centime.
 *
 * @param km - Distance du trajet en kilomètres.
 * @param isNight - true pour le tarif nuit, dimanche et jours fériés.
 * @param config - Tarifs à appliquer (par défaut ceux de src/config/business.ts).
 */
export function computeFare(km: number, isNight: boolean, config: FareConfig = fares): FareEstimate {
  const perKm = isNight ? config.prixKmNuit : config.prixKmJour;
  const total = Math.round((config.priseEnCharge + km * perKm) * 100) / 100;
  return { km, isNight, base: config.priseEnCharge, perKm, total };
}

/**
 * Estimation du prix d'une course, recalculée uniquement quand la distance ou le tarif change.
 *
 * @param km - Distance du trajet en kilomètres.
 * @param isNight - true pour le tarif nuit, dimanche et jours fériés.
 * @returns Le détail de l'estimation (prise en charge, prix au km, total).
 */
export function useFareEstimate(km: number, isNight: boolean): FareEstimate {
  return useMemo(() => computeFare(km, isNight), [km, isNight]);
}
