import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import EventLifecycle from '../components/ui/EventLifecycle';

const CaseStudy = () => {
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
                    <h1 className="text-4xl font-bold mb-2">Case Study & Documentation</h1>
                    <p className="text-muted-foreground">Technical approach, architecture, and design decisions</p>
                </div>

                <div className="space-y-8">
                    {/* Project Overview */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">📊 Project Overview</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p className="text-lg">
                                <strong>DigiPrint</strong> is an event-driven digital footprint intelligence platform that demonstrates
                                advanced database management concepts paired with a modern, real-time analytics interface.
                            </p>

                            <div className="my-6">
                                <EventLifecycle currentStage={4} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">🎯 Core Objectives</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Multi-site event tracking</li>
                                        <li>High-granularity Row Level Security</li>
                                        <li>Real-time database-driven updates</li>
                                        <li>Premium cyber-intelligence UI</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">💡 Key Features</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Supabase Realtime event streaming</li>
                                        <li>SQL-based analytical views</li>
                                        <li>Multi-tenant site isolation</li>
                                        <li>Dynamic tracking script generator</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Database Design */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-6">🗄️ Database Design</h2>

                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">ER Diagram & Cardinalities</h3>
                                <div className="bg-card p-6 rounded-lg font-mono text-sm overflow-x-auto">
                                    <pre className="text-muted-foreground">
                                        {`┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    SITES    │       │   SESSIONS   │       │   EVENTS    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)      │───┐   │ id (PK)     │
│ user_id (FK)│   └──<│ site_id (FK) │   └──<│ session_id  │
│ site_name   │  1:N  │ start_time   │  1:N  │ site_id (FK)│
│ domain      │       │ device_info  │       │ event_type  │
│ created_at  │       │ duration     │       │ metadata    │
└─────────────┘       └──────────────┘       └─────────────┘

Cardinalities:
• One USER (Auth) can manage MANY SITES (1:N)
• One SITE can have MANY SESSIONS (1:N)
• One SESSION can have MANY EVENTS (1:N)
• Each EVENT belongs to ONE SESSION and ONE SITE`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">ER → Relational Mapping</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/20">
                                                <th className="text-left py-2 px-3 text-muted-foreground">Entity/Relationship</th>
                                                <th className="text-left py-2 px-3 text-muted-foreground">Relational Implementation</th>
                                                <th className="text-left py-2 px-3 text-muted-foreground">Keys</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border">
                                                <td className="py-2 px-3">Sites Entity</td>
                                                <td className="py-2 px-3 font-mono text-primary">sites</td>
                                                <td className="py-2 px-3">PK: id (UUID), FK: user_id → auth.users</td>
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="py-2 px-3">Sessions Entity</td>
                                                <td className="py-2 px-3 font-mono text-primary">sessions</td>
                                                <td className="py-2 px-3">PK: id (UUID), FK: site_id → sites(id)</td>
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="py-2 px-3">Events Entity</td>
                                                <td className="py-2 px-3 font-mono text-primary">events</td>
                                                <td className="py-2 px-3">PK: id (UUID), FKs: site_id, session_id</td>
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="py-2 px-3">Owns (User-Site)</td>
                                                <td className="py-2 px-3">RLS policy using auth.uid()</td>
                                                <td className="py-2 px-3">1:N relationship</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-3">Captures (Site-Event)</td>
                                                <td className="py-2 px-3">Foreign keys + indexed site_id</td>
                                                <td className="py-2 px-3">1:N relationship</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">3NF Compliance</h3>
                                <p className="mb-3">The schema satisfies Third Normal Form (3NF):</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>1NF:</strong> Atomic values in all columns (JSONB used for polymorphic metadata)</li>
                                    <li><strong>2NF:</strong> All non-key attributes fully functionally dependent on PK</li>
                                    <li><strong>3NF:</strong> No transitive dependencies between non-key attributes</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Indexing Strategy */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">⚡ Performance & Indexing</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Optimized B-tree indexes for time-series and filtered lookups:
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-2 px-3 text-muted-foreground">Index</th>
                                            <th className="text-left py-2 px-3 text-muted-foreground">Purpose</th>
                                            <th className="text-left py-2 px-3 text-muted-foreground">Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-xs">
                                        <tr className="border-b border-border">
                                            <td className="py-2 px-3 text-primary">idx_events_site_time</td>
                                            <td className="py-2 px-3">Composite index for site-filtered history</td>
                                            <td className="py-2 px-3 text-green-400">High concurrency speedup</td>
                                        </tr>
                                        <tr className="border-b border-border">
                                            <td className="py-2 px-3 text-primary">idx_events_type</td>
                                            <td className="py-2 px-3">Filtering by specific event categories</td>
                                            <td className="py-2 px-3 text-green-400">O(log n) performance</td>
                                        </tr>
                                        <tr className="border-b border-border">
                                            <td className="py-2 px-3 text-primary">idx_sessions_site</td>
                                            <td className="py-2 px-3">Relational join performance</td>
                                            <td className="py-2 px-3 text-green-400">Join optimization</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Tech Stack */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🛠️ Technology Stack</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-semibold text-primary mb-2">Database Layer</h4>
                                <ul className="text-sm space-y-1">
                                    <li>PostgreSQL (Managed)</li>
                                    <li>Complex SQL Views</li>
                                    <li>JSONB/Polymorphism</li>
                                    <li>B-tree Indexes</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-secondary-foreground mb-2">Supabase Services</h4>
                                <ul className="text-sm space-y-1">
                                    <li>Auth (JWT/RLS)</li>
                                    <li>Realtime (WAL-based)</li>
                                    <li>PostgREST (Auto-API)</li>
                                    <li>GoTrue (Auth engine)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Frontend</h4>
                                <ul className="text-sm space-y-1">
                                    <li>React 18 (Vite)</li>
                                    <li>Tailwind CSS</li>
                                    <li>Framer Motion</li>
                                    <li>ECharts / Recharts</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Challenges & Solutions */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🎯 Key Learnings</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">1. Real-Time Event Broadcasting</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Synchronizing database writes with frontend updates.
                                    <br />
                                    <strong>Solution:</strong> Leveraged Supabase Realtime to broadcast PostgreSQL WAL changes directly to the client.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-foreground mb-2">2. Multi-site Data Isolation</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Ensuring users only see data for sites they own.
                                    <br />
                                    <strong>Solution:</strong> Implemented strict Row Level Security (RLS) policies based on `auth.uid()`.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-foreground mb-2">3. Motion Design Without Overdoing It</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Premium animations without performance degradation.
                                    <br />
                                    <strong>Solution:</strong> Strategic use of Framer Motion with hardware acceleration for smooth data transitions.
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </motion.div>
    );
};

export default CaseStudy;
