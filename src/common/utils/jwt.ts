import * as jwt from "jsonwebtoken";
import { env } from "../../config/env";
type jwtPayload = {
  id: number;
};

export default {
  jwtSign: function (payload: jwtPayload) {
    let key = env.JWT_SECRET;
    let expires = env.JWT_EXPIRES;

    const accessToken = jwt.sign(payload, key, {
      expiresIn: expires as any,
    });

    return accessToken;
  },

  jwtVerify: function (token: string) {
    let key = env.JWT_SECRET;
    let decoded = jwt.verify(token, key);
    if (typeof decoded === "string") {
      return {};
    }
    return decoded;
  },
};
