/** Assemble des noms de classes CSS en ignorant les valeurs vides ou fausses. */
export const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');
