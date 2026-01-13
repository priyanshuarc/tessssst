
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { RequestStatus } from '../types';
import { supabase } from '../supabaseClient';

const WorkerDashboard: React.FC = () => {
  const { workers, activeRequest, toggleDuty, acceptJob, refreshState } = useApp();
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  // Simulation: We are Rahul Sharma (w1)
  const worker = workers.find(w => w.id === 'w1') || workers[0];

  if (!worker) return <div className="p-20 text-center text-zinc-500">Connecting to system...</div>;

  const handleAccept = async (id: string) => {
    setIsAccepting(id);
    await acceptJob(id, worker.id);
    setIsAccepting(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={worker.avatar} alt={worker.name} className="w-24 h-24 rounded-[32px] border-4 border-zinc-800 object-cover" />
            {/* Fix: Changed worker.on_duty to worker.onDuty */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-zinc-900 ${worker.onDuty ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{worker.name}</h2>
            <div className="flex items-center gap-2 text-zinc-500 mt-1">
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{worker.serviceType}</span>
              <span>&bull;</span>
              <span className="text-sm font-bold text-yellow-500">⭐ {worker.rating}</span>
            </div>
          </div>
        </div>

        <button 
          // Fix: Changed worker.on_duty to worker.onDuty
          onClick={() => toggleDuty(worker.id, worker.onDuty)}
          className={`flex items-center gap-4 px-8 py-5 rounded-3xl border-2 transition-all ${
            // Fix: Changed worker.on_duty to worker.onDuty
            worker.onDuty 
              ? 'bg-green-600/10 border-green-600/30 text-green-500' 
              : 'bg-zinc-800/50 border-zinc-800 text-zinc-500'
          }`}
        >
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Status</p>
            {/* Fix: Changed worker.on_duty to worker.onDuty */}
            <p className="text-xl font-black tracking-tighter uppercase">{worker.onDuty ? 'Available' : 'Offline'}</p>
          </div>
          {/* Fix: Changed worker.on_duty to worker.onDuty */}
          <div className={`w-12 h-6 rounded-full relative transition-colors ${worker.onDuty ? 'bg-green-500' : 'bg-zinc-700'}`}>
            {/* Fix: Changed worker.on_duty to worker.onDuty */}
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${worker.onDuty ? 'left-7' : 'left-1'}`}></div>
          </div>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tight">Active Requests Nearby</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Scanning Live</span>
          </div>
        </div>

        {/* Fix: Changed worker.on_duty to worker.onDuty */}
        {!worker.onDuty ? (
          <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[40px] p-20 text-center">
            <i className="fas fa-power-off text-4xl text-zinc-700 mb-6"></i>
            <h4 className="text-xl font-bold text-zinc-500">Go Online to see jobs</h4>
            <p className="text-sm text-zinc-600 mt-2">Requests expire within 2 minutes if not accepted.</p>
          </div>
        ) : activeRequest && activeRequest.status === RequestStatus.SEARCHING && activeRequest.service_type === worker.serviceType ? (
          <div className="bg-zinc-900 border-2 border-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-900/20 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2 block">New High-Demand Request</span>
                <h4 className="text-3xl font-black">{activeRequest.service_type} Needed</h4>
                <p className="text-zinc-500 mt-2 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-blue-500"></i>
                  {activeRequest.user_location_display}
                </p>
              </div>
              <div className="bg-black/50 px-4 py-2 rounded-2xl border border-zinc-800">
                <p className="text-[10px] font-black text-zinc-500 uppercase">Incoming</p>
                <p className="text-xl font-black text-white leading-tight">Now</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleAccept(activeRequest.id)}
                disabled={isAccepting !== null}
                className="flex-[2] bg-white text-black font-black py-5 rounded-3xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAccepting === activeRequest.id ? (
                  <><i className="fas fa-circle-notch fa-spin"></i> Processing...</>
                ) : (
                  'Accept Job'
                )}
              </button>
              <button className="flex-1 bg-zinc-800 text-white font-bold py-5 rounded-3xl hover:bg-zinc-700 transition-all">
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-20 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h4 className="text-xl font-bold text-zinc-500">Waiting for requests...</h4>
              <p className="text-sm text-zinc-600 mt-2">You are at the top of the queue for {worker.serviceType} jobs.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Earning Today', value: '₹1,240' },
          { label: 'Jobs', value: '4' },
          { label: 'On Duty', value: '2.4h' },
          { label: 'System Ping', value: '12ms' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerDashboard;
