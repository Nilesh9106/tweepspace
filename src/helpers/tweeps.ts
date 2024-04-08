import { TweepType } from '@/types/model';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class TweepHelper {
  static getAllTweeps = errorHandler(async () => {
    const { data } = await axios.get('/api/tweeps');
    return data.tweeps as TweepType[];
  });
  static getTweepWithReplies = errorHandler(async (id: string) => {
    const { data } = await axios.get(`/api/tweeps/${id}`);
    return {
      tweep: data.tweep as TweepType,
      replies: data.replies as TweepType[]
    };
  });
  static createTweep = errorHandler(async (tweep: any) => {
    const { data } = await axios.post('/api/tweeps', tweep);
    return data.tweep as TweepType;
  });
  static getTweepsByHashtag = errorHandler(async (tag: string) => {
    const { data } = await axios.get(`/api/tweeps/byHashtag/${tag}`);
    return data.tweeps as TweepType[];
  });
}
