const knex = require("../Server/conexao");

const getSkills = async () => {
  const list = await knex("habilidades").orderBy("habilidade");
  return list;
};

const skillsExists = async (habilidade) => {
  const skill = await knex("habilidades").where({ habilidade }).first();
  return skill;
};

const insertSkill = async (habilidade) => {
  habilidade = habilidade.trim();
  const newSkill = await knex("habilidades")
    .insert({ habilidade })
    .returning("*");
  return newSkill;
};

const getAreas = async () => {
  const list = await knex("area").orderBy("area");
  return list;
};

const areasExists = async (area) => {
  const areaExists = await knex("area").where({ area }).first();
  return areaExists;
};

const insertArea = async (area) => {
  area = area.trim();
  const newArea = await knex("area").insert({ area }).returning("*");
  return newArea;
};

const getTime = async () => {
  const list = await knex("horarios").orderBy("hora");
  return list;
};

const timeExists = async (hora) => {
  const times = await knex("horarios").where({ hora }).first();
  return times;
};

const insertTime = async (hora) => {
  hora = hora.trim();
  const newTime = await knex("horarios").insert({ hora }).returning("*");
  return newTime;
};

const getTimeById = async (id) => {
  const time = await knex("horarios").where({ id }).first();
  return time;
};

module.exports = {
  getSkills,
  skillsExists,
  insertSkill,
  getAreas,
  areasExists,
  insertArea,
  getTime,
  timeExists,
  insertTime,
  getTimeById,
};
