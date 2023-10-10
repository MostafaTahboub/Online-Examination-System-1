import { DataSource } from "typeorm";
import { User } from "./Entities/User.js";
import { Profile } from "./Entities/Profile.js";
import { Permission } from "./Entities/Permissions.js";
import { Role } from "./Entities/Role.js";

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "online",
  entities: [Profile, User, Role, Permission],
  synchronize: true,
  logging: true,
});

dataSource
  .initialize()
  .then(() => {
    console.log("connected to database :)");
    const user = new User();
    const profile = new Profile();
    profile.save();
    user.save();
  })
  .catch((err) => {
    console.log("failed to connect to db !! " + err);
  });

export default dataSource;
