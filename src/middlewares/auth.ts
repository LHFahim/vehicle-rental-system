import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized", data: null });
      }

      const token = authHeader.slice(7);

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized", data: null });
      }

      const verified = jwt.verify(token as string, config.SECRET as string);

      const decoded: JwtPayload =
        typeof verified === "string"
          ? { data: verified }
          : (verified as JwtPayload);

      req.user = decoded;

      if (roles.length) {
        const userRole = (decoded as any).role;
        if (!userRole || !roles.includes(userRole)) {
          return res
            .status(403)
            .json({ success: false, message: "Forbidden", data: null });
        }
      }

      // const { role } = decoded as any;

      next();
    } catch (error: any) {
      res
        .status(401)
        .json({ success: false, message: error.message, data: null });
    }
  };
};

export default auth;
