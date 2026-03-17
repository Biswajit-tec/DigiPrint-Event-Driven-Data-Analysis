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
                    <p className="text-muted-foreground">Our commitment to data protection and ethical practices</p>
                </div>

                <div className="space-y-6">
                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🔒 Data Privacy Principles</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                DigiPrint is built with <strong>privacy-first</strong> principles. All event data is handled
                                with the utmost care and follows industry best practices.
                            </p>

                            <div>
                                <h3 className="font-semibold text-foreground mb-2">What We Collect:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Event type (login, click, search, etc.)</li>
                                    <li>Timestamp of events</li>
                                    <li>Session and Site identifiers (UUIDs)</li>
                                    <li>Anonymized browser and device metadata</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-foreground mb-2">What We DON'T Collect:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cleartext IP addresses</li>
                                    <li>Personal identifiable information (PII)</li>
                                    <li>Passwords or authentication tokens</li>
                                    <li>Financial or payment data</li>
                                </ul>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">✅ Security & Isolation</h2>
                        <div className="space-y-3 text-muted-foreground">
                            <p>
                                Data isolation is enforced at the database level via <strong>Row Level Security (RLS)</strong>.
                            </p>
                            <p>
                                <strong>Isolation Models:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><span className="text-green-400">User Isolation:</span> Verified users can only access events from their own registered sites.</li>
                                <li><span className="text-cyan-400">Site Isolation:</span> Tracking is scoped strictly to the site's unique identifier.</li>
                                <li><span className="text-red-400">Anonymous Access:</span> Restricted strictly to directed event insertion.</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🟢 operational Mode</h2>
                        <div className="space-y-3 text-muted-foreground">
                            <p>
                                This platform operates in a <strong>Live Database Mode</strong> powered by Supabase:
                            </p>
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mt-4">
                                <h4 className="font-semibold text-green-400 mb-2">Supabase Managed Backend</h4>
                                <p className="text-sm">
                                    All data is stored in a secure, encrypted PostgreSQL database. Access is controlled via JWT-based authentication and database-level policies.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🎓 Academic Context</h2>
                        <div className="space-y-3 text-muted-foreground">
                            <p>
                                This project is designed for <strong>educational and portfolio purposes</strong> to demonstrate:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Database Management Systems (DBMS) concepts</li>
                                <li>Cloud-native architecture patterns (Supabase)</li>
                                <li>Real-time data processing</li>
                                <li>Full-stack development skills</li>
                                <li>Privacy-conscious design</li>
                            </ul>
                            <p className="mt-4">
                                <strong>No production user data</strong> is used. All demonstrations use synthetic or non-PII data sets.
                            </p>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-4">🛡️ Security Measures</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Database connections use <strong>SSL/TLS encryption</strong></li>
                                <li>Supabase <strong>Auth & RLS</strong> provides enterprise-grade access control</li>
                                <li>SQL queries are <strong>parameterized/managed</strong> by the Supabase client</li>
                                <li>Public analytical views expose only <strong>aggregated/anonymized</strong> metrics</li>
                            </ul>
                        </div>
                    </GlassCard>

                    <div className="mt-12 p-6 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/5 rounded-xl text-center">
                        <p className="text-muted-foreground mb-4">
                            Questions or concerns about data privacy?
                        </p>
                        <p className="text-sm text-muted-foreground">
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
