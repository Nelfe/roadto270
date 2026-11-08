# Store packaging (Capacitor)

The game is a static web app, so Capacitor wraps it as-is. Not built on a device from this repo's CI.

```bash
npm i -D @capacitor/cli @capacitor/core @capacitor/android @capacitor/ios
npm run build
mkdir -p www && cp index.html manifest.webmanifest icon-*.png www/   # sw.js is not needed in-app
cp capacitor/capacitor.config.json .
npx cap add android && npx cap add ios
npx cap sync
npx cap open android   # or: npx cap open ios
```

Before submitting: replace the placeholder `appId`, add store icons/splash screens (`@capacitor/assets`),
and fill in privacy details (no data collected unless the player opts in to anonymous stats and a URL was set at build time).
