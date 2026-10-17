import { business, services } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { ServiceCard } from '../ServiceCard';
import styles from './Services.module.css';

/**
 * Section « Où Joe vous emmène » : grille de cartes générée depuis `services`
 * (src/config/business.ts). 4 colonnes sur grand écran, 2 sur tablette, 1 sur mobile.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <p className={ui.eyebrow}>Où Joe vous emmène</p>
          <h2 id="services-title" className={ui.sectionTitle}>
            <span>Il va partout.</span>
            <span className={ui.accent}>La preuve.</span>
          </h2>
        </div>

        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.id} className={styles.item}>
              <ServiceCard service={service} showCpam={business.isCpamApproved && service.showCpamBadge === true} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
