import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, staggerContainer, staggerItem } from '../utils/animations';
import GlowButton from '../components/ui/GlowButton';
import ParallaxSection from '../components/ui/ParallaxSection';
import EventLifecycle from '../components/ui/EventLifecycle';

const Landing = () => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen"
        >
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-background">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <ParallaxSection intensity={0.8} className="relative z-10">
                    <div className="container mx-auto px-6 py-32">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="max-w-4xl mx-auto text-center"
                        >
                            <motion.div variants={staggerItem} className="mb-6">
                                <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
                                    Event-Driven Intelligence Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={staggerItem}
                                className="text-6xl md:text-7xl font-bold mb-6 text-foreground"
                            >
                                Digital Footprint
                                <br />
                                Analytics
                            </motion.h1>

                            <motion.p
                                variants={staggerItem}
                                className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
                            >
                                Real-time event tracking, advanced database analytics, and intelligent anomaly
                                detection — all in a premium cyber-intelligence interface.
                            </motion.p>

                            <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-4 mb-16">
                                <Link to="/dashboard">
                                    <GlowButton variant="primary" size="lg">
                                        Enter Dashboard
                                    </GlowButton>
                                </Link>
                                <Link to="/case-study">
                                    <GlowButton variant="glass" size="lg">
                                        View Documentation
                                    </GlowButton>
                                </Link>
                            </motion.div>

                            <motion.div variants={staggerItem}>
                                <EventLifecycle currentStage={4} />
                            </motion.div>
                        </motion.div>
                    </div>
                </ParallaxSection>
            </section>

            {/* Features Section */}
            <ParallaxSection intensity={0.6}>
                <section className="py-20 bg-card/50">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4">Core Capabilities</h2>
                            <p className="text-muted-foreground text-lg">Built on PostgreSQL with advanced DBMS concepts</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: '⚡',
                                    title: 'Real-Time Events',
                                    description: 'Socket.IO powered live event streaming with instant analytics updates',
                                },
                                {
                                    icon: '📊',
                                    title: 'Advanced Analytics',
                                    description: 'SQL views, stored procedures, and z-score anomaly detection',
                                },
                                {
                                    icon: '🔒',
                                    title: 'Privacy-First',
                                    description: 'IP hashing, consent tracking, and synthetic data for demos',
                                },
                                {
                                    icon: '🎯',
                                    title: 'Database Triggers',
                                    description: 'Auto-update sessions, validate events, and track user activity',
                                },
                                {
                                    icon: '🔍',
                                    title: 'Query Playground',
                                    description: 'Safe, read-only SQL queries with 8 predefined analytics queries',
                                },
                                {
                                    icon: '📈',
                                    title: 'Risk Scoring',
                                    description: 'Automated risk classification with low/medium/high severity levels',
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-strong rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </ParallaxSection>

            {/* Tech Stack */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Built With</h2>
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {['PostgreSQL', 'Node.js', 'Express', 'Socket.IO', 'React', 'Tailwind CSS', 'Framer Motion'].map(
                                (tech) => (
                                    <span
                                        key={tech}
                                        className="px-6 py-3 glass-strong rounded-lg font-medium hover:bg-white/10 transition-all"
                                    >
                                        {tech}
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-muted/30 border-t border-border">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Dive into the dashboard to see real-time analytics, or explore the SQL playground to
                        understand the database architecture.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/dashboard">
                            <GlowButton variant="primary" size="lg">
                                Open Dashboard
                            </GlowButton>
                        </Link>
                        <Link to="/query-playground">
                            <GlowButton variant="secondary" size="lg">
                                SQL Playground
                            </GlowButton>
                        </Link>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Landing;
