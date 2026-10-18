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

/** Plan de ville stylisé du fond (repère SVG 1440 × 900) : rues et itinéraire d'une course. */
const STREETS = [
  'M-40 650 L420 560 L780 610 L1480 430',
  'M-40 230 C 300 270 520 130 820 210 S 1300 310 1480 190',
  'M330 -40 L380 940',
  'M720 -40 L720 940',
  'M1000 -40 L930 940',
  'M1230 -40 L1290 940',
  'M-40 860 L1480 770',
];
/**
 * Itinéraire : remonte la rue du milieu (x = 720, toujours au centre de l'écran, entre les deux colonnes),
 * puis rejoint l'épingle au-dessus du taximètre.
 */
const ROUTE = 'M720 790 L720 200 L968 262 L990 132';

interface DistanceFieldProps {
  km: number;
  isRoundTrip: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** Curseur de distance du trajet, avec la valeur choisie, une graduation et les bornes. */
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
      <div aria-hidden="true" className={styles.ruler} />
      <div aria-hidden="true" className={styles.scale}>
        <span>{minKm}&nbsp;km</span>
        <span>{maxKm}&nbsp;km</span>
      </div>
    </div>
  );
}

/**
 * Section « Le compteur de Joe », sur fond jaune : curseur de distance, choix du trajet (aller simple
 * ou aller-retour) et du moment (jour ou nuit), qui déterminent le tarif réglementé A, B, C ou D,
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
      <svg aria-hidden="true" className={styles.map} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {STREETS.map((street) => (
          <path key={street} className={styles.street} d={street} />
        ))}
        <path className={styles.route} d={ROUTE} />
        <circle className={styles.routeStart} cx="720" cy="790" r="11" />
        <path
          className={styles.routeEnd}
          d="M990 132 C 980 116, 968 104, 968 90 A 22 22 0 1 1 1012 90 C 1012 104, 1000 116, 990 132 Z"
        />
        <circle className={styles.routeEndDot} cx="990" cy="90" r="8" />
      </svg>

      <div className={cx('container', styles.grid)}>
        <div className={styles.controls}>
          <div>
            <p className={styles.eyebrow}>Le compteur</p>
            <h2 id="compteur-title" className={ui.sectionTitle}>
              <span>Combien ça coûte&nbsp;?</span>
              <span>
                Faites tourner le <span className={styles.mark}>compteur.</span>
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
