import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import {theme} from '../../themes/theme'

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
    padding: theme.spacing(0, 5),
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

const Input = (props)=>{

  const dispatch = useDispatch()
  const { classes, otherUser, conversationId } = props;
  const [text, setText] = useState("")
  const user = useSelector(state=>state.user)

  const handleChange = (event) => {
    setText(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    (async()=>{
      // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
      const reqBody = {
        text: event.target.text.value,
        recipientId: otherUser.id,
        conversationId: conversationId,
        sender: conversationId ? null : user,
        senderUsername: user.username
      };
      console.log(reqBody)
      await dispatch(postMessage(reqBody));
      setText("")
    })()
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
}


export default withStyles(styles)(Input);
