import Joi from "joi";

const schema = Joi.object().keys({
  _id: Joi.string().required(),
  _rev: Joi.string(),
  _deleted: Joi.boolean(),
  type: Joi.string().required(),
  studentId: Joi.string().required(),
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
  notes: Joi.string(),
  phraseCloudSelections: Joi.object()
});

const validateJump = jump => {
  try {
    const result = Joi.validate(jump, schema, {
      abortEarly: false,
      allowUnknown: true
    });
    return result;
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
};

export default validateJump;
