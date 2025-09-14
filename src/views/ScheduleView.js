import { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks,
  isToday
} from 'date-fns';
import { ScheduleUtils } from '../utils/scheduleUtils';
import { AssignmentController } from '../controllers/AssignmentController';
import { ExamController } from '../controllers/ExamController';
import { CourseController } from '../controllers/CourseController';
import WeekCalendar from '../components/WeekCalendar';

const ScheduleView = () => {
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load data
  useEffect(() => {
    const unsubscribeAssignments = AssignmentController.subscribeToAssignments(setAssignments);
    const unsubscribeExams = ExamController.subscribeToExams(setExams);
    const unsubscribeCourses = CourseController.subscribeToCourses(setCourses);

    return () => {
      unsubscribeAssignments();
      unsubscribeExams();
      unsubscribeCourses();
    };
  }, []);

  // Convert data to calendar events
  useEffect(() => {
    const assignmentEvents = ScheduleUtils.convertAssignmentsToEvents(assignments, courses);
    const examEvents = ScheduleUtils.convertExamsToEvents(exams, courses);
    const allEvents = [...assignmentEvents, ...examEvents];
    
    setEvents(allEvents);
  }, [assignments, exams, courses]);

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for the current week
  const weekEvents = ScheduleUtils.getWeekEvents(events, currentDate);
  const todaysEvents = ScheduleUtils.getDayEvents(events, new Date());

  // Event handlers
  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Weekly Schedule 📅</h2>
      
      {/* Navigation Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <button
          onClick={goToPreviousWeek}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Previous Week
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0 }}>
            {ScheduleUtils.formatCalendarDate(currentDate)}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {format(startOfWeek(currentDate), 'MMM d')} - {format(endOfWeek(currentDate), 'MMM d, yyyy')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={goToToday}
            style={{
              padding: '8px 16px',
              background: isToday(currentDate) ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Next Week →
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Sidebar - Today's Events */}
        <div style={{ 
          padding: '15px', 
          background: 'white', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#007bff' }}>
            Today's Events
          </h3>
          
          {todaysEvents.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>
              No events scheduled for today! 🎉
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {todaysEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  style={{
                    padding: '12px',
                    background: event.color,
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    opacity: event.isCompleted ? 0.6 : 1,
                    borderLeft: event.type === 'exam' ? '4px solid #ff0000' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>
                    {ScheduleUtils.formatTime(event.start)}
                  </div>
                  {event.course && (
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {event.course.name}
                    </div>
                  )}
                  {event.type === 'exam' && event.rawData.location && (
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      📍 {event.rawData.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Calendar */}
        <div>
          <WeekCalendar
            events={weekEvents}
            currentDate={currentDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>{selectedEvent.title}</h3>
            <p><strong>Type:</strong> {selectedEvent.type === 'exam' ? 'Exam' : 'Assignment'}</p>
            <p><strong>Time:</strong> {ScheduleUtils.formatTime(selectedEvent.start)}</p>
            <p><strong>Date:</strong> {ScheduleUtils.formatDate(selectedEvent.start)}</p>
            {selectedEvent.course && (
              <p><strong>Course:</strong> {selectedEvent.course.name}</p>
            )}
            {selectedEvent.type === 'exam' && selectedEvent.rawData.location && (
              <p><strong>Location:</strong> {selectedEvent.rawData.location}</p>
            )}
            <p><strong>Status:</strong> {selectedEvent.isCompleted ? 'Completed ✅' : 'Pending ⏳'}</p>
            
            <button
              onClick={handleCloseEventDetails}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#e9ecef', 
        borderRadius: '8px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h4 style={{ margin: 0 }}>Legend:</h4>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#FF6B6B', borderRadius: '3px' }}></div>
            <span>Assignments</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#3A86FF', borderRadius: '3px', borderLeft: '3px solid red' }}></div>
            <span>Exams</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#999', borderRadius: '3px', opacity: 0.6 }}></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView; 