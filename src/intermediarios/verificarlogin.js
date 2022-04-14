const conexao = require('../conexao')
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ "mensagem": 'O usuário deve estar logado e possuir um token válido. Favor realizar login.' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = await jwt.verify(token, segredo);

        const queryUsuario = 'SELECT * FROM usuarios WHERE id = $1';

        const { rows, rowCount } = await conexao.query(queryUsuario, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ "mensagem": 'O usuário logado não foi encontrado no banco de dados.' });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: 'Para acessar este recurso o usuário deve estar logado e possuir um token válido. Favor realizar login.' });
        }
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. - " + error.message });
    }
}

module.exports = verificarLogin;