import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Phone, PhoneCall } from 'lucide-react';
import { business } from '../../config/business';
import ui from '../../styles/ui.module.css';
import { cx } from '../../utils/cx';
import { toTelHref } from '../../utils/format';
import styles from './PhoneBooking.module.css';

/** Les trois temps d'une réservation, affichés en frise sous le numéro. */
const STEPS = [
  { title: 'Vous appelez', text: business.hours.join(' · ') },
  { title: 'Vous indiquez votre trajet', text: 'Départ, destination, date et heure.' },
  { title: 'Joe vous prend en charge', text: 'À l’heure et à l’adresse convenues.' },
] as const;

/** Durée d'affichage de la confirmation après un clic sur « Copier le numéro ». */
const COPY_FEEDBACK_MS = 2500;

type CopyState = 'idle' | 'copied' | 'selected';

const COPY_MESSAGES: Record<CopyState, string> = {
  idle: '',
  copied: 'Numéro copié.',
  selected: 'Numéro sélectionné, il ne reste qu’à le copier.',
};

/**
 * Section « Réservez votre taxi par téléphone » : accroche, grand numéro sélectionnable,
 * bouton d'appel (lien tel:) et frise des trois étapes d'une réservation.
 * Sur mobile, le numéro et le bouton d'appel passent juste sous l'accroche pour être visibles dès l'arrivée.
 */
export function PhoneBooking() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const digitsRef = useRef<HTMLSpanElement>(null);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const handleCopy = useCallback(async () => {
    window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(business.phone);
      setCopyState('copied');
    } catch {
      // Presse-papiers indisponible (navigateur ancien, page non sécurisée) : le numéro est sélectionné pour Ctrl+C.
      if (digitsRef.current) window.getSelection()?.selectAllChildren(digitsRef.current);
      setCopyState('selected');
    }
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), COPY_FEEDBACK_MS);
  }, []);

  const isCopied = copyState === 'copied';

  return (
    <section id="reserver" aria-labelledby="reserver-title" className={styles.section}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.head}>
          <h2 id="reserver-title" className={styles.eyebrow}>
            Réservez votre taxi par téléphone
          </h2>
          <p className={styles.tagline}>
            Votre trajet commence{' '}
            <span className={styles.tail}>
              par <span className={styles.mark}>un appel.</span>
            </span>
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.line}>
            <span aria-hidden="true" className={styles.badge}>
              <PhoneCall size={28} strokeWidth={2.25} />
            </span>
            <p className={styles.lineLabel}>
              <span className={styles.lineTitle}>Ligne directe</span>
              <span>
                {business.name}, <span className="nowrap">{business.city}</span>
              </span>
            </p>
          </div>

          {/* Texte simple (et non un lien) : se sélectionne en un clic et se copie facilement sur ordinateur. */}
          <p className={styles.number}>
            <span ref={digitsRef} className={styles.digits}>
              {business.phone}
            </span>
          </p>

          <div className={styles.actions}>
            <a href={toTelHref(business.phone)} className={cx(ui.primary, styles.call)}>
              <Phone aria-hidden="true" size={22} strokeWidth={2.25} className={styles.callIcon} />
              Appeler {business.name}
              <span className="visually-hidden"> au {business.phone}</span>
            </a>
            <button type="button" onClick={handleCopy} className={cx(ui.outline, styles.copy)}>
              {isCopied ? (
                <Check aria-hidden="true" size={18} strokeWidth={2.5} />
              ) : (
                <Copy aria-hidden="true" size={18} strokeWidth={2.25} />
              )}
              {isCopied ? 'Numéro copié' : 'Copier le numéro'}
            </button>
          </div>

          <p role="status" className="visually-hidden">
            {COPY_MESSAGES[copyState]}
          </p>
        </div>

        <p className={styles.lead}>
          Une ligne directe avec votre chauffeur. Gare, aéroport, rendez-vous
          médical ou soirée&nbsp;: un appel suffit pour réserver votre course.
        </p>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span aria-hidden="true" className={styles.stepNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
