import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect, useDispatch } from "react-redux";
import { readConvo } from "../../store/utils/thunkCreators";
import { setLatestReadMessage } from "../../store/latestReadMessage";

const useStyles = makeStyles(() => ({
  root: {
    display: "grid",
    flexGrow: 8,
    height: '100%'
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
    overflowY: 'hidden'
  },
  messages: {
    flexGrow: 1,
    overflowY: 'auto'
  }
}));

const ActiveChat = (props) => {

  const dispatch = useDispatch()

  const classes = useStyles();
  const { user, activeConversation, latestReadMessage } = props;
  const conversation = props.conversation || {};

  useEffect(()=>{
    if(activeConversation){
      (async()=>{
        const messageIds = []
        conversation.messages.every((message)=>{
          if (message.read && message.senderId !== user.id){
            return false
          } else{
            if (!message.read && message.senderId !== user.id){
              messageIds.push(message.id)
            }
            return true
          }
        })
        if (messageIds.length){
          await dispatch(readConvo({otherUserId: conversation.otherUser.id, readMessages:messageIds}))
        }
      })()

      if (latestReadMessage[activeConversation]===undefined){
        let messageId;
        conversation.messages?.every((message)=>{
          if(message.senderId===user.id && message.read){
            messageId = message.id
            return false
          } else{
            return true
          }
        })
        dispatch(setLatestReadMessage(activeConversation, messageId))
      }
    }
  },[activeConversation])

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              latestReadMessageId={latestReadMessage[activeConversation]}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      ),
    activeConversation:state.activeConversation,
    latestReadMessage: state.latestReadMessage
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
