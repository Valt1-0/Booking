const Joi = require("joi");

// Définition du schéma de validation pour l'événement
const eventValidationSchema = Joi.object({
  firstname: Joi.string().required().trim().messages({
    "string.empty": "First name is required.",
    "any.required": "First name is required.",
  }),
  lastname: Joi.string().required().trim().messages({
    "string.empty": "Last name is required.",
    "any.required": "Last name is required.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required.",
    "any.required": "Phone number is required.",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "any.required": "Password is required.",
    }),
});

// Fonction pour valider un événement
const validateUser = (req, res, next) => {
  const { error } = eventValidationSchema.validate(req.body);
  console.log(error);

  if (error) {
    return res.status(400).json({ message: error });
  }
  next();
};

module.exports = {
  validateUser,
};
