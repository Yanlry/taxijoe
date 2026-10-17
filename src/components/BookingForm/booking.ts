import type { BookingField, BookingFormErrors, BookingFormValues } from '../../types';

/** Ordre des champs dans le formulaire (sert à placer le focus sur la première erreur). */
export const BOOKING_FIELDS: readonly BookingField[] = ['name', 'phone', 'from', 'to', 'date', 'time', 'passengers'];

export const INITIAL_BOOKING: BookingFormValues = {
  name: '',
  phone: '',
  from: '',
  to: '',
  date: '',
  time: '',
  passengers: '1',
};

const MAX_PASSENGERS = 8;

export const PASSENGER_OPTIONS = Array.from({ length: MAX_PASSENGERS }, (_, index) => {
  const count = index + 1;
  return { value: String(count), label: `${count} passager${count > 1 ? 's' : ''}` };
});

/** Numéro français : 06 12 34 56 78, 0612345678, +33 6 12 34 56 78… (espaces, points ou tirets acceptés). */
const FRENCH_PHONE = /^(?:(?:\+|00)33[\s.-]?[1-9]|0[1-9])(?:[\s.-]?\d{2}){4}$/;

const isFrenchPhone = (value: string): boolean => FRENCH_PHONE.test(value.trim());

/** Date du jour au format AAAA-MM-JJ, dans le fuseau horaire du visiteur. */
export function getTodayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Valide un champ et renvoie le message d'erreur à afficher, ou undefined s'il est correct.
 * @param today - Date du jour (AAAA-MM-JJ) : une course ne peut pas être demandée dans le passé.
 */
export function validateField(field: BookingField, rawValue: string, today: string): string | undefined {
  const value = rawValue.trim();

  switch (field) {
    case 'name':
      return value ? undefined : 'Indiquez votre nom.';
    case 'phone':
      if (!value) return 'Indiquez votre numéro de téléphone.';
      return isFrenchPhone(value)
        ? undefined
        : 'Numéro invalide. Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78.';
    case 'from':
      return value ? undefined : 'Indiquez l’adresse de départ.';
    case 'to':
      return value ? undefined : 'Indiquez l’adresse d’arrivée.';
    case 'date':
      if (!value) return 'Choisissez une date.';
      return value < today ? 'Choisissez une date à partir d’aujourd’hui.' : undefined;
    case 'time':
      return value ? undefined : 'Choisissez une heure.';
    case 'passengers': {
      const count = Number(value);
      return Number.isInteger(count) && count >= 1 && count <= MAX_PASSENGERS
        ? undefined
        : `Choisissez entre 1 et ${MAX_PASSENGERS} passagers.`;
    }
  }
}

/** Valide tout le formulaire. Un objet vide signifie que tout est correct. */
export function validateBooking(values: BookingFormValues, today: string): BookingFormErrors {
  const errors: BookingFormErrors = {};
  for (const field of BOOKING_FIELDS) {
    const message = validateField(field, values[field], today);
    if (message) errors[field] = message;
  }
  return errors;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** « 2026-10-18 » -> « dimanche 18 octobre 2026 ». */
function formatDateFr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

/** Lien mailto: adressé à Joe, pré-rempli avec le récapitulatif de la demande. */
export function buildMailtoHref(email: string, values: BookingFormValues): string {
  const name = values.name.trim();
  const lines = [
    'Bonjour Joe,',
    '',
    'Je souhaite réserver une course :',
    '',
    `Nom : ${name}`,
    `Téléphone : ${values.phone.trim()}`,
    `Départ : ${values.from.trim()}`,
    `Arrivée : ${values.to.trim()}`,
    `Date : ${formatDateFr(values.date)}`,
    `Heure : ${values.time.replace(':', 'h')}`,
    `Passagers : ${values.passengers}`,
    '',
    'Merci de me rappeler pour confirmer.',
  ];
  const subject = `Demande de course — ${name}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
}
