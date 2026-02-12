import React, { useState } from 'react';

const Configuration = ({ isRunning, activeServices, onAddService, onRemoveService }) => {
    const [customPort, setCustomPort] = useState('');
    const [customType, setCustomType] = useState('http');

    const standardServices = [
        { port: 21, type: 'ftp', label: 'FTP' },
        { port: 22, type: 'ssh', label: 'SSH' },
        { port: 23, type: 'telnet', label: 'Telnet' },
        { port: 80, type: 'http', label: 'HTTP' },
        { port: 443, type: 'https', label: 'HTTPS' },
        { port: 3306, type: 'mysql', label: 'MySQL' },
    ];

    const handleAddCustom = () => {
        if (!customPort) return;
        const portNum = parseInt(customPort);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
            alert("Invalid Port Number");
            return;
        }
        onAddService({ port: portNum, type: customType });
        setCustomPort('');
    };

    const getTypeColor = (type) => {
        const colors = {
            ssh: 'bg-purple-900/50 text-purple-200 border-purple-700',
            http: 'bg-blue-900/50 text-blue-200 border-blue-700',
            https: 'bg-indigo-900/50 text-indigo-200 border-indigo-700',
            ftp: 'bg-orange-900/50 text-orange-200 border-orange-700',
            telnet: 'bg-gray-700/50 text-gray-200 border-gray-600',
            mysql: 'bg-cyan-900/50 text-cyan-200 border-cyan-700',
            generic: 'bg-slate-700/50 text-slate-300 border-slate-600'
        };
        return colors[type] || colors.generic;
    };

    return (
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 border-b border-slate-700 pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Service Config
            </h2>

            {/* Config Form - Disabled when Running */}
            <div className={`transition-all duration-300 ${isRunning ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Add Custom Listener</label>
                    <div className="flex gap-2">
                        <select
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value)}
                            className="bg-slate-800 text-white rounded px-3 py-2 text-sm border border-slate-600 focus:outline-none focus:border-emerald-500 w-1/3"
                        >
                            <option value="http">HTTP</option>
                            <option value="ssh">SSH</option>
                            <option value="ftp">FTP</option>
                            <option value="telnet">Telnet</option>
                            <option value="mysql">MySQL</option>
                            <option value="generic">Generic</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Port"
                            value={customPort}
                            onChange={(e) => setCustomPort(e.target.value)}
                            className="bg-slate-800 text-white rounded px-3 py-2 w-20 text-sm border border-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            onClick={handleAddCustom}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold transition-all flex-1"
                        >
                            + Add
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {standardServices.map((svc) => (
                            <button
                                key={svc.port}
                                onClick={() => onAddService({ port: svc.port, type: svc.type })}
                                disabled={activeServices.some(s => s.port === svc.port)}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                {svc.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Ports {activeServices.length > 0 && <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] ml-2">{activeServices.length}</span>}</h3>
                <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {activeServices.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-700/50 rounded-lg">
                            <p className="text-slate-500 text-sm">No services configured.</p>
                            <p className="text-slate-600 text-xs mt-1">Add a port above to begin.</p>
                        </div>
                    ) : (
                        activeServices.map((svc) => (
                            <div key={`${svc.type}-${svc.port}`} className="flex justify-between items-center bg-slate-900/40 p-3 rounded border border-slate-700/50 group hover:border-slate-600 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase w-14 text-center ${getTypeColor(svc.type)}`}>
                                        {svc.type}
                                    </span>
                                    <span className="font-mono text-slate-200 text-sm">Port <span className="text-emerald-400 font-bold">{svc.port}</span></span>
                                </div>
                                <button
                                    onClick={() => onRemoveService(svc.port)}
                                    disabled={isRunning}
                                    className="text-slate-500 hover:text-red-400 disabled:opacity-0 transition-colors p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 text-[10px] text-slate-500 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p>Running ports under 1024 (e.g., 21, 80) requires Administrator/Root privileges.</p>
            </div>
        </div>
    );
};

export default Configuration;
