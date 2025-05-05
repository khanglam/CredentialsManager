# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Planned Features & Improvements

### Security & Privacy
- [ ] **End-to-End Encryption**: Encrypt credentials in the browser before sending to the backend (e.g., with CryptoJS, Web Crypto API). Only the user can decrypt with their master password.
- [ ] **Biometric Authentication**: Integrate with device biometrics (FaceID, fingerprint) for unlocking credentials on supported devices.
- [ ] **Password Generation**: Add a strong password generator tool (with options: length, symbols, numbers, etc.) in the Add/Edit dialog.
- [ ] **Security Audit/Health Report**: Show password reuse, weak passwords, old passwords, and recommend changes.
- [ ] **2FA/OTP Storage**: Allow storing and displaying TOTP (Time-based One-Time Password) secrets, QR code scanning, and code generation.

### User Experience & Usability
- [ ] **Browser Extension**: Build a Chrome/Firefox extension for autofilling credentials on login pages.
- [ ] **Drag-and-Drop Organization**: Allow users to drag credentials between categories or reorder them.
- [ ] **Favorites & Pinning**: Let users pin credentials to the top or mark as favorites for quick access.
- [ ] **Search & Filtering Enhancements**: Add advanced search (by username, URL, notes) and multi-category filtering.
- [ ] **Dark Mode / Theme Customization**: Let users choose dark/light/system theme, or customize accent colors.

### Collaboration & Sharing
- [ ] **Secure Sharing**: Allow users to securely share credentials with other users (with expiration, revoke, view-only, etc.).
- [ ] **Audit Log**: Show a history of changes, access, and sharing for each credential.

### Backup, Import, and Export
- [ ] **Cloud Backup & Restore**: One-click backup/restore to Google Drive, Dropbox, or encrypted file download.
- [ ] **Import/Export Enhancements**: Support more formats (1Password, LastPass, CSV, JSON) and bulk editing.

### Mobile Experience
- [ ] **Progressive Web App (PWA)**: Make the app installable on mobile devices, with offline support and push notifications.
- [ ] **QR Code Login**: Scan a QR code on desktop to log in instantly on mobile.

### Other Feature Ideas
- [ ] **Breach Monitoring**: Notify users if any stored credentials appear in public data breaches (using HaveIBeenPwned API).
- [ ] **Custom Fields**: Allow users to add custom fields (e.g., security questions, PINs, notes) to credentials.
- [ ] **Password Expiry Reminders**: Remind users to update passwords after a set period.
- [ ] **Multi-language Support**: Add localization for global users.
Integrate with device biometrics (FaceID, fingerprint) for unlocking credentials on supported devices.
Password Generation
Add a strong password generator tool (with options: length, symbols, numbers, etc.) in the Add/Edit dialog.
Security Audit/Health Report
Show password reuse, weak passwords, old passwords, and recommend changes.
2FA/OTP Storage
Allow storing and displaying TOTP (Time-based One-Time Password) secrets, QR code scanning, and code generation.
User Experience & Usability
Browser Extension
Build a Chrome/Firefox extension for autofilling credentials on login pages.
Drag-and-Drop Organization
Allow users to drag credentials between categories or reorder them.
Favorites & Pinning
Let users pin credentials to the top or mark as favorites for quick access.
Search & Filtering Enhancements
Add advanced search (by username, URL, notes) and multi-category filtering.
Dark Mode / Theme Customization
Let users choose dark/light/system theme, or customize accent colors.
Collaboration & Sharing
Secure Sharing
Allow users to securely share credentials with other users (with expiration, revoke, view-only, etc.).
Audit Log
Show a history of changes, access, and sharing for each credential.
Backup, Import, and Export
Cloud Backup & Restore
One-click backup/restore to Google Drive, Dropbox, or encrypted file download.
Import/Export Enhancements
Support more formats (1Password, LastPass, CSV, JSON) and bulk editing.
Mobile Experience
Progressive Web App (PWA)
Make the app installable on mobile devices, with offline support and push notifications.
QR Code Login
Scan a QR code on desktop to log in instantly on mobile.
Other Feature Ideas
Breach Monitoring
Notify users if any stored credentials appear in public data breaches (using HaveIBeenPwned API).
Custom Fields
Allow users to add custom fields (e.g., security questions, PINs, notes) to credentials.
Password Expiry Reminders
Remind users to update passwords after a set period.
Multi-language Support
Add localization for global users.