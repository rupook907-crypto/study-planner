import { CourseModel } from '../models/CourseModel';

export class CourseController {
  // Add new course with validation
  static async addCourse(courseName) {
    // Validation
    if (!courseName || !courseName.trim()) {
      throw new Error('Course name is required');
    }
    if (courseName.trim().length < 2) {
      throw new Error('Course name must be at least 2 characters long');
    }

    // Prepare data for model
    const courseData = {
      name: courseName.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Call model to create course
    return await CourseModel.create(courseData);
  }

  // Delete course with confirmation
  static async deleteCourse(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    return await CourseModel.delete(courseId);
  }

  // Subscribe to courses updates
  static subscribeToCourses(callback) {
    return CourseModel.listenToCourses(callback);
  }

  // Get all courses (one-time)
  static async getAllCourses() {
    return await CourseModel.getAllCourses();
  }

  // Validate course data
  static validateCourseName(courseName) {
    if (!courseName || !courseName.trim()) {
      return 'Course name is required';
    }
    if (courseName.trim().length < 2) {
      return 'Course name must be at least 2 characters long';
    }
    if (courseName.trim().length > 50) {
      return 'Course name must be less than 50 characters';
    }
    return null; // No error
  }
}