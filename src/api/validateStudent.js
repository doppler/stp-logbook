const Joi = require("joi");

const schema = Joi.object().keys({
  id: Joi.string()
    .alphanum()
    .required(),
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  phone: Joi.string()
    .replace(/[^\d]/g, "")
    .length(10)
    .required(),
  instructor: Joi.string().required(),
  previousJumps: Joi.number()
    .integer()
    .min(0)
    .required(),
  jumps: Joi.array().required()
});

const validateStudent = student => {
  const result = Joi.validate(student, schema, { abortEarly: false });
  return result;
};

module.exports = validateStudent;
