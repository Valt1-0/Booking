const Joi = require("joi");

// Définition du schéma de validation pour l'événement
const eventValidationSchema = Joi.object({
  eventName: Joi.string().required().messages({
    "any.required": "Event name is required.",
    "string.empty": "Event name cannot be empty.",
  }),
  localization: Joi.string().required().messages({
    "any.required": "Localization is required.",
    "string.empty": "Localization cannot be empty.",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required.",
    "date.base": "Date must be a valid date.",
  }),
  startTime: Joi.string().required().messages({
    "any.required": "Start time is required.",
    "string.empty": "Start time cannot be empty.",
  }),
  endTime: Joi.string().required().messages({
    "any.required": "End time is required.",
    "string.empty": "End time cannot be empty.",
  }),
  description: Joi.string().messages({
    "string.empty": "Description cannot be empty.",
  }),
  organizer: Joi.string().required().messages({
    "any.required": "Organizer is required.",
    "string.empty": "Organizer cannot be empty.",
  }),
  ticketPrice: Joi.number().required().min(0).messages({
    "any.required": "Ticket price is required.",
    "number.min": "Ticket price must be a positive number or zero.",
  }),
  maxCapacity: Joi.number().required().min(1).messages({
    "any.required": "Max capacity is required.",
    "number.min": "Max capacity must be at least 1.",
  }),
  currentCapacity: Joi.number().min(0).messages({
    "number.min": "Current capacity must be a positive number or zero.",
  }),
  isCancelled: Joi.boolean(),
  performers: Joi.array().items(Joi.string().required()).min(1).messages({
    "array.base": "Performers must be an array of strings.",
    "array.min": "At least one performer must be provided.",
    "string.empty": "Performer name cannot be empty.",
    "any.required": "Performer name is required.",
  }),
});

// Fonction pour valider un événement
const validateEvent = (req, res, next) => {
  req.body.performers = JSON.parse(req.body.performers);

  const { error } = eventValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = {
  validateEvent,
};
