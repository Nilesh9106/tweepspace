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
