import { useMemo } from 'react';
import { fares, meterSettings } from '../config/business';
import type { FareConfig, FareEstimate, TariffCode } from '../types';

const toCents = (euros: number): number => Math.round(euros * 100);

/** Tarif A à D selon le moment de la course et le retour (avec le client ou à vide). */
export const getTariffCode = (isNight: boolean, isRoundTrip: boolean): TariffCode =>
  isRoundTrip ? (isNight ? 'B' : 'A') : isNight ? 'D' : 'C';

/**
 * Calcule une estimation comme un taximètre : la prise en charge, puis une chute (0,10 €)
 * à chaque fois que la distance parcourue atteint la valeur d'une chute, sans montant partiel.
 * Le compteur tourne aussi pendant l'approche (avant la prise en charge du client), au même tarif.
 * La course minimum s'applique si le compteur affiche moins. Calcul en centimes (pas d'erreur d'arrondi).
 *
 * @param km - Distance parcourue avec le client, en kilomètres.
 * @param isNight - true pour la nuit (19h-7h), les dimanches et jours fériés.
 * @param isRoundTrip - true pour un aller-retour avec le client (tarifs A/B), false pour un aller simple (C/D).
 * @param approachKm - Distance d'approche comptée avant l'adresse du client, en kilomètres.
 * @param config - Tarifs à appliquer (par défaut ceux de src/config/business.ts).
 */
export function computeFare(
  km: number,
  isNight: boolean,
  isRoundTrip: boolean,
  approachKm = 0,
  config: FareConfig = fares,
): FareEstimate {
  const tariff = getTariffCode(isNight, isRoundTrip);
  const perKm = config.prixKm[tariff];
  const chuteCents = toCents(config.chute);
  const chutes = Math.floor(Math.round((km + approachKm) * toCents(perKm)) / chuteCents);
  const meterCents = toCents(config.priseEnCharge) + chutes * chuteCents;
  const minimumCents = toCents(config.courseMinimum);
  const isMinimum = meterCents < minimumCents;

  return {
    km,
    approachKm,
    isNight,
    isRoundTrip,
    tariff,
    base: config.priseEnCharge,
    perKm,
    total: (isMinimum ? minimumCents : meterCents) / 100,
    minimum: config.courseMinimum,
    isMinimum,
  };
}

/**
 * Estimation du prix d'une course réservée par téléphone (approche de meterSettings comprise),
 * recalculée uniquement quand la distance ou le tarif change.
 *
 * @param km - Distance parcourue avec le client, en kilomètres.
 * @param isNight - true pour la nuit (19h-7h), les dimanches et jours fériés.
 * @param isRoundTrip - true pour un aller-retour avec le client.
 * @returns Le détail de l'estimation (tarif, prise en charge, prix au km, approche, total).
 */
export function useFareEstimate(km: number, isNight: boolean, isRoundTrip: boolean): FareEstimate {
  return useMemo(
    () => computeFare(km, isNight, isRoundTrip, meterSettings.approachKm),
    [km, isNight, isRoundTrip],
  );
}
