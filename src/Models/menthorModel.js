const knex = require("../Server/conexao");

const listMenthorByArea = async (area) => {
  const list = await knex("agenda")
    .select(
      "usuarios.id",
      "usuarios.nome",
      "usuarios.bio",
      "usuarios.avatar",
      "usuarios.area"
    )
    .join("usuarios", "agenda.usuario_id", "=", "usuarios.id")
    .join("areausuarios", "areausuarios.usuario_id", "=", "usuarios.id")
    .where({ "areausuarios.area_id": area })
    .groupBy("usuarios.id");
  return list;
};

const getUser = async (id) => {
  const user = await knex("usuarios").where({ id }).first();
  return user;
};

const getMenthorSchedule = async (usuario_id) => {
  const list = await knex("agenda")
    .select("agenda.id", "agenda.dia", "horarios.hora")
    .join("horarios", "horarios.id", "=", "agenda.hora_id")
    .where({ usuario_id, "agenda.disponivel": true })
    .orderBy("agenda.dia", "horarios.hora");
  return list;
};

const getScheduledMenthorships = async (usuario_id) => {
  const list = await knex("mentorias")
    .select("mentorias.id", "agenda.dia", "horarios.hora")
    .join("agenda", "mentorias.agenda_id", "=", "agenda.id")
    .join("horarios", "agenda.hora_id", "=", "horarios.id")
    .where({ "mentorias.usuario_mentorado_id": usuario_id })
    .limit(5)
    .orderBy("agenda.dia", "horarios.hora");
  return list;
};

const scheduleAvailable = async (id) => {
  const available = await knex("agenda")
    .where({ id, disponivel: true })
    .first();

  return available;
};

const scheduleMentorship = async (usuario_id, agenda_id) => {
  const mentorship = await knex("mentorias")
    .insert({ usuario_mentorado_id: usuario_id, agenda_id })
    .returning("*");

  return mentorship;
};

const scheduleUpdate = async (id) => {
  const mentorship = await knex("agenda")
    .where({ id })
    .update({ disponivel: false })
    .returning("*");

  return mentorship;
};

module.exports = {
  listMenthorByArea,
  getUser,
  getMenthorSchedule,
  getScheduledMenthorships,
  scheduleAvailable,
  scheduleMentorship,
  scheduleUpdate,
};
