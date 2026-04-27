import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  PhoneIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const SchedulesHub = () => {
  const [scheduledItems, setScheduledItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed, expired
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    message: '',
    category: 'Family',
    type: 'Voice Only'
  });

  // Load schedules from localStorage
  useEffect(() => {
    const loadSchedules = () => {
      // Load from VoiceClone schedules
      const voiceCloneSchedules = localStorage.getItem('vc_scheduled');
      const voiceCloneLogs = localStorage.getItem('vc_logs');
      
      let allSchedules = [];

      if (voiceCloneSchedules) {
        const schedules = JSON.parse(voiceCloneSchedules);
        allSchedules = schedules.map(s => ({
          ...s,
          date: new Date().toISOString().split('T')[0], // Today's date
          status: getScheduleStatus(s.time),
          source: 'Voice Clone',
          completed: false
        }));
      }

      // Load completed logs
      if (voiceCloneLogs) {
        const logs = JSON.parse(voiceCloneLogs);
        logs.forEach(log => {
          allSchedules.push({
            id: log.id,
            name: log.phone,
            phone: log.phone,
            message: log.message,
            category: log.category,
            timestamp: log.timestamp,
            date: log.timestamp.split(' ')[0],
            time: log.timestamp.split(' ')[1],
            status: 'completed',
            source: 'Voice Clone',
            completed: true,
            type: 'Voice Only'
          });
        });
      }

      // Load custom schedules
      const customSchedules = localStorage.getItem('custom_schedules');
      if (customSchedules) {
        const customs = JSON.parse(customSchedules);
        allSchedules = [...allSchedules, ...customs];
      }

      // Sort by date and time
      allSchedules.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA; // Latest first
      });

      setScheduledItems(allSchedules);
    };

    loadSchedules();
  }, []);

  // Get schedule status based on time
  const getScheduleStatus = (time) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (time <= currentTime) {
      return 'completed';
    } else {
      return 'pending';
    }
  };

  // Add new schedule
  const handleAddSchedule = (e) => {
    e.preventDefault();
    
    if (!newSchedule.name || !newSchedule.phone || !newSchedule.date || !newSchedule.time || !newSchedule.message) {
      toast.error('Please fill all fields');
      return;
    }

    const schedule = {
      ...newSchedule,
      id: Date.now(),
      status: getScheduleStatus(newSchedule.time),
      source: 'Custom',
      completed: false
    };

    const updatedSchedules = [...scheduledItems, schedule];
    setScheduledItems(updatedSchedules);

    // Save to localStorage
    const customSchedules = localStorage.getItem('custom_schedules');
    const customs = customSchedules ? JSON.parse(customSchedules) : [];
    customs.push(schedule);
    localStorage.setItem('custom_schedules', JSON.stringify(customs));

    toast.success('Schedule added successfully!');
    setNewSchedule({
      name: '',
      phone: '',
      date: '',
      time: '',
      message: '',
      category: 'Family',
      type: 'Voice Only'
    });
    setShowAddSchedule(false);
  };

  // Mark as completed
  const handleMarkComplete = (id) => {
    const updated = scheduledItems.map(item =>
      item.id === id ? { ...item, status: 'completed', completed: true } : item
    );
    setScheduledItems(updated);
    toast.success('Schedule marked as completed!');
  };

  // Delete schedule
  const handleDeleteSchedule = (id) => {
    const updated = scheduledItems.filter(item => item.id !== id);
    setScheduledItems(updated);
    
    // Update localStorage
    const customSchedules = localStorage.getItem('custom_schedules');
    if (customSchedules) {
      const customs = JSON.parse(customSchedules).filter(s => s.id !== id);
      localStorage.setItem('custom_schedules', JSON.stringify(customs));
    }
    
    toast.success('Schedule deleted!');
  };

  // Filter schedules
  const getFilteredSchedules = () => {
    return scheduledItems.filter(item => {
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      return statusMatch && categoryMatch;
    });
  };

  const filteredSchedules = getFilteredSchedules();

  // Calculate statistics
  const stats = {
    total: scheduledItems.length,
    pending: scheduledItems.filter(s => s.status === 'pending').length,
    completed: scheduledItems.filter(s => s.status === 'completed').length,
    today: scheduledItems.filter(s => s.date === new Date().toISOString().split('T')[0]).length
  };

  const categories = ['Family', 'Health', 'Emergency', 'Business', 'Education'];
  const categoryEmojis = {
    Family: '👨‍👩‍👧‍👦',
    Health: '🏥',
    Emergency: '🚨',
    Business: '💼',
    Education: '🏫'
  };

  return (
    <div className="space-y-8 bg-[#f5f6f8] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-6 pb-20">
      
      {/* Header */}
      <div className="pt-2 pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3a3f45] flex items-center gap-2 md:gap-3">
          <ClockIcon className="w-7 h-7 md:w-8 md:h-8" /> SCHEDULES HUB
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">
          Track all your scheduled tasks, reminders, and calls in one place
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
          <div className="text-3xl font-black text-[#7c56c2] mb-1">{stats.total}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Schedules</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
          <div className="text-3xl font-black text-[#ff556c] mb-1">{stats.pending}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pending</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
          <div className="text-3xl font-black text-[#56bc56] mb-1">{stats.completed}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Completed</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
          <div className="text-3xl font-black text-[#fdb022] mb-1">{stats.today}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Today</div>
        </div>
      </div>

      {/* Action Buttons & Filters */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <button
            onClick={() => setShowAddSchedule(!showAddSchedule)}
            className="bg-[#7c56c2] hover:bg-[#6e4cb0] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" /> Add New Schedule
          </button>
          
          <button
            onClick={() => setScheduledItems([])}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <TrashIcon className="w-5 h-5" /> Clear All
          </button>
        </div>

        {/* Add Schedule Form */}
        {showAddSchedule && (
          <form onSubmit={handleAddSchedule} className="space-y-4 mb-6 pb-6 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Recipient Name"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newSchedule.phone}
                onChange={(e) => setNewSchedule({...newSchedule, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              />
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              />
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              />
              <select
                value={newSchedule.category}
                onChange={(e) => setNewSchedule({...newSchedule, category: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({...newSchedule, type: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
              >
                <option>Voice Only</option>
                <option>SMS Only</option>
                <option>Voice + SMS</option>
              </select>
            </div>
            <textarea
              placeholder="Message or reminder text..."
              value={newSchedule.message}
              onChange={(e) => setNewSchedule({...newSchedule, message: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 h-20 resize-none focus:ring-2 focus:ring-[#7c56c2] focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#56bc56] hover:bg-[#4caf50] text-white py-3 rounded-xl font-bold transition-colors"
              >
                Save Schedule
              </button>
              <button
                type="button"
                onClick={() => setShowAddSchedule(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
                { value: 'pending', label: 'Pending', color: 'bg-red-100 text-red-700' },
                { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filterStatus === status.value
                      ? `${status.color} ring-2 ring-offset-0 ring-current`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filterCategory === 'all'
                    ? 'bg-[#7c56c2] text-white ring-2 ring-offset-0 ring-[#7c56c2]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    filterCategory === cat
                      ? 'bg-[#7c56c2] text-white ring-2 ring-offset-0 ring-[#7c56c2]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{categoryEmojis[cat]}</span> {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 border border-gray-100 text-center">
            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Schedules Found</h3>
            <p className="text-gray-500 mb-6">
              {filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first schedule to get started'}
            </p>
            {(filterStatus !== 'all' || filterCategory !== 'all') && (
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                }}
                className="bg-[#7c56c2] hover:bg-[#6e4cb0] text-white px-6 py-2 rounded-lg font-bold transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredSchedules.map(schedule => (
            <div
              key={schedule.id}
              className={`bg-white rounded-3xl shadow-sm p-6 border-l-4 transition-all hover:shadow-md ${
                schedule.completed
                  ? 'border-l-green-500 border-gray-100'
                  : 'border-l-[#ff556c] border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Left Section: Basic Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-[#3a3f45] max-w-[200px]">
                      {schedule.name}
                    </h3>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">
                      {categoryEmojis[schedule.category]} {schedule.category}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                      {schedule.source}
                    </span>
                    {schedule.completed && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm max-w-[500px] line-clamp-2">
                    💬 "{schedule.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
                    <span className="flex items-center gap-1.5">
                      <PhoneIcon className="w-4 h-4 text-[#7c56c2]" />
                      {schedule.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#fdb022]" />
                      {schedule.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4 text-[#ff556c]" />
                      {schedule.time}
                    </span>
                    {schedule.type && (
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {schedule.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {!schedule.completed && (
                    <button
                      onClick={() => handleMarkComplete(schedule.id)}
                      className="flex-1 md:flex-none bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Mark Done
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#ff556c] mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">Pending Schedules</p>
              <p className="text-gray-500 text-xs">Scheduled calls yet to be executed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#56bc56] mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">Completed Schedules</p>
              <p className="text-gray-500 text-xs">Successfully executed or manually marked done</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-400 mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">Source Types</p>
              <p className="text-gray-500 text-xs">Voice Clone auto-schedules or Custom schedules</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SchedulesHub;
