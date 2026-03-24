import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, XCircle } from 'lucide-react';
import { fetchAlerts, performAlertAction } from '../services/api';

export default function AlertMonitor({ isAuthenticated }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let pollInterval;
    
    // Only poll if there's no active alert currently showing
    if (!activeAlert) {
      pollInterval = setInterval(async () => {
        try {
          const alerts = await fetchAlerts();
          // Find if there's any pending alert that needs immediate action
          // We only trigger for High or Medium risks that are still "pending"
          const pendingAlert = alerts.find(a => 
            a.status === 'pending' && 
            (a.risk_level === 'High' || a.risk_level === 'Medium')
          );
          
          if (pendingAlert) {
            setActiveAlert(pendingAlert);
            setCountdown(15);
          }
        } catch (error) {
          console.error("Failed to fetch alerts for monitor", error);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isAuthenticated, activeAlert]);

  // Handle countdown
  useEffect(() => {
    let timer;
    if (activeAlert && countdown > 0 && !isProcessing) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (activeAlert && countdown === 0 && !isProcessing) {
      // Countdown finished -> trigger automatically
      handleTriggerEmergency();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeAlert, countdown, isProcessing]);

  const handleCancelEmergency = async () => {
    if (!activeAlert) return;
    setIsProcessing(true);
    try {
      await performAlertAction(activeAlert.id, 'cancel');
      setActiveAlert(null);
    } catch (error) {
      console.error("Failed to cancel alert", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerEmergency = async () => {
    if (!activeAlert) return;
    setIsProcessing(true);
    try {
      let coords = { latitude: null, longitude: null };
      
      // Try to get location
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          coords.latitude = position.coords.latitude;
          coords.longitude = position.coords.longitude;
        } catch (geoError) {
          console.warn("Could not get geolocation, sending trigger without coords.", geoError);
        }
      }

      await performAlertAction(activeAlert.id, 'trigger', coords.latitude, coords.longitude);
      
      setActiveAlert(null); // Close the modal, Dashboard will show it as triggered
    } catch (error) {
      console.error("Failed to trigger alert", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col items-center text-center relative border-4 border-red-500 animate-in zoom-in-95 duration-300">
        
        {/* Pulsing background effect */}
        <div className="absolute inset-0 bg-red-50/50 animate-pulse pointer-events-none" />

        <div className="relative pt-10 pb-6 px-8 z-10 w-full flex flex-col items-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-bounce">
            <ShieldAlert size={40} className="text-red-500" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Critical Health Alert</h2>
          <p className="text-red-600 font-bold text-lg mb-4">{activeAlert.message}</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full mb-6">
            <p className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Emergency contacts will be notified in</p>
            <div className="text-5xl font-black text-red-500 tabular-nums">
              00:{countdown.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleCancelEmergency}
              disabled={isProcessing}
              className="group relative flex items-center w-full justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <XCircle size={24} />
              <span>I am OK / Stop Alert</span>
            </button>

            <button
              onClick={handleTriggerEmergency}
              disabled={isProcessing}
              className="flex items-center w-full justify-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 p-4 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              <MapPin size={20} />
              <span>Trigger Emergency Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
