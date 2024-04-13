import { apiRoutes } from '@/constants/routes';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class HashTagsHelper {
  static getHashTags = errorHandler(async () => {
    const { data } = await axios.get(apiRoutes.getAllHashtags);
    return data.hashtags;
  });
}
