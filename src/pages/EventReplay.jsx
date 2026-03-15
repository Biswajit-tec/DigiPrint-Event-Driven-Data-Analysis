import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';

const EventReplay = () => {
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
                    <h1 className="text-4xl font-bold mb-2">Event Replay</h1>
                    <p className="text-gray-400">Timeline-based event playback with controls</p>
                </div>

                <GlassCard>
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⏱️</div>
                        <h3 className="text-2xl font-semibold mb-2">Event Replay Mode</h3>
                        <p className="text-gray-400 mb-4">
                            Step through historical events with timeline controls, pause, rewind, and fast-forward.
                        </p>
                        <p className="text-sm text-gray-500">
                            Coming soon: Date range selection, playback speed controls, and event timeline visualization.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default EventReplay;
