const Messages = require("../model/msgModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, msg } = req.body;
    const data = await Messages.create({
      message: { text: msg },
      users: { from, to },
      sender: from,
    });
    if (data) return res.json({ msg: "message auccesfully." });
    return res.json({ msg: "Failed to add msg to the database." });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllMessage = async (req, res, next) => {};
