import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  readConversation,
} from "../conversations";
import { setLatestReadMessage } from "../latestReadMessage";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.connect()
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.connect()
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.connect()
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
    socket.disconnect()
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
    senderUsername: body.senderUsername,
  });
};

const sendReadStatus = (readMessages, userId, otherUserId, otherUserUsername) => {
  socket.emit("read-messages", {
    readMessages,
    userId,
    otherUserId,
    otherUserUsername,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

// Sets all specified messages to read in backend and redux, sets socket emit to other user as well
export const readConvo = (body) => async (dispatch, getState) => {
  try {
    const state = getState()
    await axios.put("/api/conversations/read", body);

    dispatch(readConversation(body.otherUserId, body.readMessages))

    sendReadStatus(body.readMessages, body.otherUserId, state.user.id, state.user.username)

  } catch (error) {
    console.error(error);
  }
};

// Handles new incoming messages, and sees if conversation is already active
export const handleNewMessage = ({message, sender, senderUsername}) => async (dispatch, getState) => {
  const state = getState()

  if (state.activeConversation === senderUsername){
    message.read = true
    await axios.put("/api/conversations/read", {readMessages:[message.id]});
    sendReadStatus([message.id], message.senderId, state.user.id, state.user.username)
  }

  dispatch(setNewMessage(message, sender))
};

// Handles when other user has read a conversation
export const handleConvoRead = (body) => async (dispatch) => {

  dispatch(readConversation(body.otherUserId, body.readMessages))
  dispatch(setLatestReadMessage(body.otherUserUsername, body.readMessages[0]))
}

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
