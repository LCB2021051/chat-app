const Users = require("../model/userModel");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await Users.findOne({ username });

    if (usernameCheck) {
      return res.json({ msg: "Username already exists", status: false });
    }

    const emailCheck = await Users.findOne({ email });

    if (emailCheck) {
      return res.json({ msg: "Email already taken", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = Users.create({
      email,
      username,
      password: hashedPassword,
    });

    delete (await user).password;

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.json({ msg: "Incorrect username", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect password", status: false });
    }

    delete (await user).password;

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUser = async (req, res, next) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params.id } }).select(
      "email username avatarImage _id"
    );
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
