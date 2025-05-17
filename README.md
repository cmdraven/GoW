# Guild Of Woten (Firebase Realtime DB version)

This is a minimal app using Firebase Realtime Database to store and sync flash fiction stories live.

## Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database and set rules to allow read/write access for testing:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Replace the placeholder config in `script.js` with your Firebase project config from the Firebase console.
4. Open `index.html` in your browser or host on static hosting (Vercel, Netlify, GitHub Pages, etc.)
5. This is quite rudmientry in nature that even a 3 year old may set it up.

Enjoy your storytelling community!
