import { useCallback, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Moon, Sun } from 'lucide-react';
import { meterSettings } from '../../config/business';
import { useFareEstimate } from '../../hooks/useFareEstimate';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import styles from './Meter.module.css';
import { Taximeter } from './Taximeter';

const { minKm, maxKm, defaultKm } = meterSettings;

/**
 * Section « Le compteur de Joe » : curseur de distance, choix du tarif jour ou nuit,
 * et taximètre qui affiche l'estimation en direct (calcul dans useFareEstimate).
 */
export function Meter() {
  const [km, setKm] = useState(defaultKm);
  const [isNight, setIsNight] = useState(false);
  const estimate = useFareEstimate(km, isNight);

  const handleDistanceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKm(Number(event.target.value));
  }, []);
  const selectDay = useCallback(() => setIsNight(false), []);
  const selectNight = useCallback(() => setIsNight(true), []);

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
                Distance du trajet
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

          <fieldset className={styles.fieldset}>
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
          </fieldset>
        </div>

        <div className={styles.meterColumn}>
          <Taximeter estimate={estimate} />
          <p className={styles.disclaimer}>
            Estimation indicative. Le prix final est celui affiché au compteur, selon le tarif réglementé en
            vigueur.
          </p>
        </div>
      </div>
    </section>
  );
}
