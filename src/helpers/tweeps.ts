import { apiRoutes } from '@/constants/routes';
import { TweepType, UserTypeWithIds } from '@/types/model';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';

export class TweepHelper {
  static getAllTweeps = errorHandler(async () => {
    const { data } = await axios.get(apiRoutes.tweeps.getAllTweeps);
    return data.tweeps as TweepType[];
  });
  static getFeed = errorHandler(async () => {
    const { data } = await axios.get(apiRoutes.tweeps.getFeed);
    return data.tweeps as TweepType[];
  });
  static getTweepWithReplies = errorHandler(async (id: string) => {
    const { data } = await axios.get(apiRoutes.tweeps.getTweepWithReplies(id));
    return {
      tweep: data.tweep as TweepType,
      replies: data.replies as TweepType[]
    };
  });
  static createTweep = errorHandler(async (tweep: any) => {
    const { data } = await axios.post(apiRoutes.tweeps.createTweep, tweep);
    return data.tweep as TweepType;
  });
  static deleteTweep = errorHandler(async (id: string) => {
    const { data } = await axios.delete(apiRoutes.tweeps.deleteTweep(id));
    return data;
  });
  static getTweepsByHashtag = errorHandler(async (tag: string) => {
    const { data } = await axios.get(apiRoutes.tweeps.getTweepsByHashtag(tag));
    return data.tweeps as TweepType[];
  });

  static likeTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.post(apiRoutes.tweeps.likeTweepPOST, {
      tweepId: tweepId
    });
    return data;
  });

  static unLikeTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.put(apiRoutes.tweeps.unlikeTweepPUT, {
      tweepId: tweepId
    });
    return data;
  });
  static retweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.post(apiRoutes.tweeps.retweepPOST, {
      tweepId: tweepId
    });
    return data;
  });

  static unReTweep = errorHandler(async (tweepId: string) => {
    const { data } = await axios.put(apiRoutes.tweeps.undoRetweepPUT, {
      tweepId: tweepId
    });
    return data;
  });
  static getLikes = errorHandler(async (tweepId: string) => {
    const { data } = await axios.get(apiRoutes.tweeps.getLikesOfTweep(tweepId));
    return data.likes as UserTypeWithIds[];
  });
  static getRetweeps = errorHandler(async (tweepId: string) => {
    const { data } = await axios.get(apiRoutes.tweeps.getRetweepsOfTweep(tweepId));
    return data.retweeps as UserTypeWithIds[];
  });
}
