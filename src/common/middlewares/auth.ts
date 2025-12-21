import { Request, Response, NextFunction } from "express";
import jwtUtil from "../utils/jwt";
import userService from "../../modules/users/users.service";

export default {
  authenticate: async function (req: Request, res: Response, next: NextFunction) {
    // Check params
    let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request: Access token is required",
      });
    }

    // Verify
    const decoded = jwtUtil.jwtVerify(token);
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request: Invalid access token",
      });
    }

    const user = await userService.findUserByColumn({ id: decoded.id });
    if (!user.success || !user.data) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request: Invalid access token for user",
      });
    }

    req.user = { id: user.data.id };

    next();
  },
};
