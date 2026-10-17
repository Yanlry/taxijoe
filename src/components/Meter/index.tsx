import { useCallback, useState, type ChangeEvent, type CSSProperties } from 'react';
import { ArrowLeftRight, ArrowRight, Moon, Sun } from 'lucide-react';
import { fares, meterSettings } from '../../config/business';
import { useFareEstimate } from '../../hooks/useFareEstimate';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { formatEuros } from '../../utils/format';
import styles from './Meter.module.css';
import { Taximeter } from './Taximeter';

const { minKm, maxKm, defaultKm } = meterSettings;

/**
 * Section « Le compteur de Joe » : curseur de distance, choix du moment (jour ou nuit)
 * et du trajet (aller simple ou aller-retour), qui déterminent le tarif réglementé A, B, C ou D,
 * et taximètre qui affiche l'estimation en direct (calcul dans useFareEstimate).
 */
export function Meter() {
  const [km, setKm] = useState(defaultKm);
  const [isNight, setIsNight] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const estimate = useFareEstimate(km, isNight, isRoundTrip);

  const handleDistanceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKm(Number(event.target.value));
  }, []);
  const selectDay = useCallback(() => setIsNight(false), []);
  const selectNight = useCallback(() => setIsNight(true), []);
  const selectOneWay = useCallback(() => setIsRoundTrip(false), []);
  const selectRoundTrip = useCallback(() => setIsRoundTrip(true), []);

  const rangeStyle = { '--progress': `${((km - minKm) / (maxKm - minKm)) * 100}%` } as CSSProperties;

  return (
    <section id="compteur" aria-labelledby="compteur-title" className={styles.section}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.controls}>
          <div>
            <p className={ui.eyebrow}>Le compteur</p>
            <h2 id="compteur-title" className={ui.sectionTitle}>
              <span>
                <span className={ui.accent}></span> Combien ça coûte&nbsp;?
              </span>
              <span>
              <span className={ui.accent}> Faites</span> tourner le <span className={ui.accent}>compteur.</span>
              </span>
            </h2>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldHead}>
              <label htmlFor="distance" className={styles.label}>
                {isRoundTrip ? 'Distance totale (aller + retour)' : 'Distance du trajet'}
              </label>
              <span aria-hidden="true" className={styles.kmValue}>
                {km}&nbsp;km
              </span>
            </div>
            <input
              id="distance"
              type="range"
              min={minKm}
              max={maxKm}
              step={1}
              value={km}
              onChange={handleDistanceChange}
              aria-valuetext={`${km} kilomètre${km > 1 ? 's' : ''}`}
              className={styles.range}
              style={rangeStyle}
            />
            <div aria-hidden="true" className={styles.scale}>
              <span>{minKm}&nbsp;km</span>
              <span>{maxKm}&nbsp;km</span>
            </div>
          </div>

          <fieldset aria-describedby="tarif-hint" className={styles.fieldset}>
            <legend className={cx(styles.label, styles.legend)}>Tarif</legend>
            <div className={styles.toggle}>
              <button type="button" aria-pressed={!isNight} onClick={selectDay} className={styles.toggleButton}>
                <Sun aria-hidden="true" size={18} strokeWidth={2} />
                Jour
              </button>
              <button type="button" aria-pressed={isNight} onClick={selectNight} className={styles.toggleButton}>
                <Moon aria-hidden="true" size={18} strokeWidth={2} />
                Nuit, dimanche et fériés
              </button>
            </div>
            <p id="tarif-hint" className={styles.hint}>
              Jour&nbsp;: 7h-19h, du lundi au samedi. Nuit&nbsp;: 19h-7h, ainsi que les dimanches et jours fériés.
            </p>
          </fieldset>

          <fieldset aria-describedby="trajet-hint" className={styles.fieldset}>
            <legend className={cx(styles.label, styles.legend)}>Trajet</legend>
            <div className={styles.toggle}>
              <button type="button" aria-pressed={!isRoundTrip} onClick={selectOneWay} className={styles.toggleButton}>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                Aller simple
              </button>
              <button type="button" aria-pressed={isRoundTrip} onClick={selectRoundTrip} className={styles.toggleButton}>
                <ArrowLeftRight aria-hidden="true" size={18} strokeWidth={2} />
                Aller-retour avec Joe
              </button>
            </div>
            <p id="trajet-hint" className={styles.hint}>
              Aller simple&nbsp;: Joe repart à vide après la course. Aller-retour&nbsp;: Joe vous ramène.
            </p>
          </fieldset>
        </div>

        <div className={styles.meterColumn}>
          <Taximeter estimate={estimate} />
          <p className={styles.disclaimer}>
            Estimation au tarif maximum réglementé ({fares.source}). Hors attente ou marche lente (
            {formatEuros(fares.attenteHeureJour)}/h le jour, {formatEuros(fares.attenteHeureNuit)}/h la nuit) et
            suppléments&nbsp;: {formatEuros(fares.supplementBagage)} par bagage hors coffre ou au-delà de trois valises,{' '}
            {formatEuros(fares.supplementPassager)} par passager à partir du 5<sup>e</sup>. Le prix final est celui
            affiché au compteur.
          </p>
        </div>
      </div>
    </section>
  );
}
