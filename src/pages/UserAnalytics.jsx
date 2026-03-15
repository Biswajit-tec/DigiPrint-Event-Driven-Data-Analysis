import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';

const UserAnalytics = () => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-8"
        >
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">User Analytics</h1>
                    <p className="text-gray-400">Per-user behavior analysis and insights</p>
                </div>

                <GlassCard>
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">👤</div>
                        <h3 className="text-2xl font-semibold mb-2">User Analytics</h3>
                        <p className="text-gray-400 mb-4">
                            Individual user behavior tracking, session history, and personalized insights.
                        </p>
                        <p className="text-sm text-gray-500">
                            Coming soon: User selection, session timelines, and behavioral patterns.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default UserAnalytics;
