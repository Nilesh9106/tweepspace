import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import toast from 'react-hot-toast';

export class UsersHelper {
  static followUser = errorHandler(async (username: string) => {
    const response = await axios.post(`/api/users/${username}/follow`);
    toast.success(response.data.message);
    return response.data;
  });
  static unfollowUser = errorHandler(async (username: string) => {
    const response = await axios.post(`/api/users/${username}/unfollow`);
    toast.success(response.data.message);
    return response.data;
  });
  static getUserWithoutPopulate = errorHandler(async (username: string) => {
    const response = await axios.get(`/api/users/${username}`);
    return response.data;
  });
}
