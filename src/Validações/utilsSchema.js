const yup = require("./config");

const newSkill = yup.object().shape({
  habilidade: yup.string().trim().required("Habilidade não informada"),
});

const newArea = yup.object().shape({
  area: yup.string().trim().required("Area não informada"),
});

const newTime = yup.object().shape({
  hora: yup.string().trim().required("Horário não informado"),
});

module.exports = {
  newSkill,
  newArea,
  newTime,
};
