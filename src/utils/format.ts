const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

/** Montant en euros au format français : 2,60 €. */
export const formatEuros = (value: number): string => euroFormatter.format(value);

/**
 * Chiffres de l'afficheur du taximètre : 6 caractères, zéros devant, virgule française.
 * Ex. 17.6 -> « 017,60 ».
 */
export const formatMeterDigits = (value: number): string =>
  (Math.round(Math.max(0, value) * 100) / 100).toFixed(2).padStart(6, '0').replace('.', ',');

/**
 * Numéro au format international, appelable depuis l'étranger :
 * « 06 12 34 56 78 » -> « +33612345678 ». Les autres formats sont seulement nettoyés.
 */
export const toInternationalPhone = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, '');
  return /^0\d{9}$/.test(digits) ? `+33${digits.slice(1)}` : digits;
};

/** Lien tel: à partir d'un numéro affiché (« 06 12 34 56 78 » -> « tel:+33612345678 »). */
export const toTelHref = (phone: string): string => `tel:${toInternationalPhone(phone)}`;
