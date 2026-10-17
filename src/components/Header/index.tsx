import { Phone } from 'lucide-react';
import { business } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { toTelHref } from '../../utils/format';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '#compteur', label: 'Prix' },
  { href: '#services', label: 'Services' },
  { href: '#reserver', label: 'Réserver' },
] as const;

/**
 * En-tête du site : logo, liens d'ancre vers les sections et bouton d'appel.
 * Collant en haut de l'écran à partir de 900px ; sur mobile, les liens passent sur leur propre ligne.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={cx('container', styles.inner)}>
        <a href="#accueil" className={styles.brand}>
          <img
            src={business.logo.src}
            width={business.logo.width}
            height={business.logo.height}
            alt={`${business.name}, retour à l’accueil`}
            className={styles.logo}
          />
        </a>

        <nav aria-label="Navigation principale" className={styles.nav}>
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={toTelHref(business.phone)} className={cx(ui.primary, ui.compact, styles.call)}>
          <Phone aria-hidden="true" size={18} strokeWidth={2.25} />
          <span className="visually-hidden">Appeler le </span>
          {business.phone}
        </a>
      </div>
    </header>
  );
}
