import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../../themes/theme";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  notification:{
    width: 'min-content',
    height: 'min-content',
    display: 'flex',
    padding: theme.spacing(0, 1),
    marginRight: theme.spacing(1),
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
    fontSize:'100%',
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "10px",
  }
};

const Chat = (props)=>{
  const dispatch = useDispatch()

  const { classes, userId, conversation } = props;
  const otherUser = conversation.otherUser;

  const [messageCount, setMessageCount] = useState(
    conversation.messages.filter((message)=>{
      return !message.read && message.senderId !== props.userId
    }).length || null
  )

  useEffect(()=>{
    setMessageCount(conversation.messages.filter((message)=>{
      return !message.read && message.senderId !== props.userId
    }).length || null,)
  },[conversation.messages])

  const handleClick = async (conversation) => {
    await dispatch(setActiveChat(conversation.otherUser.username));
  };

  return (
    <Box
      onClick={() => handleClick(conversation)}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} hasUnreadMessages = {!!messageCount}/>
      {messageCount &&
        <Box
          className={classes.notification}
        >{messageCount}</Box>
      }
    </Box>
  );
}

export default withStyles(styles)(Chat);
