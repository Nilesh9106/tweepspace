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
  static searchUsers = errorHandler(async (query: string) => {
    const response = await axios.get(`/api/users?query=${query}`);
    return response.data;
  });
  static getUserProfile = errorHandler(
    async (username: string, field: 'followers' | 'following' | 'user' | 'tweeps' | 'retweeps') => {
      const response = await axios.get(`/api/tweeps/user/${username}?field=${field}`);
      return response.data;
    }
  );
}
