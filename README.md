# DigiPrint - Event-Driven Digital Footprint Intelligence Platform

A full-stack, event-driven web application showcasing real-time digital footprint analytics with strong emphasis on database management concepts and premium cyber-intelligence UI design.

## 🎯 Features

- **Event-Driven Architecture**: Real-time event ingestion and broadcasting via Socket.IO
- **Advanced DBMS**: PostgreSQL with triggers, views, stored procedures, and optimized indexes
- **Real-Time Analytics**: Live dashboards with anomaly detection and risk scoring
- **Premium UI**: Cyber-intelligence design with glassmorphism, parallax effects, and Framer Motion animations
- **Academic-Ready**: Complete ER diagrams, schema mappings, and performance documentation

## 🏗️ Architecture

```
├── database/          # PostgreSQL schema, triggers, views, procedures, indexes
├── backend/           # Node.js + Express + Socket.IO API
├── src/               # React frontend with Tailwind + Framer Motion
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── services/      # API & Socket.IO services
│   └── utils/         # Animations, mock data, helpers
└── docs/              # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon or Supabase recommended)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)

2. Run the schema files in order:
```bash
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/triggers.sql
psql $DATABASE_URL -f database/views.sql
psql $DATABASE_URL -f database/procedures.sql
psql $DATABASE_URL -f database/indexes.sql
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your DATABASE_URL
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📊 Database Schema

### Tables
- **users**: User information with consent tracking
- **sessions**: User sessions with device metadata
- **events**: Time-series event storage (7 event types)

### Event Types
- `login`, `click`, `search`, `api_call`, `session_start`, `session_end`, `page_view`

### Views & Analytics
- Event frequency analysis
- Peak activity detection
- User behavior summaries
- Z-score anomaly detection
- Risk scoring (low/medium/high)

## 🎨 Design System

### Color Palette
- Primary: Cyber Cyan (#00bfff)
- Secondary: Muted Purple (#8b5cf6)
- Background: Dark (#020617)

### Motion Design
8-category animation system with accessibility support:
- Page transitions, section reveals, staggered animations
- Real-time event updates, hover effects, parallax scrolling
- Data-driven count-up animations
- Full `prefers-reduced-motion` support

## 📡 API Endpoints

### Events
- `POST /api/events` - Ingest event
- `POST /api/events/session` - Create session
- `GET /api/events/stream` - Recent events
- `GET /api/events/replay` - Time-range replay

### Analytics
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/frequency` - Event frequency
- `GET /api/analytics/anomalies` - Anomaly detection
- `GET /api/analytics/risk-scores` - Risk scoring

### Query Playground
- `GET /api/queries/predefined` - List safe queries
- `POST /api/queries/execute` - Execute query

## 🔒 Privacy & Safety

- Synthetic/consent-based data only
- IP hashing (no raw IPs stored)
- Consent status tracking
- Read-only SQL playground (whitelisted queries)

## 📚 Documentation

- Database: See `/database/schema_mapping.md` for ER diagrams and normalization docs
- Performance: Indexing strategy and optimization guidelines
- API: Comprehensive route documentation in code

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL (pg driver)
- Socket.IO

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios + Socket.IO Client

## 📖 Academic Context

Built as a demonstration of:
- Database Management Systems (3NF, triggers, views, procedures, indexes)
- Event-driven architecture
- Real-time data processing
- Full-stack development
- UI/UX design principles

## 📄 License

MIT - Academic/Portfolio Use

## 👤 Author

Biswajit Sahu - Full-Stack MERN Developer

---

**Built with PostgreSQL · Node.js · React · Event-Driven Architecture**
