import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Décélération en fin d'animation. */
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Fait défiler un nombre de sa valeur affichée vers une nouvelle cible, avec requestAnimationFrame.
 * Si la cible change en cours de route, l'animation repart de la valeur affichée.
 * Sans animation si l'utilisateur a activé « réduire les animations ».
 *
 * @param target - Valeur à atteindre.
 * @param duration - Durée de l'animation en millisecondes.
 * @returns La valeur intermédiaire à afficher.
 */
export function useAnimatedNumber(target: number, duration = 450): number {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    // Animations réduites : la cible est affichée dès la première image.
    const total = prefersReducedMotion() ? 0 : duration;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = total > 0 ? Math.min(1, (now - start) / total) : 1;
      const next = from + (target - from) * easeOutCubic(progress);
      currentRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
