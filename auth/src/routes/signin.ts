import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "@microservice-training/common";
import { User } from "../models/user";
import { BadRequestError } from "@microservice-training/common";
import { PasswordEncrypt } from "../services/password";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be vaild"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("Invaild Credentials");
      }

      const passwordMatch = await PasswordEncrypt.compare(
        existingUser.password,
        password
      );

      if (!passwordMatch) {
        throw new BadRequestError("Invaild Credentials");
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };

      res.status(200).send(existingUser);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as signinRouter };
