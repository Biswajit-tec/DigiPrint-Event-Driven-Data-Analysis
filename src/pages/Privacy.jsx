import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';

const Privacy = () => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-8"
        >
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Privacy & Ethics</h1>
                    <p className="text-gray-400">Our commitment to data protection and ethical practices</p>
                </div>

                <div className="space-y-6">
                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🔒 Data Privacy Principles</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                DigiPrint is built with <strong>privacy-first</strong> principles. All event data is handled
                                with the utmost care and follows industry best practices.
                            </p>

                            <div>
                                <h3 className="font-semibold text-white mb-2">What We Collect:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Event type (login, click, search, etc.)</li>
                                    <li>Timestamp of events</li>
                                    <li>Session identifiers (UUIDs)</li>
                                    <li>Anonymized user metadata</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-2">What We DON'T Collect:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Raw IP addresses (only hashed)</li>
                                    <li>Personal identifiable information (PII)</li>
                                    <li>Passwords or authentication tokens</li>
                                    <li>Financial or payment data</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">✅ Consent Management</h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                User consent is tracked at the database level via the <code className="bg-dark-800 px-2 py-1 rounded text-cyber-400">consent_status</code> column.
                            </p>
                            <p>
                                <strong>Consent States:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><span className="text-green-400">Granted:</span> User has explicitly opted in to tracking</li>
                                <li><span className="text-yellow-400">Pending:</span> Awaiting user decision</li>
                                <li><span className="text-red-400">Revoked:</span> User has opted out; data anonymized or deleted</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🧪 Demo vs Live Mode</h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                This platform supports two operational modes:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <h4 className="font-semibold text-blue-400 mb-2">🔵 Demo Mode</h4>
                                    <p className="text-sm">
                                        Uses <strong>synthetic, privacy-safe data</strong> generated locally. No real user information is involved.
                                    </p>
                                </div>
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <h4 className="font-semibold text-green-400 mb-2">🟢 Live Mode</h4>
                                    <p className="text-sm">
                                        Connects to real database with <strong>consent-based tracking</strong>. All users must explicitly opt-in.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🎓 Academic Context</h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                This project is designed for <strong>educational and portfolio purposes</strong> to demonstrate:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Database Management Systems (DBMS) concepts</li>
                                <li>Event-driven architecture patterns</li>
                                <li>Real-time data processing</li>
                                <li>Full-stack development skills</li>
                                <li>Privacy-conscious design</li>
                            </ul>
                            <p className="mt-4">
                                <strong>No production user data</strong> is used. All demonstrations use synthetic or anonymized data sets.
                            </p>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">📜 Data Retention</h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                Event data is retained for analytical purposes with the following policies:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Active events:</strong> Indexed for 30 days (partial index)</li>
                                <li><strong>Historical events:</strong> Archived after 90 days (conceptual archiving strategy documented)</li>
                                <li><strong>User deletion requests:</strong> Immediate anonymization or deletion upon request</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🛡️ Security Measures</h2>
                        <div className="space-y-2 text-gray-300">
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>IP addresses are <strong>hashed using SHA-256</strong> before storage</li>
                                <li>Database connections use <strong>SSL/TLS encryption</strong></li>
                                <li>SQL queries are <strong>parameterized</strong> to prevent injection attacks</li>
                                <li>Query Playground uses <strong>whitelisted, read-only queries</strong> only</li>
                                <li>No arbitrary SQL execution permitted</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <div className="mt-12 p-6 bg-gradient-to-r from-cyber-600/10 via-purple-600/10 to-cyber-600/10 rounded-xl text-center">
                        <p className="text-gray-400 mb-4">
                            Questions or concerns about data privacy?
                        </p>
                        <p className="text-sm text-gray-500">
                            This is a demonstration project. For real-world deployment, consult with legal and compliance teams
                            to ensure GDPR, CCPA, and other regulatory compliance.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Privacy;
