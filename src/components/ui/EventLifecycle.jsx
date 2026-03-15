import { motion } from 'framer-motion';

/**
 * Event Lifecycle Visualization
 * Shows the flow: Ingested → Stored → Analyzed → Visualized
 */
const EventLifecycle = ({ currentStage = 4 }) => {
    const stages = [
        { id: 1, label: 'Ingested', icon: '📥' },
        { id: 2, label: 'Stored', icon: '💾' },
        { id: 3, label: 'Analyzed', icon: '🔍' },
        { id: 4, label: 'Visualized', icon: '📊' },
    ];

    return (
        <div className="flex items-center gap-2">
            {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                    <motion.div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${stage.id <= currentStage
                                ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/50'
                                : 'bg-gray-800 text-gray-500 border border-gray-700'
                            }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <span>{stage.icon}</span>
                        <span>{stage.label}</span>
                    </motion.div>

                    {index < stages.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${stage.id < currentStage ? 'bg-cyber-500' : 'bg-gray-700'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default EventLifecycle;
