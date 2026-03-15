import { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Demo Mode vs Live Mode Toggle
 * Allows switching between synthetic and real data
 */

const ModeContext = createContext();

export const useModeContext = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useModeContext must be used within ModeProvider');
    }
    return context;
};

export const ModeProvider = ({ children }) => {
    const [isLiveMode, setIsLiveMode] = useState(false);

    return (
        <ModeContext.Provider value={{ isLiveMode, setIsLiveMode }}>
            {children}
        </ModeContext.Provider>
    );
};

const ModeToggle = () => {
    const { isLiveMode, setIsLiveMode } = useModeContext();

    return (
        <div className="glass-strong rounded-lg p-1 inline-flex items-center gap-2">
            <motion.button
                onClick={() => setIsLiveMode(false)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${!isLiveMode
                        ? 'bg-cyber-500 text-dark-950 shadow-glow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                whileTap={{ scale: 0.95 }}
            >
                Demo Mode
            </motion.button>
            <motion.button
                onClick={() => setIsLiveMode(true)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${isLiveMode
                        ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                whileTap={{ scale: 0.95 }}
            >
                Live Mode
            </motion.button>
        </div>
    );
};

export default ModeToggle;
