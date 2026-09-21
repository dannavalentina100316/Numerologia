import { body } from "express-validator";
export const crearReadingValidator = [
  body("userId").isMongoId().withMessage("userId invalido"),
  body("readingType").notEmpty().isIn(['lifePath','soulUrge','expression']).withMessage("Tipo no válido"),
  body("content").trim().notEmpty().withMessage("Content obligatorio")
];