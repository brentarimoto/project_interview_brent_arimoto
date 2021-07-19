import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect, useDispatch } from "react-redux";
import { readMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
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
  const { user, activeConversation } = props;
  const conversation = props.conversation || {};

  useEffect(()=>{
    if(activeConversation){
      (async()=>{

        const messageIds = []

        conversation.messages.forEach((message)=>{
          if (!message.read && message.senderId !== user.id){
            messageIds.push(message.id)
          }
        })

        if (messageIds.length){
          await dispatch(readMessages({otherUserId: conversation.otherUser.id, readMessages:messageIds}))
        }

      })()

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
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
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
    activeConversation:state.activeConversation
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
