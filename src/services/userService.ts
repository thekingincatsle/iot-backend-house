import { PASSWORD_NOT_MATCH, USER_NOT_FOUND } from "../constants/errorMessages";
import { getStateForUser } from "../data/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const checkLogin = async (username: string, password: string) => {
  const user = await getStateForUser(username.replace(".", "-"));
  if (!user) throw new Error(USER_NOT_FOUND);
  const check = bcrypt.compareSync(password, user.password);
  if (!check) throw new Error(PASSWORD_NOT_MATCH);
  const data = {
    ...user,
    password: undefined
  };
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "300s"
  });

  return {
    data,
    accessToken
  };
};

export default {
  checkLogin
};