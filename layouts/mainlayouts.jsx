import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationStore } from '../store/locationsstore';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { startTracking, stopTracking } = useLocationStore();

  useEffect(() => {
    // Initiate automatic real-time global GPS monitoring 
    // across the entire application interface.
    startTracking();
    
    // Stop tracing only if the layout unmounts completely
    return () => {
        stopTracking();
    };
  }, [startTracking, stopTracking]);

  return (
    <div className="h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-72 h-full z-50 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <Sidebar />
      </div>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Navbar (Static in Flex Column instead of Fixed) */}
        <div className="z-[60] w-full">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-white/10">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
