import { useState, useEffect } from 'react';
import { CourseController } from '../controllers/CourseController';

const CoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load courses on component mount
  useEffect(() => {
    const unsubscribe = CourseController.subscribeToCourses(setCourses);
    return unsubscribe;
  }, []);

  // Handle add course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate using controller
    const validationError = CourseController.validateCourseName(courseName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await CourseController.addCourse(courseName);
      setCourseName('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await CourseController.deleteCourse(courseId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Courses 📚</h2>
      
      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter course name (e.g., Mathematics, Physics)"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            margin: '10px 0', 
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        
        {error && (
          <div style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}
        
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
            fontSize: '16px'
          }}
        >
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </form>

      {/* Courses List */}
      <div>
        <h3>Your Courses ({courses.length})</h3>
        
        {courses.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No courses yet. Add your first course above!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {courses.map((course) => (
              <li 
                key={course.id} 
                style={{ 
                  padding: '15px', 
                  margin: '10px 0', 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ 
                  flex: 1, 
                  fontSize: '16px', 
                  fontWeight: '500' 
                }}>
                  {course.name}
                </span>
                
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoursesView;