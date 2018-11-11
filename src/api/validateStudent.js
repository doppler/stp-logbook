const Joi = require("joi");

const schema = Joi.object()
  .keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number()
      .integer()
      .min(1900)
      .max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
  })
  .with("username", "birthyear")
  .without("password", "access_token");

// Return result.
const result = Joi.validate(
  { email: "foo", username: "aa", birthyear: "1971" },
  schema,
  { abortEarly: false }
);
// result.error === null -> valid
console.log(result);
// You can also pass a callback which will be called synchronously with the validation result.
Joi.validate(
  { email: "foobar", username: "abc", birthyear: 1994 },
  schema,
  function(err, value) {}
); // err === null -> valid
