const express = require("express");
const noAuth = require("../controladores/noAuth");
const usuarios = require("../controladores/usuarios");
const utilitarios = require("../controladores/utils");
const forum = require("../controladores/forum");
const mentorias = require("../controladores/mentorias");
const notificacao = require("../controladores/notificacoes");
const verificarLogin = require("../intermediarios/verificarlogin");

const rotas = express();

rotas.post("/", noAuth.login);
rotas.post("/usuarios", noAuth.signUpUser);

rotas.post("/habilidades", utilitarios.cadastrarHabilidade);
rotas.get("/habilidades", utilitarios.listarHabilidade);
rotas.post("/horarios", utilitarios.cadastrarHorario);
rotas.get("/horarios", utilitarios.listarHorario);
rotas.post("/areas", utilitarios.cadastrarAreas);
rotas.get("/areas", utilitarios.listarAreas);

// Autenticação
rotas.use(verificarLogin);

//rotas para manuseio do usuário
rotas.get("/usuarios", usuarios.listarUsuarios);
rotas.get("/usuario", usuarios.obterUsuario);
rotas.patch("/usuario", usuarios.atualizarUsuario);
rotas.get("/usuarios/habilidades/:id", usuarios.listarHabilidadesUsuario);
rotas.post("/usuarios/habilidades", usuarios.addHabilidadeUsuario);

rotas.delete("/usuarios/", usuarios.deletarUsuario);
rotas.post("/usuarios/areas", usuarios.addAreaUsuario);
rotas.get("/usuarios/areas/:id", usuarios.listarAreaUsuario);

//rotas para notificações
rotas.get("/notificacoes", notificacao.listarNotificacoes);
rotas.post("/notificacoes", notificacao.visualizarTodasNotificacoes);

rotas.get("/notificacoes/quantidade/:id", notificacao.contarNotificacoes);

// rotas para o forum
rotas.get("/forum", forum.listarPerguntas);

rotas.get(
  "/forum/filtro/:habilidade_id",
  forum.listarPerguntasFiltroHabilidade
);
rotas.get("/forum/:postagem_id", forum.listarComentarios); // id da postagem
rotas.post("/forum/", forum.criarPergunta);
rotas.post("/forum/:postagem_id", forum.comentarPergunta); // id da postagem

// rotas para as mentorias
rotas.get("/mentorias/filtroArea", mentorias.filtrarMentorArea);
rotas.get("/mentor/:mentor", mentorias.obterMentor);
rotas.post("/mentorias/marcar", mentorias.marcarMentoria);
rotas.get("/mentorias/marcadas", mentorias.listarMentoriasMarcadas);

rotas.get("/mentorias", mentorias.listarMentores);
rotas.post("/usuarios/mentorias", mentorias.disponibilizarHorario);

module.exports = rotas;
