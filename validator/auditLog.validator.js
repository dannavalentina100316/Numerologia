import { body } from "express-validator";
export const crearAuditLogValidator = [
  body("userId").isMongoId(),
  body("action").trim().notEmpty().withMessage("Action requerido")
];