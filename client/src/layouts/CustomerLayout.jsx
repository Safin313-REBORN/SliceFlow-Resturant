import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSocket } from '../contexts/SocketContext';
import { Bell } from 'lucide-react';

const CustomerLayout = () => {
  const { liveOrderEvent } = useSocket();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6EF] dark:bg-dark-bg text-espresso dark:text-dark-text transition-colors duration-300">
      {/* Real-time Order Notification Banner */}
      {liveOrderEvent && (
        <div className="bg-honey text-forest px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b border-honey/40 shadow-sm animate-fade-in">
          <Bell className="w-4 h-4 animate-bounce text-primary" />
          <span>
            Order Status Update: Your order is now <strong>{liveOrderEvent.orderStatus}</strong>!
          </span>
        </div>
      )}

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
