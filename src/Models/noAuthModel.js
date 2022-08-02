const knex = require("../Server/conexao");

const emailExists = async (email) => {
  const list = await knex("usuarios").select("email").where({ email }).first();
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

module.exports = {
  emailExists,
  userEmail,
  userExists,
  insertUser,
};
