import express from 'express';
import { User } from '../../DB/Entities/User.js';
import { Permission } from '../../DB/Entities/Permissions.js';

const authorize = (api: string) => {
    return (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction  
    ) => {
        const permissions: Permission[] = res.locals.user.role.permissions || [];
        if (permissions.filter(p => p.name === api).length > 0) {
            next();
        } else {
            res.status(403).send("you don't have the permission to access this resource!");
        }
    }
}

export {
    authorize
}