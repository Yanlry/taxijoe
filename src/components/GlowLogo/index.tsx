import { business } from '../../config/business';
import styles from './GlowLogo.module.css';

/**
 * Grand logo Taxi Joe de l'accueil, toujours allumé : pleines couleurs et halo jaune
 * qui pulse lentement (sans pulsation si l'utilisateur a demandé à réduire les animations).
 * Décoratif : le nom figure déjà dans l'en-tête et le titre.
 */
export function GlowLogo() {
  return (
    <img
      src={business.logo.src}
      width={business.logo.width}
      height={business.logo.height}
      alt=""
      className={styles.logo}
    />
  );
}
