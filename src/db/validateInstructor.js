const Joi = require("joi");

const schema = Joi.object().keys({
  _id: Joi.string()
    .alphanum()
    .required(),
  _rev: Joi.string(),
  _deleted: Joi.boolean(),
  type: Joi.string().required(),
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
