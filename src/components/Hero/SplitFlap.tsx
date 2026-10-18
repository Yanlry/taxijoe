import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cx } from '../../utils/cx';
import styles from './SplitFlap.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** Caractères qui défilent sur les palettes avant que chacune s'arrête sur sa lettre. */
const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const STEP_MS = 45;

/** Réglage du défilement, en pas de 45 ms. */
interface FlapTiming {
  /** Attente avant que la première palette se mette à tourner. */
  delay?: number;
  /** Décalage entre deux palettes voisines (effet de vague de gauche à droite). */
  stagger?: number;
  /** Nombre de caractères qui défilent sur chaque palette avant la bonne lettre. */
  scramble?: number;
}

/**
 * Texte affiché par une rangée de palettes. À chaque nouveau texte, les palettes défilent au hasard puis
 * s'arrêtent sur leur nouvelle lettre, les unes après les autres ; celles qui n'ont pas encore commencé
 * gardent l'ancienne lettre (vide au premier affichage), comme sur un vrai tableau.
 * Affiché directement si l'utilisateur a demandé à réduire les animations.
 */
function useSplitFlap(target: string, { delay = 0, stagger = 1, scramble = 8 }: FlapTiming): string {
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const [flap, setFlap] = useState({ target, previous: '', step: 0 });

  // Nouveau texte : le défilement repart de l'ancien (état ajusté pendant le rendu, motif prévu par React).
  if (flap.target !== target) {
    setFlap({ target, previous: flap.target, step: 0 });
  }

  const lastStep = delay + [...target].length * stagger + scramble;

  useEffect(() => {
    if (reduceMotion || flap.step >= lastStep) return;
    const timer = window.setTimeout(() => setFlap((current) => ({ ...current, step: current.step + 1 })), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [flap.step, lastStep, reduceMotion]);

  if (reduceMotion || flap.step >= lastStep) return target;
  const previous = [...flap.previous];
  return [...target]
    .map((char, index) => {
      const start = delay + index * stagger;
      const before = previous[index] ?? ' ';
      if (flap.step >= start + scramble) return char;
      if (flap.step < start) return before;
      if (char === ' ' && before === ' ') return ' ';
      return FLAP_CHARS[(index * 7 + flap.step * 13) % FLAP_CHARS.length];
    })
    .join('');
}

/** Morceau de texte d'une rangée, avec sa couleur et une classe éventuelle (ex. le mot barré). */
export interface FlapSegment {
  text: string;
  tone?: 'accent' | 'muted';
  className?: string;
}

/** Palette : moitiés haute et basse séparées par la charnière ; la lettre rebascule à chaque changement. */
function Tile({ char }: { char: string }) {
  return (
    <span className={styles.tile}>
      {char.trim() && (
        <span key={char} className={styles.char}>
          {char}
        </span>
      )}
    </span>
  );
}

interface FlapRowProps extends FlapTiming {
  segments: readonly FlapSegment[];
  /** Nombre de palettes de la rangée : complétée par des palettes vides, comme sur un vrai tableau. */
  length?: number;
  className?: string;
}

/**
 * Rangée de palettes façon tableau des départs. Décorative : le texte réel doit être fourni
 * aux lecteurs d'écran à côté (la rangée est masquée par aria-hidden).
 */
export function FlapRow({ segments, length = 0, className, ...timing }: FlapRowProps) {
  const text = segments.map((segment) => segment.text).join('');
  const padding = ' '.repeat(Math.max(0, length - [...text].length));
  const shown = [...useSplitFlap(text + padding, timing)];
  const parts: readonly FlapSegment[] = padding ? [...segments, { text: padding }] : segments;
  // Position de la première palette de chaque morceau dans la rangée.
  const sizes = parts.map((segment) => [...segment.text].length);
  const starts = sizes.map((_, index) => sizes.slice(0, index).reduce((sum, size) => sum + size, 0));

  return (
    <span aria-hidden="true" className={cx(styles.row, className)}>
      {parts.map((segment, index) => (
        <span key={index} className={cx(styles.segment, segment.tone && styles[segment.tone], segment.className)}>
          {shown.slice(starts[index], starts[index] + sizes[index]).map((char, position) => (
            <Tile key={starts[index] + position} char={char} />
          ))}
        </span>
      ))}
    </span>
  );
}
