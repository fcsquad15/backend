const conexao = require("../Server/conexao");

const notificationModel = require("../Models/notificationModel");

const listarNotificacoes = async (req, res) => {
  const { id } = req.usuario;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado" });
  }

  try {
    const notificacoes = await notificationModel.listNotification(id);

    if (!notificacoes) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível encontrar as notificações" });
    }

    res.status(200).json(notificacoes);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const contarNotificacoes = async (req, res) => {
  // const { id } = req.usuario // para usar com Autenticaçaõ
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado" });
  }

  try {
    const notificacoes = await conexao.query(
      "SELECT COUNT(*) FROM notificacao WHERE usuario_id=$1 AND lida=false",
      [id]
    );

    if (notificacoes.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível encontrar as notificações" });
    }

    res.status(200).send(notificacoes.rows[0].count);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const visualizarTodasNotificacoes = async (req, res) => {
  const { id } = req.usuario;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado" });
  }

  try {
    const notificacoes = await notificationModel.readAllNotification(id);

    if (!notificacoes) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível ler as notificações" });
    }

    res.status(200).json({ mensagem: "Mensagem lida com sucesso" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarNotificacoes,
  visualizarTodasNotificacoes,
  contarNotificacoes,
};
