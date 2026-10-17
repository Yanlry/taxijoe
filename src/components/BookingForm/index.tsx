import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type HTMLInputTypeAttribute,
} from 'react';
import { CircleAlert, CircleCheck, Phone, Send } from 'lucide-react';
import { business } from '../../config/business';
import ui from '../../styles/ui.module.css';
import type { BookingField, BookingFormErrors, BookingFormValues } from '../../types';
import { cx } from '../../utils/cx';
import { toTelHref } from '../../utils/format';
import {
  BOOKING_FIELDS,
  INITIAL_BOOKING,
  PASSENGER_OPTIONS,
  buildMailtoHref,
  getTodayIso,
  validateBooking,
  validateField,
} from './booking';
import styles from './BookingForm.module.css';

type FieldChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

interface FormFieldProps {
  field: BookingField;
  label: string;
  value: string;
  error?: string;
  onChange: FieldChangeHandler;
  className?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: 'text' | 'tel';
  autoComplete?: string;
  placeholder?: string;
  min?: string;
  /** Si fourni, affiche une liste déroulante au lieu d'un champ de saisie. */
  options?: ReadonlyArray<{ value: string; label: string }>;
}

/**
 * Champ du formulaire : libellé, champ et message d'erreur relié par aria-describedby.
 * Mémoïsé (props primitives + onChange stable) : à la frappe, seul le champ modifié se ré-affiche.
 */
const FormField = memo(function FormField({
  field,
  label,
  value,
  error,
  onChange,
  className,
  options,
  type = 'text',
  ...inputProps
}: FormFieldProps) {
  const id = `booking-${field}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: field,
    value,
    onChange,
    className: styles.input,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {!options && (
          <span aria-hidden="true" className={styles.required}>
            *
          </span>
        )}
      </label>

      {options ? (
        <select {...shared}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...shared} {...inputProps} type={type} required />
      )}

      {error && (
        <p id={errorId} className={styles.error}>
          <CircleAlert aria-hidden="true" size={16} strokeWidth={2.25} />
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Section « On part quand ? » : invitation à appeler Joe et formulaire de demande de course.
 * Sans backend : une fois validé, le formulaire ouvre la messagerie du visiteur avec un e-mail
 * pré-rempli (lien mailto:) adressé à business.email, puis affiche une confirmation.
 */
export function BookingForm() {
  const [values, setValues] = useState<BookingFormValues>(INITIAL_BOOKING);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSent, setIsSent] = useState(false);
  const [today] = useState(getTodayIso);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocus = useRef<BookingField | null>(null);

  // Après un envoi invalide : focus sur le premier champ en erreur, une fois son message affiché.
  useEffect(() => {
    const field = pendingFocus.current;
    if (!field) return;
    pendingFocus.current = null;
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  }, [errors]);

  const handleChange = useCallback<FieldChangeHandler>(
    (event) => {
      const field = event.target.name as BookingField;
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
      // Un champ déjà signalé est revalidé à chaque saisie : l'erreur disparaît dès qu'elle est corrigée.
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        const message = validateField(field, value, today);
        if (message) next[field] = message;
        else delete next[field];
        return next;
      });
      setIsSent(false);
    },
    [today],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextErrors = validateBooking(values, today);
      setErrors(nextErrors);

      const firstInvalid = BOOKING_FIELDS.find((field) => nextErrors[field]);
      if (firstInvalid) {
        pendingFocus.current = firstInvalid;
        setIsSent(false);
        return;
      }

      // Pas de backend pour l'instant : la demande part par la messagerie du visiteur.
      window.location.href = buildMailtoHref(business.email, values);
      setIsSent(true);
    },
    [values, today],
  );

  const errorCount = Object.keys(errors).length;

  return (
    <section id="reserver" aria-labelledby="reserver-title" className={styles.section}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.intro}>
          <h2 id="reserver-title" className={styles.title}>
            On part quand&nbsp;?
          </h2>
          <p className={styles.text}>Laissez votre trajet, Joe vous rappelle pour confirmer.</p>
          <a href={toTelHref(business.phone)} className={ui.outlineDark}>
            <Phone aria-hidden="true" size={18} strokeWidth={2.25} />
            Appeler Joe
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 id="booking-form-title" className={styles.cardTitle}>
              Votre demande de course
            </h3>
            <p aria-hidden="true" className={styles.note}>
              <span className={styles.required}>*</span> Champs obligatoires
            </p>
          </div>

          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby="booking-form-title"
            className={styles.form}
          >
            <FormField
              field="name"
              label="Nom"
              value={values.name}
              error={errors.name}
              onChange={handleChange}
              autoComplete="name"
              className={styles.half}
            />
            <FormField
              field="phone"
              label="Téléphone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              error={errors.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              className={styles.half}
            />
            <FormField
              field="from"
              label="Départ"
              value={values.from}
              error={errors.from}
              onChange={handleChange}
              autoComplete="street-address"
              placeholder="Adresse, gare, aéroport…"
              className={styles.full}
            />
            <FormField
              field="to"
              label="Arrivée"
              value={values.to}
              error={errors.to}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Adresse, gare, aéroport…"
              className={styles.full}
            />
            <FormField
              field="date"
              label="Date"
              type="date"
              min={today}
              value={values.date}
              error={errors.date}
              onChange={handleChange}
              className={styles.third}
            />
            <FormField
              field="time"
              label="Heure"
              type="time"
              value={values.time}
              error={errors.time}
              onChange={handleChange}
              className={styles.third}
            />
            <FormField
              field="passengers"
              label="Passagers"
              options={PASSENGER_OPTIONS}
              value={values.passengers}
              error={errors.passengers}
              onChange={handleChange}
              className={styles.thirdWide}
            />

            <div className={cx(styles.full, styles.actions)}>
              <button type="submit" className={cx(ui.primary, styles.submit)}>
                <Send aria-hidden="true" size={18} strokeWidth={2.25} />
                Envoyer ma demande
              </button>
              <p className={styles.mailNote}>
                Votre messagerie s’ouvre avec la demande pré-remplie&nbsp;: il ne reste qu’à l’envoyer.
              </p>
              <div role="status" className={styles.feedback}>
                {isSent ? (
                  <p className={styles.success}>
                    <CircleCheck aria-hidden="true" size={20} strokeWidth={2.25} />
                    Demande envoyée, Joe vous rappelle très vite.
                  </p>
                ) : errorCount > 0 ? (
                  <p className={styles.errorSummary}>
                    {errorCount === 1 ? 'Un champ est à corriger.' : `${errorCount} champs sont à corriger.`}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
