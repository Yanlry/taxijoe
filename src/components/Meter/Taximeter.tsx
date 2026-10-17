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
 * Le montant défile de l'ancienne valeur vers la nouvelle ; les lecteurs d'écran
 * n'entendent que le montant final, via une zone live discrète.
 */
export const Taximeter = memo(function Taximeter({ estimate }: TaximeterProps) {
  const displayed = useAnimatedNumber(estimate.total);
  const tariffLabel = estimate.isNight ? 'Tarif nuit' : 'Tarif jour';

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
          {`Estimation : ${formatEuros(estimate.total)}, ${tariffLabel.toLowerCase()}`}
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
      </dl>
    </div>
  );
});
