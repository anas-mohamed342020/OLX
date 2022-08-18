const joi = require("joi");

const userSchema = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi.string().required().pattern(RegExp('^[a-zA-Z0-9_.]*$')),
      lastName: joi.string().required().pattern(RegExp('^[a-zA-Z0-9_.]*$')),
      email: joi.string().email().required(),
      password: joi.string().required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      phone: joi.string(),
    }),
};

const confirmSchema = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

const signInScema = {
  body: joi.object().required().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};

const updateSchema = {
  body: joi.object().required().keys({
    firstName: joi.string().pattern(RegExp('^[a-zA-Z0-9_.]*$')),
    lastName: joi.string().pattern(RegExp('^[a-zA-Z0-9_.]*$')),
    email: joi.string().email(),
    phone: joi.string(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

const deleteSchema = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().max(24).min(24),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};


const softDeleteSchema = {
  body:joi.object().required().keys({}),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}

const changePassSend = {
  body:joi.object().required().keys({
    email:joi.string().email().required()
  }),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
}
const changePass = {
  body:joi.object().required().keys({
    email:joi.string().email().required(),
    key:joi.string().required().length(6),
    password:joi.string().required(),
    cPassword:joi.string().valid(joi.ref('password')).required()
  }),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
}
const updatePass = {
  body:joi.object().required().keys({
    old_password:joi.string().required(),
    new_password:joi.string().required()
  }),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
}

module.exports = {
  userSchema,
  confirmSchema,
  signInScema,
  updateSchema,
  deleteSchema,
  softDeleteSchema,
  changePassSend,
  changePass,
  updatePass
};
