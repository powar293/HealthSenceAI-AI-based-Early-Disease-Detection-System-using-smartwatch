import React, { useState, useEffect, useRef } from 'react';
import { Shield, Settings, Play, Square, Activity, Heart, Wind, Moon } from 'lucide-react';
import { postHealthData } from '../services/api';

export default function ControlPanel() {
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoIntervalRef = useRef(null);

  // Manual configuration states
  const [hr, setHr] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [sleep, setSleep] = useState(7.5);
  const [steps, setSteps] = useState(5000);

  const [notification, setNotification] = useState('');

  // Auto Data Generation Logic
  useEffect(() => {
    if (isAutoRunning) {
      autoIntervalRef.current = setInterval(async () => {
        // Generate random data
        const createAnomaly = Math.random() < 0.15;
        let heartRate, o2, sleepHours, activitySteps;

        if (createAnomaly) {
          heartRate = Math.random() < 0.5 ? Math.floor(Math.random() * 10) + 40 : Math.floor(Math.random() * 30) + 101;
          o2 = Math.floor(Math.random() * 10) + 85;
          sleepHours = (Math.random() * 2.5 + 2).toFixed(1);
          activitySteps = Math.floor(Math.random() * 1500) + 500;
        } else {
          heartRate = Math.floor(Math.random() * 35) + 60;
          o2 = Math.floor(Math.random() * 6) + 95;
          sleepHours = (Math.random() * 3.0 + 6).toFixed(1);
          activitySteps = Math.floor(Math.random() * 8000) + 4000;
        }

        try {
          await postHealthData({
            heart_rate: heartRate,
            spo2: o2,
            sleep_hours: parseFloat(sleepHours),
            activity_steps: activitySteps
          });
          setNotification(`[Auto] Sent Data: HR=${heartRate}, SpO2=${o2}% at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
          console.error("Auto mode failed to send data", error);
        }
      }, 5000); // every 5s
    } else {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    }

    return () => clearInterval(autoIntervalRef.current);
  }, [isAutoRunning]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await postHealthData({
        heart_rate: hr,
        spo2: spo2,
        sleep_hours: sleep,
        activity_steps: steps
      });
      setNotification(`[Manual] Data Submitted Successfully at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error("Manual submit failed", error);
      setNotification(`[Error] Failed to submit data.`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Control Panel</h1>
          <p className="text-slate-500 mt-1.5 font-semibold text-sm">Hardware Simulation & Override Module</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100/60 inline-flex w-full md:w-auto">
        <button 
          onClick={() => { setMode('auto'); }}
          className={`flex-1 md:w-48 py-3 px-6 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${mode === 'auto' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Activity size={18} />
          Auto Mode
        </button>
        <button 
          onClick={() => { setMode('manual'); if(isAutoRunning) setIsAutoRunning(false); }}
          className={`flex-1 md:w-48 py-3 px-6 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${mode === 'manual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Settings size={18} />
          Manual Mode
        </button>
      </div>

      {notification && (
        <div className="bg-blue-50 text-blue-800 p-4 border border-blue-100 rounded-2xl font-semibold opacity-90 animate-in fade-in slide-in-from-top-4">
          {notification}
        </div>
      )}

      {mode === 'auto' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
              <Activity size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Automatic Smartwatch Simulation</h3>
              <p className="text-slate-500 font-medium">The system constantly produces varied health statistics (including occasional dangerous anomalies) and dispatches them to the server logic every 5 seconds. Use this for general demo tracking.</p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
              {isAutoRunning ? (
                <span className="text-emerald-500 font-extrabold text-2xl flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  RUNNING
                </span>
              ) : (
                <span className="text-slate-400 font-extrabold text-2xl">STOPPED</span>
              )}
            </div>

            <button 
              onClick={() => setIsAutoRunning(!isAutoRunning)}
              className={`px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center gap-3 transition-colors ${
                isAutoRunning ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isAutoRunning ? (
                <><Square size={20} className="fill-current" /> Stop Simulation</>
              ) : (
                <><Play size={20} className="fill-current" /> Start Simulation</>
              )}
            </button>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all">
           <div className="flex items-start gap-4 mb-8">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <Settings size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Manual Vitals Override</h3>
              <p className="text-slate-500 font-medium">Precisely push specific health records to trigger edge-cases, high-risk detection, and intelligent emergency workflows instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Heart Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold flex items-center gap-2">
                  <Heart size={16} className="text-red-500" /> Heart Rate
                </label>
                <span className="text-red-500 font-black text-xl bg-red-50 px-3 py-1 rounded-lg">{hr} BPM</span>
              </div>
              <input 
                type="range" min="30" max="200" value={hr} onChange={(e) => setHr(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>30</span><span>Healthy: 60-100</span><span>200</span>
              </div>
            </div>

            {/* SpO2 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold flex items-center gap-2">
                  <Wind size={16} className="text-blue-500" /> Blood Oxygen
                </label>
                <span className="text-blue-500 font-black text-xl bg-blue-50 px-3 py-1 rounded-lg">{spo2}%</span>
              </div>
              <input 
                type="range" min="70" max="100" value={spo2} onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>70%</span><span>Healthy: &gt;95%</span><span>100%</span>
              </div>
            </div>

            {/* Sleep */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold flex items-center gap-2">
                  <Moon size={16} className="text-indigo-500" /> Sleep Duration
                </label>
                <span className="text-indigo-500 font-black text-xl bg-indigo-50 px-3 py-1 rounded-lg">{sleep} hrs</span>
              </div>
              <input 
                type="range" min="0" max="14" step="0.5" value={sleep} onChange={(e) => setSleep(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>0</span><span>Healthy: 6-9 hrs</span><span>14</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" /> Activity Steps
                </label>
                <span className="text-emerald-500 font-black text-xl bg-emerald-50 px-3 py-1 rounded-lg">{steps.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="0" max="25000" step="100" value={steps} onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>0</span><span>Healthy: &gt;5000</span><span>25,000</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Shield size={20} />
              Push Data to Analysis Engine
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
