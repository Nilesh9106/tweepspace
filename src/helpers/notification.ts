import { apiRoutes } from '@/constants/routes';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import toast from 'react-hot-toast';

export class NotificationHelper {
  static getNotifications = errorHandler(async () => {
    const { data } = await axios.get(apiRoutes.notifications.getNotifications);
    return data;
  });
  static markAsRead = errorHandler(async (id: string) => {
    const { data } = await axios.put(apiRoutes.notifications.PUTmarkAsRead(id));
    return data;
  });
  static deleteNotification = errorHandler(async (id: string) => {
    const { data } = await axios.delete(apiRoutes.notifications.deleteNotification(id));
    toast.success('Notification deleted');
    return data;
  });
  static markAllAsRead = errorHandler(async () => {
    const { data } = await axios.put(apiRoutes.notifications.markAllAsRead);
    return data;
  });
}
