const SET_LATEST_READ_MESSAGE = "SET_LATEST_READ_MESSAGE";

export const setLatestReadMessage = (otherUserUsername, messageId) => {
  return {
    type: SET_LATEST_READ_MESSAGE,
    otherUserUsername,
    messageId
  };
};

const reducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case SET_LATEST_READ_MESSAGE: {
      newState = {...state}
      newState[action.otherUserUsername] = action.messageId
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
