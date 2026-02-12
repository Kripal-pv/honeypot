import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Configuration from './components/Configuration';
import ControlPanel from './components/ControlPanel';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPorts, setSelectedPorts] = useState([21, 22, 80]);

  // Check status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/status');
        setIsRunning(response.data.running);
      } catch (error) {
        console.error("Backend not reachable");
      }
    };
    checkStatus();
  }, []);

  const togglePort = (port) => {
    setSelectedPorts(prev =>
      prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Honey<span className="text-emerald-400">Shield</span>
            </h1>
          </div>
          <div className="text-sm font-mono text-slate-500">
            v1.0.0
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6">
          <ControlPanel
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            selectedPorts={selectedPorts}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Configuration
                isRunning={isRunning}
                selectedPorts={selectedPorts}
                onTogglePort={togglePort}
              />
            </div>
            <div className="lg:col-span-2">
              <Dashboard isRunning={isRunning} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
