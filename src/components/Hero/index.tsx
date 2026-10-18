import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { business, destinations, fares } from '../../config/business';
import { useCycle } from '../../hooks/useCycle';
import ui from '../../styles/ui.module.css';
import { FlapRow, type FlapSegment } from './SplitFlap';
import styles from './Hero.module.css';

/** Palettes par rangée du grand tableau : les rangées plus courtes sont complétées par des palettes vides. */
const BOARD_LENGTH = 12;

/** Accroche « Joe le taxi, il va pas partout. » sur trois rangées ; « pas » est barré (Joe va partout). */
const TITLE_ROWS: readonly (readonly FlapSegment[])[] = [
  [{ text: 'Joe', tone: 'accent' }, { text: ' le taxi,' }],
  [{ text: 'il va ' }, { text: 'pas', tone: 'muted', className: styles.struck }],
  [{ text: 'partout.', tone: 'accent' }],
];

/** Destinations affichées à la fois sur le panneau, et rythme de défilement. */
const VISIBLE_DESTINATIONS = Math.min(4, destinations.length);
const DESTINATION_LENGTH = Math.max(...destinations.map((place) => [...place].length));
const CYCLE_MS = 4500;

const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const pad = (value: number): string => String(value).padStart(2, '0');

/** Heure locale du visiteur (« 14:32 »), mise à jour toutes les 10 secondes. */
function useClock(): string {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(timer);
  }, []);

  return timeFormatter.format(now);
}

/**
 * Section d'accueil façon tableau des départs à palettes : l'accroche s'écrit lettre par lettre
 * sur un grand tableau (bandeau jaune : départ et heure locale), puis le texte d'introduction et les
 * boutons, un panneau qui fait défiler les destinations (`destinations`, src/config/business.ts)
 * et une fiche récapitulative (horaires, secteur, tarifs, licence).
 * Le tableau est décoratif : le vrai titre et la liste des destinations sont fournis aux lecteurs d'écran.
 */
export function Hero() {
  const time = useClock();
  const first = useCycle(destinations.length, CYCLE_MS);
  const shownPlaces = Array.from({ length: VISIBLE_DESTINATIONS }, (_, row) => (first + row) % destinations.length);

  return (
    <section id="accueil" aria-labelledby="hero-title" className={styles.hero}>
      <div className="container">
        <h1 id="hero-title" className="visually-hidden">
          Joe le taxi, il va partout.
        </h1>

        <div className={styles.boardWrap}>
          <div className={styles.board}>
            <div className={styles.boardBar}>
              <p className={styles.boardRoute}>
                <span className={styles.boardLabel}>Départ</span>
                <span className="nowrap">{business.city}</span>
              </p>
              <p aria-hidden="true" className={styles.clock}>
                <span className={styles.boardLabel}>Il est</span>
                <FlapRow segments={[{ text: time, tone: 'accent' }]} scramble={4} />
              </p>
            </div>
            <div className={styles.boardRows}>
              {TITLE_ROWS.map((segments, row) => (
                <FlapRow key={row} segments={segments} length={BOARD_LENGTH} delay={row * 5} scramble={10} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.lower}>
          <div className={styles.intro}>
            <p className={styles.lead}>
              Votre taxi à <span className="nowrap">{business.city}</span>, 7&nbsp;jours sur&nbsp;7, jour et nuit. Gares
              et aéroports, transport médical, soirées et longues distances&nbsp;: vous réservez, Joe vous conduit.
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

          <section aria-labelledby="destinations-title" className={styles.destinations}>
            <div className={styles.destinationsHead}>
              <h2 id="destinations-title" className={styles.destinationsTitle}>
                Destinations
              </h2>
              <span aria-hidden="true" className={styles.counter}>
                {pad(first + 1)}/{pad(destinations.length)}
              </span>
            </div>
            <ul className="visually-hidden">
              {destinations.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
            <ol
              aria-hidden="true"
              className={styles.departures}
              style={{ '--cols': DESTINATION_LENGTH } as CSSProperties}
            >
              {shownPlaces.map((placeIndex, row) => (
                <li key={row} className={styles.departure}>
                  <span className={styles.departureIndex}>{pad(placeIndex + 1)}</span>
                  <FlapRow
                    segments={[
                      { text: destinations[placeIndex].toUpperCase(), tone: row === 0 ? 'accent' : undefined },
                    ]}
                    length={DESTINATION_LENGTH}
                    delay={row * 3}
                    scramble={5}
                  />
                </li>
              ))}
            </ol>
            <p className={styles.destinationsFoot}>Et partout ailleurs, sur réservation.</p>
          </section>
        </div>

        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt>Horaires</dt>
            <dd>
              {business.hours[0]}
              <span>{business.hours[1]}</span>
            </dd>
          </div>
          <div className={styles.spec}>
            <dt>Secteur</dt>
            <dd>
              Partout
              <span>Depuis {business.city}</span>
            </dd>
          </div>
          <div className={styles.spec}>
            <dt>Tarifs</dt>
            <dd>
              Réglementés
              <span>{fares.source}</span>
            </dd>
          </div>
          <div className={styles.spec}>
            <dt>Licence</dt>
            <dd>
              N°&nbsp;{business.licenseNumber}
              <span>Autorisation de stationnement</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
