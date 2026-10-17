import { memo } from 'react';
import { BadgeCheck, MoonStar, Plane, Route, Stethoscope, type LucideIcon } from 'lucide-react';
import type { ServiceIconName, ServiceItem } from '../../types';
import { CheckerBand } from '../CheckerBand';
import styles from './ServiceCard.module.css';

/** Correspondance entre les noms d'icônes de la config et les icônes Lucide. */
const ICONS: Record<ServiceIconName, LucideIcon> = {
  plane: Plane,
  stethoscope: Stethoscope,
  moon: MoonStar,
  route: Route,
};

interface ServiceCardProps {
  service: ServiceItem;
  /** Affiche la mention « Taxi conventionné CPAM ». */
  showCpam?: boolean;
}

/** Carte de service : bande damier de 12px, icône jaune, titre et texte court. */
export const ServiceCard = memo(function ServiceCard({ service, showCpam = false }: ServiceCardProps) {
  const Icon = ICONS[service.icon];

  return (
    <article className={styles.card}>
      <CheckerBand size={12} />
      <div className={styles.body}>
        <span className={styles.icon}>
          <Icon aria-hidden="true" size={28} strokeWidth={1.75} />
        </span>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.text}>{service.description}</p>
        {showCpam && (
          <p className={styles.badge}>
            <BadgeCheck aria-hidden="true" size={18} strokeWidth={2} />
            Taxi conventionné CPAM
          </p>
        )}
      </div>
    </article>
  );
});
