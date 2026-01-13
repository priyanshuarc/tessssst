
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import RequestFlow from './pages/RequestFlow';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="/request/:id" element={<RequestFlow />} />
            <Route path="/about" element={
              <div className="p-8 max-w-2xl mx-auto text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-4">About ServeU</h1>
                <p className="mb-4">
                  ServeU is built on the philosophy of <strong>"Services in Minutes"</strong>. 
                  Just as you expect groceries or a ride in minutes, we believe household services 
                  should be just as immediate.
                </p>
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h2 className="text-xl font-semibold text-white mb-2">Key Logic Principles</h2>
                  <ul className="list-disc ml-5 space-y-2">
                    <li><strong>Post-Acceptance ETA:</strong> Arrival time is only shared once a worker commits to the job, ensuring accuracy over estimates.</li>
                    <li><strong>Proximity Simulation:</strong> Uses internal coordinates to calculate travel time without exposing user privacy or relying on expensive Map APIs.</li>
                    <li><strong>Availability-Driven:</strong> Only on-duty workers are shown to ensure instant fulfillment.</li>
                  </ul>
                </div>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
