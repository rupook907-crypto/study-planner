import { useState, useEffect } from 'react';
import { ProgressUtils } from '../utils/progressUtils';
import { AssignmentController } from '../controllers/AssignmentController';
import { ExamController } from '../controllers/ExamController';
import { CourseController } from '../controllers/CourseController';

const ProgressView = () => {
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const unsubscribeAssignments = AssignmentController.subscribeToAssignments(setAssignments);
    const unsubscribeExams = ExamController.subscribeToExams(setExams);
    const unsubscribeCourses = CourseController.subscribeToCourses(setCourses);
    
    // Set loading to false after data loads
    setTimeout(() => setLoading(false), 1000);
    
    return () => {
      unsubscribeAssignments();
      unsubscribeExams();
      unsubscribeCourses();
    };
  }, []);

  // Calculate progress
  const overallProgress = ProgressUtils.calculateOverallProgress(assignments, exams);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading progress...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Progress Tracker 📊</h2>
      
      {/* Overall Progress */}
      <div style={{ 
        padding: '20px', 
        border: '2px solid #007bff', 
        borderRadius: '10px',
        marginBottom: '20px',
        background: '#f8f9fa'
      }}>
        <h3>Overall Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: `conic-gradient(${ProgressUtils.getProgressColor(overallProgress)} ${overallProgress * 3.6}deg, #ddd 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {overallProgress}%
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{ProgressUtils.getProgressMessage(overallProgress)}</h4>
            <p style={{ margin: 0, color: '#666' }}>
              {assignments.filter(a => a.completed).length + exams.filter(e => e.completed).length} of 
              {assignments.length + exams.length} tasks completed
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '20px', 
          background: '#ddd', 
          borderRadius: '10px',
          overflow: 'hidden',
          marginTop: '10px'
        }}>
          <div 
            style={{ 
              width: `${overallProgress}%`, 
              height: '100%', 
              background: ProgressUtils.getProgressColor(overallProgress),
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '10px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            {overallProgress}%
          </div>
        </div>
      </div>

      {/* Course-wise Progress */}
      <div>
        <h3>Progress by Course</h3>
        {courses.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center' }}>No courses yet. Add courses to track progress.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {courses.map(course => {
              const courseProgress = ProgressUtils.calculateCourseProgress(course.id, assignments, exams);
              const courseAssignments = assignments.filter(a => a.courseId === course.id);
              const courseExams = exams.filter(e => e.courseId === course.id);
              const totalItems = courseAssignments.length + courseExams.length;
              
              return (
                <div
                  key={course.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: '#fff'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0' }}>{course.name}</h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: `conic-gradient(${ProgressUtils.getProgressColor(courseProgress)} ${courseProgress * 3.6}deg, #ddd 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {courseProgress}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        width: '100%', 
                        height: '12px', 
                        background: '#ddd', 
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            width: `${courseProgress}%`, 
                            height: '100%', 
                            background: ProgressUtils.getProgressColor(courseProgress),
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                        {courseAssignments.filter(a => a.completed).length + courseExams.filter(e => e.completed).length} of {totalItems} tasks completed
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
        <h4>📈 Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong>Total Assignments:</strong> {assignments.length}
          </div>
          <div>
            <strong>Completed Assignments:</strong> {assignments.filter(a => a.completed).length}
          </div>
          <div>
            <strong>Total Exams:</strong> {exams.length}
          </div>
          <div>
            <strong>Completed Exams:</strong> {exams.filter(e => e.completed).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;