const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");

const authController = {
  register: expressAsyncHandler(async (req, res) => {
    const { email } = req?.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(409);
      throw new Error("이미 사용자가 존재합니다");
    }

    try {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }),

  login: expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req?.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("사용자를 찾지 못하였습니다");
    }
    if (user.isPasswordMatch(password)) {
      res.status(200).json(user);
    } else {
      res.status(403);
      throw new Error("비밀번호가 맞지 않습니다");
    }
  }),
};

module.exports = authController;