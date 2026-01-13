
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Location, Worker, ServiceRequest, RequestStatus, ServiceType } from '../types';
import { supabase } from '../supabaseClient';
import { MOCK_WORKERS } from '../constants';

interface AppContextType {
  userLocation: Location | null;
  setUserLocation: (loc: Location) => void;
  workers: Worker[];
  activeRequest: ServiceRequest | null;
  loading: boolean;
  refreshState: () => Promise<void>;
  requestService: (type: ServiceType, loc: Location) => Promise<string>;
  toggleDuty: (workerId: string, currentStatus: boolean) => Promise<void>;
  acceptJob: (requestId: string, workerId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setLoc] = useState<Location | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshState = useCallback(async () => {
    try {
      // 1. Fetch Workers
      const { data: workerData } = await supabase.from('workers').select('*');
      if (workerData && workerData.length > 0) {
        setWorkers(workerData);
      } else {
        // Seed if empty (Simulation only)
        const seedData = MOCK_WORKERS.map(w => ({
          ...w,
          // Fix: w.hiddenLocation is now a string in MOCK_WORKERS
          hiddenLocation: w.hiddenLocation
        }));
        await supabase.from('workers').upsert(seedData);
        setWorkers(MOCK_WORKERS);
      }

      // 2. Fetch Active Request (for the simulated current user)
      const { data: requestData } = await supabase
        .from('requests')
        .select('*')
        .neq('status', RequestStatus.COMPLETED)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (requestData && requestData.length > 0) {
        setActiveRequest(requestData[0]);
      } else {
        setActiveRequest(null);
      }
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshState();
    // Poll every 5 seconds for "Real-time" feel without WebSockets
    const interval = setInterval(refreshState, 5000);
    return () => clearInterval(interval);
  }, [refreshState]);

  const setUserLocation = (loc: Location) => {
    setLoc(loc);
    localStorage.setItem('serveu_last_loc', JSON.stringify(loc));
  };

  useEffect(() => {
    const saved = localStorage.getItem('serveu_last_loc');
    if (saved) setLoc(JSON.parse(saved));
  }, []);

  const requestService = async (type: ServiceType, loc: Location): Promise<string> => {
    const { data, error } = await supabase.from('requests').insert([{
      service_type: type,
      user_location_display: loc.address,
      hidden_user_area: `${loc.x},${loc.y}`,
      status: RequestStatus.SEARCHING
    }]).select();

    if (error) throw error;
    setActiveRequest(data[0]);
    return data[0].id;
  };

  const toggleDuty = async (workerId: string, currentStatus: boolean) => {
    await supabase.from('workers').update({ on_duty: !currentStatus }).eq('id', workerId);
    await refreshState();
  };

  const acceptJob = async (requestId: string, workerId: string) => {
    // Simulated Latency
    await new Promise(r => setTimeout(r, 1500));

    const worker = workers.find(w => w.id === workerId);
    const req = activeRequest; // Simplified for MVP

    if (!worker || !req) return;

    // ETA Logic
    const [wx, wy] = worker.hiddenLocation.split(',').map(Number);
    const [ux, uy] = req.hidden_user_area.split(',').map(Number);
    const distance = Math.sqrt(Math.pow(wx - ux, 2) + Math.pow(wy - uy, 2));
    const eta = Math.ceil(distance / 2) + 2;

    await supabase.from('requests').update({
      status: RequestStatus.ACCEPTED,
      assigned_worker_id: workerId,
      eta_minutes: eta
    }).eq('id', requestId);
    
    await refreshState();
  };

  return (
    <AppContext.Provider value={{ 
      userLocation, 
      setUserLocation, 
      workers, 
      activeRequest, 
      loading, 
      refreshState,
      requestService,
      toggleDuty,
      acceptJob
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
