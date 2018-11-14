const Joi = require("joi");

const schema = Joi.object().keys({
  id: Joi.string()
    .alphanum()
    .required(),
  name: Joi.string().required(),
  tailNumber: Joi.string()
    .alphanum()
    .required()
});

const validateAircraft = aircraft => {
  const result = Joi.validate(aircraft, schema, { abortEarly: false });
  return result;
};

module.exports = validateAircraft;
