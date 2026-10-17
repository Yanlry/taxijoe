import { ArrowRight } from 'lucide-react';
import { business } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { GlowLogo } from '../GlowLogo';
import styles from './Hero.module.css';

/**
 * Section d'accueil : accroche « Joe le taxi, il va pas partout » avec « pas » barré
 * (Joe va partout), texte d'introduction, boutons d'action et grand logo allumé.
 */
export function Hero() {
  return (
    <section id="accueil" aria-labelledby="hero-title" className={styles.hero}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            <span>
              <span className={ui.accent}>Joe</span> le taxi,
            </span>
            <span>
              il va{' '}
              {/* « pas » barré : masqué aux lecteurs d'écran, qui lisent le vrai message « il va partout ». */}
              <s aria-hidden="true" className={styles.struck}>
                pas
              </s>
            </span>
            <span className={ui.accent}>partout.</span>
          </h1>

          <p className={styles.lead}>
            Votre taxi à <span className="nowrap">{business.city}</span>, 7&nbsp;jours sur&nbsp;7, jour et nuit. Gares et aéroports, transport
            médical, soirées et longues distances&nbsp;: vous réservez, Joe vous conduit.
          </p>

          <div className={styles.actions}>
            <a href="#reserver" className={ui.primary}>
              Réserver une course
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.25} />
            </a>
            <a href="#compteur" className={ui.outline}>
              Estimer mon trajet
            </a>
          </div>
        </div>

        <GlowLogo />
      </div>
    </section>
  );
}
