import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class HashTagsHelper {
  static getHashTags = errorHandler(async () => {
    const { data } = await axios.get('/api/hashtags');
    return data.hashtags;
  });
}
