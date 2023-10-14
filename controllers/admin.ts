import { Permission } from "../DB/Entities/Permissions.js";
import { Role } from "../DB/Entities/Role.js";
import { User } from "../DB/Entities/User.js";

let createAdminUser = async () => {
  let admin = await User.findOneBy({ name: "Root" });
  if (admin === null) {
    const permission = new Permission();
    permission.name = "admin";
    await permission.save();

    const role = new Role();
    role.roleName = "admin";
    role.permissions = [permission];
    await role.save();

    const student = new Role();
    student.roleName = "student";
    await student.save();
    
    const instructor = new Role();
    instructor.roleName = "instructor";
    await instructor.save();

    const user = new User();
    user.name = "Root";
    user.email = "201160@ppu.edu.ps";
    user.password = process.env.ADMIN_PASSWORD || "";
    user.role = role;
    await user.save();
  }
};

export default createAdminUser;
