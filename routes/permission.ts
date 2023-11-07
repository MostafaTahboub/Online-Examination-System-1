import express from "express";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Permission } from "../DB/Entities/Permissions.js";
import dataSource from "../DB/dataSource.js";
import { Role } from "../DB/Entities/Role.js";
import baseLogger from "../log.js";

const router = express.Router();

router.post("/", authenticate, authorize("Admin"), async (req, res) => {
  try {
    if (!req.body.permissionName) {
      res.status(400).send("Enter the name of the permission!");
    }

    const x = await Permission.findOneBy({
      name: req.body.permissionName,
    });

    if (x === null) {
      let permission = new Permission();
      permission.name = req.body.permissionName;

      await permission.save();
      res.status(201).send("Permission has been added succefully!");
    } else {
      res.status(409).send("There ara a Permission with this name!");
    }
  } catch (error) {
    res.status(500).send("Something wrong happened!");
    console.error(error);
  }
});

router.get("/", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const permissions = await dataSource
      .createQueryBuilder()
      .select("name")
      .from(Permission, "name")
      .getMany();
    baseLogger.info(`All permission names has been retrived for the admin`);
    return res.status(200).json({ permissions });
  } catch (error) {
    baseLogger.error(
      `Error while retriving the permissions names by the admin: ${error}`
    );
    res.status(500).send("somthing wrong happend");
  }
});

router.put("/role", authenticate, authorize("Admin"), async (req, res) => {
  try {
    if (!req.body.roleName) {
      res.status(400).send("Enter the role name");
    }

    if (!req.body.permissionName) {
      res.status(400).send("Enter the permission name");
    }
    const role = await Role.findOneBy({ roleName: req.body.roleName });
    const permission = await Permission.findOneBy({
      name: req.body.permissionName,
    });
    if (role === null || permission === null) {
      baseLogger.error(
        `Error while assigning permission to role: one of them or both not exist`
      );
      res.send("invalid role or permission name");
    } else {
      role.permissions = [...role.permissions, permission];
      role.save();
      baseLogger.info(
        `Assigning permission: ${permission.name} to role: ${role.roleName} was successful`
      );
      res.status(200).send("permission assigned to the role");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("something went wrong ");
  }
});

export default router;
