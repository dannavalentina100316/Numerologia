import { body, param } from "express-validator";

export const crearUsuarioValidator = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio")
    .isLength({min:2, max:50}).withMessage("Min 2 max 50"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password").isLength({min:6}).withMessage("Password min 6")
];
export const idValidator = [
  param("id").isMongoId().withMessage("Id no es un ObjectId válido")
];