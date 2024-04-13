export const webRoutes = {
  home: '/',
  explore: '/explore',
  editProfile: '/editprofile',
  auth: {
    login: '/auth',
    signUp: '/auth'
  },
  tweep: (id: string) => `/tweep/${id}`,
  user: (username: string) => `/user/${username}`,
  tweepWithHashtag: (hashtag: string) => `/hashtag/${hashtag}`,
  activity: '/activity'
};

export const apiRoutes = {
  auth: {
    checkToken: '/api/auth',
    login: '/api/auth/login',
    signUp: '/api/auth/signup',
    logout: '/api/auth/logout'
  },
  users: {
    searchUser: (query: string) => `/api/users?query=${query}`,
    updateProfile: '/api/users',
    getUserWithPopulate: (username: string) => `/api/users/${username}`,
    followUser: (username: string) => `/api/users/${username}/follow`,
    unfollowUser: (username: string) => `/api/users/${username}/unfollow`
  },
  tweeps: {
    createTweep: '/api/tweeps',
    getAllTweeps: '/api/tweeps',
    getTweepsByHashtag: (tag: string) => `/api/tweeps/byHashtag/${tag}`,
    getTweepWithReplies: (id: string) => `/api/tweeps/${id}`,
    deleteTweep: (id: string) => `/api/tweeps/${id}`,
    getLikesOfTweep: (id: string) => `/api/tweeps/${id}/getLikes`,
    getRetweepsOfTweep: (id: string) => `/api/tweeps/${id}/getRetweeps`,
    getFeed: '/api/tweeps/feed',
    likeTweepPOST: '/api/tweeps/like',
    unlikeTweepPUT: '/api/tweeps/like',
    retweepPOST: '/api/tweeps/retweep',
    undoRetweepPUT: '/api/tweeps/retweep',
    getFollowersOfUser: (username: string) => `/api/tweeps/user/${username}?field=followers`,
    getFollowingOfUser: (username: string) => `/api/tweeps/user/${username}?field=following`,
    getTweepsOfUser: (username: string) => `/api/tweeps/user/${username}?field=tweeps`,
    getRetweepsOfUser: (username: string) => `/api/tweeps/user/${username}?field=retweeps`,
    getUser: (username: string) => `/api/tweeps/user/${username}?field=user`
  },
  notifications: {
    getNotifications: '/api/notifications',
    PUTmarkAsRead: (id: string) => `/api/notifications/${id}`,
    deleteNotification: (id: string) => `/api/notifications/${id}`
  },
  getAllHashtags: '/api/hashtags'
};
