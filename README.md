# Casa

A small private PWA for one family to manage home chores and groceries. It runs on a kitchen wall tablet and on the family's phones. The user interface is in Brazilian Portuguese.

Stack: Vite, React, TypeScript, Tailwind CSS, Firebase Authentication and Cloud Firestore (free Spark plan), hosted on GitHub Pages.

## Local development

```sh
npm install
npm run dev      # http://localhost:5173/central-casa-app/
npm test         # unit tests (Vitest)
npm run build    # type-check and build into dist/
```

The app shows a "Falta configurar o Firebase" message until `src/firebase-config.ts` is filled in (step 1 below).

## Configuration in one place

- **Repository name**: `REPO_NAME` at the top of `vite.config.ts`. The site is served from `https://<user>.github.io/<REPO_NAME>/`, and the base path comes from this value. If your GitHub repository is not called `central-casa-app`, change it there.
- **Firebase web config and family email**: `src/firebase-config.ts`.
- **Security rules**: `firestore.rules`.

## Manual setup steps

You need to do these yourself, once.

### 1. Create the Firebase project and web app

1. Go to <https://console.firebase.google.com>, create a project (Google Analytics is not needed).
2. In **Project settings > General > Your apps**, add a **Web** app. You don't need Firebase Hosting.
3. Copy the `firebaseConfig` values into `src/firebase-config.ts`.

The web config (including `apiKey`) is public by design and safe to commit. Access is protected by the security rules.

### 2. Enable Email/Password sign-in and create the family account

The console groups products by category in the left sidebar. Portuguese labels are in parentheses.

1. In the sidebar, open **Security (Segurança) > Authentication** and click **Get started (Vamos começar)** if shown.
2. In the **Sign-in method (Método de login)** tab, enable **Email/Password (E-mail/senha)**, leave "Email link" off, and save.
3. In the **Users (Usuários)** tab, click **Add user (Adicionar usuário)** and create the single family account with an email and a strong password.
4. Copy the new user's **User UID (UID do usuário)**.
5. Put the email (not the password) in `FAMILY_EMAIL` in `src/firebase-config.ts`.

Never commit the password. Share it with the family in person.

### 3. Turn off new account creation

In **Authentication > Settings (Configurações) > User actions (Ações do usuário)**, uncheck **Enable create (sign-up)** if the option is available for your project. Even if it isn't, the security rules only allow the one family UID, so any other account sees nothing.

### 4. Create Firestore and publish the rules

1. In the sidebar, open **Databases & storage (Bancos de dados e armazenamento) > Firestore Database** and create a database in **production mode (modo de produção)**. Choose a location close to you, for example `southamerica-east1` (São Paulo). You can't change the location later.
2. Open `firestore.rules`, replace `REPLACE_WITH_FAMILY_UID` with the UID from step 2, and commit that change.
3. In **Firestore Database > Rules (Regras)**, paste the contents of `firestore.rules` and click **Publish**.

The first time the app opens after sign-in, it creates three placeholder members (`Pessoa 1`, `Pessoa 2`, `Pessoa 3`) in the `members` collection. Rename them and pick their colors in the Firestore console by editing `name` and `color` (a hex value like `#7c3aed`).

### 5. Authorize the GitHub Pages domain

In **Authentication > Settings (Configurações) > Authorized domains (Domínios autorizados)**, add `<user>.github.io` (your GitHub username, without the repository path). `localhost` is already authorized for development.

### 6. Enable GitHub Pages

1. Push this repository to GitHub, on the `main` branch.
2. In the repository's **Settings > Pages**, set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which installs, runs the tests, builds, and deploys `dist/`. The site appears at `https://<user>.github.io/<REPO_NAME>/`.

### 7. Install on each device

On every phone and on the tablet:

1. Open `https://<user>.github.io/<REPO_NAME>/`.
2. Install it: on Android/Chrome use **Add to Home screen** or **Install app**; on iPhone/iPad use Safari's **Share > Add to Home Screen**.
3. Open the installed app, enter the family password once, and choose who the device belongs to. On the wall tablet choose **Tablet da cozinha**.

On iPhone, the installed app keeps its own storage separate from Safari, so sign in from inside the installed app, not in Safari.

The session persists indefinitely, so nobody should see the password screen again on that device. Tapping the name in the header lets you change who the device belongs to.

## Optional hardening

In Google Cloud console > **APIs & Services > Credentials**, you can restrict the browser API key to HTTP referrers `https://<user>.github.io/*` and `http://localhost:5173/*`. This is not required; the security rules are what protect the data.
