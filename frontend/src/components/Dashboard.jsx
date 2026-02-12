import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dashboard = ({ isRunning }) => {
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/logs?limit=100');
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    // Poll for logs when running
    useEffect(() => {
        let interval;
        if (isRunning) {
            fetchLogs();
            interval = setInterval(fetchLogs, 2000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Auto-scroll logic
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const clearLogs = async () => {
        try {
            await axios.post('http://localhost:5001/api/logs/clear');
            setLogs([]);
        } catch (error) {
            console.error("Error clearing logs:", error);
        }
    };

    return (
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 h-full flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                    </span>
                    Live Attack Feed
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchLogs}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-slate-600"
                    >
                        ⟳ Refresh
                    </button>
                    <button
                        onClick={clearLogs}
                        className="bg-red-900/30 hover:bg-red-900/50 text-red-200 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-red-900/50"
                    >
                        🗑 Clear
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-black/80 rounded-lg border border-slate-800 shadow-inner flex flex-col font-mono text-sm relative">
                {/* Scanner/Grid Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06)_1px,transparent_0,transparent_2px)] z-10 bg-[length:100%_4px,3px_100%] opacity-20"></div>

                <div className="overflow-y-auto p-0 flex-1 custom-scrollbar z-20">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900 z-30 shadow-md">
                            <tr className="text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-3 w-32 border-b border-slate-800">Timestamp</th>
                                <th className="p-3 w-32 border-b border-slate-800">Source IP</th>
                                <th className="p-3 w-24 border-b border-slate-800">Target</th>
                                <th className="p-3 border-b border-slate-800">Payload / Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-600 italic">
                                        No threats detected yet. System monitoring...
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-900/60 transition-colors group">
                                        <td className="p-3 text-slate-400 text-xs whitespace-nowrap font-mono">{log.timestamp.split(' ')[1]}</td>
                                        <td className="p-3 text-red-400 font-bold font-mono tracking-wide">{log.ip}</td>
                                        <td className="p-3">
                                            <span className="bg-slate-800 text-yellow-400 px-2 py-0.5 rounded text-xs font-mono border border-slate-700">:{log.port}</span>
                                        </td>
                                        <td className="p-3 text-emerald-300 break-all font-mono text-xs opacity-90 group-hover:opacity-100">
                                            {log.payload}
                                        </td>
                                    </tr>
                                ))
                            )}
                            <div ref={logsEndRef} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
