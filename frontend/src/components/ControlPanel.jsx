import React, { useState } from 'react';
import axios from 'axios';

const ControlPanel = ({ isRunning, setIsRunning, selectedPorts }) => {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleStart = async () => {
        setLoading(true);
        setStatusMessage('Starting services...');
        try {
            const response = await axios.post('http://localhost:5001/api/start', {
                ports: selectedPorts
            });
            setStatusMessage(response.data.message);
            setIsRunning(true);
        } catch (error) {
            setStatusMessage('Error starting honeypot: ' + error.message);
        }
        setLoading(false);
    };

    const handleStop = async () => {
        setLoading(true);
        setStatusMessage('Stopping services...');
        try {
            const response = await axios.post('http://localhost:5001/api/stop');
            setStatusMessage(response.data.message);
            setIsRunning(false);
        } catch (error) {
            setStatusMessage('Error stopping honeypot: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Control Panel</h2>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-slate-400 text-sm">
                        Status: {isRunning ? <span className="text-emerald-400 font-bold">RUNNING</span> : <span className="text-red-400 font-bold">STOPPED</span>}
                    </span>
                </div>
                {statusMessage && <p className="text-xs text-slate-500 mt-1">{statusMessage}</p>}
            </div>

            <button
                onClick={isRunning ? handleStop : handleStart}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-lg ${isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/50'
                    } ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
                {loading ? 'Processing...' : (isRunning ? 'STOP HONEYPOT' : 'START HONEYPOT')}
            </button>
        </div>
    );
};

export default ControlPanel;
