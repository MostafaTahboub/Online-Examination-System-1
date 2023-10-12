import express from "express";
import { validateUser } from "../middleware/validation/user.js";
import { User } from "../DB/Entities/User.js";
import { login } from "../controllers/user.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { Role } from "../DB/Entities/Role.js";
import { symbolName } from "typescript";
const router = express.Router();

router.post("/register", validateUser, (req, res) => {
    
  let user = new User();
  user.userName = req.body.userName;
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save();
});

router.post("/login", (req, res) => {
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
      res.send();
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.get("/logout", authenticate, (req, res) => {
  res.cookie("fullName", "", { maxAge: -1 });
  res.cookie("logintTime", "", { maxAge: -1 });
  res.cookie("token", "", { maxAge: -1 });
  res.send("See You Soon My User");
});

export default router;