import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { readMessages } from "../../store/utils/thunkCreators";

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
    width: 22,
    height: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
    fontSize:'85%',
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "50%",
  }
};

class Chat extends Component {
  handleClick = async (conversation, userId) => {
    await this.props.setActiveChat(conversation.otherUser.username);

    const readMessages = []

    conversation.messages.forEach((message)=>{
      if (!message.read && message.senderId !== userId){
        readMessages.push(message.id)
      }
    })

    if (readMessages.length){
      await this.props.setReadMessages({readMessages})
    }

  };


  render() {
    const { classes, userId } = this.props;
    const otherUser = this.props.conversation.otherUser;

    const messageCount = this.props.conversation.messages.filter((message)=>{
      return !message.read && message.senderId !== userId
    }).length || null

    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation, userId)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} />
        {messageCount &&
          <Box
            className={classes.notification}
          >{messageCount}</Box>
        }
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    setReadMessages: (body) => {
      dispatch(readMessages(body));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
