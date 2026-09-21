import { body, param } from "express-validator";
export const crearNumerologyValidator = [
  body("userId").isMongoId().withMessage("userId debe ser ObjectId válido"),
  body("birthDate").optional().isISO8601().withMessage("Fecha debe ser YYYY-MM-DD")
];
export const actualizarNumerologyValidator = [
  body("userId").optional().isMongoId(),
  body("lifePathNumber").optional().isInt({min:1, max:33})
];