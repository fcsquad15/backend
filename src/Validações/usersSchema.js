const yup = require("./config");

const updateUser = yup.object().shape({
  nome: yup.string().trim(),
  email: yup.string().trim().email(),
  senha: yup.string().trim(),
  bio: yup.string(),
  area: yup.string(),
});

module.exports = {
  updateUser,
};
