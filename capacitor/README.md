# Application Android (Capacitor)

Le jeu est empaqueté tel quel dans une app Android (WebView, fonctionne hors ligne). Le build se fait sur GitHub (les SDK Android ne sont pas disponibles ailleurs ici).

## Obtenir l'APK de test
1. GitHub → dépôt **Nelfe/roadto270** → onglet **Actions** → workflow **Android build** → **Run workflow**.
2. Quand c'est vert (≈ 5–8 min), ouvrir l'exécution → section *Artifacts* → télécharger **roadto270-debug-apk** (zip contenant `app-debug.apk`).
3. Émulateur : glisser-déposer l'APK sur la fenêtre de l'émulateur, ou `adb install app-debug.apk`.

## Publier sur le Play Store (AAB signé)
1. Créer une clé d'upload (une seule fois) :
   `keytool -genkeypair -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000`
   (garder le fichier et les mots de passe en lieu sûr ; ne jamais le committer)
2. Dépôt → Settings → Secrets and variables → Actions → ajouter :
   `ANDROID_KEYSTORE_B64` (= `base64 -w0 release.keystore`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
3. Relancer le workflow : l'artefact **roadto270-release-aab** est un `.aab` signé à envoyer dans la Play Console (compte développeur Google Play requis, 25 $ une fois). L'identifiant d'app est `io.github.nelfe.roadto270` (à changer dans `capacitor.config.json` avant la première publication : il est définitif ensuite).
4. La Play Console demandera : icône 512, visuel de présentation, captures d'écran, politique de confidentialité (le jeu ne collecte rien tant que la mesure anonyme n'est pas activée), questionnaire de classification de contenu.

## En local (si vous avez Android Studio)
`npm install && npm run android:sync` puis `npx cap open android`.
