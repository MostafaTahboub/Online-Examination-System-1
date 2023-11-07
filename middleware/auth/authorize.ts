import express from "express";
import { Permission } from "../../DB/Entities/Permissions.js";
import baseLogger from "../../log.js";

const authorize = (api: string) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const permissions: Permission[] = res.locals.user.role.permissions || [];
    if (
      permissions.filter((p) => {
        return p.name === api || p.name === "Admin";
      }).length > 0
    ) {
      next();
    } else {
      baseLogger.info(
        `Someone tried to access something he don't has access to`
      );
      res
        .status(403)
        .send("you don't have the permission to access this resource!");
    }
  };
};

export { authorize };
