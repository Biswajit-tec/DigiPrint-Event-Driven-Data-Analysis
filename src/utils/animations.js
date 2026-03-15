/**
 * Framer Motion Animation Variants & Utilities
 * 8-Category Motion Design System
 */

// 1. PAGE TRANSITIONS (300-400ms, fade + slide)
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

// 2. SECTION REVEAL (400-500ms, viewport-triggered)
export const sectionVariants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// 3. STAGGER ANIMATIONS (50-100ms delay between items)
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// 4. EVENT ENTRY/EXIT (real-time updates, 300ms)
export const eventEntryVariants = {
    initial: {
        opacity: 0,
        x: -20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

// 5. HOVER STATES (150-200ms, lift + glow)
export const hoverLift = {
    rest: {
        y: 0,
        scale: 1,
    },
    hover: {
        y: -4,
        scale: 1.02,
        transition: {
            duration: 0.15,
            ease: 'easeOut',
        },
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1,
        },
    },
};

// 6. PARALLAX CALCULATIONS
export const calculateParallaxOffset = (scrollY, intensity = 0.5) => {
    // intensity: 0.5 = background (slower), 1 = foreground (normal)
    return scrollY * (1 - intensity);
};

// Reduced motion detection
export const shouldReduceMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// 7. COUNT-UP ANIMATION SPRING CONFIG
export const countUpSpring = {
    stiffness: 50,
    damping: 15,
    mass: 1,
};

// 8. REDUCED MOTION VARIANTS
export const getReducedMotionVariants = (normalVariants) => {
    if (shouldReduceMotion()) {
        // Return instant transitions for reduced motion
        return {
            ...normalVariants,
            animate: {
                ...normalVariants.animate,
                transition: { duration: 0.01 },
            },
        };
    }
    return normalVariants;
};

// CHART ANIMATIONS
export const chartVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// MODAL/OVERLAY ANIMATIONS
export const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.15,
            ease: 'easeIn',
        },
    },
};

// FADE IN/OUT
export const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 },
    },
};
