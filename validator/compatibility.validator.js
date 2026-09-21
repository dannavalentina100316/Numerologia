import { body } from "express-validator";
export const crearCompatibilityValidator = [
  body("user1Id").isMongoId(),
  body("user2Id").isMongoId(),
  body("score").optional().isFloat({min:0, max:100})
];