import { motion } from 'framer-motion';
import { useState } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import { api } from '../services/api';

const QueryPlayground = () => {
    const [queries, setQueries] = useState([
        { id: 'total_events', name: 'Total Events Count', description: 'Get the total number of events in the system' },
        { id: 'events_by_type', name: 'Events by Type', description: 'Count events grouped by event type' },
        { id: 'active_users', name: 'Active Users (Last 7 Days)', description: 'Users with activity in the past week' },
        { id: 'session_durations', name: 'Average Session Duration', description: 'Average session duration by user' },
        { id: 'hourly_distribution', name: 'Hourly Event Distribution', description: 'Events grouped by hour of day' },
        { id: 'user_event_summary', name: 'User Event Summary', description: 'Comprehensive user activity statistics' },
        { id: 'recent_anomalies', name: 'Recent Anomalies', description: 'Sessions flagged as anomalous (z-score > 2)' },
        { id: 'risk_distribution', name: 'Risk Score Distribution', description: 'Count of sessions by risk level' },
    ]);

    const [selectedQuery, setSelectedQuery] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeQuery = async (queryId) => {
        try {
            setLoading(true);
            setError(null);
            setSelectedQuery(queryId);

            const response = await api.executeQuery(queryId);
            setResults(response);
        } catch (err) {
            setError(err.message || 'Failed to execute query');
            console.error('Query execution error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderResults = () => {
        if (loading) {
            return (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Executing query...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400">❌ Error: {error}</p>
                </div>
            );
        }

        if (!results || !results.data || results.data.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    No results. Select a query to execute.
                </div>
            );
        }

        const columns = Object.keys(results.data[0]);

        return (
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {results.data.length} row{results.data.length !== 1 ? 's' : ''} returned
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Execution time: {results.execution_time_ms || '< 1'}ms
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                {columns.map((col) => (
                                    <th key={col} className="text-left py-2 px-3 text-muted-foreground font-medium uppercase text-xs">
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-mono text-xs">
                            {results.data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-white/5 hover:bg-muted transition-colors">
                                    {columns.map((col) => (
                                        <td key={col} className="py-2 px-3">
                                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

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
                    <h1 className="text-4xl font-bold mb-2">SQL Query Playground</h1>
                    <p className="text-muted-foreground">Execute predefined, read-only analytical queries</p>

                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-400">
                            🔒 <strong>Safety:</strong> Only whitelisted, read-only queries are allowed. No DROP, DELETE, UPDATE, or arbitrary SQL execution permitted.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Query List */}
                    <div>
                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-4">Available Queries</h3>
                            <div className="space-y-2">
                                {queries.map((query) => (
                                    <button
                                        key={query.id}
                                        onClick={() => executeQuery(query.id)}
                                        disabled={loading}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${selectedQuery === query.id
                                                ? 'bg-primary/20 border border-primary/50'
                                                : 'bg-muted hover:bg-white/10'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="font-medium text-sm mb-1">{query.name}</div>
                                        <div className="text-xs text-muted-foreground">{query.description}</div>
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2">
                        <GlassCard>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Query Results</h3>
                                {selectedQuery && (
                                    <GlowButton
                                        size="sm"
                                        variant="glass"
                                        onClick={() => executeQuery(selectedQuery)}
                                        disabled={loading}
                                    >
                                        🔄 Re-run
                                    </GlowButton>
                                )}
                            </div>

                            <div className="min-h-[400px]">
                                {renderResults()}
                            </div>
                        </GlassCard>

                        {/* Query Info */}
                        {selectedQuery && (
                            <GlassCard className="mt-6">
                                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Query Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Query ID:</span>
                                        <span className="font-mono text-primary">{selectedQuery}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="text-green-400">Read-Only SELECT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Permissions:</span>
                                        <span className="text-secondary-foreground">Whitelisted</span>
                                    </div>
                                </div>
                            </GlassCard>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QueryPlayground;
