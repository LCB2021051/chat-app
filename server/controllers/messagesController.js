const Messages = require("../model/msgModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, msg } = req.body;
    const data = await Messages.create({
      message: { text: msg },
      users: { from, to },
      sender: from,
    });
    if (data) return res.json({ msg: "message added succesfully." });
    return res.json({ msg: "Failed to add msg to the database." });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      $or: [
        { "users.from": from, "users.to": to }, // From current user to chat
        { "users.from": to, "users.to": from }, // From chat to current user
      ],
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.json(projectMessages);
  } catch (err) {
    next(err);
  }
};
