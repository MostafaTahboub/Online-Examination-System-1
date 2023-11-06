import express from "express";
import { User } from "../DB/Entities/User.js";
import jwt from "jsonwebtoken";
import ableToReset from "../middleware/validation/resetPwd.js";
import sendEmail from "../controllers/SES.js";
import bcrypt from "bcrypt";
import baseLogger from "../log.js";

const router = express.Router();

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOneBy({ email: email });
  if (user === null) {
    res.send("user not registered");
    return;
  }
  const secret = process.env.JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "5m" });
  const link = `http://localhost:${process.env.PORT}/reset-password/${user.id}/${token}`;
  sendEmail(payload.email, "Password Reset", `${link}`);
  baseLogger.info(
    `${payload.email} has recived an email to reset his password`
  );
  res.send("Password reset link has been sent to your email...");
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOneBy({ id: Number(id) });
  if (user === null) {
    res.send("invalid id...");
    return;
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    baseLogger.error(error);
    res.send(error);
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  const user = await User.findOneBy({ id: Number(id) });
  if (user === null) {
    res.send("invalid id...");
    return;
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    if (ableToReset(password, password2) === true) {
      let hashPassword = async (password: string) => {
        if (password) {
          user.password = await bcrypt.hash(password, 10);
        }
      };
      hashPassword(password);
      await user.save();
      res.send(password);
      baseLogger.info(`The user with id ${id} changed his password succefully`);
    }
  } catch (error) {
    baseLogger.error(error);
    res.send(error);
  }
});

export default router;
