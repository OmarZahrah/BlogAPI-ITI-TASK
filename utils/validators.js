const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const postSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(3).required(),
  group: Joi.string().optional().allow(null, ""),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(3),
  content: Joi.string().min(3),
  group: Joi.string().optional().allow(null, ""),
}).min(1);

const groupSchema = Joi.object({
  name: Joi.string().min(2).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  postSchema,
  updatePostSchema,
  groupSchema,
};
