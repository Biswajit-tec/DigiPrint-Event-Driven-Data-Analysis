import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';

const ArchitectureViz = () => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-8"
        >
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">System Architecture</h1>
                    <p className="text-muted-foreground">Event-driven architecture visualization</p>
                </div>

                <GlassCard className="mb-6">
                    <h2 className="text-2xl font-semibold mb-6">Architecture Overview</h2>
                    <div className="bg-card p-6 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre className="text-muted-foreground">{`
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   React     │  │  Tailwind    │  │  Framer Motion      │   │
│  │   Router    │  │    CSS       │  │   Animations        │   │
│  └──────┬──────┘  └──────────────┘  └─────────────────────┘   │
└─────────┼───────────────────────────────────────────────────────┘
          │
          │ HTTPS + WebSocket (PostgreSQL Realtime)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE PLATFORM                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   Supabase Auth  │  │ Supabase Storage │  │ Supabase Edge  │  │
│  │  - User Mgmt     │  │  - Static Assets │  │    Functions   │  │
│  │  - RLS Policies  │  │                  │  │ (Conceptual)   │  │
│  └────────┬─────────┘  └──────────────────┘  └────────┬───────┘  │
└───────────┼───────────────────────────────────────────┼──────────┘
            │                                           │
            ▼                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    Tables    │  │   Triggers   │  │     Views            │  │
│  │  - sites     │  │  - Timestamp │  │  - v_events_over_time│  │
│  │  - sessions  │  │    tracking  │  │  - v_event_dist      │  │
│  │  - events    │  │              │  │  - v_top_pages       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌────────────────────────────────────────┐  │
│  │   Indexes    │  │       Row Level Security (RLS)         │  │
│  │  - site_id   │  │  - user_id isolation                   │  │
│  │  - timestamp │  │  - Anonymous tracker insertion         │  │
│  └──────────────┘  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   REAL-TIME LAYER (Realtime)                     │
│   Supabase Realtime ◄──────► PostgreSQL WAL ◄──────► Clients    │
│   Database changes broadcast instantly via WebSocket              │
└─────────────────────────────────────────────────────────────────┘
`}</pre>
                    </div>
                </GlassCard>

                <div className="grid md:grid-cols-2 gap-6">
                    <GlassCard>
                        <h3 className="text-xl font-semibold mb-4">Key Components</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Supabase Client:</strong> Direct interaction from frontend to backend services</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Real-time Channels:</strong> Listening for insert/update events on PostgreSQL tables</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Row Level Security:</strong> High-granularity access control at the database level</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Analytical Views:</strong> Complex SQL aggregations exposed as queryable relations</span>
                            </li>
                        </ul>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-xl font-semibold mb-4">Data Flow</h3>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>Tracker script sends event data to Supabase</li>
                            <li>Supabase Auth verifies session/origin context</li>
                            <li>PostgreSQL stores event and triggers Realtime broadcast</li>
                            <li>Client-side Supabase SDK receives WAL update</li>
                            <li>UI state updates reactively with Framer Motion</li>
                            <li>Analytics dashboards query optimized SQL views</li>
                        </ol>
                    </GlassCard>
                </div>
            </div>
        </motion.div>
    );
};

export default ArchitectureViz;