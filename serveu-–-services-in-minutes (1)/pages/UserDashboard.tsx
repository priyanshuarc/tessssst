
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { SERVICE_CATEGORIES } from '../constants';
import { ServiceType, RequestStatus } from '../types';

const UserDashboard: React.FC = () => {
  const { userLocation, setUserLocation, requestService, activeRequest, workers } = useApp();
  const [addressInput, setAddressInput] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  // Redirect if an active request already exists
  useEffect(() => {
    if (activeRequest && (activeRequest.status === RequestStatus.SEARCHING || activeRequest.status === RequestStatus.ACCEPTED)) {
      navigate(`/request/${activeRequest.id}`);
    }
  }, [activeRequest, navigate]);

  const handleUseLocation = () => {
    setLoadingLocation(true);
    setTimeout(() => {
      setUserLocation({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        address: "Supreme Tower, HSR Layout"
      });
      setLoadingLocation(false);
    }, 1200);
  };

  const handleManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput) return;
    setUserLocation({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      address: addressInput
    });
  };

  const handleRequest = async (type: ServiceType) => {
    if (!userLocation) return;
    try {
      const id = await requestService(type, userLocation);
      navigate(`/request/${id}`);
    } catch (e) {
      alert("System busy. Please try again.");
    }
  };

  if (!userLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Instant fulfillment
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">Expert service.<br/>Arriving in minutes.</h1>
        </div>

        <div className="w-full max-w-md space-y-4">
          <button 
            onClick={handleUseLocation}
            disabled={loadingLocation}
            className="w-full bg-white text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loadingLocation ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-location-arrow"></i>}
            Use Current Location
          </button>

          <form onSubmit={handleManualLocation} className="relative group">
            <input 
              type="text" 
              placeholder="Or enter your address manually"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-6 py-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-600"
            />
            <button type="submit" className="absolute right-3 top-3 bg-zinc-800 p-2 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity">
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fix: Changed w.on_duty to w.onDuty to match Worker interface
  const onlineWorkers = workers.filter(w => w.onDuty);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center">
            <i className="fas fa-map-pin text-blue-500"></i>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Delivery Address</p>
            <button onClick={() => setUserLocation(null as any)} className="text-sm font-bold flex items-center gap-2 hover:text-blue-500">
              {userLocation.address} <i className="fas fa-edit text-[10px]"></i>
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{onlineWorkers.length} Active Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.map(cat => {
          const count = onlineWorkers.filter(w => w.serviceType === cat).length;
          return (
            <div 
              key={cat}
              className={`p-1 rounded-[32px] transition-all ${count > 0 ? 'bg-zinc-800/50 hover:bg-zinc-800' : 'bg-zinc-900/30 opacity-60'}`}
            >
              <div className="bg-zinc-900 p-7 rounded-[30px] flex flex-col justify-between h-full border border-zinc-800/50">
                <div className="mb-6">
                  <div className="flex justify-between items-start">
                    <h4 className="text-2xl font-black tracking-tight">{cat}</h4>
                    {count === 1 && (
                      <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-2 py-1 rounded-md">SCARCE</span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">Verified professionals available for instant hire.</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-bolt text-yellow-500 text-xs"></i>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ready in minutes</span>
                  </div>
                  <button 
                    onClick={() => handleRequest(cat)}
                    disabled={count === 0}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    {count > 0 ? 'Request Now' : 'Busy'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-600/5 border border-blue-600/20 rounded-3xl p-6 flex items-center gap-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <i className="fas fa-shield-alt text-xl text-white"></i>
        </div>
        <div>
          <h5 className="font-bold">ServeU Protection</h5>
          <p className="text-xs text-zinc-500">All workers are vetted and tracked via internal GPS simulation for your safety.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
