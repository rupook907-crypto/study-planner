import { AssignmentModel } from '../models/AssignmentModel';

export class AssignmentController {
  // Add new assignment with validation
  static async addAssignment(assignmentData) {
    // Validation
    if (!assignmentData.title || !assignmentData.title.trim()) {
      throw new Error('Assignment title is required');
    }
    if (!assignmentData.dueDate) {
      throw new Error('Due date is required');
    }
    if (!assignmentData.courseId) {
      throw new Error('Course selection is required');
    }

    // Prepare data for model
    const assignmentDataForModel = {
      title: assignmentData.title.trim(),
      description: assignmentData.description?.trim() || '',
      dueDate: new Date(assignmentData.dueDate),
      courseId: assignmentData.courseId,
      priority: assignmentData.priority || 'medium',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Call model to create assignment
    return await AssignmentModel.create(assignmentDataForModel);
  }

  // Delete assignment
  static async deleteAssignment(assignmentId) {
    if (!assignmentId) {
      throw new Error('Assignment ID is required');
    }

    return await AssignmentModel.delete(assignmentId);
  }

  // Toggle completion status
  static async toggleComplete(assignment) {
    if (!assignment.id) {
      throw new Error('Assignment ID is required');
    }

    return await AssignmentModel.update(assignment.id, {
      completed: !assignment.completed,
      updatedAt: new Date()
    });
  }

  // Subscribe to assignments updates
  static subscribeToAssignments(callback) {
    return AssignmentModel.listenToAssignments(callback);
  }

  // Get all assignments
  static async getAllAssignments() {
    return await AssignmentModel.getAllAssignments();
  }

  // Get assignments by course
  static async getAssignmentsByCourse(courseId) {
    return await AssignmentModel.getAssignmentsByCourse(courseId);
  }

  // Validate assignment data
  static validateAssignment(assignmentData) {
    if (!assignmentData.title || !assignmentData.title.trim()) {
      return 'Assignment title is required';
    }
    if (assignmentData.title.trim().length < 2) {
      return 'Assignment title must be at least 2 characters long';
    }
    if (assignmentData.title.trim().length > 100) {
      return 'Assignment title must be less than 100 characters';
    }
    if (!assignmentData.dueDate) {
      return 'Due date is required';
    }
    if (new Date(assignmentData.dueDate) < new Date()) {
      return 'Due date cannot be in the past';
    }
    if (!assignmentData.courseId) {
      return 'Course selection is required';
    }
    return null; // No error
  }

  // Calculate days until due
  static getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Get priority color
  static getPriorityColor(priority) {
    switch (priority) {
      case 'high': return '#dc3545'; // red
      case 'medium': return '#fd7e14'; // orange
      case 'low': return '#28a745'; // green
      default: return '#6c757d'; // gray
    }
  }
}