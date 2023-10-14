import express from "express";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Role } from "../DB/Entities/Role.js";
import { Permission } from "../DB/Entities/Permissions.js";
import dataSource from "../DB/dataSource.js";
import { User } from "../DB/Entities/User.js";
import { Like } from "typeorm";
const router = express.Router();

router.post("/newRole", authenticate, authorize("admin"), async (req, res) => {
  try {
    const permissions = req.body.permissions;

    if (!req.body.roleName) {
      res.status(500).send("Enter the name of the Role!");
    }

    if (!permissions) {
      res.status(500).send("Enter the permissions of this role");
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
          //create that permission
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
      res.status(201).send("Role has been added succefully!");
    } else {
      res.send("There are a Role with this name!");
    }
  } catch (error) {
    res.status(500).send("Something wrong happened!");
    console.error(error);
  }
});

router.get("/all", authenticate, authorize("admin"), async (req, res) => {
  try {
    const roles = await dataSource
      .createQueryBuilder()
      .select("roleName")
      .from(Role, "roleName")
      .getMany();
    return res.status(200).json({ roles });
  } catch (error) {
    res.status(404).send("somthing wrong happend");
  }
});

///the modification done on the Root
router.post(
  "/assign_role_to_user",
  authenticate,
  authorize("admin"),
  (req, res) => {
    let x: Role | null;
    const roleName = req.body.roleName;
    const userName = req.body.username;
    let role = Role.findOneBy({ roleName: roleName }).then((rle) => (x = rle));
    let user = User.findOneBy({ username: userName }).then((usr) => {
      if (x === null || usr === null) {
        res.status(404).send("Can't find User or the Role");
      } else {
        usr.role = x;
        console.log(usr);
        console.log(role);

        usr.save();
      }
    });
    res.status(200).send("Role has been assigned to the user");
  }
);
export default router;
