export default function(authConfig) {
  return {
    getAuth: state => state[authConfig.storeKey],
    getUser: state => getAuth(state).user,
    getAuthenticated: state => getAuth(state).authenticated
  }
}
