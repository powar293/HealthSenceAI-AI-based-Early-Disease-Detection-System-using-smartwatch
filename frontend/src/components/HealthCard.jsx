import React from 'react';

export default function HealthCard({ title, value, unit, icon: Icon, iconClassName, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_18px_rgba(0,0,0,0.02)] border border-slate-100/60 flex items-start justify-between transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div>
        <p className="text-slate-500 font-semibold text-sm tracking-wide uppercase">{title}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-slate-800 tracking-tight">{value}</span>
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        </div>
      </div>
      <div className={`p-4 rounded-2xl ${iconClassName}`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
    </div>
  );
}
