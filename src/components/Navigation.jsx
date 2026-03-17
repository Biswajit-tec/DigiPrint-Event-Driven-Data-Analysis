import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Don't render nav on auth pages
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    if (isAuthPage) return null;

    let user = null;
    let signOut = null;
    try {
        const auth = useAuth();
        user = auth.user;
        signOut = auth.signOut;
    } catch {
        // AuthProvider may not be ready yet
    }

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/live-tracking', label: 'Live Tracking' },
        { path: '/analytics', label: 'Analytics' },
        { path: '/anomalies', label: 'Anomalies' },
        { path: '/query-playground', label: 'SQL Playground' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await signOut?.();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <nav className="sticky top-0 z-50 glass-strong border-b border-border">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">D</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            DigiPrint
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                            ? 'bg-transparent border border-foreground text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.label}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Right: User Info */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground truncate max-w-[180px]" title={user.email}>
                                    {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                        {!user && (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/10"
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
                        className="lg:hidden pb-4 space-y-1"
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
                                            ? 'bg-transparent border border-foreground text-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-border">
                            {user && (
                                <div className="flex items-center justify-between px-4 py-2">
                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                            {!user && (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block mx-4 text-center px-4 py-2 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/50"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
