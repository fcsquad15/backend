const conexao = require("../Server/conexao");

const utilsSchema = require("../Validações/utilsSchema");
const utilsModel = require("../Models/utilsModel");

const messageError = require("../Mensagens/errorToast");
const messageSuccess = require("../Mensagens/successToast");

const cadastrarHabilidade = async (req, res) => {
  const { habilidade } = req.body;

  try {
    await utilsSchema.newSkill.validate(req.body);

    if (!habilidade) {
      return res.status(404).json(messageError.mandatoryInfo);
    }

    const habilidadeExistente = await utilsModel.skillsExists(habilidade);

    if (habilidadeExistente) {
      return res.status(400).json(messageError.skillExists);
    }

    const novaHabilidade = await utilsModel.insertSkill(habilidade);
    if (!novaHabilidade) {
      return res.status(400).json(messageError.utilsErros);
    }

    res.status(201).json({ mensagem: "Habilidade Cadastrada" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarHabilidade = async (req, res) => {
  try {
    const habilidades = await utilsModel.getSkills();

    if (!habilidades) {
      return res.status(400).json(messageError.utilsNotFound);
    }

    res.status(200).json(habilidades);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarHorario = async (req, res) => {
  const { hora } = req.body;

  try {
    await utilsSchema.newTime.validate(req.body);

    const horaExistente = await utilsModel.timeExists(hora);

    if (horaExistente) {
      return res.status(400).json(messageError.timeExists);
    }

    const novaHabilidade = utilsModel.insertTime(hora);

    if (!novaHabilidade) {
      return res.status(400).json(messageError.utilsErros);
    }

    res.status(201).json({ mensagem: "Hora Cadastrada" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarHorario = async (req, res) => {
  try {
    const horarios = await utilsModel.getTime();

    if (!horarios) {
      return res.status(400).json(messageError.utilsNotFound);
    }

    res.status(200).json(horarios);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const listarAreas = async (req, res) => {
  try {
    const areas = await utilsModel.getAreas();

    if (!areas) {
      return res.status(400).json(messageError.utilsNotFound);
    }

    res.status(201).json(areas);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarAreas = async (req, res) => {
  const { area } = req.body;

  try {
    await utilsSchema.newArea.validate(req.body);

    const areaExistente = await utilsModel.areasExists(area);

    if (areaExistente) {
      return res.status(400).json(messageError.areaExists);
    }

    const novaArea = await utilsModel.insertArea(area);

    if (!novaArea) {
      return res.status(400).json(messageError.utilsErros);
    }

    res.status(201).json({ mensagem: "Área Cadastrada" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarHabilidade,
  listarHabilidade,
  cadastrarHorario,
  listarHorario,
  listarAreas,
  cadastrarAreas,
};
