const conexao = require('../conexao');


const criarPergunta = async (req, res) => {
    const { usuario_id, pergunta, habilidade_id } = req.body;

    if (!pergunta) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const novoPost = await conexao.query('INSERT INTO postagem (usuario_id, pergunta, hora_postagem, habilidade_id) VALUES ( $1, $2, current_timestamp, $3)',
            [usuario_id, pergunta, habilidade_id]);

        if (novoPost.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível cadastrar a pergunta' })
        }

        const mensagem = "Pergunta criada com sucesso."

        const novaNotificacao = await conexao.query('INSERT INTO notificacao (usuario_id,mensagem) VALUES ($1,$2)', [usuario_id, mensagem])

        if (novaNotificacao.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível criar a notificação.' })
        }

        res.status(201).json({ 'mensagem': 'Post cadastrado' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const comentarPergunta = async (req, res) => {
    let { postagem_id } = req.params;
    const { usuario_id, comentario } = req.body;

    if (!comentario) {
        return res.status(400).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const novoComentario = await conexao.query('INSERT INTO comentarios (usuario_id, postagem_id, comentario, hora_postagem) VALUES ( $1, $2, $3, current_timestamp)',
            [usuario_id, postagem_id, comentario]);

        if (novoComentario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível inserir o comentário' })
        }

        const buscarUsuario = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);

        if (buscarUsuario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível buscar o nome do usuário.' })
        }

        const mensagem = `O usuário ${buscarUsuario.rows[0].nome} comentou na sua pergunta!`

        const usuarioDuvida = await conexao.query('SELECT * FROM postagem WHERE id=$1', [postagem_id])

        if (usuarioDuvida.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível localizar o usuário que realizou a pergunta.' })
        }

        const novaNotificacao = await conexao.query('INSERT INTO notificacao (usuario_id,mensagem) VALUES ($1,$2)', [usuarioDuvida.rows[0].usuario_id, mensagem])

        if (novaNotificacao.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível criar a notificação.' })
        }


        res.status(201).json({ 'mensagem': 'Comentário cadastrado' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarPerguntas = async (req, res) => {

    try {
        const perguntas = await conexao.query('SELECT postagem.id,postagem.pergunta, usuarios.avatar, usuarios.nome, habilidades.habilidade FROM postagem LEFT JOIN usuarios  ON postagem.usuario_id=usuarios.id LEFT JOIN habilidades ON habilidades.id = postagem.habilidade_id ORDER BY postagem.hora_postagem DESC');

        if (perguntas.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar perguntas' })
        }

        res.status(200).json(perguntas.rows);
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarPerguntasFiltroHabilidade = async (req, res) => {
    const { habilidade_id } = req.body

    try {
        const perguntas = await conexao.query('SELECT postagem.id,postagem.pergunta, usuarios.avatar, usuarios.nome, habilidades.habilidade,postagem.hora_postagem FROM postagem LEFT JOIN usuarios  ON postagem.usuario_id=usuarios.id LEFT JOIN habilidades ON habilidades.id = postagem.habilidade_id WHERE postagem.habilidade_id=$1 ORDER BY postagem.hora_postagem DESC', [habilidade_id]);

        if (perguntas.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar perguntas' })
        }

        res.status(200).json(perguntas.rows);
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarComentarios = async (req, res) => {
    let { postagem_id } = req.params;

    try {
        const comentarios = await conexao.query('SELECT comentarios.id,comentarios.comentario,comentarios.hora_postagem,usuarios.avatar, usuarios.nome FROM comentarios LEFT JOIN usuarios  ON comentarios.usuario_id=usuarios.id WHERE comentarios.postagem_id = $1 ORDER BY comentarios.hora_postagem DESC', [postagem_id]);

        if (comentarios.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar comentarios' })
        }

        res.status(200).json(comentarios.rows);
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports = {
    criarPergunta, comentarPergunta, listarPerguntas, listarComentarios, listarPerguntasFiltroHabilidade
}