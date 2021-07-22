const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // find a conversation between sender and recipient
    let conversation = await Conversation.findByPk(conversationId);

    // if conversation does not exits, make a conversation
    if (!conversation) {

      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });

      // set sender as online
      if (onlineUsers.has(sender.id)) {
        sender.online = true;
      }

      // creates message
      const message = await Message.create({
        senderId,
        text,
        conversationId: conversation.id,
      });


      return res.json({ message, sender });

    // if conversation exists, and it matches the id of the conversationId stated, then user can make message
    } else if ((conversation.user1Id===senderId || conversation.user2Id===senderId) && (conversation.user1Id===recipientId || conversation.user2Id===recipientId)){
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });

    // if conversation exists but conversation id does not match throw error
    } else{
      const err = new Error('ConversationId Does Not Match')
      err.title = 'Access Denied'
      err.errors= ['ConversationId Does Not Match'];
      err.status= 403
      next(err)
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
