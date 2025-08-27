export class ProgressUtils {
  // Calculate overall progress percentage
  static calculateOverallProgress(assignments, exams) {
    const allItems = [...assignments, ...exams];
    if (allItems.length === 0) return 0;
    
    const completed = allItems.filter(item => item.completed).length;
    return Math.round((completed / allItems.length) * 100);
  }

  // Calculate progress for a specific course
  static calculateCourseProgress(courseId, assignments, exams) {
    const courseAssignments = assignments.filter(a => a.courseId === courseId);
    const courseExams = exams.filter(e => e.courseId === courseId);
    const allCourseItems = [...courseAssignments, ...courseExams];
    
    if (allCourseItems.length === 0) return 0;
    
    const completed = allCourseItems.filter(item => item.completed).length;
    return Math.round((completed / allCourseItems.length) * 100);
  }

  // Get progress color based on percentage
  static getProgressColor(percentage) {
    if (percentage >= 80) return '#28a745'; // Green
    if (percentage >= 50) return '#ffc107'; // Yellow
    if (percentage >= 25) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  }

  // Get progress message based on percentage
  static getProgressMessage(percentage) {
    if (percentage === 0) return 'Not started';
    if (percentage === 100) return 'Completed! 🎉';
    if (percentage >= 80) return 'Almost there!';
    if (percentage >= 50) return 'Good progress';
    if (percentage >= 25) return 'Getting started';
    return 'Just beginning';
  }
}