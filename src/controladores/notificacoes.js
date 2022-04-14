const conexao = require('../conexao');

const listarNotificacoes = async (req, res) => {
    // const { id } = req.usuario // para usar com Autenticaçaõ
    const { id } = req.body


    if (!id) {
        return res.status(400).json({ 'mensagem': 'Id não informado' })
    }

    try {
        const notificacoes = await conexao.query('SELECT * FROM notificacao WHERE usuario_id=$1 ORDER BY data_time', [id]);

        if (notificacoes.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar as notificações' })
        }

        res.status(200).send(notificacoes.rows);
    } catch (error) {
        return res.status(400).json(error)
    }
}

const visualizarTodasNotificacoes = async (req, res) => {
    // const { id } = req.usuario // para usar com Autenticaçaõ
    const { id } = req.body


    if (!id) {
        return res.status(400).json({ 'mensagem': 'Id não informado' })
    }

    try {
        const notificacoes = await conexao.query('UPDATE notificacao SET lida=TRUE WHERE usuario_id=$1', [id]);

        if (notificacoes.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível ler as notificações' })
        }

        res.status(200).json({ "mensagem": "Mensagem lida com sucesso" });
    } catch (error) {
        return res.status(400).json(error)
    }
}


module.exports = {
    listarNotificacoes, visualizarTodasNotificacoes
}
