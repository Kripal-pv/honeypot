import React from 'react';
import axios from 'axios';

const Configuration = ({ isRunning, selectedPorts, onTogglePort }) => {
    const availablePorts = [
        { port: 21, label: 'FTP (21)' },
        { port: 22, label: 'SSH (22)' },
        { port: 23, label: 'Telnet (23)' },
        { port: 80, label: 'HTTP (80)' },
        { port: 443, label: 'HTTPS (443)' },
        { port: 8080, label: 'HTTP-Alt (8080)' },
        { port: 3306, label: 'MySQL (3306)' },
    ];

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center">
                <span className="mr-2">⚙️</span> Configuration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availablePorts.map((item) => (
                    <button
                        key={item.port}
                        onClick={() => onTogglePort(item.port)}
                        disabled={isRunning}
                        className={`p-3 rounded-md font-medium transition-all border ${selectedPorts.includes(item.port)
                                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 text-sm text-slate-500 bg-slate-900/50 p-3 rounded">
                <p>
                    <span className="text-yellow-500 font-bold">⚠️ Note:</span>
                    Ports below 1024 require Administrator privileges to bind.
                </p>
            </div>
        </div>
    );
};

export default Configuration;
