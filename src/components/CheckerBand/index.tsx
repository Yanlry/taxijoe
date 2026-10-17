import { memo, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import styles from './CheckerBand.module.css';

interface CheckerBandProps {
  /** Hauteur de la bande en pixels, égale à la taille d'une tuile du damier (24 entre les sections, 12 sur les cartes). */
  size?: number;
  className?: string;
}

/**
 * Bande décorative en damier jaune et noir, dessinée en CSS (repeating-conic-gradient).
 * Purement décorative : masquée aux lecteurs d'écran.
 */
export const CheckerBand = memo(function CheckerBand({ size = 24, className }: CheckerBandProps) {
  const style = { '--checker-size': `${size}px` } as CSSProperties;
  return <div aria-hidden="true" className={cx(styles.band, className)} style={style} />;
});
