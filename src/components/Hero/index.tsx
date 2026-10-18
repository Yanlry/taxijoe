import type { CSSProperties } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { business, destinations } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { GlowLogo } from '../GlowLogo';
import styles from './Hero.module.css';

/** Traînées de phares du fond : hauteur (%), épaisseur et flou (px), durée et décalage (s), sens et teinte. */
const TRAILS = [
  { y: 8, size: 1, blur: 0, duration: 12, delay: -2, reverse: false, warm: false },
  { y: 26, size: 1, blur: 0.5, duration: 9.5, delay: -7, reverse: true, warm: true },
  { y: 44, size: 2, blur: 1, duration: 7.5, delay: -1, reverse: false, warm: false },
  { y: 60, size: 2, blur: 1.5, duration: 6, delay: -4, reverse: true, warm: true },
  { y: 76, size: 3, blur: 2, duration: 4.8, delay: -3, reverse: false, warm: false },
  { y: 92, size: 4, blur: 2.5, duration: 4, delay: -0.5, reverse: true, warm: true },
] as const;

/** Variables CSS passées en style inline. */
const vars = (values: Record<string, string>) => values as CSSProperties;

/**
 * Section d'accueil, de nuit : sol en perspective qui défile et traînées de phares en fond.
 * À gauche, l'accroche « Joe le taxi, il va pas partout » (« pas » barré : Joe va partout),
 * le texte d'introduction et les boutons d'action. À droite, le grand logo allumé sur son cadran,
 * avec les destinations (`destinations`, src/config/business.ts) qui tournent tout autour, et son reflet.
 */
export function Hero() {
  return (
    <section id="accueil" aria-labelledby="hero-title" className={styles.hero}>
      <div aria-hidden="true" className={styles.backdrop}>
        <span className={styles.floor}>
          <span className={styles.floorGrid} />
        </span>
        <span className={styles.trails}>
          {TRAILS.map((trail) => (
            <span
              key={trail.y}
              className={cx(styles.trail, trail.reverse && styles.trailReverse, trail.warm && styles.trailWarm)}
              style={vars({
                '--y': `${trail.y}%`,
                '--h': `${trail.size}px`,
                '--blur': `${trail.blur}px`,
                '--t': `${trail.duration}s`,
                '--d': `${trail.delay}s`,
              })}
            />
          ))}
        </span>
      </div>

      <div className={cx('container', styles.grid)}>
        <div className={styles.content}>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>
              <span className={ui.accent}>Joe</span> le taxi,
            </span>
            <span className={styles.line}>
              il va{' '}
              {/* « pas » barré : masqué aux lecteurs d'écran, qui lisent le vrai message « il va partout ». */}
              <s aria-hidden="true" className={styles.struck}>
                pas
              </s>
            </span>
            <span className={cx(styles.line, ui.accent)}>partout.</span>
          </h1>

          <p className={styles.lead}>
            Votre taxi à <span className="nowrap">{business.city}</span>, 7&nbsp;jours sur&nbsp;7, jour et nuit. Gares et
            aéroports, transport médical, soirées et longues distances&nbsp;: vous réservez, Joe vous conduit.
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

        <div className={styles.stage}>
          <div className={styles.logoWrap}>
            <span aria-hidden="true" className={styles.halo} />
            <span aria-hidden="true" className={styles.dial} />
            <GlowLogo />
            {/* Destinations réparties sur le cercle, qui tournent avec lui en restant droites. */}
            <ul aria-label="Destinations desservies" className={styles.orbit}>
              {destinations.map((place, index) => (
                <li
                  key={place}
                  className={styles.place}
                  style={vars({ '--angle': `${(360 / destinations.length) * index}deg` })}
                >
                  <span className={cx(styles.placeLabel, index === 0 && styles.placeHome)}>
                    <MapPin aria-hidden="true" size={12} strokeWidth={2.5} />
                    {place}
                  </span>
                </li>
              ))}
            </ul>
            <img
              aria-hidden="true"
              alt=""
              src={business.logo.src}
              width={business.logo.width}
              height={business.logo.height}
              className={styles.reflection}
            />
          </div>
        </div>
      </div>

      <span aria-hidden="true" className={styles.scrollCue} />
    </section>
  );
}
