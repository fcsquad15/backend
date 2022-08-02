const yup = require("./config");

const signUpUser = yup.object().shape({
  nome: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  senha: yup.string().trim().required(),
  bio: yup.string(),
  area: yup.string(),
});

const loginSchema = yup.object().shape({
  email: yup.string().trim().email().required(),
  senha: yup.string().trim().required(),
});

module.exports = {
  signUpUser,
  loginSchema,
};
