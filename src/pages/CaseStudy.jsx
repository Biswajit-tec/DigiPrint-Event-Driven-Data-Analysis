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
                    <p className="text-gray-400">Technical approach, architecture, and design decisions</p>
                </div>

                <div className="space-y-8">
                    {/* Project Overview */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">📊 Project Overview</h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="text-lg">
                                <strong>DigiPrint</strong> is an event-driven digital footprint intelligence platform that demonstrates
                                advanced database management concepts paired with a modern, real-time analytics interface.
                            </p>

                            <div className="my-6">
                                <EventLifecycle currentStage={4} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <h4 className="font-semibold text-white mb-2">🎯 Core Objectives</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Demonstrate 3NF database design</li>
                                        <li>Implement triggers, views, stored procedures</li>
                                        <li>Real-time event-driven architecture</li>
                                        <li>Premium cyber-intelligence UI</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-2">💡 Key Features</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Socket.IO powered real-time updates</li>
                                        <li>Z-score based anomaly detection</li>
                                        <li>Risk scoring (low/medium/high)</li>
                                        <li>Safe SQL query playground</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Database Design */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-6">🗄️ Database Design</h2>

                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">ER Diagram & Cardinalities</h3>
                                <div className="bg-dark-900 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                                    <pre className="text-gray-300">
                                        {`┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   USERS     │       │   SESSIONS   │       │   EVENTS    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)      │───┐   │ id (PK)     │
│ username    │   │   │ user_id (FK) │   │   │ session_id  │
│ email       │   └──<│ start_time   │   └──<│ event_type  │
│ created_at  │  1:N  │ end_time     │  1:N  │ timestamp   │
│ ip_hash     │       │ device_info  │       │ metadata    │
│ consent     │       │ duration     │       │ created_at  │
└─────────────┘       └──────────────┘       └─────────────┘

Cardinalities:
• One USER can have MANY SESSIONS (1:N)
• One SESSION can have MANY EVENTS (1:N)
• Each EVENT belongs to ONE SESSION
• Each SESSION belongs to ONE USER`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">ER → Relational Mapping</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/20">
                                                <th className="text-left py-2 px-3 text-gray-400">Entity/Relationship</th>
                                                <th className="text-left py-2 px-3 text-gray-400">Relational Implementation</th>
                                                <th className="text-left py-2 px-3 text-gray-400">Keys</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Users Entity</td>
                                                <td className="py-2 px-3 font-mono text-cyber-400">users</td>
                                                <td className="py-2 px-3">PK: id (SERIAL)</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Sessions Entity</td>
                                                <td className="py-2 px-3 font-mono text-cyber-400">sessions</td>
                                                <td className="py-2 px-3">PK: id (UUID), FK: user_id → users(id)</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Events Entity</td>
                                                <td className="py-2 px-3 font-mono text-cyber-400">events</td>
                                                <td className="py-2 px-3">PK: id (BIGSERIAL), FK: session_id → sessions(id)</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Creates (User-Session)</td>
                                                <td className="py-2 px-3">Foreign key in sessions table</td>
                                                <td className="py-2 px-3">1:N relationship</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-3">Contains (Session-Event)</td>
                                                <td className="py-2 px-3">Foreign key in events table</td>
                                                <td className="py-2 px-3">1:N relationship</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">3NF Compliance</h3>
                                <p className="mb-3">The schema satisfies Third Normal Form (3NF):</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>1NF:</strong> All attributes contain atomic values (no multi-valued attributes)</li>
                                    <li><strong>2NF:</strong> No partial dependencies (all non-key attributes depend on the entire primary key)</li>
                                    <li><strong>3NF:</strong> No transitive dependencies (non-key attributes depend only on the primary key)</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-400 mb-2">❓ Metadata Design Justification</h4>
                                <p className="text-sm mb-2">
                                    <strong>Question:</strong> Why is metadata stored as JSON instead of normalized tables?
                                </p>
                                <p className="text-sm">
                                    <strong>Answer:</strong> Event metadata is <strong>polymorphic</strong> (varies by event type).
                                    Normalizing this would require 7+ separate tables (one per event type) or a complex EAV pattern.
                                    JSON storage provides:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                                    <li>Flexibility for evolving event schemas</li>
                                    <li>Reduced join complexity</li>
                                    <li>PostgreSQL JSONB indexing & querying capabilities</li>
                                    <li>Trade-off: Accept minor denormalization for practical flexibility</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Indexing Strategy */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">⚡ Performance & Indexing</h2>

                        <div className="space-y-4 text-gray-300">
                            <p>
                                Strategic indexes improve query performance for time-series analytics:
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-2 px-3 text-gray-400">Index</th>
                                            <th className="text-left py-2 px-3 text-gray-400">Purpose</th>
                                            <th className="text-left py-2 px-3 text-gray-400">Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-xs">
                                        <tr className="border-b border-white/10">
                                            <td className="py-2 px-3 text-cyber-400">events(timestamp)</td>
                                            <td className="py-2 px-3">Time-range queries</td>
                                            <td className="py-2 px-3 text-green-400">O(log n) vs O(n)</td>
                                        </tr>
                                        <tr className="border-b border-white/10">
                                            <td className="py-2 px-3 text-cyber-400">events(session_id, timestamp)</td>
                                            <td className="py-2 px-3">Session timeline queries</td>
                                            <td className="py-2 px-3 text-green-400">Composite speedup</td>
                                        </tr>
                                        <tr className="border-b border-white/10">
                                            <td className="py-2 px-3 text-cyber-400">events(event_type)</td>
                                            <td className="py-2 px-3">Event type filtering</td>
                                            <td className="py-2 px-3 text-green-400">Category queries</td>
                                        </tr>
                                        <tr className="border-b border-white/10">
                                            <td className="py-2 px-3 text-cyber-400">sessions(user_id)</td>
                                            <td className="py-2 px-3">User session lookup</td>
                                            <td className="py-2 px-3 text-green-400">Join optimization</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-3 text-purple-400">Partial: recent events</td>
                                            <td className="py-2 px-3">30-day hot data</td>
                                            <td className="py-2 px-3 text-green-400">Reduced index size</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Pagination Strategy</h4>
                                <p className="text-sm">
                                    Time-series queries use <code className="bg-dark-800 px-2 py-1 rounded text-cyber-400">LIMIT</code> and{' '}
                                    <code className="bg-dark-800 px-2 py-1 rounded text-cyber-400">OFFSET</code> with timestamp-based cursor pagination
                                    for efficient large dataset retrieval.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* ML Scope */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🤖 Machine Learning Scope</h2>

                        <div className="space-y-3 text-gray-300">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-sm">
                                    <strong>Important:</strong> Machine learning is an <strong>optional, asynchronous analysis layer</strong> used
                                    only for anomaly detection. The core system functions <strong>fully using SQL-based analytics</strong>.
                                </p>
                            </div>

                            <p>
                                Current implementation uses <strong>statistical z-score analysis</strong> (SQL-based) for anomaly detection:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                                <li>Calculate mean and standard deviation of event counts per session</li>
                                <li>Sessions with z-score {'>'} 2.0 flagged as anomalous</li>
                                <li>No external ML dependencies required</li>
                                <li>Can be extended with Python sklearn for more advanced detection</li>
                            </ul>
                        </div>
                    </GlassCard>

                    {/* Query Safety */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🔒 Query Playground Safety</h2>

                        <div className="space-y-3 text-gray-300">
                            <p>The SQL Query Playground implements strict safety measures:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Whitelisted queries only:</strong> 8 predefined analytical queries</li>
                                <li><strong>Read-only enforcement:</strong> Only SELECT statements permitted</li>
                                <li><strong>No DDL/DML:</strong> DROP, DELETE, UPDATE, INSERT blocked</li>
                                <li><strong>Query validation:</strong> Server-side validation before execution</li>
                                <li><strong>Error handling:</strong> Errors don't expose schema details</li>
                            </ul>
                        </div>
                    </GlassCard>

                    {/* Tech Stack */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🛠️ Technology Stack</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-semibold text-cyber-400 mb-2">Database Layer</h4>
                                <ul className="text-sm space-y-1">
                                    <li>PostgreSQL 15+</li>
                                    <li>Triggers & Views</li>
                                    <li>Stored Procedures</li>
                                    <li>B-tree Indexes</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Backend</h4>
                                <ul className="text-sm space-y-1">
                                    <li>Node.js + Express</li>
                                    <li>Socket.IO</li>
                                    <li>pg (PostgreSQL driver)</li>
                                    <li>CORS & Security</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Frontend</h4>
                                <ul className="text-sm space-y-1">
                                    <li>React 18 + Vite</li>
                                    <li>Tailwind CSS</li>
                                    <li>Framer Motion</li>
                                    <li>Recharts</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Challenges & Solutions */}
                    <GlassCard>
                        <h2 className="text-3xl font-semibold mb-4">🎯 Key Learnings</h2>

                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h4 className="font-semibold text-white mb-2">1. Real-Time Event Broadcasting</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Synchronizing database writes with Socket.IO broadcasts.
                                    <br />
                                    <strong>Solution:</strong> Event service emits Socket.IO events immediately after successful DB insertion.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">2. Anomaly Detection at Scale</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Efficient statistical analysis on large datasets.
                                    <br />
                                    <strong>Solution:</strong> PostgreSQL view with window functions for z-score calculation.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">3. Motion Design Without Overdoing It</h4>
                                <p className="text-sm">
                                    <strong>Challenge:</strong> Premium animations without performance degradation or accessibility issues.
                                    <br />
                                    <strong>Solution:</strong> Framer Motion with GPU acceleration, reduced motion support, and strategic animation budgets.
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
