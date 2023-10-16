import { User } from "../DB/Entities/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../DB/Entities/Role.js";

const inserUser = async (payload: User) => {
  let user = new User();
  const newuser = User.create({
    ...payload,
  });
  user.save();
};

const login = async (email: string, password: string) => {
  try {
    const user = await User.findOneBy({ email });
    const passwordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (user && passwordMatching) {
      const token = jwt.sign(
        {
          userID: user.id,
          email: user.email,
          fullName: user.name,
        },
        process.env.SECRET_KEY || "",
        { expiresIn: "10m" }
      );
      return { token, fullName: user.name };
    } else {
      throw "Invalid Username or password!";
    }
  } catch (error) {
    throw "Invalid Username or password!";
  }
};

export { login };
