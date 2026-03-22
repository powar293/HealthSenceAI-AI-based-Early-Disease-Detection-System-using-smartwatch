import React from 'react';
import { LayoutDashboard, Activity, HeartPulse, LogOut, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/contacts', icon: Users, label: 'Emergency Contacts' }
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-[1px_0_40px_rgba(0,0,0,0.03)] z-30 hidden md:flex flex-col border-r border-slate-100">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="bg-healthcare-50 text-healthcare-600 p-2.5 rounded-xl shadow-inner border border-healthcare-100">
          <HeartPulse size={24} className="animate-pulse" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">HealthSense<span className="text-healthcare-500">AI</span></span>
      </div>

      <div className="flex-1 py-8 px-5 space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-healthcare-50 text-healthcare-700 shadow-sm border border-healthcare-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-slate-50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full text-slate-500 hover:bg-red-50 hover:text-red-700 transition-all font-semibold"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
