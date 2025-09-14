import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import AuthView from './views/AuthView';
import CoursesView from './views/CoursesView';
import AssignmentsView from './views/AssignmentsView';
import ExamsView from './views/ExamsView'; 
import ProgressView from './views/ProgressView';
import ReminderView from './views/ReminderView';
import ScheduleView from './views/ScheduleView';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('courses');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <header style={{ padding: '10px 20px', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Study Planner App 🎓</h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setCurrentView('courses')}
                style={{ 
                  padding: '8px 16px', 
                  background: currentView === 'courses' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Courses
              </button>
              <button 
                onClick={() => setCurrentView('assignments')}
                style={{ 
                  padding: '8px 16px', 
                  background: currentView === 'assignments' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Assignments
              </button>
              <button 
                onClick={() => setCurrentView('exams')}
                style={{ 
                  padding: '8px 16px', 
                  background: currentView === 'exams' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Exams
              </button>
              <button
                onClick={() => setCurrentView('progress')}
                style={{ 
                  padding: '8px 16px', 
                  background: currentView === 'progress' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}  
              >
                Progress
              </button>
              <button 
              onClick={() => setCurrentView('reminders')}
              style={{
                padding: '8px 16px',
                background: currentView === 'reminders' ? '#007bff' : '#6c757d',
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              >
                Reminders
              </button>  
              <button 
                onClick={() => setCurrentView('schedule')}
                style={{ 
                  padding: '8px 16px', 
                  background: currentView === 'schedule' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                >
                Schedule
            </button>  
              
            </div>
            <div>
              <span>Welcome, {user.email} </span>
              <button 
                onClick={handleLogout}
                style={{ padding: '5px 10px', marginLeft: '10px', background: 'red', color: 'white', border: 'none' }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {!user ? <AuthView /> : (
        currentView === 'courses' ? <CoursesView /> : 
        currentView === 'assignments' ? <AssignmentsView /> :  
        currentView === 'exams' ? <ExamsView /> :
        currentView === 'progress' ? <ProgressView /> :
        currentView === 'reminders' ? <ReminderView /> :
        currentView === 'schedule' ? <ScheduleView /> :
        null
      )}
    </div>
  );
}

export default App; 
