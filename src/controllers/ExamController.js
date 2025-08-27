import { ExamModel } from '../models/ExamModel';

export class ExamController {
  // Add new exam with validation
  static async addExam(examData) {
    // Validation
    if (!examData.name || !examData.name.trim()) {
      throw new Error('Exam name is required');
    }
    if (!examData.examDate) {
      throw new Error('Exam date is required');
    }
    if (!examData.courseId) {
      throw new Error('Course selection is required');
    }

    // Prepare data for model
    const examDataForModel = {
      name: examData.name.trim(),
      examDate: new Date(examData.examDate),
      courseId: examData.courseId,
      examTime: examData.examTime || '09:00',
      location: examData.location?.trim() || '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Call model to create exam
    return await ExamModel.create(examDataForModel);
  }

  // Delete exam
  static async deleteExam(examId) {
    if (!examId) {
      throw new Error('Exam ID is required');
    }

    return await ExamModel.delete(examId);
  }

  // Toggle completion status
  static async toggleComplete(exam) {
    if (!exam.id) {
      throw new Error('Exam ID is required');
    }

    return await ExamModel.update(exam.id, {
      completed: !exam.completed,
      updatedAt: new Date()
    });
  }

  // Subscribe to exams updates
  static subscribeToExams(callback) {
    return ExamModel.listenToExams(callback);
  }

  // Get all exams
  static async getAllExams() {
    return await ExamModel.getAllExams();
  }

  // Get exams by course
  static async getExamsByCourse(courseId) {
    return await ExamModel.getExamsByCourse(courseId);
  }

  // Validate exam data
  static validateExam(examData) {
    if (!examData.name || !examData.name.trim()) {
      return 'Exam name is required';
    }
    if (examData.name.trim().length < 2) {
      return 'Exam name must be at least 2 characters long';
    }
    if (examData.name.trim().length > 100) {
      return 'Exam name must be less than 100 characters';
    }
    if (!examData.examDate) {
      return 'Exam date is required';
    }
    if (new Date(examData.examDate) < new Date()) {
      return 'Exam date cannot be in the past';
    }
    if (!examData.courseId) {
      return 'Course selection is required';
    }
    return null; // No error
  }

  // Calculate countdown timer
  static getCountdown(examDate) {
    const now = new Date();
    const exam = new Date(examDate);
    const diff = exam - now;

    if (diff < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isOverdue: false };
  }

  // Get countdown color based on days left
  static getCountdownColor(days) {
    if (days === 0) return '#dc3545'; // red
    if (days <= 3) return '#fd7e14'; // orange
    if (days <= 7) return '#ffc107'; // yellow
    return '#28a745'; // green
  }
}