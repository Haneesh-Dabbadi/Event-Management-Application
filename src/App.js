import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch events from the server
    setIsLoading(true);
    axios.get('http://localhost:5000/api/events')
      .then(response => {
        setEvents(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleEventAdd = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleEventDelete = (id) => {
    // Delete an event
    axios.delete(`http://localhost:5000/api/events/${id}`)
      .then(() => setEvents(events.filter(event => event._id !== id)))
      .catch(error => console.error(error));
  };

  const handleToggleReminder = (eventId) => {
    // Find the event by ID
    const selectedEvent = events.find(event => event._id === eventId);

    // Toggle the reminder status
    const updatedEvent = {
      ...selectedEvent,
      reminder: !selectedEvent.reminder
    };

    // Update the event in the database
    axios.put(`http://localhost:5000/api/events/${eventId}`, updatedEvent)
      .then(() => {
        // If the update is successful, update the events in the state
        const updatedEvents = events.map(event =>
          event._id === eventId ? updatedEvent : event
        );
        setEvents(updatedEvents);
      })
      .catch(error => console.error(`Error updating reminder status for event with ID ${eventId}:`, error));
  };

  const onEventEdit = (eventId, updatedData) => {
    // Update the event in the database
    axios.put(`http://localhost:5000/api/events/${eventId}`, updatedData)
      .then(() => {
        // If the update is successful, update the events in the state
        const updatedEvents = events.map(event =>
          event._id === eventId ? { ...event, ...updatedData } : event
        );
        setEvents(updatedEvents);
      })
      .catch(error => console.error(`Error updating event with ID ${eventId}:`, error));
  };

  // Create decorative floating elements
  const FloatingElements = () => {
    // Define different shapes and positions
    const elements = [
      { type: 'circle', size: 60, top: '15%', left: '10%', color: 'rgba(255, 255, 255, 0.1)', animation: 'float 15s infinite ease-in-out' },
      { type: 'circle', size: 40, top: '75%', left: '85%', color: 'rgba(255, 255, 255, 0.08)', animation: 'float 18s infinite ease-in-out reverse' },
      { type: 'square', size: 50, top: '45%', left: '5%', color: 'rgba(255, 255, 255, 0.07)', animation: 'float 20s infinite ease-in-out 1s' },
      { type: 'square', size: 30, top: '20%', left: '90%', color: 'rgba(255, 255, 255, 0.05)', animation: 'float 17s infinite ease-in-out 2s' },
      { type: 'triangle', size: 70, top: '80%', left: '15%', color: 'rgba(255, 255, 255, 0.06)', animation: 'float 22s infinite ease-in-out 3s' },
      { type: 'circle', size: 25, top: '35%', left: '92%', color: 'rgba(255, 255, 255, 0.1)', animation: 'float 14s infinite ease-in-out 1.5s' },
    ];

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {elements.map((el, index) => {
          let shape;
          if (el.type === 'circle') {
            shape = <div style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              borderRadius: '50%',
              background: el.color,
              position: 'absolute',
              top: el.top,
              left: el.left,
              animation: el.animation,
            }} />;
          } else if (el.type === 'square') {
            shape = <div style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              background: el.color,
              position: 'absolute',
              top: el.top,
              left: el.left,
              transform: 'rotate(45deg)',
              animation: el.animation,
            }} />;
          } else if (el.type === 'triangle') {
            shape = <div style={{
              width: 0,
              height: 0,
              borderLeft: `${el.size/2}px solid transparent`,
              borderRight: `${el.size/2}px solid transparent`,
              borderBottom: `${el.size}px solid ${el.color}`,
              position: 'absolute',
              top: el.top,
              left: el.left,
              animation: el.animation,
            }} />;
          }
          return <div key={index}>{shape}</div>;
        })}
      </div>
    );
  };

  return (
    <div className='main-container'>
      <FloatingElements />
      <h2>Event Management App</h2>
      <EventForm onEventAdd={handleEventAdd} />
      {isLoading ? (
        <p className="loading-message">Loading events...</p>
      ) : (
        <EventList
          events={events}
          onEventDelete={handleEventDelete}
          onToggleReminder={handleToggleReminder}
          onEventEdit={onEventEdit}
        />
      )}
    </div>
  );
};

export default App;