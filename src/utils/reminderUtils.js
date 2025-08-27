export class ReminderUtils {
  // Request browser notification permission
  static async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  static showNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/logo192.png', // React logo
        badge: '/logo192.png'
      });
    }
  }

  // Check for upcoming deadlines (within 24 hours)
  static checkUpcomingDeadlines(assignments, exams) {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingAssignments = assignments.filter(assignment => {
      if (assignment.completed) return false;
      const dueDate = new Date(assignment.dueDate);
      return dueDate > now && dueDate <= tomorrow;
    });

    const upcomingExams = exams.filter(exam => {
      if (exam.completed) return false;
      const examDate = new Date(exam.examDate);
      return examDate > now && examDate <= tomorrow;
    });

    return { upcomingAssignments, upcomingExams };
  }

  // Format reminder message
  static formatReminderMessage(upcomingAssignments, upcomingExams) {
    let message = '';
    
    if (upcomingAssignments.length > 0) {
      message += `📝 ${upcomingAssignments.length} assignment(s) due soon:\n`;
      upcomingAssignments.forEach((assignment, index) => {
        const dueDate = new Date(assignment.dueDate);
        message += `${index + 1}. ${assignment.title} - ${dueDate.toLocaleDateString()}\n`;
      });
      message += '\n';
    }

    if (upcomingExams.length > 0) {
      message += `📚 ${upcomingExams.length} exam(s) coming up:\n`;
      upcomingExams.forEach((exam, index) => {
        const examDate = new Date(exam.examDate);
        message += `${index + 1}. ${exam.name} - ${examDate.toLocaleDateString()}\n`;
      });
    }

    return message.trim();
  }

  // Get time until next check (5 minutes)
  static getNextCheckTime() {
    return 5 * 60 * 1000; // 5 minutes in milliseconds
  }
}