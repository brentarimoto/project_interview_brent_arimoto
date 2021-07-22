const SET_SOCKET = "SET_SOCKET";

export const setSocket = (socket) => {
  return {
    type: SET_SOCKET,
    socket
  };
};

const reducer = (state = null, action) => {
  switch (action.type) {
    case SET_SOCKET: {
      return action.socket;
    }
    default:
      return state;
  }
};

export default reducer;
