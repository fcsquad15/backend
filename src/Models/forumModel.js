const knex = require("../Server/conexao");

const skillExists = async (usuario_id, habilidade_id) => {
  const list = await knex("habilidadeusuarios")
    .where({ usuario_id, habilidade_id })
    .first();
  return list;
};

const listQuestion = async () => {
  const list = await knex("postagem")
    .select(
      "postagem.id",
      "postagem.pergunta",
      "usuarios.avatar",
      "usuarios.nome",
      "usuarios.area",
      "habilidades.habilidade"
    )
    .join("usuarios", "postagem.usuario_id", "=", "usuarios.id")
    .join("habilidades", "habilidades.id", "=", "postagem.habilidade_id")
    .orderBy("postagem.hora_postagem", "desc");
  return list;
};

const insertSkill = async (usuario_id, habilidade_id) => {
  const skillOk = await knex("habilidadeusuarios")
    .insert({ usuario_id, habilidade_id })
    .returning("*");
  return skillOk;
};

module.exports = {
  listQuestion,
};
