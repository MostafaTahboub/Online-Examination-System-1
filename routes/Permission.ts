import express from 'express'
import { authenticate } from '../middleware/auth/authenticate.js';
import { authorize } from '../middleware/auth/authorize.js';
import { Permission } from '../DB/Entities/Permissions.js';
import dataSource from '../DB/dataSource.js';
import { Role } from '../DB/Entities/Role.js';
const router = express.Router();
router.post('/new_permission', async(req, res) => {
    try {
        if (!req.body.permissionName) {
          res.status(500).send("Enter the name of the permission!");
        }
    
        const x = await Permission.findOneBy({
          name : req.body.permissionName 
        });
    
        if (x === null) {
          let permission = new Permission();
          permission.name = req.body.permissionName;
    
          permission.save();
          res.status(201).send("Permission has been added succefully!");
        } else {
          res.send("There ara a Permission with this name!");
        }
      } catch (error) {
        res.status(500).send("Something wrong happened!");
        console.error(error)
      }
});
router.get('/all',authenticate, authorize('admin'), async (req,res) => {
    try {
        const permissions = await dataSource
          .createQueryBuilder()
          .select("name")
          .from(Permission, "name")
          .getMany();
        return res.status(200).json({ permissions });
      } catch (error) {
        res.status(404).send("somthing wrong happend");
      }
});

router.put("/assign_permsiision_to_role", authenticate, authorize('admin'), async(req,res) => {
    try {
        if(!req.body.roleName)
        {
            res.send("Enter the role name");
        }

        if(!req.body.permissionName)
        {
            res.send("Enter the permission name");
        }
        const role = await Role.findOneBy({roleName: req.body.roleName});
        const permission = await Permission.findOneBy({name: req.body.permissionName});
        if(role === null || permission === null)
        {
            res.send("invalid role or permission name");
        }
        else{
            role.permissions = [...role.permissions, permission];
            role.save();
            res.status(200).send("permission assigned to the role");
        }
    } catch (error) {
        
    }
})

export default router;