# Cap sur 270

Simulation de campagne présidentielle américaine en 12 semaines, jouable sur mobile (PWA installable, hors ligne).

- Carte des 51 États, grands électeurs, sondages bruités
- Enjeux, 7 groupes d'électeurs, économie locale, événements, débats
- Adversaire piloté par l'IA, trois niveaux de difficulté
- Candidats fictifs ; marges de départ approximées d'après les résultats de 2024

## Lancer en local

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 (le service worker n'est actif que sur localhost ou en HTTPS).

## Publier avec GitHub Pages

Settings, Pages, Source : branche `main`, dossier `/ (root)`.
L'URL sera `https://nelfe.github.io/roadto270/`.

## Mises à jour

Après toute modification de `index.html`, changer `VERSION` dans `sw.js` (ex. `cap270-v2`), sinon les joueurs gardent l'ancienne version en cache.

## Fichiers

- `index.html` : le jeu (HTML, CSS et JS dans un seul fichier)
- `manifest.webmanifest` : métadonnées d'installation
- `sw.js` : cache hors ligne
- `icon-192.png`, `icon-512.png` : icônes provisoires
