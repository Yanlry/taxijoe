import { useCallback, useSyncExternalStore } from 'react';

/**
 * Indique si une media query CSS correspond à l'écran, et se met à jour quand ce n'est plus le cas
 * (rotation, redimensionnement). Juste dès le premier rendu, sans saut d'affichage.
 *
 * @param query - Media query, ex. « (min-width: 960px) ».
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
