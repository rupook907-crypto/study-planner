import { useState, useEffect } from 'react';
import { ExamController } from '../controllers/ExamController';
import { CourseController } from '../controllers/CourseController';

const ExamsView = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('09:00');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examLocation, setExamLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load exams and courses on component mount
  useEffect(() => {
    const unsubscribeExams = ExamController.subscribeToExams(setExams);
    const unsubscribeCourses = CourseController.subscribeToCourses(setCourses);
    
    return () => {
      unsubscribeExams();
      unsubscribeCourses();
    };
  }, []);

  // Handle add exam
  const handleAddExam = async (e) => {
    e.preventDefault();
    setError('');
    
    const examData = {
      name: examName,
      examDate: examDate,
      courseId: selectedCourse,
      examTime: examTime,
      location: examLocation
    };

    // Validate using controller
    const validationError = ExamController.validateExam(examData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await ExamController.addExam(examData);
      // Reset form
      setExamName('');
      setExamDate('');
      setExamTime('09:00');
      setSelectedCourse('');
      setExamLocation('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete exam
  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      await ExamController.deleteExam(examId);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (exam) => {
    try {
      await ExamController.toggleComplete(exam);
    } catch (error) {
      setError(error.message);
    }
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Exam Countdown Timer ⏰</h2>
      
      {/* Add Exam Form */}
      <form onSubmit={handleAddExam} style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '20px',
        background: '#f9f9f9'
      }}>
        <h3>Add New Exam</h3>
        
        {error && (
          <div style={{ color: 'red', margin: '10px 0', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label>Exam Name *</label>
            <input
              type="text"
              placeholder="e.g., Midterm Exam, Final Exam"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label>Course *</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={loading || courses.length === 0}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Exam Date *</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              disabled={loading}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label>Exam Time</label>
            <input
              type="time"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g., Room 101, Main Hall"
              value={examLocation}
              onChange={(e) => setExamLocation(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{ 
            padding: '12px 24px', 
            background: loading ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {loading ? 'Adding Exam...' : 'Add Exam'}
        </button>
      </form>

      {/* Exams List */}
      <div>
        <h3>Your Exams ({exams.length})</h3>
        
        {exams.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            No exams scheduled yet. Add your first exam above!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {exams.map((exam) => {
              const countdown = ExamController.getCountdown(exam.examDate);
              const countdownColor = ExamController.getCountdownColor(countdown.days);
              
              return (
                <div
                  key={exam.id}
                  style={{
                    padding: '20px',
                    border: `2px solid ${countdownColor}`,
                    borderRadius: '8px',
                    background: exam.completed ? '#d4edda' : '#fff',
                    opacity: exam.completed ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input
                          type="checkbox"
                          checked={exam.completed}
                          onChange={() => handleToggleComplete(exam)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <h4 style={{ 
                          margin: 0, 
                          textDecoration: exam.completed ? 'line-through' : 'none',
                          color: exam.completed ? '#6c757d' : '#000'
                        }}>
                          {exam.name}
                        </h4>
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Course:</strong> {getCourseName(exam.courseId)}<br />
                        <strong>Date:</strong> {new Date(exam.examDate).toLocaleDateString()}<br />
                        <strong>Time:</strong> {new Date(exam.examDate).toLocaleTimeString()}<br />
                        {exam.location && <><strong>Location:</strong> {exam.location}<br /></>}
                      </div>

                      {/* Countdown Timer */}
                      {!exam.completed && (
                        <div style={{ 
                          padding: '15px', 
                          background: countdown.isOverdue ? '#ffcccc' : '#f0f9ff',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <h5 style={{ margin: '0 0 10px 0', color: countdownColor }}>
                            {countdown.isOverdue ? 'EXAM PASSED' : 'TIME UNTIL EXAM'}
                          </h5>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                            <div style={{ color: countdownColor }}>
                              <div>{countdown.days}</div>
                              <div style={{ fontSize: '12px' }}>DAYS</div>
                            </div>
                            <div style={{ color: countdownColor }}>
                              <div>{countdown.hours}</div>
                              <div style={{ fontSize: '12px' }}>HOURS</div>
                            </div>
                            <div style={{ color: countdownColor }}>
                              <div>{countdown.minutes}</div>
                              <div style={{ fontSize: '12px' }}>MINS</div>
                            </div>
                            <div style={{ color: countdownColor }}>
                              <div>{countdown.seconds}</div>
                              <div style={{ fontSize: '12px' }}>SECS</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => handleDeleteExam(exam.id)}
                        style={{ 
                          padding: '8px 16px', 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsView;