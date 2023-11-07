import express from "express";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Role } from "../DB/Entities/Role.js";
import { Permission } from "../DB/Entities/Permissions.js";
import dataSource from "../DB/dataSource.js";
import { User } from "../DB/Entities/User.js";
import { Like } from "typeorm";
import baseLogger from "../log.js";

const router = express.Router();

router.post("/", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const permissions = req.body.permissions;

    if (!req.body.roleName) {
      res.status(400).send("Enter the name of the Role!");
    }

    if (!permissions) {
      res.status(400).send("Enter the permissions of this role");
    }

    const x = await Role.findOne({
      where: { roleName: Like(`${req.body.roleName}`) },
    });

    if (x === null) {
      let role = new Role();
      role.roleName = req.body.roleName;
      let perm: Permission[] = [];

      for (let i = 0; i < permissions.length; i++) {
        let p = await Permission.findOneBy({
          name: permissions[i],
        });

        if (p === null) {
          var permision = new Permission();
          permision.name = permissions[i];
          await permision.save();

          perm = [...perm, permision];
          continue;
        }

        perm = [...perm, p];
      }
      role.permissions = perm;
      role.save();
      baseLogger.info(`New Rle has been added be admin: ${role.roleName}`);
      res.status(201).send("Role has been added succefully!");
    } else {
      baseLogger.info(
        `The admin trying to add new role with name already exist`
      );
      res.status(409).send("There are a Role with this name!");
    }
  } catch (error) {
    baseLogger.error(`Error occured while creating new Role: ${error}`);
    res.status(500).send("Something wrong happened!");
  }
});

router.get("/", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const roles = await dataSource
      .createQueryBuilder()
      .select("roleName")
      .from(Role, "roleName")
      .getMany();
    baseLogger.info(`The admin view the existed Roles`);
    return res.status(200).json({ roles });
  } catch (error) {
    baseLogger.error(`Error while seeing the Roles by admin: ${error}`);
    res.status(500).send("somthing wrong happend");
  }
});

router.put("/user", authenticate, authorize("Admin"), async (req, res) => {
  try {
    let x: Role | null;
    const roleName = req.body.roleName;
    const userName = req.body.username;
    let role = await Role.findOneBy({ roleName: roleName }).then(
      (rle) => (x = rle)
    );
    let user = await User.findOneBy({ username: userName });

    if (role === null || user === null) {
      baseLogger.error(
        `Trying to add role for user one of them or both not exist`
      );
      res.status(404).send("Can't find User or the Role");
    } else {
      user.role = role;
      user.save();
    }

    baseLogger.info(`The Role ${role?.roleName} for the user ${user?.name}`);
    res.status(200).send("Role has been assigned to the user");
  } catch (error) {
    console.error("error while assigning role to the user :" + error);
    res.status(500).send("something went wrong");
  }
});
export default router;
