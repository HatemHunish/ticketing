import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { RequestValidationError } from "@microservice-training/common";
import { User } from "../models/user";
import { BadRequestError } from "@microservice-training/common";
import { validateRequest } from "@microservice-training/common";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email Must Be Valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 charachters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log("Email in use", existingUser);
        throw new BadRequestError(`Email in use : ${existingUser}`);
      }
      const user = new User({
        email,
        password,
      });

      await user.save();

      //GENERATE JWT

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

export { router as signupRouter };
