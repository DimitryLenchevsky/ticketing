import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Password } from "../services/password";
import { User } from "../models/user";
import { validationRequest } from "../middleware/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("User not found");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate json web token
    const userJwt = jwt.sign(
      {
        id: (existingUser._id as any).toString(),
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
