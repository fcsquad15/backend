const knex = require("../Server/conexao");

const listUsers = async () => {
  const list = await knex("usuarios").orderBy("nome");
  return list;
};

const userEmail = async (email) => {
  const list = await knex("usuarios").where({ email }).first();
  return list;
};

const userExists = async (id) => {
  const list = await knex("usuarios").where({ id }).first();
  return list;
};

const insertUser = async (
  nome,
  email,
  encryptedPassword,
  avatar,
  bio,
  area
) => {
  nome = nome.trim();
  email = email.trim();
  const addedUser = await knex("usuarios")
    .insert({ nome, email, senha: encryptedPassword, avatar, bio, area })
    .returning("*");
  return addedUser;
};

const updateUser = async (id, nome, email, senha, bio, avatar, area) => {
  nome = nome && nome.trim();
  email = email && email.trim();
  bio = bio && bio.trim();
  area = area && area.trim();

  const userUpdated = await knex("usuarios")
    .where({ id })
    .update({ nome, email, senha, bio, avatar, area });
  return userUpdated;
};

module.exports = {
  listUsers,
  userEmail,
  userExists,
  insertUser,
  updateUser,
};
