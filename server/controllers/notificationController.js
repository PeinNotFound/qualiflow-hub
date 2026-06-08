import Notification from "../models/Notification.js";

// GET /api/notifications — get unread notifications for the logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/:id/read — mark one as read
export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/read-all — mark all as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
