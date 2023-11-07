import express from "express";
import { validateUser } from "../middleware/validation/user.js";
import { User } from "../DB/Entities/User.js";
import { login } from "../controllers/user.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { Role } from "../DB/Entities/Role.js";
import { validateUserLogin } from "../middleware/validation/login.js";
import baseLogger from "../log.js";
import sendEmail from "../controllers/SES.js";
const router = express.Router();

router.post("/signup", validateUser, async (req, res) => {
  try {
    let user = new User();
    user.username = req.body.userName;
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    let x = await Role.find({
      where: {
        roleName: req.body.type,
      },
    }).then((role) => {
      user.role = role[0] || null;
      console.log(user.role);
    });
    await user.save();
    baseLogger.info(`new ${Role.name} has been registered`);
    sendEmail(
      user.email,
      "Online-Examination-System",
      `Hello user ${user.id} you just join our family`
    );
    res.status(201).send("user has been added successfully");
  } catch (error) {
    baseLogger.error(`Error thrown while register: ${error}`);
    res.status(500).send("something went wrong ");
  }
});

router.post("/signin", validateUserLogin, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  login(email, password)
    .then((data) => {
      res.cookie("fullName", data.fullName, {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("loginTime", Date.now(), {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("token", data.token, {
        maxAge: 30 * 60 * 1000,
      });
      baseLogger.info(`New login from ( ${data.fullName} ) user`);
      res.status(200).send("ok");
    })
    .catch((err) => {
      baseLogger.info("Trying to login with invalid credintials");
      res.status(400).send("pleas try again with valid credintials");
    });
});

router.post("/signout", authenticate, (req, res) => {
  baseLogger.info(`${req.cookies["fullName"]} has just logged out`);
  res.cookie("fullName", "", { maxAge: -1 });
  res.cookie("logintTime", "", { maxAge: -1 });
  res.cookie("token", "", { maxAge: -1 });
  res.status(200).send("See You Soon My User");
});

export default router;
