import { motion } from 'framer-motion';

/**
 * Glassmorphism Card Component
 * Variants: default, elevated, glow
 */
const GlassCard = ({
    children,
    variant = 'default',
    className = '',
    hover = false,
    ...props
}) => {
    const variants = {
        default: 'glass',
        elevated: 'glass-strong',
        subtle: 'glass-subtle',
    };

    const baseClasses = `${variants[variant]} rounded-xl p-6 transition-all duration-300`;
    const hoverClasses = hover ? 'hover:bg-white/8 hover:-translate-y-1 hover:shadow-glass cursor-pointer' : '';

    return (
        <motion.div
            className={`${baseClasses} ${hoverClasses} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? { scale: 1.02 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
