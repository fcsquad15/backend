const knex = require("../Server/conexao");

const userEmail = async (email) => {
  const list = await knex("usuarios").where({ email }).first();
  return list;
};

const skillExists = async (usuario_id, habilidade_id) => {
  const list = await knex("habilidadeusuarios")
    .where({ usuario_id, habilidade_id })
    .first();
  return list;
};

const listSkills = async (id) => {
  const list = await knex("habilidadeusuarios")
    .where({ "habilidadeusuarios.usuario_id": id })
    .select("habilidades.id", "habilidades.habilidade")
    .join(
      "habilidades",
      "habilidades.id",
      "=",
      "habilidadeusuarios.habilidade_id"
    )
    .orderBy("habilidade");
  return list;
};

const insertSkill = async (usuario_id, habilidade_id) => {
  const skillOk = await knex("habilidadeusuarios")
    .insert({ usuario_id, habilidade_id })
    .returning("*");
  return skillOk;
};

module.exports = {
  listSkills,
  insertSkill,
  skillExists,
};
