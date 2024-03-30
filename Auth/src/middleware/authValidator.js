const Joi = require("joi");

// Définition du schéma de validation pour l'événement
const authValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "any.required": "Password is required.",
    }),
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": 'Role must be either "user" or "admin".',
    "any.required": "Role is required.",
  })
});

// Fonction pour valider un événement
const validateAuth = (req, res, next) => {
  const { error } = authValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  next();
};

module.exports = {
  validateAuth,
};
