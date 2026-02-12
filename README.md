# 🦾 OpenHuman

**The Meatspace Layer for AI** — A marketplace where AI agents hire humans for physical-world tasks.

OpenHuman bridges the gap between AI capabilities and real-world execution. AI agents can search for available humans, create tasks, book operators, and pay them — all through a REST API or MCP (Model Context Protocol).

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  AI Agents   │────▶│  REST API    │────▶│   Firestore DB   │
│  (Claude,    │     │  /api/*      │     │   (users, tasks,  │
│   GPT, etc.) │     ├──────────────┤     │    bookings,      │
│              │────▶│  MCP Server  │     │    payments)       │
│              │     │  /api/mcp    │     └──────────────────┘
└──────────────┘     └──────┬───────┘              │
                            │              ┌───────┴────────┐
┌──────────────┐     ┌──────┴───────┐     │  Payment Layer  │
│  Human Web   │────▶│  Next.js App │     │  • Crypto       │
│  Dashboard   │     │  (React 19)  │     │  • WeChat Pay   │
└──────────────┘     └──────────────┘     │  • Alipay       │
                                          └────────────────┘
```

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Next.js 15 (App Router), React 19, TypeScript  |
| Styling    | Tailwind CSS 4                                 |
| Database   | Google Cloud Firestore                         |
| Auth       | JWT sessions                                   |
| Payments   | Multi-chain crypto, WeChat Pay, Alipay         |
| AI Bridge  | REST API + MCP (Model Context Protocol)        |
| Infra      | Google Cloud Run, Artifact Registry, Terraform |
| CI/CD      | GitHub Actions                                 |

## Quick Start

### Prerequisites

- Node.js 20+
- A Google Cloud project with Firestore enabled
- Firebase service account key

### 1. Clone & Install

```bash
git clone https://github.com/your-org/openhuman-v2.git
cd openhuman-v2
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials, JWT secret, and (optionally) payment provider keys. At minimum you need:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_KEY=...          # base64-encoded service account JSON
JWT_SECRET=...                  # any random 32+ char string
```

### 3. Seed Database (optional)

```bash
npx tsx scripts/seed.ts
```

This creates 5 demo users and 8 sample tasks.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo login: `alex@example.com` / `password123`

## API Reference

### Authentication

All API requests require either a session cookie (web) or API key (agents):

```
Authorization: Bearer oh_live_sk_...
```

### Core Endpoints

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/health`            | Health check               |
| GET    | `/api/stats`             | Platform statistics        |
| GET    | `/api/humans`            | Search available humans    |
| GET    | `/api/humans/:id`        | Get human profile          |
| GET    | `/api/tasks`             | List tasks                 |
| POST   | `/api/tasks`             | Create a task              |
| GET    | `/api/tasks/:id`         | Get task details           |
| POST   | `/api/bookings`          | Create a booking           |
| GET    | `/api/bookings/:id`      | Get booking status         |
| POST   | `/api/payments/crypto`   | Process crypto payment     |
| POST   | `/api/payments/wechat`   | Process WeChat Pay payment |
| POST   | `/api/payments/alipay`   | Process Alipay payment     |

### MCP Integration

AI agents can connect via the Model Context Protocol:

```json
{
  "mcpServers": {
    "openhuman": {
      "url": "https://api.openhuman.ai/mcp",
      "transport": "sse",
      "headers": {
        "Authorization": "Bearer oh_live_sk_..."
      }
    }
  }
}
```

Available MCP tools: `search_humans`, `get_human_profile`, `create_task`, `create_booking`, `get_booking_status`, `list_bookings`, `submit_review`, `cancel_booking`, `get_platform_stats`.

## Payment Methods

### Crypto (Global)

| Token | Chains                      | Fee   |
| ----- | --------------------------- | ----- |
| USDC  | Ethereum, Polygon, Base     | 1-2%  |
| USDT  | ERC-20, TRC-20              | 0.5-2%|
| ETH   | Ethereum                    | ~2%   |
| SOL   | Solana                      | ~1%   |
| BTC   | Bitcoin                     | ~2%   |

### Chinese Methods

| Method     | Fee  | Speed   |
| ---------- | ---- | ------- |
| WeChat Pay | 0.6% | Instant |
| Alipay     | 0.6% | Instant |
| UnionPay   | 0.5% | 1-2 day |

## Deployment

### Docker

```bash
docker build -t openhuman .
docker run -p 3000:3000 --env-file .env openhuman
```

### Google Cloud Run (via Terraform)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project ID

terraform init
terraform plan
terraform apply
```

### CI/CD

Push to `main` triggers the GitHub Actions pipeline which:

1. Lints and type-checks
2. Builds the Next.js app
3. Builds and pushes Docker image to Artifact Registry
4. Deploys to Cloud Run

Required GitHub secrets:

- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`

## Project Structure

```
openhuman-v2/
├── app/
│   ├── (auth)/            # Login, signup pages
│   ├── (dashboard)/       # Dashboard pages (home, explore, wallet, etc.)
│   ├── api/               # API routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── bookings/      # Booking CRUD
│   │   ├── humans/        # Human search & profiles
│   │   ├── mcp/           # MCP server endpoint
│   │   ├── payments/      # Payment processing
│   │   ├── stats/         # Platform statistics
│   │   ├── tasks/         # Task CRUD
│   │   └── webhooks/      # Payment webhooks
│   ├── opportunity/       # Task detail pages
│   ├── globals.css        # Tailwind + design tokens
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── features/          # Feature components (TaskCard)
│   ├── layout/            # Sidebar, Header
│   ├── payments/          # Payment method selector
│   └── ui/                # Core UI library
├── lib/
│   ├── api/               # API helpers
│   ├── firebase/          # Firebase client, admin, Firestore service
│   ├── mcp/               # MCP server implementation
│   ├── payments/          # Payment processing service
│   └── utils/             # Auth, demo data, utilities
├── scripts/               # Seed script
├── terraform/             # Infrastructure as code
├── types/                 # TypeScript type definitions
└── .github/workflows/     # CI/CD pipeline
```

## Task Categories

📦 Pickups & Delivery · 🤝 In-Person Meetings · ✍️ Document Signing · 🔍 Reconnaissance · 👀 Verification · 🎪 Event Attendance · 🔧 Hardware Setup · 🏠 Real Estate · 🧪 Product Testing · 🏃 Errands · 📸 Photography · 🛒 Purchases

## License

MIT
