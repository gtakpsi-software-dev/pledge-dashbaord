import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useGoogleLogin } from '@react-oauth/google';
import 'react-calendar/dist/Calendar.css';
import './CalendarSection.css';

function CalendarSection() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'google'
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Combine sample events with Google Calendar events
  const sampleEvents = [
    {
      date: new Date(2025, 9, 28), // October 28
      title: 'Chapter Meeting',
      time: '7:00 PM',
      type: 'meeting'
    },
    {
      date: new Date(2025, 9, 30), // October 30
      title: 'Networking Event',
      time: '6:30 PM',
      type: 'event'
    },
    {
      date: new Date(2025, 10, 1), // November 1
      title: '1:1 Deadline',
      time: 'All Day',
      type: 'deadline'
    },
    {
      date: new Date(2025, 10, 5), // November 5
      title: 'Pledge Exam',
      time: '8:00 PM',
      type: 'exam'
    }
  ];

  // Merge sample events with Google events
  const events = isConnected ? [...sampleEvents, ...googleEvents] : sampleEvents;

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasEvents = events.some(event => 
        event.date.toDateString() === date.toDateString()
      );
      if (hasEvents) {
        return 'has-events';
      }
    }
    return null;
  };

  const selectedDateEvents = getEventsForDate(date);

  // Fetch events from Google Calendar
  const fetchGoogleCalendarEvents = React.useCallback(async (token) => {
    setLoading(true);
    try {
      const now = new Date();
      // Fetch events from 3 months ago to 6 months ahead
      const timeMin = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
      const timeMax = new Date(now.getFullYear(), now.getMonth() + 6, 0).toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Google Calendar API Response:', data);
        console.log('Number of events found:', data.items?.length || 0);
        
        const formattedEvents = data.items.map(item => ({
          date: new Date(item.start.dateTime || item.start.date),
          title: item.summary,
          time: item.start.dateTime 
            ? new Date(item.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : 'All Day',
          type: 'google',
          description: item.description
        }));
        
        console.log('Formatted Google events:', formattedEvents);
        setGoogleEvents(formattedEvents);
      } else {
        console.error('Failed to fetch calendar events');
        if (response.status === 401) {
          // Token expired
          setIsConnected(false);
          setAccessToken(null);
          setGoogleEvents([]);
          localStorage.removeItem('googleCalendarToken');
        }
      }
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('googleCalendarToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsConnected(true);
      fetchGoogleCalendarEvents(storedToken);
    }
  }, [fetchGoogleCalendarEvents]);

  // Google OAuth login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('OAuth Success:', tokenResponse);
      setAccessToken(tokenResponse.access_token);
      setIsConnected(true);
      localStorage.setItem('googleCalendarToken', tokenResponse.access_token);
      await fetchGoogleCalendarEvents(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('OAuth Error:', error);
      alert('Failed to connect to Google Calendar. Please try again.');
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
  });

  const handleConnect = () => {
    // Check if Google OAuth is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('⚠️ Google Calendar sync is not configured yet.\n\nTo enable sync:\n1. Set up Google OAuth in Google Cloud Console\n2. Add VITE_GOOGLE_CLIENT_ID to your .env file\n\nFor now, opening Google Calendar in a new tab...');
      window.open('https://calendar.google.com', '_blank');
      return;
    }
    login();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAccessToken(null);
    setGoogleEvents([]);
    localStorage.removeItem('googleCalendarToken');
  };

  const handleRefresh = () => {
    if (accessToken) {
      fetchGoogleCalendarEvents(accessToken);
    }
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <h3>📅 Calendar & Events</h3>
        <div className="calendar-actions">
          {!isConnected ? (
            <button 
              className="btn-google-sync"
              onClick={handleConnect}
              disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              </svg>
              {loading ? 'Connecting...' : '🔗 Sync Google Calendar'}
            </button>
          ) : (
            <>
              <button 
                className="btn-google-connected"
                onClick={handleRefresh}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                {loading ? 'Syncing...' : '✓ Synced'}
              </button>
              <button 
                className="btn-disconnect"
                onClick={handleDisconnect}
                title="Disconnect Google Calendar"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>

      <div className="calendar-content">
        <div className="calendar-widget">
          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={getTileClassName}
          />
        </div>

        <div className="events-panel">
          <h4>Events for {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h4>
          
          {selectedDateEvents.length > 0 ? (
            <div className="events-list">
              {selectedDateEvents.map((event, index) => (
                <div key={index} className={`event-item event-${event.type}`}>
                  <div className="event-time">{event.time}</div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-type">{event.type}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events scheduled for this day</p>
            </div>
          )}

          <div className="calendar-info">
            {!isConnected ? (
              <p className="info-text">
                <strong>💡 Tip:</strong> Click "Sync Google Calendar" above to connect your personal calendar and see all your events here.
              </p>
            ) : (
              <p className="info-text info-success">
                <strong>✓ Connected:</strong> Showing events from your Google Calendar. Click "Synced" to refresh.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="upcoming-events">
        <h4>Upcoming Events</h4>
        <div className="upcoming-list">
          {events
            .filter(event => event.date >= new Date())
            .slice(0, 3)
            .map((event, index) => (
              <div key={index} className={`upcoming-item upcoming-${event.type}`}>
                <div className="upcoming-date">
                  <div className="date-day">{event.date.getDate()}</div>
                  <div className="date-month">
                    {event.date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                <div className="upcoming-details">
                  <div className="upcoming-title">{event.title}</div>
                  <div className="upcoming-time">{event.time}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarSection;

