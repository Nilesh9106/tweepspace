import { apiRoutes } from '@/constants/routes';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import toast from 'react-hot-toast';

export class UsersHelper {
  static followUser = errorHandler(async (username: string) => {
    const response = await axios.post(apiRoutes.users.followUser(username.toLowerCase()));
    toast.success(response.data.message);
    return response.data;
  });
  static unfollowUser = errorHandler(async (username: string) => {
    const response = await axios.post(apiRoutes.users.unfollowUser(username.toLowerCase()));
    toast.success(response.data.message);
    return response.data;
  });
  static searchUsers = errorHandler(async (query: string) => {
    const response = await axios.get(apiRoutes.users.searchUser(query.toLowerCase()));
    return response.data;
  });
  static getUserProfile = errorHandler(
    async (username: string, field: 'followers' | 'following' | 'user' | 'tweeps' | 'retweeps') => {
      let response;
      switch (field) {
        case 'followers':
          response = await axios.get(apiRoutes.tweeps.getFollowersOfUser(username.toLowerCase()));
          return response.data;
        case 'following':
          response = await axios.get(apiRoutes.tweeps.getFollowingOfUser(username.toLowerCase()));
          return response.data;
        case 'user':
          response = await axios.get(apiRoutes.tweeps.getUser(username.toLowerCase()));
          return response.data;
        case 'tweeps':
          response = await axios.get(apiRoutes.tweeps.getTweepsOfUser(username.toLowerCase()));
          return response.data;
        case 'retweeps':
          response = await axios.get(apiRoutes.tweeps.getRetweepsOfUser(username.toLowerCase()));
          return response.data;
        default:
          return undefined;
      }
    }
  );
  static updateProfile = errorHandler(async (data: any) => {
    const response = await axios.put(apiRoutes.users.updateProfile, data);
    return response.data;
  });
}
