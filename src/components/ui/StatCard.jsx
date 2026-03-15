import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated Statistics Card with Count-Up Effect
 */
const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    delay = 0,
    suffix = '',
    prefix = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const springValue = useSpring(0, { stiffness: 50, damping: 15 });

    useEffect(() => {
        const timeout = setTimeout(() => {
            springValue.set(value);
        }, delay);

        const unsubscribe = springValue.on('change', (latest) => {
            setDisplayValue(Math.floor(latest));
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, [value, delay, springValue]);

    const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400';

    return (
        <motion.div
            className="glass-strong rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay / 1000 }}
            whileHover={{ y: -4 }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white stat-count-up">
                            {prefix}{displayValue.toLocaleString()}{suffix}
                        </h3>
                        {trend !== undefined && trend !== 0 && (
                            <span className={`text-sm font-medium ${trendColor}`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                    </div>
                </div>
                {Icon && (
                    <div className="p-3 bg-cyber-500/10 rounded-lg">
                        <Icon className="w-6 h-6 text-cyber-400" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
