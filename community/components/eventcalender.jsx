import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Safety Workshop',
      date: new Date(2024, 0, 20),
      time: '10:00 AM',
      location: 'Community Center',
      description: 'Learn about personal safety and security measures',
      type: 'workshop'
    },
    {
      id: 2,
      title: 'Cyber Security Webinar',
      date: new Date(2024, 0, 25),
      time: '2:00 PM',
      location: 'Online',
      description: 'Protect yourself from online threats',
      type: 'webinar'
    },
    {
      id: 3,
      title: 'Neighborhood Watch Meeting',
      date: new Date(2024, 0, 28),
      time: '6:30 PM',
      location: 'Local Police Station',
      description: 'Monthly meeting for neighborhood watch program',
      type: 'meeting'
    }
  ]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    location: '',
    description: '',
    type: 'workshop'
  });

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="event-dot">
            <span className="dot"></span>
            <span className="event-count">{dayEvents.length}</span>
          </div>
        );
      }
    }
    return null;
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now(),
      date: selectedDate
    };
    setEvents([...events, event]);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      time: '',
      location: '',
      description: '',
      type: 'workshop'
    });
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <h2>Community Event Calendar</h2>
        <p>Stay updated with safety workshops, meetings, and community events</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-section">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="custom-calendar"
          />
        </div>

        <div className="events-section">
          <div className="events-header">
            <h3>Events for {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <button onClick={() => setShowEventForm(true)} className="add-event-btn">
              + Add Event
            </button>
          </div>

          {selectedEvents.length > 0 ? (
            <div className="events-list">
              {selectedEvents.map(event => (
                <div key={event.id} className={`event-card ${event.type}`}>
                  <div className="event-time">{event.time}</div>
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p className="event-location">📍 {event.location}</p>
                    <p className="event-description">{event.description}</p>
                    <div className="event-type-badge">{event.type}</div>
                  </div>
                  <button className="register-btn">Register</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <p>No events scheduled for this date</p>
              <button onClick={() => setShowEventForm(true)} className="create-event-btn">
                Create an Event
              </button>
            </div>
          )}
        </div>
      </div>

      {showEventForm && (
        <div className="modal-overlay" onClick={() => setShowEventForm(false)}>
          <div className="event-form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Create Event</button>
                <button type="button" onClick={() => setShowEventForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .event-calendar {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .calendar-header {
          margin-bottom: 30px;
        }

        .calendar-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .calendar-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .calendar-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        .calendar-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        :global(.custom-calendar) {
          width: 100%;
          border: none;
        }

        :global(.custom-calendar .react-calendar__tile) {
          padding: 1em 0.5em;
          position: relative;
        }

        .event-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #007bff;
          border-radius: 50%;
        }

        .event-count {
          font-size: 10px;
          color: #007bff;
        }

        .events-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .events-header h3 {
          margin: 0;
          color: #333;
        }

        .add-event-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .event-card {
          display: flex;
          gap: 15px;
          padding: 15px;
          border-radius: 8px;
          background: #f8f9fa;
          transition: transform 0.2s;
        }

        .event-card:hover {
          transform: translateX(5px);
        }

        .event-card.workshop { border-left: 4px solid #28a745; }
        .event-card.webinar { border-left: 4px solid #007bff; }
        .event-card.meeting { border-left: 4px solid #ffc107; }

        .event-time {
          font-weight: bold;
          color: #007bff;
          min-width: 80px;
        }

        .event-details {
          flex: 1;
        }

        .event-details h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .event-location, .event-description {
          margin: 0 0 5px 0;
          font-size: 13px;
          color: #666;
        }

        .event-type-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #e0e0e0;
          border-radius: 4px;
          font-size: 11px;
          margin-top: 5px;
        }

        .register-btn {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          height: fit-content;
        }

        .no-events {
          text-align: center;
          padding: 40px;
        }

        .no-events-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .create-event-btn {
          margin-top: 15px;
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .event-form-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
        }

        .event-form-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
          font-size: 14px;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .submit-btn, .cancel-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .submit-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .calendar-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
