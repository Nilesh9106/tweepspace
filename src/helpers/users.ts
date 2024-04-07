import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import toast from 'react-hot-toast';

export class UsersHelper {
  static followUser = errorHandler(async (userId: string) => {
    const response = await axios.post('/api/users/follow', {
      operation: 'follow',
      userId: userId
    });
    toast.success(response.data.message);
    return response.data;
  });
  static unfollowUser = errorHandler(async (userId: string) => {
    const response = await axios.post('/api/users/follow', {
      operation: 'unfollow',
      userId: userId
    });
    toast.success(response.data.message);
    return response.data;
  });
  static accpetFollowRequest = errorHandler(async (userId: string) => {
    const response = await axios.post('/api/users/follow', {
      operation: 'accept-request',
      userId: userId
    });
    toast.success(response.data.message);
    return response.data;
  });
  static rejectFollowRequest = errorHandler(async (userId: string) => {
    const response = await axios.post('/api/users/follow', {
      operation: 'reject-request',
      userId: userId
    });
    toast.success(response.data.message);
    return response.data;
  });
}
