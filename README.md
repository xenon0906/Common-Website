# Snapgo

Ride-sharing platform website built with Next.js -- pool cabs, split fares, and save money.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS, Radix UI, Framer Motion
- **Backend:** Firebase (Firestore, Auth, Cloud Functions)
- **Analytics:** Google Analytics, Sentry
- **Testing:** Vitest, Testing Library
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase project with Firestore enabled

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd snapgo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Fill in the required Firebase configuration values. See `.env.example` for all available options.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/            Next.js App Router pages and API routes
components/     Reusable UI and layout components
lib/            Utilities, configs, Firebase clients, auth helpers
functions/      Firebase Cloud Functions
data/           Static data files
public/         Static assets
scripts/        Maintenance and seed scripts
tests/          Test files
```

## Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start development server           |
| `npm run build`      | Production build                   |
| `npm start`          | Start production server            |
| `npm run lint`       | Run ESLint                         |
| `npm test`           | Run tests in watch mode            |
| `npm run test:run`   | Run tests once                     |
| `npm run test:coverage` | Run tests with coverage report  |

## Environment Variables

See [`.env.example`](.env.example) for the full list. At minimum you need:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Deployment

The app is deployed on [Vercel](https://vercel.com). Push to `main` triggers automatic deployment.

## License

All rights reserved.
