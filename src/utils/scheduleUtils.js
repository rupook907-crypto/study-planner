import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addDays,
  isToday,
  isSameDay,
  parseISO
} from 'date-fns';

export class ScheduleUtils {
  // Convert assignments to calendar events
  static convertAssignmentsToEvents(assignments, courses) {
    return assignments.map(assignment => {
      const course = courses.find(c => c.id === assignment.courseId);
      const courseColor = course ? this.getCourseColor(course.id) : '#666666';
      
      return {
        id: `assignment-${assignment.id}`,
        title: `📝 ${assignment.title}`,
        start: new Date(assignment.dueDate),
        end: new Date(assignment.dueDate),
        type: 'assignment',
        course: course,
        color: courseColor,
        isCompleted: assignment.completed,
        rawData: assignment
      };
    });
  }

  // Convert exams to calendar events
  static convertExamsToEvents(exams, courses) {
    return exams.map(exam => {
      const course = courses.find(c => c.id === exam.courseId);
      const courseColor = course ? this.getCourseColor(course.id) : '#666666';
      
      return {
        id: `exam-${exam.id}`,
        title: `📚 ${exam.name}`,
        start: new Date(exam.examDate),
        end: new Date(exam.examDate),
        type: 'exam',
        course: course,
        color: courseColor,
        isCompleted: exam.completed,
        rawData: exam
      };
    });
  }

  // Generate consistent color for each course
  static getCourseColor(courseId) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
      '#FB5607', '#FF006E', '#8338EC', '#3A86FF',
      '#38B000', '#F15BB5', '#9B5DE5', '#00BBF9',
      '#FF9E00', '#00C2BA', '#FF5A5F', '#7B68EE'
    ];
    
    if (!courseId) return colors[0];
    
    // Simple hash function for consistent colors
    const hash = courseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Get events for current week
  static getWeekEvents(events, date = new Date()) {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    
    return events.filter(event => 
      event.start >= weekStart && event.start <= weekEnd
    );
  }

  // Get events for a specific day
  static getDayEvents(events, date = new Date()) {
    return events.filter(event => 
      isSameDay(event.start, date)
    );
  }

  // Format time for display
  static formatTime(date) {
    return format(date, 'h:mm a');
  }

  // Format date for display
  static formatDate(date) {
    return format(date, 'EEE, MMM d');
  }

  // Format date for calendar header
  static formatCalendarDate(date) {
    return format(date, 'MMMM yyyy');
  }

  // Check if event is today
  static isEventToday(event) {
    return isToday(event.start);
  }

  // Sort events by time
  static sortEventsByTime(events) {
    return events.sort((a, b) => a.start - b.start);
  }

  // Group events by day
  static groupEventsByDay(events) {
    const grouped = {};
    
    events.forEach(event => {
      const dateKey = format(event.start, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort events within each day
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey] = this.sortEventsByTime(grouped[dateKey]);
    });
    
    return grouped;
  }

  // Get week days array
  static getWeekDays(date = new Date()) {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    
    return days;
  }
} 