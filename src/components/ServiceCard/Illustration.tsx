import { memo, useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Plane, PlaneTakeoff } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ServiceIconName } from '../../types';
import { cx } from '../../utils/cx';
import styles from './Illustration.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const TICKER_DELAY_MS = 2600;

/** Variables CSS passées en style inline (positions, délais d'animation). */
const vars = (values: Record<string, string | number>) => values as CSSProperties;

/**
 * Texte qui change à intervalle régulier, avec un effet de volet qui bascule (tableau des départs).
 * Tous les éléments sont empilés de façon invisible pour réserver la largeur du plus long : rien ne bouge autour.
 * À l'arrêt si l'utilisateur a demandé à réduire les animations.
 */
function Ticker({ items, className }: { items: readonly string[]; className?: string }) {
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), TICKER_DELAY_MS);
    return () => window.clearInterval(timer);
  }, [items.length, reduceMotion]);

  return (
    <span className={cx(styles.ticker, className)}>
      {items.map((item) => (
        <span key={item} className={styles.tickerSizer}>
          {item}
        </span>
      ))}
      <span key={index} className={styles.tickerItem}>
        {items[index % items.length]}
      </span>
    </span>
  );
}

const RUNWAY_LIGHTS = Array.from({ length: 9 }, (_, index) => index);

/**
 * Gares et aéroports : un avion vole sur un arc pointillé, un second plus lointain croise dans l'autre sens,
 * au-dessus de la piste, de la tour de contrôle et du tableau des départs.
 */
function AirportScene({ destinations }: { destinations: readonly string[] }) {
  return (
    <div className={cx(styles.scene, styles.airport)}>
      <span className={cx(styles.flight, styles.flightFar)}>
        <span className={styles.trail} />
        <span className={styles.plane}>
          <Plane size={18} strokeWidth={1.75} />
        </span>
      </span>
      <span className={styles.ground} />
      <svg className={styles.tower} viewBox="0 0 60 120">
        <line className={styles.towerMast} x1="30" y1="4" x2="30" y2="14" />
        <circle className={styles.beacon} cx="30" cy="4" r="3" />
        <rect className={styles.towerBody} x="13" y="13" width="34" height="8" />
        <polygon className={styles.towerBody} points="7,21 53,21 46,42 14,42" />
        <rect className={styles.towerGlass} x="15" y="26" width="30" height="6" />
        <polygon className={styles.towerBody} points="22,42 38,42 40,120 20,120" />
      </svg>
      <span className={styles.orbit} />
      <span className={styles.flight}>
        <span className={styles.trail} />
        <span className={styles.plane}>
          <Plane size={30} strokeWidth={1.75} />
        </span>
      </span>
      <span className={styles.runway}>
        {RUNWAY_LIGHTS.map((light) => (
          <span key={light} className={styles.light} style={vars({ '--i': light })} />
        ))}
      </span>
      {destinations.length > 0 && (
        <span className={styles.board}>
          <span className={styles.boardLabel}>
            <PlaneTakeoff size={14} strokeWidth={2.25} />
            Départs
          </span>
          <Ticker items={destinations} className={styles.boardValue} />
        </span>
      )}
    </div>
  );
}

/** Tracé de moniteur cardiaque : deux battements sur toute la largeur. */
const ECG_PATH =
  'M0 90 H150 l12 0 l9 -16 l9 16 l12 0 l7 20 l11 -78 l11 92 l9 -34 l9 0 ' +
  'H420 l12 0 l9 -16 l9 16 l12 0 l7 20 l11 -78 l11 92 l9 -34 l9 0 H700';

/** Transport médical : un battement lumineux parcourt le tracé du moniteur, la croix pulse au rythme du cœur. */
function MedicalScene() {
  return (
    <div className={cx(styles.scene, styles.medical)}>
      <svg className={styles.ecg} viewBox="0 0 700 180" preserveAspectRatio="xMidYMid meet">
        <path className={styles.ecgBase} d={ECG_PATH} />
        <path className={styles.ecgGlow} d={ECG_PATH} pathLength={1} />
        <path className={styles.ecgPulse} d={ECG_PATH} pathLength={1} />
      </svg>
      <span className={styles.cross} />
    </div>
  );
}

/** Étoiles du ciel de nuit : position (%), taille (px) et décalage du scintillement. */
const STARS = [
  { x: 6, y: 12, size: 2, delay: 0 },
  { x: 14, y: 30, size: 3, delay: 1.2 },
  { x: 22, y: 8, size: 2, delay: 2.1 },
  { x: 31, y: 22, size: 2, delay: 0.6 },
  { x: 40, y: 10, size: 3, delay: 1.8 },
  { x: 47, y: 34, size: 2, delay: 2.6 },
  { x: 55, y: 16, size: 2, delay: 0.3 },
  { x: 63, y: 6, size: 3, delay: 1.5 },
  { x: 70, y: 38, size: 2, delay: 2.3 },
  { x: 88, y: 44, size: 2, delay: 0.9 },
  { x: 94, y: 10, size: 3, delay: 2.9 },
  { x: 36, y: 42, size: 2, delay: 1.1 },
] as const;

