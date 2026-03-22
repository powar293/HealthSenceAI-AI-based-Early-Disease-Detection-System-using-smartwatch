import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VitalsChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_18px_rgba(0,0,0,0.02)] border border-slate-100/60 w-full h-[380px]">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-slate-800 tracking-tight">Heart Rate & SpO2 Trends</h3>
         <div className="flex gap-4 text-sm font-medium">
             <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> Heart Rate</div>
             <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> SpO2</div>
         </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            dy={15}
          />
          <YAxis 
            yAxisId="left" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            dx={-10}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} domain={['dataMin - 5', 100]} />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontWeight: 600 }}
            itemStyle={{ fontWeight: 600 }}
          />
          <Line yAxisId="left" type="monotone" dataKey="hr" stroke="#f87171" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0 }} name="Heart Rate (BPM)" />
          <Line yAxisId="right" type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0 }} name="SpO2 (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
