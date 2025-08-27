import { useState, useEffect } from 'react';
import { AssignmentController } from '../controllers/AssignmentController';
import { CourseController } from '../controllers/CourseController';

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load assignments and courses on component mount
  useEffect(() => {
    const unsubscribeAssignments = AssignmentController.subscribeToAssignments(setAssignments);
    const unsubscribeCourses = CourseController.subscribeToCourses(setCourses);
    
    return () => {
      unsubscribeAssignments();
      unsubscribeCourses();
    };
  }, []);

  // Handle add assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setError('');
    
    const assignmentData = {
      title,
      description,
      dueDate,
      courseId: selectedCourse,
      priority
    };

    // Validate using controller
    const validationError = AssignmentController.validateAssignment(assignmentData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await AssignmentController.addAssignment(assignmentData);
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedCourse('');
      setPriority('medium');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await AssignmentController.deleteAssignment(assignmentId);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (assignment) => {
    try {
      await AssignmentController.toggleComplete(assignment);
    } catch (error) {
      setError(error.message);
    }
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  // Get days until due and status
  const getDueDateInfo = (dueDate) => {
    const daysUntilDue = AssignmentController.getDaysUntilDue(dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    return { daysUntilDue, isOverdue, isDueSoon };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Assignment Tracker 📝</h2>
      
      {/* Add Assignment Form */}
      <form onSubmit={handleAddAssignment} style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '20px',
        background: '#f9f9f9'
      }}>
        <h3>Add New Assignment</h3>
        
        {error && (
          <div style={{ color: 'red', margin: '10px 0', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label>Title *</label>
            <input
              type="text"
              placeholder="Assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label>Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>Description</label>
          <textarea
            placeholder="Assignment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="3"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
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
            fontSize: '16px'
          }}
        >
          {loading ? 'Adding Assignment...' : 'Add Assignment'}
        </button>
      </form>

      {/* Assignments List */}
      <div>
        <h3>Your Assignments ({assignments.length})</h3>
        
        {assignments.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            No assignments yet. Add your first assignment above!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {assignments.map((assignment) => {
              const { daysUntilDue, isOverdue, isDueSoon } = getDueDateInfo(assignment.dueDate);
              const priorityColor = AssignmentController.getPriorityColor(assignment.priority);
              
              return (
                <div
                  key={assignment.id}
                  style={{
                    padding: '20px',
                    border: `2px solid ${priorityColor}`,
                    borderRadius: '8px',
                    background: assignment.completed ? '#d4edda' : '#fff',
                    opacity: assignment.completed ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input
                          type="checkbox"
                          checked={assignment.completed}
                          onChange={() => handleToggleComplete(assignment)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <h4 style={{ 
                          margin: 0, 
                          textDecoration: assignment.completed ? 'line-through' : 'none',
                          color: assignment.completed ? '#6c757d' : '#000'
                        }}>
                          {assignment.title}
                        </h4>
                        <span
                          style={{
                            padding: '4px 12px',
                            background: priorityColor,
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {assignment.priority}
                        </span>
                      </div>
                      
                      {assignment.description && (
                        <p style={{ margin: '5px 0', color: '#666', fontStyle: 'italic' }}>
                          {assignment.description}
                        </p>
                      )}
                      
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        <strong>Course:</strong> {getCourseName(assignment.courseId)} • 
                        <strong> Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()} • 
                        <span style={{ 
                          color: isOverdue ? '#dc3545' : isDueSoon ? '#fd7e14' : '#28a745',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}>
                          {isOverdue ? `Overdue ${Math.abs(daysUntilDue)} days` : 
                           isDueSoon ? `Due in ${daysUntilDue} days` : 
                           `Due in ${daysUntilDue} days`}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => handleDeleteAssignment(assignment.id)}
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

export default AssignmentsView;