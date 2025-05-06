const userModel = require("../models/user.model");

module.exports.createUser = async ({ userName, email, password }) => {
  if (!userName || !password || !email) {
    throw new Error("All field are required");
  }

  const user = userModel.create({
    userName,
    email,
    password,
  });

  return user;
};
