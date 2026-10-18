import { memo, useCallback, type PointerEvent } from 'react';
import { BadgeCheck, MoonStar, Plane, Route, Stethoscope, type LucideIcon } from 'lucide-react';
import type { ServiceIconName, ServiceItem } from '../../types';
import { ServiceIllustration } from './Illustration';
import styles from './ServiceCard.module.css';

/** Correspondance entre les noms d'icônes de la config et les icônes Lucide. */
const ICONS: Record<ServiceIconName, LucideIcon> = {
  plane: Plane,
  stethoscope: Stethoscope,
  moon: MoonStar,
  route: Route,
};

const pad = (value: number): string => String(value).padStart(2, '0');

interface ServiceCardProps {
  service: ServiceItem;
  /** Position de la carte dans la liste (0 pour la première), affichée « 01 / 04 ». */
  index: number;
  total: number;
  /** Affiche la mention « Taxi conventionné CPAM ». */
  showCpam?: boolean;
}

/**
 * Carte de service : scène animée (voir Illustration), icône, numéro façon compteur, titre et texte.
 * Un halo jaune suit le pointeur au survol (position transmise au CSS par variables, sans nouveau rendu).
 * La mise en page passe en deux colonnes quand la carte est large (requête de conteneur).
 */
export const ServiceCard = memo(function ServiceCard({ service, index, total, showCpam = false }: ServiceCardProps) {
  const Icon = ICONS[service.icon];

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
  }, []);

  return (
    <article className={styles.card} onPointerMove={handlePointerMove}>
      <div className={styles.layout}>
        <div className={styles.media}>
          <ServiceIllustration icon={service.icon} highlights={service.highlights} />
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.icon}>
              <Icon aria-hidden="true" size={24} strokeWidth={1.9} />
            </span>
            <span aria-hidden="true" className={styles.index}>
              {pad(index + 1)}
              <span className={styles.total}>/{pad(total)}</span>
            </span>
          </div>
          <h3 className={styles.title}>{service.title}</h3>
          <p className={styles.text}>{service.description}</p>
          {showCpam && (
            <p className={styles.badge}>
              <BadgeCheck aria-hidden="true" size={18} strokeWidth={2} />
              Taxi conventionné CPAM
            </p>
          )}
        </div>
      </div>
    </article>
  );
});
