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
    .required()
});

const validateInstructor = instructor => {
  const result = Joi.validate(instructor, schema, { abortEarly: false });
  return result;
};

module.exports = validateInstructor;
