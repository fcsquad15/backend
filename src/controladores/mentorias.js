const conexao = require("../Server/conexao");

const utilsModel = require("../Models/utilsModel");
const menthorModel = require("../Models/menthorModel");
const menthorInfosModel = require("../Models/usersInfosModel");

const notificationModel = require("../Models/notificationModel");

const messageError = require("../Mensagens/errorToast");

//ok
const filtrarMentorArea = async (req, res) => {
  const { area } = req.query;

  if (!area) {
    return res.status(404).json(messageError.mandatoryInfo);
  }

  try {
    const mentores = await menthorModel.listMenthorByArea(area);

    if (!mentores) {
      return res.status(400).json(messageError.utilsNotFound);
    }

    res.status(200).json(mentores);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
//ok
const obterMentor = async (req, res) => {
  const { mentor } = req.params;

  if (!mentor) {
    return res.status(404).json(messageError.mandatoryInfo);
  }

  try {
    const menthor = await menthorModel.getUser(mentor);

    if (!menthor) {
      return res.status(400).json(messageError.userNotFound);
    }

    const menthorSkills = await menthorInfosModel.listSkills(mentor);

    const schedule = await menthorModel.getMenthorSchedule(mentor);

    res.status(200).json({
      mentor: menthor,
      habilidade:
        menthorSkills.length !== 0
          ? menthorSkills
          : "Não tem habilidades cadastradas",
      horarios: schedule.length !== 0 ? schedule : "Não tem horário disponível",
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
//ok
const marcarMentoria = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const { agenda_id, mentor_id } = req.body;

  if (!usuario_id || !agenda_id || !mentor_id) {
    return res.status(400).json(messageError.mandatoryInfo);
  }

  try {
    const mentoriaDisponivel = await menthorModel.scheduleAvailable(agenda_id);

    if (!mentoriaDisponivel) {
      return res.status(400).json(messageError.scheduleAvailable);
    }

    const novaMentoria = await menthorModel.scheduleMentorship(
      usuario_id,
      agenda_id
    );

    if (!novaMentoria) {
      return res.status(400).json(messageError.unfinishedAction);
    }

    const mentoriaMarcada = await menthorModel.scheduleUpdate(agenda_id);

    if (!mentoriaMarcada) {
      return res.status(400).json(messageError.unfinishedAction);
    }

    const buscarMentorado = await menthorModel.getUser(usuario_id);

    const buscarMentor = await menthorModel.getUser(mentor_id);

    const dataParaFormatar = new Date(mentoriaDisponivel.dia);
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(dataParaFormatar);

    const time = await utilsModel.getTimeById(mentoriaDisponivel.hora_id);

    const mensagemMentorado = `Mentoria com ${buscarMentor.nome} (${dataFormatada} às ${time.hora}) foi agendada com sucesso. Você receberá uma notificação 15 minutos antes dela começar e um chat entre vocês será aberto automaticamente.`;

    const mensagemMentor = `Sua mentoria ${dataFormatada} às ${time.hora} foi agendada por ${buscarMentorado.nome} . Você receberá uma notificação 15 minutos antes dela começar e um chat entre vocês será aberto automaticamente.`;

    const notificaoMentorado = await notificationModel.createNotification(
      usuario_id,
      mensagemMentorado
    );

    if (!notificaoMentorado) {
      return res.status(400).json(messageError.createNotification);
    }

    const notificaoMentor = await notificationModel.createNotification(
      mentor_id,
      mensagemMentor
    );

    if (notificaoMentor.rowCount === 0) {
      return res.status(400).json(messageError.createNotification);
    }

    return res.status(201).json({ mensagem: "Mentoria marcada com sucesso" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
//ok
const listarMentoriasMarcadas = async (req, res) => {
  const { id: usuario_id } = req.usuario;

  if (!usuario_id) {
    return res.status(400).json(messageError.mandatoryInfo);
  }

  try {
    const mentorias = await menthorModel.getScheduledMenthorships(usuario_id);

    if (mentorias.length === 0) {
      return res.status(200).json("Sem mentorias marcadas.");
    }

    return res.status(200).json(mentorias);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarMentores = async (req, res) => {
  try {
    const mentores = await conexao.query(
      "SELECT usuarios.id,usuarios.nome,usuarios.bio, usuarios.avatar FROM agenda LEFT JOIN usuarios ON agenda.usuario_id = usuarios.id GROUP BY usuarios.id"
    );

    if (mentores.rowCount === 0) {
      return res.status(400).json("Não foi possível listar as mentorias");
    }

    res.status(200).json(mentores.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const disponibilizarHorario = async (req, res) => {
  // const { id: usuario_id } = req.usuario
  // const { dia, hora_id } = req.body
  const { usuario_id, dia, hora_id } = req.body;

  if (!usuario_id || !dia || !hora_id) {
    return res
      .status(404)
      .json({ mensagem: "Dados obrigatórios não informados." });
  }

  try {
    const { rowCount: buscarUsuario } = await conexao.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (buscarUsuario === 0) {
      return res.status(400).json({ mensagem: "Usuário não encontrado" });
    }

    const { rowCount: horarioExistente } = await conexao.query(
      "SELECT * FROM agenda WHERE usuario_id=$1 AND dia=$2 AND hora_id=$3",
      [usuario_id, dia, hora_id]
    );

    if (horarioExistente > 0) {
      return res
        .status(400)
        .json({ mensagem: "Essa horário já está disponibilizado" });
    }

    const novoHorario = await conexao.query(
      "INSERT INTO agenda (usuario_id,dia,hora_id) VALUES ( $1,$2,$3)",
      [usuario_id, dia, hora_id]
    );

    if (novoHorario.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível inserir o horário." });
    }

    res.status(201).json({ mensagem: "Horário inserido com sucesso" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  filtrarMentorArea,
  obterMentor,
  marcarMentoria,
  listarMentoriasMarcadas,
  disponibilizarHorario,
  listarMentores,
};
