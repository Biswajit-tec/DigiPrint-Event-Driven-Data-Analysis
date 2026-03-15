import { motion } from 'framer-motion';

/**
 * Professional Footer with Tech Stack Credits
 */
const Footer = () => {
    const techStack = [
        { name: 'PostgreSQL', color: 'text-blue-400' },
        { name: 'Node.js', color: 'text-green-400' },
        { name: 'React', color: 'text-cyan-400' },
        { name: 'Event-Driven Architecture', color: 'text-purple-400' },
    ];

    const year = new Date().getFullYear();

    return (
        <footer className="mt-20 border-t border-white/10 bg-dark-900/50">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-gray-400 text-sm">
                        © {year} DigiPrint. Built for academic demonstration.
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-gray-500 text-sm">Built with:</span>
                        {techStack.map((tech, index) => (
                            <span key={tech.name} className="flex items-center gap-2">
                                <span className={`${tech.color} text-sm font-medium`}>
                                    {tech.name}
                                </span>
                                {index < techStack.length - 1 && (
                                    <span className="text-gray-700">·</span>
                                )}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <a href="#privacy" className="text-gray-400 hover:text-cyber-400 transition-colors">
                            Privacy
                        </a>
                        <a href="#docs" className="text-gray-400 hover:text-cyber-400 transition-colors">
                            Docs
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
