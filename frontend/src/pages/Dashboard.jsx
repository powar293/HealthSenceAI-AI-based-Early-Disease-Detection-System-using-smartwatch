import React, { useEffect, useState } from 'react';
import { Activity, Heart, Moon, Wind } from 'lucide-react';
import HealthCard from '../components/HealthCard';
import VitalsChart from '../components/VitalsChart';
import { fetchHealthData, fetchAlerts } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [healthData, alertData] = await Promise.all([
        fetchHealthData(),
        fetchAlerts()
      ]);
      
      setData(healthData);
      setAlerts(alertData);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Poll every 3 seconds to feel truly real-time
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-40">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-healthcare-100 border-b-healthcare-600 border-l-healthcare-600 shadow-sm mb-4"></div>
        <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Initializing Health AI...</p>
      </div>
    );
  }

  const latest = data.length > 0 ? data[0] : null;

  // Format data for chart
  const chartData = [...data]
    .reverse()
    .slice(-20) // Last 20 points
    .map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      hr: d.heart_rate,
      spo2: d.spo2
    }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Overview</h1>
          <p className="text-slate-500 mt-1.5 font-semibold text-sm">Real-time smartwatch vitals monitoring</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          </span>
          <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Live Sync</span>
        </div>
      </div>

      {alerts.length > 0 && alerts[0].risk_level !== 'Low' && (
        <div className={`p-5 rounded-3xl flex items-start gap-4 shadow-sm border ${
          alerts[0].risk_level === 'High' 
            ? 'bg-red-50 border-red-100 text-red-900' 
            : 'bg-amber-50 border-amber-100 text-amber-900'
        } transition-all`}>
          <div className={`p-3 rounded-2xl shadow-sm ${alerts[0].risk_level === 'High' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div className="pt-0.5">
            <h4 className="font-extrabold text-lg tracking-tight mb-1">{alerts[0].risk_level} Risk Detected!</h4>
            <p className="font-semibold opacity-90 leading-relaxed text-sm md:text-base">{alerts[0].message}</p>
            <p className="text-sm mt-3 opacity-60 font-semibold">{new Date(alerts[0].timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {latest ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <HealthCard 
            title="Heart Rate" 
            value={Math.round(latest.heart_rate)} 
            unit="BPM" 
            icon={Heart} 
            iconClassName="bg-red-50 text-red-500 border border-red-100/50" 
          />
          <HealthCard 
            title="Blood Oxygen" 
            value={latest.spo2} 
            unit="%" 
            icon={Wind} 
            iconClassName="bg-blue-50 text-blue-500 border border-blue-100/50" 
          />
          <HealthCard 
            title="Sleep Duration" 
            value={latest.sleep_hours} 
            unit="hrs" 
            icon={Moon} 
            iconClassName="bg-indigo-50 text-indigo-500 border border-indigo-100/50" 
          />
          <HealthCard 
            title="Daily Activity" 
            value={latest.activity_steps} 
            unit="steps" 
            icon={Activity} 
            iconClassName="bg-emerald-50 text-emerald-500 border border-emerald-100/50" 
          />
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center shadow-sm">
          <p className="text-slate-500 font-bold tracking-wide">Waiting for smartwatch data sync...</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2">
          {chartData.length > 0 && <VitalsChart data={chartData} />}
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_18px_rgba(0,0,0,0.02)] border border-slate-100/60 max-h-[380px] overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-slate-800 mb-6 sticky top-0 bg-white pb-3 border-b border-slate-50 tracking-tight z-10 w-full">Recent Alerts & Insights</h3>
          <div className="space-y-3">
            {alerts.slice(0, 15).map(alert => (
              <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/60 flex items-start gap-3 transition-colors hover:bg-slate-100">
                <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${
                  alert.risk_level === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                  alert.risk_level === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                }`} />
                <div>
                  <p className="font-semibold text-slate-800 tracking-tight leading-snug mb-1.5">{alert.message}</p>
                  <p className="text-xs font-bold text-slate-400">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-60">
                <Heart size={40} className="text-emerald-500 mb-3" />
                <p className="text-sm font-bold text-slate-500 text-center">No alerts generated yet.<br/>You are completely healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
