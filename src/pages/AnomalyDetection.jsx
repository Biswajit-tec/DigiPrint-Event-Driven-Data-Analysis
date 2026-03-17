import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../services/api';
import { useModeContext } from '../components/ui/ModeToggle';
import { generateMockAnomalies } from '../utils/mockData';

const AnomalyDetection = () => {
    const { isLiveMode } = useModeContext();
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnomalies();
    }, [isLiveMode]);

    const fetchAnomalies = async () => {
        try {
            setLoading(true);
            if (isLiveMode) {
                const data = await api.getAnomalies(2.0);
                setAnomalies(data.data || []);
            } else {
                setAnomalies(generateMockAnomalies(8));
            }
        } catch (error) {
            console.error('Failed to fetch anomalies:', error);
            setAnomalies(generateMockAnomalies(8));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Detecting anomalies...</p>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-4xl font-bold mb-2">Anomaly Detection</h1>
                    <p className="text-muted-foreground">Statistical analysis using z-score methodology</p>
                </div>

                <GlassCard className="mb-6">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-400 mb-2">Detection Method</h4>
                        <p className="text-sm text-muted-foreground">
                            Sessions with event counts deviating {'>'} 2 standard deviations from the mean are flagged as anomalies.
                            This uses pure SQL statistical analysis (no external ML required).
                        </p>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h2 className="text-2xl font-semibold mb-6">Detected Anomalies</h2>

                    {anomalies.length > 0 ? (
                        <div className="space-y-4">
                            {anomalies.map((anomaly, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${anomaly.severity === 'critical'
                                            ? 'bg-red-500/10 border-red-500/30'
                                            : 'bg-yellow-500/10 border-yellow-500/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-mono text-sm text-muted-foreground">
                                                    Session: {anomaly.session_id}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${anomaly.severity === 'critical'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {anomaly.severity?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Event Count:</span>
                                                    <span className="ml-2 font-semibold">{anomaly.event_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Z-Score:</span>
                                                    <span className="ml-2 font-semibold text-cyan-400">{anomaly.z_score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold mb-2">No Anomalies Detected</h3>
                            <p className="text-muted-foreground">
                                All sessions are within normal behavioral patterns.
                            </p>
                        </div>
                    )}
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default AnomalyDetection;
