import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import toast from 'react-hot-toast';

export class NotificationHelper {
  static getNotifications = errorHandler(async () => {
    const { data } = await axios.get('/api/notifications');
    return data;
  });
  static markAsRead = errorHandler(async (id: string) => {
    const { data } = await axios.put(`/api/notifications/${id}`);
    toast.success('Notification marked as read');
    return data;
  });
  static deleteNotification = errorHandler(async (id: string) => {
    const { data } = await axios.delete(`/api/notifications/${id}`);
    toast.success('Notification deleted');
    return data;
  });
}
