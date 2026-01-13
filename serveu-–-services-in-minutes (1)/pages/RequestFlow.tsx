
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { RequestStatus } from '../types';

const RequestFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeRequest, workers, loading } = useApp();
  const [calculating, setCalculating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If request is completed or not found, go home
    if (!loading && (!activeRequest || activeRequest.id !== id)) {
      navigate('/');
    }
  }, [activeRequest, loading, id, navigate]);

  useEffect(() => {
    if (activeRequest?.status === RequestStatus.ACCEPTED) {
      setCalculating(true);
      const timer = setTimeout(() => setCalculating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeRequest?.status]);

  if (loading || !activeRequest) {
    return <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 animate-pulse">Syncing with ServeU Cloud...</div>;
  }

  const assignedWorker = activeRequest.assigned_worker_id ? workers.find(w => w.id === activeRequest.assigned_worker_id) : null;

  return (
    <div className="max-w-md mx-auto space-y-12 py-10 animate-in fade-in duration-700">
      <div className="flex flex-col items-center">
        {activeRequest.status === RequestStatus.SEARCHING ? (
          <>
            <div className="w-48 h-48 relative flex items-center justify-center mb-10">
              <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-2 border-blue-400/10 rounded-full animate-pulse"></div>
              <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center">
                <i className="fas fa-search text-3xl text-blue-500 animate-pulse"></i>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Finding Nearest Pro</h2>
              <div className="bg-zinc-900/50 border border-zinc-800 py-3 px-6 rounded-2xl inline-block">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Requesting</p>
                <p className="text-sm font-black">{activeRequest.service_type}</p>
              </div>
              <p className="text-zinc-500 text-sm max-w-[280px] mx-auto animate-pulse">
                Prioritizing workers within 3km of {activeRequest.user_location_display}
              </p>
            </div>
          </>
        ) : calculating ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-900/40">
              <i className="fas fa-check text-3xl text-white"></i>
            </div>
            <h2 className="text-4xl font-black tracking-tight">Worker Found!</h2>
            <p className="text-zinc-500 animate-pulse italic">Optimizing route based on current traffic...</p>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-10 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                
                <div className="mb-6">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Estimated Arrival</span>
                  <h2 className="text-6xl font-black mt-2">~{activeRequest.eta_minutes}<span className="text-xl text-zinc-600 ml-1">mins</span></h2>
                </div>

                <div className="flex justify-center -space-x-4 mb-8">
                  <div className="w-20 h-20 bg-zinc-800 rounded-[30px] border-4 border-black flex items-center justify-center overflow-hidden">
                    <img src="https://picsum.photos/seed/user1/200" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 h-20 bg-blue-600 rounded-[30px] border-4 border-black flex items-center justify-center z-10">
                    <i className="fas fa-bolt text-2xl text-white animate-pulse"></i>
                  </div>
                  <div className="w-20 h-20 bg-zinc-800 rounded-[30px] border-4 border-black flex items-center justify-center overflow-hidden">
                    <img src={assignedWorker?.avatar} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-black text-lg">{assignedWorker?.name} is on the way</p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{activeRequest.service_type} Specialist</p>
                </div>
             </div>

             <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Worker Level</p>
                    <p className="text-sm font-bold">Elite Partner &bull; {assignedWorker?.rating} ★</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <i className="fas fa-phone-alt"></i>
                  </button>
                  <button className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <i className="fas fa-comment-dots"></i>
                  </button>
                </div>
             </div>
             
             <div className="text-center px-10">
               <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed tracking-widest">
                 State persistent. Your worker is locked in even if you refresh this page.
               </p>
             </div>
          </div>
        )}
      </div>

      {activeRequest.status === RequestStatus.SEARCHING && (
        <div className="bg-blue-600/5 p-6 rounded-3xl border border-blue-600/20 text-center space-y-4">
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Marketplace Instructions</p>
          <p className="text-sm text-zinc-400">
            Open the <strong>Worker Dashboard</strong> in a separate tab/window to accept this request and see the system sync in action.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link to="/worker" target="_blank" className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-xl">Open Worker View</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestFlow;
