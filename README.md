# Codeforces Progress Tracker

Enter any public Codeforces handle to view live profile, contest, problem-solving, and submission-heatmap data. The app no longer stores students, uses MongoDB, or exports CSV files.

## Run locally

Use two terminals during development:

```bash
# Terminal 1: API server
cd server
npm install
npm start
```

```bash
# Terminal 2: React app
cd client
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000). The React development server proxies API requests to `http://localhost:8080`.

## Deploy as one service

The Express server will automatically serve the built React app when `client/build` exists. On a Node hosting service such as Render, use:

```bash
# Build command
cd client && npm ci && npm run build && cd ../server && npm ci --omit=dev
```

```bash
# Start command
cd server && npm start
```

No environment variables or database setup are needed. The hosting service must allow outbound HTTPS requests to `codeforces.com`.

The repository pins Node.js `20.18.0` in `.node-version`, which is compatible with the frontend dependencies. For Render, set the health-check path to `/api/health`.
