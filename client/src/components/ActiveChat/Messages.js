import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import {theme} from '../../themes/theme'

import moment from "moment";

const useStyles = makeStyles(() => ({
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(0, 5),
    display: 'flex',
    flexDirection: 'column-reverse',
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, latestReadMessageId } = props;

  return (
    <Box className={classes.messages}>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            latestReadMessage={message.id === latestReadMessageId}
          />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
