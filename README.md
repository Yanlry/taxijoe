# Taxi Joe — site vitrine

Site d'une page, en React + TypeScript (Vite), sans backend.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) 20.19 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres commandes :

```bash
npm run build      # version de production dans dist/
npm run preview    # aperçu de cette version sur http://localhost:4173
npm run lint       # vérification du code
```

> Si l'ajout d'un **nouveau** paquet plante avec `Cannot read properties of null (reading 'edgesOut')`,
> c'est un bug de npm 10.8 : mettez npm à jour (`npm install -g npm@latest`) puis relancez.

## Modifier les infos et les tarifs

Tout se trouve dans **`src/config/business.ts`** :

| À modifier | Champ |
| --- | --- |
| Téléphone, e-mail, ville | `phone`, `email`, `CITY` (en haut du fichier) |
| Adresse (vide = rue non affichée) | `streetAddress`, `postalCode` |
| Numéro de licence, SIRET | `licenseNumber`, `siret` |
| Mention « Taxi conventionné CPAM » | `isCpamApproved: true` |
| Horaires du pied de page | `hours` |
| **Tarifs** (prise en charge, prix au km jour / nuit) | `fares` |
| Cartes de services (titres, textes) | `services` |
| Adresse du site, une fois en ligne | `siteUrl` (ex. `https://taxi-joe.fr`) |

Les valeurs encore à remplacer sont entre crochets : `[VOTRE E-MAIL]` et `[À COMPLÉTER]` (numéro de licence).
Le titre de la page, la description Google, les aperçus de liens (Open Graph) et les données structurées
se mettent à jour automatiquement à partir de ce fichier.

À compléter aussi :

- **Mentions légales** : `public/mentions-legales.html` (déjà remplies avec les infos de la fiche ; restent l'e-mail, la licence et l'hébergeur).
- **Logo** : `public/logo-taxi-joe.png` (original, utilisé pour les aperçus de liens) et
  `public/logo-taxi-joe-web.png` (version recadrée et allégée affichée sur le site).

Le formulaire de réservation ouvre la messagerie du visiteur avec un e-mail pré-rempli adressé à `email`.

## Mettre en ligne gratuitement

### Netlify

- **Le plus simple** : lancez `npm run build`, puis glissez le dossier `dist/` sur
  [app.netlify.com/drop](https://app.netlify.com/drop).
- **Avec mises à jour automatiques** : poussez le projet sur GitHub, puis sur Netlify choisissez
  *Add new site → Import an existing project*. Le fichier `netlify.toml` fournit déjà les réglages
  (`npm run build`, dossier `dist`).

### Vercel

Poussez le projet sur GitHub, puis sur [vercel.com/new](https://vercel.com/new) importez le dépôt.
Vite est détecté automatiquement (commande `npm run build`, dossier `dist`). Cliquez sur *Deploy*.

Une fois l'adresse du site connue, renseignez `siteUrl` dans `src/config/business.ts` et redéployez :
les aperçus de liens (Facebook, WhatsApp…) utiliseront alors des adresses complètes.

## Structure

```
src/
  components/   un dossier par section (index.tsx + Composant.module.css)
  hooks/        useFareEstimate, useAnimatedNumber
  config/       business.ts (infos + tarifs), seo.ts (balises générées)
  types/        types partagés
  styles/       tokens.css (couleurs, polices), global.css, ui.module.css (boutons)
public/         logo, favicons, mentions légales
```
