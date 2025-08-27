import { useState, useEffect } from 'react';
import { ReminderUtils } from '../utils/reminderUtils';
import { AssignmentController } from '../controllers/AssignmentController';
import { ExamController } from '../controllers/ExamController';
import { CourseController } from '../controllers/CourseController';

const ReminderView = () => {
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [upcomingItems, setUpcomingItems] = useState({ upcomingAssignments: [], upcomingExams: [] });

  // Load data and setup reminders
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

  // Check for reminders periodically
  useEffect(() => {
    let reminderInterval;

    if (remindersEnabled) {
      checkReminders();
      
      reminderInterval = setInterval(() => {
        checkReminders();
      }, ReminderUtils.getNextCheckTime());
    }

    return () => {
      if (reminderInterval) {
        clearInterval(reminderInterval);
      }
    };
  }, [remindersEnabled, assignments, exams]);

  // Check for upcoming reminders
  const checkReminders = () => {
    const { upcomingAssignments, upcomingExams } = ReminderUtils.checkUpcomingDeadlines(assignments, exams);
    setUpcomingItems({ upcomingAssignments, upcomingExams });

    if (upcomingAssignments.length > 0 || upcomingExams.length > 0) {
      showReminderNotification(upcomingAssignments, upcomingExams);
    }
  };

  // Show browser notification
  const showReminderNotification = (upcomingAssignments, upcomingExams) => {
    const message = ReminderUtils.formatReminderMessage(upcomingAssignments, upcomingExams);
    ReminderUtils.showNotification('📚 Study Planner Reminder', message);
  };

  // Request notification permission
  const handleEnableReminders = async () => {
    const granted = await ReminderUtils.requestNotificationPermission();
    setNotificationPermission(Notification.permission);
    
    if (granted) {
      setRemindersEnabled(true);
      checkReminders();
    }
  };

  // Disable reminders
  const handleDisableReminders = () => {
    setRemindersEnabled(false);
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Reminder System 🔔</h2>

      {/* Reminder Controls */}
      <div style={{ 
        padding: '20px', 
        border: '2px solid #007bff', 
        borderRadius: '10px',
        marginBottom: '20px',
        background: '#f8f9fa',
        textAlign: 'center'
      }}>
        <h3>Notification Settings</h3>
        
        {notificationPermission === 'granted' ? (
          remindersEnabled ? (
            <div>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                ✅ Reminders are ENABLED
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                You'll receive notifications for deadlines within 24 hours
              </p>
              <button 
                onClick={handleDisableReminders}
                style={{ 
                  padding: '10px 20px', 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Disable Reminders
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: '#666' }}>
                Notifications are allowed but reminders are disabled
              </p>
              <button 
                onClick={() => setRemindersEnabled(true)}
                style={{ 
                  padding: '10px 20px', 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Enable Reminders
              </button>
            </div>
          )
        ) : (
          <div>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Enable browser notifications to get reminders for upcoming deadlines
            </p>
            <button 
              onClick={handleEnableReminders}
              style={{ 
                padding: '10px 20px', 
                background: '#007bff', 
                color: 'white', 
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Enable Notifications
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h3>Upcoming Deadlines (Next 24 Hours)</h3>
        
        {(upcomingItems.upcomingAssignments.length === 0 && upcomingItems.upcomingExams.length === 0) ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No upcoming deadlines in the next 24 hours. Great job! 🎉
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {/* Upcoming Assignments */}
            {upcomingItems.upcomingAssignments.length > 0 && (
              <div>
                <h4 style={{ color: '#dc3545' }}>📝 Assignments Due Soon</h4>
                {upcomingItems.upcomingAssignments.map(assignment => (
                  <div
                    key={assignment.id}
                    style={{
                      padding: '15px',
                      border: '1px solid #ffcccc',
                      borderRadius: '8px',
                      background: '#fffafa',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{assignment.title}</strong>
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          Course: {getCourseName(assignment.courseId)}
                        </p>
                        <p style={{ margin: '5px 0', color: '#dc3545', fontWeight: 'bold' }}>
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </p>
                      </div>
                      <div style={{ 
                        padding: '5px 10px', 
                        background: '#dc3545', 
                        color: 'white', 
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        URGENT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming Exams */}
            {upcomingItems.upcomingExams.length > 0 && (
              <div>
                <h4 style={{ color: '#fd7e14' }}>📚 Exams Coming Up</h4>
                {upcomingItems.upcomingExams.map(exam => (
                  <div
                    key={exam.id}
                    style={{
                      padding: '15px',
                      border: '1px solid #ffe6cc',
                      borderRadius: '8px',
                      background: '#fffaf0',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{exam.name}</strong>
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          Course: {getCourseName(exam.courseId)}
                        </p>
                        <p style={{ margin: '5px 0', color: '#fd7e14', fontWeight: 'bold' }}>
                          Exam: {new Date(exam.examDate).toLocaleString()}
                        </p>
                        {exam.location && (
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            Location: {exam.location}
                          </p>
                        )}
                      </div>
                      <div style={{ 
                        padding: '5px 10px', 
                        background: '#fd7e14', 
                        color: 'white', 
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        EXAM
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#e9ecef', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>ℹ️ How It Works</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Notifications are checked every 5 minutes</li>
          <li>You'll get alerts for deadlines within 24 hours</li>
          <li>Notifications work even when the app is closed</li>
          <li>Make sure browser notifications are allowed</li>
        </ul>
      </div>
    </div>
  );
};

export default ReminderView;