import express from "express";
import { Permission } from "../../DB/Entities/Permissions.js";

const authorize = (api: string) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const permissions: Permission[] = res.locals.user.role.permissions || [];
    if (
      permissions.filter((p) => {
        return p.name === api || p.name === "admin";
      }).length > 0
    ) {
      next();
    } else {
      res
        .status(403)
        .send("you don't have the permission to access this resource!");
    }
  };
};

export { authorize };
