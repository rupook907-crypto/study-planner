import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';

const WeekCalendar = ({ 
  events, 
  currentDate, 
  onDateClick, 
  onEventClick 
}) => {
  const weekDays = [];
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    weekDays.push(day);
  }

  // Group events by day
  const eventsByDay = {};
  events.forEach(event => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    if (!eventsByDay[dateKey]) {
      eventsByDay[dateKey] = [];
    }
    eventsByDay[dateKey].push(event);
  });

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      background: '#ddd',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header Row - Days */}
      {weekDays.map(day => (
        <div
          key={day.toString()}
          style={{
            background: 'white',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            borderBottom: '2px solid #eee'
          }}
        >
          <div style={{ 
            color: isToday(day) ? '#007bff' : '#333',
            fontSize: isToday(day) ? '16px' : '14px'
          }}>
            {format(day, 'EEE')}
          </div>
          <div style={{ 
            color: isToday(day) ? '#007bff' : '#666',
            fontSize: isToday(day) ? '18px' : '16px',
            fontWeight: isToday(day) ? 'bold' : 'normal'
          }}>
            {format(day, 'd')}
          </div>
        </div>
      ))}

      {/* Events Row */}
      {weekDays.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEvents = eventsByDay[dateKey] || [];
        
        return (
          <div
            key={day.toString()}
            style={{
              background: 'white',
              padding: '10px',
              minHeight: '120px',
              borderRight: '1px solid #eee',
              position: 'relative'
            }}
            onClick={() => onDateClick && onDateClick(day)}
          >
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick && onEventClick(event);
                }}
                style={{
                  background: event.color,
                  color: 'white',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  marginBottom: '5px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  opacity: event.isCompleted ? 0.6 : 1,
                  borderLeft: event.type === 'exam' ? '3px solid #ff0000' : 'none'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  {format(event.start, 'h:mm a')}
                </div>
                {event.course && (
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>
                    {event.course.name}
                  </div>
                )}
              </div>
            ))}
            
            {dayEvents.length > 3 && (
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '5px',
                textAlign: 'center'
              }}>
                +{dayEvents.length - 3} more
              </div>
            )}
            
            {dayEvents.length === 0 && (
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                textAlign: 'center',
                marginTop: '10px'
              }}>
                No events
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeekCalendar; 
