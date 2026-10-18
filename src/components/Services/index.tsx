import { ArrowRight } from 'lucide-react';
import { business, services } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { ServiceCard } from '../ServiceCard';
import styles from './Services.module.css';

/** Mots du bandeau défilant : les titres des services, en double pour couvrir les très grands écrans. */
const MARQUEE_WORDS = [...services, ...services].map((service, index) => ({ key: index, label: service.title }));

/**
 * Section « Où Joe vous emmène » : en-tête (trait jaune qui se dessine sous « partout. »),
 * bandeau défilant des services et grille « bento » de cartes animées générée depuis `services`
 * (src/config/business.ts). La 1re et la 4e carte sont larges : 3 colonnes sur grand écran, 2 sur tablette, 1 sur mobile.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className={styles.section}>
      <div className={cx('container', styles.head)}>
        <div>
          <p className={ui.eyebrow}>Où Joe vous emmène</p>
          <h2 id="services-title" className={ui.sectionTitle}>
            <span>
              Il va{' '}
              <span className={styles.mark}>
                partout.
                <svg aria-hidden="true" className={styles.markLine} viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M4 13 C 70 4, 150 3, 210 9 S 280 15, 296 7" pathLength={1} />
                </svg>
              </span>
            </span>
            <span className={ui.accent}>La preuve.</span>
          </h2>
        </div>

        <div className={styles.intro}>
          <p className={styles.lead}>
            Du premier train au dernier verre, de la salle d’attente à l’autre bout de la carte&nbsp;: où que vous
            alliez, Joe vous y conduit.
          </p>
          <a href="#reserver" className={cx(ui.outline, ui.compact)}>
            Réserver une course
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.25} />
          </a>
        </div>
      </div>

      {/* Bandeau décoratif : deux copies identiques qui défilent en boucle continue. */}
      <div aria-hidden="true" className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.marqueeGroup}>
              {MARQUEE_WORDS.map((word) => (
                <li key={word.key}>{word.label}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container">
        <ul className={styles.grid}>
          {services.map((service, index) => (
            <li key={service.id} className={styles.item}>
              <ServiceCard
                service={service}
                index={index}
                total={services.length}
                showCpam={business.isCpamApproved && service.showCpamBadge === true}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
