# AssetFlow Frontend

Next.js 16 (App Router) client for [AssetFlow OS](../readme.md) — the enterprise asset and resource management platform.

## Prerequisites

- Node.js 20+
- Backend running on port 3001 (see [root README](../readme.md#quick-start))

## Quick Start

```bash
npm install
cp .env.example .env.local   # optional — defaults to http://localhost:3001/api
npm run dev                  # http://localhost:3000
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Public landing page |
| `/login` | Authentication |
| `/dashboard` | Mission Control KPI dashboard |
| `/organization-setup` | Departments, categories, employees (admin) |
| `/assets` | Asset directory & registration |
| `/allocation` | Asset assignment & transfers |
| `/booking` | Time-slot resource reservations |
| `/maintenance` | Maintenance request workflow |
| `/audit` | Audit cycle management |
| `/reports` | Analytics & reports |
| `/activity` | Notifications & activity log |
| `/settings` | Profile, security, and preferences |

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Auth-protected app shell
│   ├── login/
│   └── page.tsx         # Landing page
├── components/          # Navbar, Sidebar, Modal, ToastProvider
├── contexts/            # AuthContext (JWT state)
├── services/            # API client modules (one per domain)
├── types/               # TypeScript interfaces
└── lib/                 # api-client, errors, utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Next.js 16** — App Router, React 19
- **TypeScript 5**
- **Tailwind CSS 4** — via PostCSS (`postcss.config.mjs`)
- **Motion 12** — scroll and UI animations
- **Lucide React** — dashboard icons

For full architecture, API reference, and test credentials, see the [root README](../readme.md).
