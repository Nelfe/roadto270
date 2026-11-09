# Road to 270 (Cap sur 270)

Simulation de campagne présidentielle américaine en 12 semaines, jouable sur mobile (PWA installable, hors ligne). Trilingue : anglais (par défaut), français et espagnol, avec un sélecteur de langue à l’écran titre et dans le manuel.

- Carte des 51 États, grands électeurs, sondages bruités
- Enjeux, 7 groupes d'électeurs, économie locale, événements, débats
- Adversaire piloté par l'IA, trois niveaux de difficulté
- Modes : présidentielle 2028 (primaires), midterms 2030, scénarios historiques 2016 / 2020 / 2024 (marges d'État réelles, candidats fictifs)
- Marges de départ approximées d'après les résultats de 2024

## Lancer en local

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 (le service worker n'est actif que sur localhost ou en HTTPS).

## Publier avec GitHub Pages

Settings, Pages, Source : branche `main`, dossier `/ (root)`.
L'URL sera `https://nelfe.github.io/roadto270/`.

## Mises à jour

Le service worker essaie d'abord le réseau : un simple rafraîchissement de la page récupère la dernière version, et le cache ne sert que hors ligne. Changer `VERSION` dans `sw.js` n'est utile que pour purger l'ancien cache après une modification de `sw.js` lui-même.

## Développement

Le code source vit dans `src/` ; `index.html` est généré (ne pas l'éditer à la main).

```
npm install && npx playwright install chromium
npm run build          # src/ -> index.html (PWA) + dist/artifact.html (fichier unique, sans service worker)
npm test               # build + test de fumée FR/EN + tests d'équilibrage (parties simulées, graines fixes)
```

- `src/js/NN-*.js` : modules concaténés dans l'ordre (noyau, langue, modèle, adversaire, événements, actions, rendu, modales, tutoriel, candidats, primaires, équipe, stats, titre, mesure)
- `src/data/*.json` : données réelles (États, grands électeurs, sièges de la Chambre, Sénat, démographie, noms anglais), injectées au build
- `src/config.json` : `telemetryUrl` (vide = aucune mesure) ; surchargeable avec `TELEMETRY_URL=... npm run build`
- `tests/snapshot.js` : résultats exacts de parties à graines fixes (`npm run test:update-snapshot` après un changement volontaire des règles)
- `tests/balance.js` : bots seedés ; échoue si un taux de victoire sort de sa fourchette
- CI : `.github/workflows/ci.yml` (build à jour + tests à chaque push)
- `capacitor/` : instructions pour empaqueter en app Android/iOS

### Mesure anonyme

Désactivée par défaut. Si une URL est fournie au build, une case apparaît dans les réglages (non cochée) ; une fois activée, seuls un identifiant aléatoire, la langue, le mode, la difficulté, la semaine atteinte et le résultat sont envoyés (fins de partie et abandons).

## Fichiers

- `index.html` : le jeu généré
- `src/` : sources
- `manifest.webmanifest` : métadonnées d'installation
- `sw.js` : cache hors ligne
- `icon-192.png`, `icon-512.png` : icônes provisoires

## Traductions

Les appels `t(fr, en)` et `B(fr, en)` du code reçoivent leur 3e argument (espagnol) **au build** depuis `src/i18n/es.json` (clé = texte anglais). `src/i18n/help_es.html` contient le manuel espagnol. Après avoir ajouté un texte, `node tools/i18n-extract.js --missing` liste les textes sans traduction (affichés en anglais en attendant) ; `node tests/i18n-leftovers.js es` repère les lignes encore en anglais pendant une partie.
