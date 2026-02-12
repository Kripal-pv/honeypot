import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/logs?limit=50');
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-96 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Live Attack Logs</h2>
            <div className="flex-1 overflow-y-auto font-mono text-sm bg-black p-4 rounded border border-slate-700">
                {logs.length === 0 ? (
                    <div className="text-slate-500 italic">No attacks detected yet...</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="mb-1 border-b border-slate-900 pb-1">
                            <span className="text-slate-400">[{log.timestamp}]</span>{' '}
                            <span className="text-red-400 font-bold">{log.ip}</span>{' '}
                            <span className="text-yellow-400">:{log.port}</span>{' '}
                            <span className="text-emerald-200">
                                {log.payload.length > 50 ? log.payload.substring(0, 50) + '...' : log.payload}
                            </span>
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default Dashboard;
