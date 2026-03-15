import { motion } from 'framer-motion';

/**
 * Event Card Component with Slide-In Animation
 * Used for event stream displays
 */
const EventCard = ({
    event,
    index = 0
}) => {
    const eventTypeColors = {
        login: 'bg-green-500/20 text-green-400 border-green-500/30',
        click: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        search: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        api_call: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        session_start: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        session_end: 'bg-red-500/20 text-red-400 border-red-500/30',
        page_view: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    };

    const colorClass = eventTypeColors[event.event_type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <motion.div
            className="glass rounded-lg p-4 border-l-4 border-cyber-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                            {event.event_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-500 text-xs">{formatTime(event.timestamp)}</span>
                    </div>

                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-sm text-gray-400">
                            <pre className="font-mono text-xs bg-dark-900/50 p-2 rounded overflow-auto">
                                {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="text-right text-xs text-gray-500">
                    <div>ID: {event.id?.toString().slice(0, 8)}...</div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
