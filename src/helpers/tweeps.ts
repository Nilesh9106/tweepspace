import { TweepType, TweepTypeWithParent } from '@/types/model';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class TweepHelper {
  static getAllTweeps = errorHandler(async () => {
    const { data } = await axios.get('/api/tweeps');
    return data.tweeps as TweepType[];
  });
  static getFeed = errorHandler(async () => {
    const { data } = await axios.get('/api/tweeps/feed');
    return data.tweeps as TweepType[];
  });
  static getTweepWithReplies = errorHandler(async (id: string) => {
    const { data } = await axios.get(`/api/tweeps/${id}`);
    const tweep: TweepTypeWithParent = data.tweep;
    if (tweep.parent_tweep) {
      return {
        tweep: {
          ...tweep,
          parent_tweep: tweep.parent_tweep?._id
        } as TweepType,
        replies: data.replies as TweepType[],
        parent_tweep: tweep.parent_tweep
      };
    } else {
      return {
        tweep: tweep as TweepType,
        replies: data.replies as TweepType[],
        parent_tweep: undefined
      };
    }
  });
  static createTweep = errorHandler(async (tweep: any) => {
    const { data } = await axios.post('/api/tweeps', tweep);
    return data.tweep as TweepType;
  });
  static deleteTweep = errorHandler(async (id: string) => {
    const { data } = await axios.delete(`/api/tweeps/${id}`);
    return data;
  });
  static getTweepsByHashtag = errorHandler(async (tag: string) => {
    const { data } = await axios.get(`/api/tweeps/byHashtag/${tag}`);
    return data.tweeps as TweepType[];
  });

  static likeTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.post('/api/tweeps/like', {
      tweepId: tweepId
    });
    return data;
  });

  static unLikeTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.put('/api/tweeps/like', {
      tweepId: tweepId
    });
    return data;
  });
  static retweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.post('/api/tweeps/retweep', {
      tweepId: tweepId
    });
    return data;
  });

  static unReTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.put('/api/tweeps/retweep', {
      tweepId: tweepId
    });
    return data;
  });
}
