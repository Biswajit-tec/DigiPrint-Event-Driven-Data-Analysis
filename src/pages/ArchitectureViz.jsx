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
          │ HTTP + WebSocket
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Express.js Server                           │   │
│  │    ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │    │  Event   │  │Analytics │  │  Query           │    │   │
│  │    │  Routes  │  │  Routes  │  │  Routes          │    │   │
│  │    └────┬─────┘  └────┬─────┘  └────┬─────────────┘    │   │
│  └─────────┼─────────────┼─────────────┼──────────────────┘   │
└────────────┼─────────────┼─────────────┼──────────────────────┘
             │             │             │
             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌──────────────────┐  ┌────────────────────────────────────┐  │
│  │  Event Service   │  │     Analytics Service              │  │
│  │  - Ingest events │  │  - Dashboard summaries             │  │
│  │  - Broadcast via │  │  - Peak time analysis              │  │
│  │    Socket.IO     │  │  - Anomaly detection (z-score)     │  │
│  │  - Session mgmt  │  │  - Risk scoring                    │  │
│  └────────┬─────────┘  └──────────┬─────────────────────────┘  │
└───────────┼────────────────────────┼─────────────────────────────┘
            │                        │
            │  PostgreSQL Driver (pg)│
            ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    Tables    │  │   Triggers   │  │     Views            │  │
│  │  - users     │  │  - Auto-end  │  │  - v_event_frequency │  │
│  │  - sessions  │  │    sessions  │  │  - v_peak_activity   │  │
│  │  - events    │  │  - Validate  │  │  - v_anomalies       │  │
│  │              │  │    events    │  │  - v_risk_scores     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌────────────────────────────────────────┐  │
│  │   Indexes    │  │    Stored Procedures                   │  │
│  │  - timestamp │  │  - get_user_analytics(user_id)         │  │
│  │  - session   │  │  - get_event_timeline(start, end)      │  │
│  │  - type      │  │  - detect_anomalies(threshold)         │  │
│  └──────────────┘  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   REAL-TIME LAYER (Socket.IO)                    │
│   Client ◄──────► Server ◄──────► Broadcast to all clients     │
│   New events pushed instantly without polling                    │
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
                                <span><strong>Event Ingestion:</strong> POST /api/events with Socket.IO broadcast</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Real-Time Stream:</strong> WebSocket connection for live updates</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Analytics Engine:</strong> SQL views + stored procedures</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">▸</span>
                                <span><strong>Anomaly Detection:</strong> Z-score statistical analysis</span>
                            </li>
                        </ul>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-xl font-semibold mb-4">Data Flow</h3>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>Client sends event to API</li>
                            <li>Event Service validates & stores in DB</li>
                            <li>Database trigger auto-updates session</li>
                            <li>Event Service broadcasts via Socket.IO</li>
                            <li>All connected clients receive update</li>
                            <li>Analytics views refresh on next query</li>
                        </ol>
                    </GlassCard>
                </div>
            </div>
        </motion.div>
    );
};

export default ArchitectureViz;
