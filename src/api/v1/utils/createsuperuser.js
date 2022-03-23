import colors from "colors";
import db from "../config/db.js";
import User from "../models/UserModel.js";

const questions = [
  {
    type: "input",
    name: "firstName",
    message: "Enter your first name: ",
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter your last name: ",
  },
  {
    type: "input",
    name: "email",
    message: "Enter your email: ",
  },
  {
    type: "password",
    name: "password",
    message: "Enter your password: ",
  },
];

const createSuperUser = async ({ firstName, lastName, email, password }) => {
  try {
    await db();

    const existUser = await User.findOne({ email: email });

    if (existUser) {
      console.log(`User with ${email} is already exists`.yellow.bold);
      return;
    }

    await User.create({
      firstName,
      lastName,
      email,
      password,
      isAdmin: true,
    });

    console.log("Super user created successfully".green.bold);
  } catch (err) {
    console.error(`Something went during super user creation: ${err}`.red.bold);
    throw Error(err);
  }
};

export { questions };
export default createSuperUser;
