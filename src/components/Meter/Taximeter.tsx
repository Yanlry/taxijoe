import { memo } from 'react';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import type { FareEstimate } from '../../types';
import { cx } from '../../utils/cx';
import { formatEuros, formatMeterDigits } from '../../utils/format';
import styles from './Taximeter.module.css';

interface TaximeterProps {
  estimate: FareEstimate;
}

/**
 * Taximètre : boîtier noir, afficheur ambré façon compteur et détail du calcul.
 * Le badge indique le tarif réglementé appliqué (A à D) ; la case « Minimum » s'allume
 * quand la course minimum remplace le montant au compteur.
 * Le montant défile de l'ancienne valeur vers la nouvelle ; les lecteurs d'écran
 * n'entendent que le montant final, via une zone live discrète.
 */
export const Taximeter = memo(function Taximeter({ estimate }: TaximeterProps) {
  const displayed = useAnimatedNumber(estimate.total);
  const tariffLabel = `Tarif ${estimate.tariff} · ${estimate.isNight ? 'nuit' : 'jour'}`;
  const tripLabel = estimate.isRoundTrip ? 'aller-retour' : 'aller simple';

  return (
    <div className={styles.meter}>
      <div className={styles.head}>
        <span className={styles.brand}>Taxi Joe · Estimation</span>
        <span className={cx(styles.badge, estimate.isNight && styles.badgeNight)}>{tariffLabel}</span>
      </div>

      <div className={styles.screen}>
        <p aria-hidden="true" className={styles.readout}>
          <span className={styles.ghost}>888,88</span>
          <span className={styles.digits}>{formatMeterDigits(displayed)}</span>
        </p>
        <span aria-hidden="true" className={styles.currency}>
          €
        </span>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {`Estimation : ${formatEuros(estimate.total)}${estimate.isMinimum ? ' (course minimum)' : ''}, tarif ${estimate.tariff}, ${estimate.isNight ? 'nuit' : 'jour'}, ${tripLabel}`}
        </p>
      </div>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>Prise en charge</dt>
          <dd>{formatEuros(estimate.base)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>Prix au km</dt>
          <dd>{formatEuros(estimate.perKm)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>Distance</dt>
          <dd>{estimate.km}&nbsp;km</dd>
        </div>
        <div className={cx(styles.detail, estimate.isMinimum && styles.detailActive)}>
          <dt>Minimum</dt>
          <dd>{formatEuros(estimate.minimum)}</dd>
        </div>
      </dl>
    </div>
  );
});
