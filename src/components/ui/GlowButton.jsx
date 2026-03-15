import { motion } from 'framer-motion';

/**
 * Glow Button Component
 * Variants: primary (cyan), secondary (purple), glass, danger
 */
const GlowButton = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'bg-cyber-500 text-dark-950 hover:bg-cyber-400 hover:shadow-glow',
        secondary: 'bg-purple-500 text-white hover:bg-purple-400 hover:shadow-glow-purple',
        glass: 'glass hover:bg-white/10 hover:border-white/30 text-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
    };

    const baseClasses = `font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`;

    return (
        <motion.button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default GlowButton;
