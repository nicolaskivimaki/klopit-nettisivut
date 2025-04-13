import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface EventData {
  _id: string;
  title: string;
  date: string;
  description: string;
}

interface CalendarViewProps {
  events: EventData[];
}

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the day of week (0 = Monday, 6 = Sunday)
const getWeekday = (year: number, month: number, day: number): number => {
  const weekday = new Date(year, month, day).getDay();
  // Convert Sunday (0) to 6 and other days to 0-5 (Monday-Saturday)
  return weekday === 0 ? 6 : weekday - 1;
};

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState<Array<{ day: number; events: EventData[] }>>([]);
  
  // Prepare calendar data whenever month or year changes
  useEffect(() => {
    const days = getDaysInMonth(currentYear, currentMonth);
    const firstWeekday = getWeekday(currentYear, currentMonth, 1);
    
    // Create array of days with their events
    const daysArray = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push({ day: 0, events: [] });
    }
    
    // Add days of the month with their events
    for (let day = 1; day <= days; day++) {
      
      // Find events for this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === currentYear && 
               eventDate.getMonth() === currentMonth && 
               eventDate.getDate() === day;
      });
      
      daysArray.push({ day, events: dayEvents });
    }
    
    setCalendarDays(daysArray);
  }, [currentMonth, currentYear, events]);
  
  // Navigation to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigation to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Get month name in Finnish
  const getMonthName = (month: number): string => {
    const monthNames = [
      'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 
      'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 
      'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
    ];
    return monthNames[month];
  };
  
  // Get weekday names in Finnish
  const weekdayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
          &lt;
        </button>
        <h3 className="calendar-title">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>
      
      <div className="calendar-grid">
        {/* Weekday headers */}
        {weekdayNames.map((name, index) => (
          <div key={`weekday-${index}`} className="calendar-weekday">
            {name}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((dayData, index) => (
          <div 
            key={`day-${index}`} 
            className={`calendar-day ${dayData.day === 0 ? 'empty-day' : ''} ${
              dayData.events.length > 0 ? 'has-events' : ''
            }`}
          >
            {dayData.day !== 0 && (
              <>
                <div className="day-number">{dayData.day}</div>
                <div className="day-events">
                  {dayData.events.map(event => (
                    <Link 
                      key={event._id} 
                      to={`/events/${event._id}`} 
                      className="calendar-event"
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView; 