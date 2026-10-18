import { useCallback, useState, type ChangeEvent, type CSSProperties } from 'react';
import { ArrowLeftRight, ArrowRight, Moon, Sun } from 'lucide-react';
import { business, fares, meterSettings } from '../../config/business';
import { useFareEstimate } from '../../hooks/useFareEstimate';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { formatEuros, formatKm } from '../../utils/format';
import styles from './Meter.module.css';
import { Taximeter } from './Taximeter';

const { minKm, maxKm, defaultKm } = meterSettings;

/** Mise en page en deux colonnes (même seuil que .grid dans Meter.module.css). */
const TWO_COLUMNS = '(min-width: 960px)';

interface DistanceFieldProps {
  km: number;
  isRoundTrip: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** Curseur de distance du trajet, avec la valeur choisie et les bornes. */
function DistanceField({ km, isRoundTrip, onChange }: DistanceFieldProps) {
  const rangeStyle = { '--progress': `${((km - minKm) / (maxKm - minKm)) * 100}%` } as CSSProperties;

  return (
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
        onChange={onChange}
        aria-valuetext={`${km} kilomètre${km > 1 ? 's' : ''}`}
        className={styles.range}
        style={rangeStyle}
      />
      <div aria-hidden="true" className={styles.scale}>
        <span>{minKm}&nbsp;km</span>
        <span>{maxKm}&nbsp;km</span>
      </div>
    </div>
  );
}

/**
 * Section « Le compteur de Joe » : curseur de distance, choix du moment (jour ou nuit)
 * et du trajet (aller simple ou aller-retour), qui déterminent le tarif réglementé A, B, C ou D,
 * et taximètre qui affiche l'estimation en direct (calcul dans useFareEstimate).
 * Sur une colonne (téléphone, tablette), le curseur passe en haut du taximètre :
 * le montant reste visible pendant qu'on fait glisser la distance.
 */
export function Meter() {
  const [km, setKm] = useState(defaultKm);
  const [isNight, setIsNight] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const estimate = useFareEstimate(km, isNight, isRoundTrip);
  const isTwoColumns = useMediaQuery(TWO_COLUMNS);

  const handleDistanceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKm(Number(event.target.value));
  }, []);
  const selectDay = useCallback(() => setIsNight(false), []);
  const selectNight = useCallback(() => setIsNight(true), []);
  const selectOneWay = useCallback(() => setIsRoundTrip(false), []);
  const selectRoundTrip = useCallback(() => setIsRoundTrip(true), []);

  // Un seul curseur dans la page : dans la colonne de gauche, ou en haut du taximètre.
  const distanceField = <DistanceField km={km} isRoundTrip={isRoundTrip} onChange={handleDistanceChange} />;

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

          {isTwoColumns && distanceField}

       

          <fieldset className={styles.fieldset}>
            <legend className={cx(styles.label, styles.legend)}>Trajet</legend>
            <div className={styles.toggle}>
              <button type="button" aria-pressed={!isRoundTrip} onClick={selectOneWay} className={styles.toggleButton}>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                Aller simple
              </button>
              <button type="button" aria-pressed={isRoundTrip} onClick={selectRoundTrip} className={styles.toggleButton}>
                <ArrowLeftRight aria-hidden="true" size={18} strokeWidth={2} />
                Aller-retour
              </button>
            </div>
          </fieldset>
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
        </div>

        <div className={styles.meterColumn}>
          <Taximeter estimate={estimate} controls={isTwoColumns ? undefined : distanceField} />
          <p className={styles.disclaimer}>
            Estimation au tarif maximum réglementé ({fares.source})
            {meterSettings.approachKm > 0 && (
              <>
                , approche comprise&nbsp;: sur réservation, Joe met le compteur en route à environ{' '}
                {formatKm(meterSettings.approachKm)}&nbsp;km de votre adresse
              </>
            )}
            . Hors attente ou marche lente ({formatEuros(fares.attenteHeureJour)}/h le jour,{' '}
            {formatEuros(fares.attenteHeureNuit)}/h la nuit) et supplément de {formatEuros(fares.supplementBagage)} par
            bagage au-delà de trois valises
            {business.maxPassengers > 4 && (
              <>
                , {formatEuros(fares.supplementPassager)} par passager à partir du 5<sup>e</sup>
              </>
            )}
            . Jusqu’à {business.maxPassengers}&nbsp;passagers. Le prix final est celui affiché au compteur.
          </p>
        </div>
      </div>
    </section>
  );
}
