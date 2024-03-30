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
});

// Fonction pour valider un événement
const validateUser = (req, res, next) => {
  req.body.performers = JSON.parse(req.body.performers);

  const { error } = eventValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = {
  validateUser,
};
