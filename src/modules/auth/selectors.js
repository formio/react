export default function(authConfig) {
  const getAuth = state => state[authConfig.storeKey];
  const getUser = state => getAuth(state).user;
  const getAuthenticated = state => getAuth(state).authenticated;

  return {
    getAuth,
    getUser,
    getAuthenticated
  };
}
