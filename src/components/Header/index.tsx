import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';
import { business } from '../../config/business';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { toTelHref } from '../../utils/format';
import { CheckerBand } from '../CheckerBand';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '#compteur', label: 'Prix', hint: 'Estimer le prix de votre course' },
  { href: '#services', label: 'Services', hint: 'Gares, aéroports, médical, soirées' },
  { href: '#reserver', label: 'Réserver', hint: 'Par téléphone, 7 jours sur 7' },
] as const;

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * En-tête collant : logo, bouton d'appel (icône seule) et bouton du menu.
 * Le menu est une fenêtre de dialogue native plein écran (focus gardé dedans, Échap pour fermer,
 * retour au bouton à la fermeture) qui s'ouvre en cercle depuis le bouton : grands liens numérotés,
 * carte de réservation directe et bande damier. Défilement de la page bloqué tant qu'il est ouvert.
 */
export function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Faux quand on ferme en suivant un lien : le focus ne revient alors pas sur le bouton du menu.
  const returnFocusRef = useRef(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [origin, setOrigin] = useState({ x: '100%', y: '0px' });
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const openMenu = useCallback(() => {
    // Le cercle d'ouverture part du centre du bouton.
    const box = menuButtonRef.current?.getBoundingClientRect();
    if (box) setOrigin({ x: `${box.left + box.width / 2}px`, y: `${box.top + box.height / 2}px` });
    setIsClosing(false);
    returnFocusRef.current = true;
    dialogRef.current?.showModal();
    closeButtonRef.current?.focus();
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (returnFocusRef.current) menuButtonRef.current?.focus();
  }, []);

  // Fermeture animée ; immédiate si l'utilisateur a demandé à réduire les animations.
  const closeMenu = useCallback(() => {
    if (!dialogRef.current?.open) return;
    if (reduceMotion) dialogRef.current.close();
    else setIsClosing(true);
  }, [reduceMotion]);

  const handleAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDialogElement>) => {
      if (isClosing && event.target === event.currentTarget) {
        setIsClosing(false);
        dialogRef.current?.close();
      }
    },
    [isClosing],
  );

  // Lien du menu : la page défile vers la section pendant que le menu se referme.
  const followLink = useCallback(() => {
    returnFocusRef.current = false;
    closeMenu();
  }, [closeMenu]);

  const menuStyle = { '--origin-x': origin.x, '--origin-y': origin.y } as CSSProperties;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#accueil" className={styles.brand}>
          <img
            src={business.logo.src}
            width={business.logo.width}
            height={business.logo.height}
            alt={`${business.name}, retour à l’accueil`}
            className={styles.logo}
          />
        </a>

        <div className={styles.actions}>
          <a
            href={toTelHref(business.phone)}
            className={styles.callButton}
            aria-label={`Appeler ${business.name} au ${business.phone}`}
          >
            <Phone aria-hidden="true" size={20} strokeWidth={2.25} />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="menu"
            aria-label="Ouvrir le menu"
            onClick={openMenu}
          >
            <span aria-hidden="true" className={styles.burger} />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="menu"
        aria-labelledby="menu-title"
        className={styles.menu}
        data-closing={isClosing || undefined}
        style={menuStyle}
        onCancel={(event) => {
          // Échap : même fermeture animée qu'avec le bouton.
          event.preventDefault();
          closeMenu();
        }}
        onClose={handleClose}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={styles.menuInner}>
          <div className={`container ${styles.menuTop}`}>
            <a href="#accueil" className={styles.brand} onClick={followLink}>
              <img
                src={business.logo.src}
                width={business.logo.width}
                height={business.logo.height}
                alt={`${business.name}, retour à l’accueil`}
                className={styles.logo}
              />
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              aria-label="Fermer le menu"
              onClick={closeMenu}
            >
              <span aria-hidden="true" className={styles.cross} />
            </button>
          </div>

          <div className={`container ${styles.menuBody}`}>
            <nav aria-labelledby="menu-title">
              <p id="menu-title" className={styles.menuEyebrow}>
                Menu
              </p>
              <ol className={styles.menuLinks}>
                {NAV_LINKS.map((link, index) => (
                  <li key={link.href} className={styles.menuItem} style={{ '--i': index } as CSSProperties}>
                    <a href={link.href} className={styles.menuLink} onClick={followLink}>
                      <span aria-hidden="true" className={styles.menuIndex}>
                        {pad(index + 1)}
                      </span>
                      <span className={styles.menuLabel}>{link.label}</span>
                      <span className={styles.menuHint}>{link.hint}</span>
                      <ArrowUpRight aria-hidden="true" className={styles.menuArrow} size={36} strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.menuCard}>
              <p className={styles.menuEyebrow}>Réservation directe</p>
              <a href={toTelHref(business.phone)} className={styles.menuCall}>
                <span aria-hidden="true" className={styles.menuCallIcon}>
                  <Phone size={22} strokeWidth={2.25} />
                </span>
                <span className={styles.menuCallText}>
                  <span className={styles.menuCallLabel}>Appeler {business.name}</span>
                  <span className={styles.menuCallNumber}>{business.phone}</span>
                </span>
              </a>
              <dl className={styles.menuFacts}>
                <div>
                  <dt>Horaires</dt>
                  <dd>
                    {business.hours[0]}, {business.hours[1].toLowerCase()}
                  </dd>
                </div>
                <div>
                  <dt>Secteur</dt>
                  <dd>{business.serviceArea}</dd>
                </div>
              </dl>
            </div>
          </div>

          <CheckerBand className={styles.menuBand} />
        </div>
      </dialog>
    </header>
  );
}
