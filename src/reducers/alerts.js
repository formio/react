import { ALERT_ADD, ALERT_RESET } from '../actions';

export default () => {
  return (state = {
    alerts: []
  }, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case ALERT_ADD:
        return {
          ...state,
          alerts: [...state.alerts, action.alert]
        };
      case ALERT_RESET:
        return {
          ...state,
          alerts: []
        };
      default:
        return state;
    }
  };
};
