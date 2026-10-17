import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  Clock,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';
import { business } from '../../config/business';
import { cx } from '../../utils/cx';
import { toTelHref } from '../../utils/format';
import { CheckerBand } from '../CheckerBand';
import styles from './Footer.module.css';

const HOURS_ICONS = [CalendarClock, Clock];

/** Année courante, calculée une fois au chargement de la page. */
const CURRENT_YEAR = new Date().getFullYear();

/** Empêche le nom de la ville de se couper aux tirets dans un texte. */
const keepCityTogether = (text: string) =>
  text.split(business.city).flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <span key={index} className="nowrap">
            {business.city}
          </span>,
          part,
        ],
  );

/**
 * Pied de page : bande damier, logo, coordonnées, horaires, informations légales et copyright.
 * Toutes les valeurs viennent de src/config/business.ts.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <CheckerBand />

      <div className={cx('container', styles.inner)}>
        <div className={styles.brand}>
          <img
            src={business.logo.src}
            width={business.logo.width}
            height={business.logo.height}
            alt={business.name}
            loading="lazy"
            className={styles.logo}
          />
          <p className={styles.tagline}>
            Votre taxi à <span className="nowrap">{business.city}</span>, jour et nuit.
          </p>
        </div>

        <div className={styles.columns}>
          <div>
            <h2 className={styles.heading}>Contact</h2>
            <address className={styles.address}>
              <ul className={styles.list}>
                <li>
                  <Phone aria-hidden="true" size={18} />
                  <a href={toTelHref(business.phone)}>{business.phone}</a>
                </li>
                {business.streetAddress && (
                  <li>
                    <MapPin aria-hidden="true" size={18} />
                    <span>
                      {business.streetAddress},{' '}
                      <span className="nowrap">
                        {business.postalCode} {business.city}
                      </span>
                    </span>
                  </li>
                )}
                <li>
                  <Navigation aria-hidden="true" size={18} />
                  <span>Zone desservie&nbsp;: {keepCityTogether(business.serviceArea)}</span>
                </li>
              </ul>
            </address>
          </div>

          <div>
            <h2 className={styles.heading}>Horaires</h2>
            <ul className={styles.list}>
              {business.hours.map((line, index) => {
                const Icon = HOURS_ICONS[index % HOURS_ICONS.length];
                return (
                  <li key={line}>
                    <Icon aria-hidden="true" size={18} />
                    <span>{line}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Infos</h2>
            <ul className={styles.list}>
              <li>
                <FileText aria-hidden="true" size={18} />
                <a href={business.legalNoticeUrl}>Mentions légales</a>
              </li>
              <li>
                <IdCard aria-hidden="true" size={18} />
                <span>Licence n°&nbsp;{business.licenseNumber}</span>
              </li>
              <li>
                <Briefcase aria-hidden="true" size={18} />
                <span>SIRET&nbsp;{business.siret}</span>
              </li>
              {business.isCpamApproved && (
                <li>
                  <BadgeCheck aria-hidden="true" size={18} />
                  <span>Taxi conventionné CPAM</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="container">
          © {CURRENT_YEAR} {business.name}
        </p>
      </div>
    </footer>
  );
}
