const express = require('express');
const usuarios = require('./controladores/usuarios');
const utilitarios = require('./controladores/utilitarios');
const forum = require('./controladores/forum');
const mentorias = require('./controladores/mentorias');
const notificacao = require('./controladores/notificacoes');
const verificarLogin = require('./intermediarios/verificarlogin');



const rotas = express();

//rotas sem autenticação
rotas.post('/', usuarios.login);
rotas.post('/usuarios/', usuarios.cadastrarUsuario);

// rotas para utilidades que não vamos usar no front, usei para testar a conexão com o banco de dados
rotas.post('/habilidades', utilitarios.cadastrarHabilidade);
rotas.get('/habilidades', utilitarios.listarHabilidade);
rotas.post('/horarios', utilitarios.cadastrarHorario);
rotas.get('/horarios', utilitarios.listarHorario);
rotas.post('/areas', utilitarios.cadastrarAreas);
rotas.get('/areas', utilitarios.listarAreas);

// Autenticação
// rotas.use(verificarLogin)

//rotas para manuseio do usuário
rotas.get('/usuarios', usuarios.listarUsuarios);
rotas.get('/usuarios/:id', usuarios.obterUsuario);//id do usuario
// rotas.put('/usuarios/', usuarios.atualizarUsuario); //com autenticação
rotas.put('/usuarios/:id', usuarios.atualizarUsuario);//id do usuario
// rotas.delete('/usuarios/', usuarios.deletarUsuario);  // com autenticação
rotas.delete('/usuarios/:id', usuarios.deletarUsuario);//id do usuario
rotas.post('/usuarios/habilidades', usuarios.addHabilidadeUsuario);
rotas.get('/usuarios/habilidades/:id', usuarios.listarHabilidadesUsuario);//id do usuario
rotas.post('/usuarios/areas', usuarios.addAreaUsuario);
rotas.get('/usuarios/areas/:id', usuarios.listarAreaUsuario);

//rotas para notificações
rotas.get('/notificacoes', notificacao.listarNotificacoes);
rotas.post('/notificacoes', notificacao.visualizarTodasNotificacoes);// FAZER


// rotas para o forum
rotas.get('/forum', forum.listarPerguntas);
rotas.get('/forum/filtro', forum.listarPerguntasFiltroHabilidade);
rotas.get('/forum/:postagem_id', forum.listarComentarios); // id da postagem
rotas.post('/forum/', forum.criarPergunta);
rotas.post('/forum/:postagem_id', forum.comentarPergunta); // id da postagem

// rotas para as mentorias
rotas.get('/mentorias', mentorias.listarMentores);
rotas.get('/mentorias/filtroHab', mentorias.filtrarMentorTema); // id da habilidade vai por req.query
rotas.get('/mentorias/filtroArea', mentorias.filtrarMentorArea); //id da área vai por req.query
rotas.get('/mentor', mentorias.listarDias);
rotas.get('/mentor/dias', mentorias.listarDiasEHora);
rotas.get('/mentor/horarios', mentorias.listarHorarios);
rotas.post('/usuarios/mentorias', mentorias.disponibilizarHorario);
rotas.post('/mentorias/marcar', mentorias.marcarMentoria)
rotas.get('/mentorias/marcadas', mentorias.listarMentoriasMarcadas)

module.exports = rotas