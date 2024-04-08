import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class HashTagsHelper {
  static getHashTags = errorHandler(async () => {
    const { data } = await axios.get('/api/hashtags');
    return data.hashtags;
  });
  static getHashTag = errorHandler(async (tag: string) => {
    const { data } = await axios.get(`/api/hashtags/${tag}`);
    return data.hashtag;
  });
}