/** Silhouette de la ville (repère SVG 400 × 130, immeubles posés sur la ligne du bas). */
const BUILDINGS = [
  { x: 0, w: 46, h: 58 },
  { x: 50, w: 34, h: 96 },
  { x: 88, w: 52, h: 72 },
  { x: 144, w: 28, h: 120 },
  { x: 176, w: 60, h: 84 },
  { x: 240, w: 36, h: 104 },
  { x: 280, w: 56, h: 66 },
  { x: 340, w: 30, h: 112 },
  { x: 374, w: 26, h: 78 },
] as const;

/** Fenêtres allumées, réparties de façon régulière ; une partie clignote, avec des décalages variés. */
const LIT_PANES = BUILDINGS.flatMap((building, b) => {
  const columns = Math.floor((building.w - 6) / 10);
  const rows = Math.floor((building.h - 14) / 14);
  return Array.from({ length: rows * columns }, (_, cell) => {
    const row = Math.floor(cell / columns);
    const column = cell % columns;
    return {
      key: `${b}-${cell}`,
      x: building.x + 5 + column * 10,
      y: 130 - building.h + 8 + row * 14,
      isLit: (b * 7 + row * 3 + column * 5) % 4 === 0,
      flickers: (b + row * 2 + column) % 3 === 0,
      delay: ((b + row + column) % 6) * 0.7,
    };
  }).filter((pane) => pane.isLit);
});

/** Soirées et nuits : ciel étoilé, croissant de lune, fenêtres qui s'allument et taxi qui passe dans la rue. */
function NightScene() {
  return (
    <div className={cx(styles.scene, styles.night)}>
      {STARS.map((star) => (
        <span
          key={`${star.x}-${star.y}`}
          className={styles.star}
          style={vars({ '--x': `${star.x}%`, '--y': `${star.y}%`, '--s': `${star.size}px`, '--d': `${star.delay}s` })}
        />
      ))}
      <span className={styles.moon} />
      <svg className={styles.skyline} viewBox="0 0 400 130" preserveAspectRatio="xMidYMax slice">
        {BUILDINGS.map((building) => (
          <rect
            key={building.x}
            className={styles.building}
            x={building.x}
            y={130 - building.h}
            width={building.w}
            height={building.h}
          />
        ))}
        {LIT_PANES.map((pane) => (
          <rect
            key={pane.key}
            className={cx(styles.pane, pane.flickers && styles.flicker)}
            x={pane.x}
            y={pane.y}
            width={4}
            height={6}
            style={vars({ '--d': `${pane.delay}s` })}
          />
        ))}
      </svg>
      <span className={styles.street} />
    </div>
  );
}

const ROAD_DASHES = Array.from({ length: 4 }, (_, index) => index);

/** Longues distances : la route défile vers l'horizon, un panneau jaune fait défiler les destinations. */
function RoadScene({ destinations }: { destinations: readonly string[] }) {
  return (
    <div className={cx(styles.scene, styles.road)}>
      <span className={styles.horizon} />
      <span className={styles.roadEdges} />
      <span className={styles.asphalt} />
      {ROAD_DASHES.map((dash) => (
        <span key={dash} className={styles.dash} style={vars({ '--i': dash })} />
      ))}
      {destinations.length > 0 && (
        <span className={styles.sign}>
          <span className={styles.signLabel}>
            Direction
            <ArrowUpRight size={14} strokeWidth={2.75} />
          </span>
          <Ticker items={destinations} className={styles.signValue} />
        </span>
      )}
    </div>
  );
}

interface ServiceIllustrationProps {
  icon: ServiceIconName;
  highlights?: readonly string[];
}

/** Scène animée d'une carte de service, choisie d'après son icône. Décorative : masquée aux lecteurs d'écran. */
export const ServiceIllustration = memo(function ServiceIllustration({
  icon,
  highlights = [],
}: ServiceIllustrationProps) {
  return (
    <div aria-hidden="true" className={styles.root}>
      {icon === 'plane' && <AirportScene destinations={highlights} />}
      {icon === 'stethoscope' && <MedicalScene />}
      {icon === 'moon' && <NightScene />}
      {icon === 'route' && <RoadScene destinations={highlights} />}
    </div>
  );
});
