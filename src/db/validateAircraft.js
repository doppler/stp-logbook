import Joi from "joi";

const schema = Joi.object().keys({
  _id: Joi.string()
    .alphanum()
    .required(),
  _rev: Joi.string(),
  _deleted: Joi.boolean(),
  type: Joi.string().required(),
  name: Joi.string().required(),
  tailNumber: Joi.string().required()
});

const validateAircraft = aircraft => {
  const result = Joi.validate(aircraft, schema, { abortEarly: false });
  return result;
};

export default validateAircraft;
