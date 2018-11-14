const Joi = require("joi");

const schema = Joi.object().keys({
  number: Joi.number()
    .min(1)
    .required(),
  diveFlow: Joi.number()
    .min(1)
    .required(),
  date: Joi.date()
    .iso()
    .required(),
  instructor: Joi.string().required(),
  aircraft: Joi.string().required(),
  exitAltitude: Joi.number().required(),
  deploymentAltitude: Joi.number().required(),
  freefallTime: Joi.number().required(),
  exit: Joi.string(),
  freefall: Joi.string(),
  canopy: Joi.string(),
  notes: Joi.string()
});

const validateJump = jump => {
  const result = Joi.validate(jump, schema, { abortEarly: false });
  return result;
};

module.exports = validateJump;
