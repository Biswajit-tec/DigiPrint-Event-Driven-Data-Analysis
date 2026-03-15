import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Parallax Section Wrapper
 * Creates camera-like motion effect with layered scrolling
 */
const ParallaxSection = ({
    children,
    intensity = 0.5, // 0.5 = background, 0.75 = midground, 1 = foreground
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    // Calculate transform based on intensity
    // Lower intensity = slower movement (background)
    // Higher intensity = faster movement (foreground)
    const y = useTransform(scrollYProgress, [0, 1], [100 * (1 - intensity), -100 * (1 - intensity)]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className={`parallax-layer ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default ParallaxSection;
