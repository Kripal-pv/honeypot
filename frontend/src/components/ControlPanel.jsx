import React, { useState } from 'react';
import axios from 'axios';

const ControlPanel = ({ isRunning, setIsRunning, activeServices }) => {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleStart = async () => {
        if (activeServices.length === 0) {
            setStatusMessage("⚠️ Add services via configuration first.");
            return;
        }

        setLoading(true);
        setStatusMessage('Initializing sensors...');
        try {
            // Force a small delay for UI feedback
            const response = await axios.post('http://localhost:5001/api/start', {
                services: activeServices
            });

            setStatusMessage(response.data.message);

            // STRICT CHECK: Only set running if explicitly confirmed
            if (response.data.message === "Started" || response.data.message === "Already running") {
                setIsRunning(true);
            } else {
                setIsRunning(false); // Likely "Failed to bind..."
            }
        } catch (error) {
            console.error("Start failed:", error);
            setStatusMessage('Error: ' + (error.response?.data?.message || error.message));
            setIsRunning(false);
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        setLoading(true);
        setStatusMessage('Terminating sensors...');
        try {
            const response = await axios.post('http://localhost:5001/api/stop');
            setStatusMessage(response.data.message);
            setIsRunning(false);
        } catch (error) {
            console.error("Stop failed:", error);
            setStatusMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
                {/* Status Circle */}
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isRunning ? 'border-emerald-500/50 bg-emerald-900/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-red-500/50 bg-red-900/20'}`}>
                    <div className={`w-8 h-8 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">System Status</h2>
                    <div className="text-sm font-mono mt-1">
                        State: {isRunning ? <span className="text-emerald-400 font-bold animate-pulse">ACTIVE MONITORING</span> : <span className="text-red-400 font-bold">OFFLINE</span>}
                    </div>
                    {statusMessage && <p className="text-xs text-yellow-500 mt-2 font-mono h-4 italic">{statusMessage}</p>}
                </div>
            </div>

            <button
                onClick={isRunning ? handleStop : handleStart}
                disabled={loading}
                className={`
                    relative overflow-hidden group px-10 py-4 rounded-lg font-bold text-lg tracking-widest transition-all shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                    ${isRunning
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 border border-red-500'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 border border-emerald-500'
                    } 
                    ${loading ? 'opacity-80 cursor-not-allowed grayscale' : ''}
                `}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            PROCESSING
                        </>
                    ) : (
                        isRunning ? 'DEACTIVATE' : 'ACTIVATE SYSTEM'
                    )}
                </span>
            </button>
        </div>
    );
};

export default ControlPanel;
