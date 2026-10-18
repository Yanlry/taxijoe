import { memo, type CSSProperties, type ReactNode } from 'react';
import type { FareEstimate, TariffCode } from '../../types';
import { cx } from '../../utils/cx';
import { formatEuros, formatKm, formatMeterDigits } from '../../utils/format';
import styles from './Taximeter.module.css';

const TARIFFS: readonly TariffCode[] = ['A', 'B', 'C', 'D'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Montant façon compteur mécanique : chaque chiffre est une bande verticale qui roule jusqu'à sa valeur. */
function RollingDigits({ value }: { value: string }) {
  return (
    <span className={styles.digits}>
      {[...value].map((char, position) =>
        /\d/.test(char) ? (
          <span key={position} className={styles.digitCell}>
            <span className={styles.digitStrip} style={{ '--n': Number(char) } as CSSProperties}>
              {DIGITS.map((digit) => (
                <span key={digit}>{digit}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={position}>{char}</span>
        ),
      )}
    </span>
  );
}

interface TaximeterProps {
  estimate: FareEstimate;
  /** Réglages affichés tout en haut du boîtier (le curseur de distance sur téléphone). */
  controls?: ReactNode;
}

/**
 * Taximètre : boîtier noir à vis, afficheur ambré (voyants des tarifs A à D, chiffres qui roulent)
 * et note de course qui sort de la fente d'impression avec le détail du calcul.
 * Les lecteurs d'écran n'entendent que le montant final, via une zone live discrète, puis lisent la note.
 */
export const Taximeter = memo(function Taximeter({ estimate, controls }: TaximeterProps) {
  const period = estimate.isNight ? 'nuit' : 'jour';
  const tripLabel = estimate.isRoundTrip ? 'aller-retour' : 'aller simple';

  return (
    <div className={styles.taximeter}>
      <div className={styles.meter}>
        {controls && <div className={styles.controls}>{controls}</div>}

        <div className={styles.head}>
          <span className={styles.brand}>Taxi Joe · Estimation</span>
          <span className={cx(styles.badge, estimate.isNight && styles.badgeNight)}>
            Tarif {estimate.tariff} · {period}
          </span>
        </div>

        <div className={styles.screen}>
          <span aria-hidden="true" className={styles.leds}>
            <span className={styles.ledsLabel}>Tarif</span>
            {TARIFFS.map((code) => (
              <span key={code} className={cx(styles.led, code === estimate.tariff && styles.ledOn)}>
                {code}
              </span>
            ))}
          </span>
          <p aria-hidden="true" className={styles.readout}>
            <span className={styles.ghost}>888,88</span>
            <RollingDigits value={formatMeterDigits(estimate.total)} />
          </p>
          <span aria-hidden="true" className={styles.currency}>
            €
          </span>
          <p className="visually-hidden" aria-live="polite" aria-atomic="true">
            {`Estimation : ${formatEuros(estimate.total)}${estimate.isMinimum ? ' (course minimum)' : ''}, tarif ${estimate.tariff}, ${period}, ${tripLabel}${estimate.approachKm > 0 ? `, approche de ${formatKm(estimate.approachKm)} km comprise` : ''}`}
          </p>
        </div>

        <span aria-hidden="true" className={styles.slot} />
      </div>

      {/* Note de course imprimée : détail du calcul, ligne par ligne. */}
      <div className={styles.receiptShadow}>
        <div className={styles.receipt}>
          <p className={styles.receiptTitle}>
            Note de course
            <span>Estimation</span>
          </p>
          <dl className={styles.lines}>
            <div className={styles.line}>
              <dt>Prise en charge</dt>
              <dd>{formatEuros(estimate.base)}</dd>
            </div>
            <div className={styles.line}>
              <dt>
                Tarif {estimate.tariff} · {period}
              </dt>
              <dd>{formatEuros(estimate.perKm)}/km</dd>
            </div>
            <div className={styles.line}>
              <dt>Distance</dt>
              <dd>{estimate.km}&nbsp;km</dd>
            </div>
            {estimate.approachKm > 0 && (
              <div className={styles.line}>
                <dt>Approche</dt>
                <dd>{formatKm(estimate.approachKm)}&nbsp;km</dd>
              </div>
            )}
            <div className={cx(styles.line, estimate.isMinimum && styles.lineActive)}>
              <dt>Course minimum</dt>
              <dd>{formatEuros(estimate.minimum)}</dd>
            </div>
            <div className={cx(styles.line, styles.total)}>
              <dt>Total estimé</dt>
              <dd key={estimate.total} className={styles.totalValue}>
                {formatEuros(estimate.total)}
              </dd>
            </div>
          </dl>
          <p className={styles.receiptFooter}>Merci et bonne route&nbsp;!</p>
        </div>
      </div>
    </div>
  );
});
