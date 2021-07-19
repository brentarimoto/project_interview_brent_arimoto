import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
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
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
    fontSize:'100%',
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "10px",
  }
};

class Chat extends Component {
  handleClick = async (conversation, userId) => {
    await this.props.setActiveChat(conversation.otherUser.username);
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
        <ChatContent conversation={this.props.conversation} messageCountBool = {messageCount ? true : false}/>
        {messageCount &&
          <Box
            className={classes.notification}
          >{1}</Box>
        }
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
