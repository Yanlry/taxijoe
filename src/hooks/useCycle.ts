import { useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * Index qui avance à intervalle régulier (0, 1, 2… puis retour à 0), pour faire défiler une liste.
 * À l'arrêt si l'utilisateur a demandé à réduire les animations.
 *
 * @param length - Nombre d'éléments de la liste.
 * @param delayMs - Intervalle entre deux avancées, en millisecondes.
 */
export function useCycle(length: number, delayMs: number): number {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), delayMs);
    return () => window.clearInterval(timer);
  }, [length, delayMs, reduceMotion]);

  return index;
}
