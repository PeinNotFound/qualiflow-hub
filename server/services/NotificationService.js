/**
 * Simple Notification Service for Qualibot-Hub
 */
class NotificationService {
  /**
   * Broadcast an in-app notification
   */
  async notify(userId, type, message, link) {
    console.log(`[Notification] To: ${userId} | Type: ${type} | Msg: ${message}`);
    // In a real implementation, this would save to a Notification model
    // and broadcast via Socket.io
  }

  /**
   * Send an email (stub)
   */
  async sendEmail(to, subject, body) {
    console.log(`[Email] To: ${to} | Subj: ${subject}`);
    // Use Nodemailer here if configured
  }
}

export default new NotificationService();
