const noAuthModel = require("../Models/noAuthModel");
const jwt = require("jsonwebtoken");
const messageError = require("../Mensagens/errorToast");

const segredo = process.env.TOKEN_SECRET;

const verificarLogin = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json(messageError.notAuthorization);
  }

  try {
    const { id } = await jwt.verify(token, segredo);

    const userExists = await noAuthModel.userExists(id);

    if (!userExists) {
      return res.status(500).json(messageError.userNotFound);
    }

    const { senha, ...usuario } = userExists;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro desconhecido. - " + error.message });
  }
};

module.exports = verificarLogin;
