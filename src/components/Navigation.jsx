import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ModeToggle from './ui/ModeToggle';

const Navigation = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/live-stream', label: 'Live Stream' },
        { path: '/analytics', label: 'Analytics' },
        { path: '/anomalies', label: 'Anomalies' },
        { path: '/query-playground', label: 'SQL Playground' },
        { path: '/architecture', label: 'Architecture' },
        { path: '/case-study', label: 'Case Study' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyber-500 rounded-lg flex items-center justify-center">
                            <span className="text-dark-950 font-bold text-xl">D</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyber-400 to-purple-400 bg-clip-text text-transparent">
                            DigiPrint
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                            ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.label}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Mode Toggle */}
                    <div className="hidden md:block">
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        className="md:hidden mt-4 pb-4 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                            >
                                <div
                                    className={`px-4 py-3 rounded-lg text-sm font-medium ${isActive(item.path)
                                            ? 'bg-cyber-500/20 text-cyber-400'
                                            : 'text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10">
                            <ModeToggle />
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
