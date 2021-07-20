import io from "socket.io-client";
import store from "./store";
import {
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { handleNewMessage, handleConvoRead } from './store/utils/thunkCreators'

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(handleNewMessage(data))
  });

  socket.on("read-messages", (data) => {
    console.log('READ MESSAGES')
    store.dispatch(handleConvoRead(data));
  });
});

export default socket;
