const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await conexao.query('SELECT id,nome,email,bio,avatar FROM usuarios ORDER BY nome');

        if (usuarios.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar usuários' })
        }

        res.status(200).json(usuarios.rows);
    } catch (error) {
        return res.status(400).json(error)
    }
};

const obterUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ 'mensagem': 'Id não informado' })
    }

    try {
        const usuario = await conexao.query('SELECT id,nome,email,bio,avatar FROM usuarios WHERE id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(400).json('Não foi possível encontrar o usuário')
        }

        res.status(200).json(usuario.rows[0]);
    } catch (error) {
        return res.status(400).json(error)
    }
}

const addHabilidadeUsuario = async (req, res) => {
    // const { id: usuario_id } = req.usuario // para usar com Autenticaçaõ
    // const { habilidade_id } = req.body;
    const { usuario_id, habilidade_id } = req.body;

    if (!usuario_id || !habilidade_id) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const { rowCount: buscarUsuario } = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);

        if (buscarUsuario === 0) {
            return res.status(400).json({ "mensagem": "Usuário não encontrado" });
        }

        const { rowCount: habilidadeExistente } = await conexao.query('SELECT * FROM habilidadeusuarios WHERE usuario_id=$1 AND habilidade_id=$2', [usuario_id, habilidade_id])

        if (habilidadeExistente > 0) {
            return res.status(400).json({ "mensagem": "Habilidade já cadastrada" })
        }

        const novaHabilidade = await conexao.query('INSERT INTO habilidadeusuarios (usuario_id,habilidade_id) VALUES ( $1, $2)',
            [usuario_id, habilidade_id]);

        if (novaHabilidade.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível inserir a habilidade' })
        }

        res.status(201).json({ 'mensagem': 'Habilidade inserida com sucesso' })


    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarHabilidadesUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const habilidadesUsuario = await conexao.query('SELECT habilidades.id, habilidades.habilidade        FROM habilidadeusuarios        LEFT JOIN usuarios ON usuarios.id= habilidadeusuarios.usuario_id        LEFT JOIN habilidades ON habilidades.id = habilidadeusuarios.habilidade_id  WHERE usuarios.id=$1     ', [id]);

        if (habilidadesUsuario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar usuários' })
        }
        res.status(200).json(habilidadesUsuario.rows);
    } catch (error) {
        res.status(400).json(error)
    }

    return res.status(200).json()
}

//FAZER (tabela area colunas id, area
//  tabela areausuarios colunas id, usuario_id, area_is )
const addAreaUsuario = async (req, res) => {
    const { id: usuario_id } = req.usuario // para usar com Autenticaçaõ
    const { area_id } = req.body;
    // const { usuario_id, area_id } = req.body;

    if (!usuario_id || !area_id) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const { rowCount: buscarUsuario } = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);

        if (buscarUsuario === 0) {
            return res.status(400).json({ "mensagem": "Usuário não encontrado" });
        }

        const { rowCount: areaExistente } = await conexao.query('SELECT * FROM areausuarios WHERE usuario_id=$1 AND area_id=$2', [usuario_id, area_id])

        if (areaExistente > 0) {
            return res.status(400).json({ "mensagem": "Área já cadastrada" })
        }

        const novaArea = await conexao.query('INSERT INTO areausuarios (usuario_id,area_id) VALUES ( $1, $2)',
            [usuario_id, area_id]);

        if (novaArea.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível inserir a nova área.' })
        }

        res.status(201).json({ 'mensagem': 'Área inserida com sucesso' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarAreaUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const areaUsuario = await conexao.query('SELECT area.id, area.area        FROM areausuarios        LEFT JOIN usuarios ON usuarios.id= areausuarios.usuario_id        LEFT JOIN area ON area.id = areausuarios.area_id  WHERE usuarios.id=$1     ', [id]);

        if (areaUsuario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível encontrar usuários' })
        }
        res.status(200).json(areaUsuario.rows);
    } catch (error) {
        res.status(400).json(error)
    }

    return res.status(200).json()
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ "mensagem": "O email e a senha são obrigatórios" });
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows } = await conexao.query(query, [email]);
        const usuarioEncontrado = rows[0];

        if (!usuarioEncontrado) {
            return res.status(400).json({ "mensagem": "Email ou senha inválidos" });
        }

        const senhaVerificada = await bcrypt.compare(String(senha), usuarioEncontrado.senha);

        if (!senhaVerificada) {
            return res.status(400).json({ "mensagem": "Email ou senha inválidos" });
        }

        const token = jwt.sign({ id: usuarioEncontrado.id }, segredo, { expiresIn: '2h' });

        return res.status(200).json(token);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro desconhecido. - ' + error.message });
    }
}

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, bio, avatar, area } = req.body;

    if (!nome || !email || !senha) {
        return res.status(404).json({ "mensagem": 'Dados obrigatórios não informados.' })
    }

    try {
        const { rowCount: buscarUsuario } = await conexao.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (buscarUsuario > 0) {
            return res.status(400).json({ "mensagem": "Já existe usuário cadastrado para o e-mail fornecido." });
        }

        const senhaEncriptada = await bcrypt.hash(String(senha), 10);


        const novoUsuario = await conexao.query('INSERT INTO usuarios (nome, email, senha, bio, avatar, area) VALUES ( $1, $2, $3, $4, $5, $6 )',
            [nome, email, senhaEncriptada, bio, avatar, area]);

        if (novoUsuario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível inserir o usuário' })
        }

        res.status(201).json({ 'mensagem': 'Usuário Cadastrado' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const atualizarUsuario = async (req, res) => {
    //  Para usar com autenticação
    // const { id } = req.usuario;
    const { id } = req.params;
    const { nome, email, senha, bio, avatar } = req.body;

    try {
        const localizarUsuário = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (localizarUsuário.rowCount === 0) {
            return res.status(400).json('Não foi possível encontrar o usuário')
        }

        const novaSenha = (senha ?
            await bcrypt.hash(String(senha), 10) :
            localizarUsuário.rows[0].senha);

        const novoNome = (nome ? nome : localizarUsuário.rows[0].nome);
        const novoEmail = (email ? email : localizarUsuário.rows[0].email);
        const novaBio = (bio ? bio : localizarUsuário.rows[0].bio);
        const novoAvatar = (avatar ? avatar : localizarUsuário.rows[0].avatar);

        const resposta = await conexao.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3, bio = $4, avatar = $5 WHERE id = $6',
            [novoNome, novoEmail, novaSenha, novaBio, novoAvatar, id]);

        if (resposta.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível atualizar o usuário' })
        }

        res.status(200).json({ 'mensagem': 'Usuário atualizado com sucesso' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const deletarUsuario = async (req, res) => {
    // Para usar com autenticação
    const { id } = req.usuario;

    // const { id } = req.params;
    try {
        const usuario = await conexao.query('DELETE FROM usuarios WHERE id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível excluir o usuário' })
        }

        res.status(200).json({ 'mensagem': 'Usuário excluido com sucesso' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports = {
    listarUsuarios, obterUsuario, addHabilidadeUsuario, listarHabilidadesUsuario, login, cadastrarUsuario, atualizarUsuario, deletarUsuario, addAreaUsuario, listarAreaUsuario
}