const conexao = require('../conexao')

const cadastrarHabilidade = async (req, res) => {
    const { habilidade } = req.body;

    if (!habilidade) {
        return res.status(404).json({ 'mensagem': 'Obrigatório informar habilidade' })
    }

    try {
        const habilidadeExistente = await conexao.query('SELECT * FROM habilidades WHERE habilidade=$1', [habilidade]);

        if (habilidadeExistente.rowCount > 0) {
            return res.status(400).json({ 'mensagem': 'Habilidade já cadastrada' })
        }

        const novaHabilidade = await conexao.query('INSERT INTO habilidades (habilidade) VALUES ( $1 )', [habilidade]);

        if (novaHabilidade.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível inserir a habilidade' })
        }

        res.status(201).json({ 'mensagem': 'Habilidade Cadastrada' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarHabilidade = async (req, res) => {
    try {
        const habilidades = await conexao.query('SELECT * FROM habilidades ORDER BY habilidade');

        if (habilidades.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Não foi possível listar as habilidades.' })
        }

        res.status(201).json(habilidades.rows)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const cadastrarHorario = async (req, res) => {
    const { hora } = req.body;

    if (!hora) {
        return res.status(404).json({ 'mensagem': 'Obrigatório informar o horário.' })
    }

    try {
        const horaExistente = await conexao.query('SELECT * FROM horarios WHERE hora= $1', [hora]);

        if (horaExistente.rowCount !== 0) {
            return res.status(400).json({ 'mensagem': 'Horário já cadastrado' })
        }

        const novaHabilidade = await conexao.query('INSERT INTO horarios (hora) VALUES ( $1 )', [hora]);

        if (novaHabilidade.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível inserir a hora' })
        }

        res.status(201).json({ 'mensagem': 'Hora Cadastrada' })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarHorario = async (req, res) => {
    try {
        const horarios = await conexao.query('SELECT * FROM horarios ORDER BY hora');

        if (horarios.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Nenhum horários encontrado' })
        }

        res.status(201).json(horarios.rows)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarAreas = async (req, res) => {
    try {
        const areas = await conexao.query('SELECT * FROM area ORDER BY area');

        if (areas.rowCount === 0) {
            return res.status(400).json({ "mensagem": 'Nenhum área foi encontrada' })
        }

        res.status(201).json(areas.rows)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const cadastrarAreas = async (req, res) => {
    const { area } = req.body;

    if (!area) {
        return res.status(404).json({ 'mensagem': 'Obrigatório informar a nova área.' })
    }

    try {
        const areaExistente = await conexao.query('SELECT * FROM area WHERE area=$1', [area]);

        if (areaExistente.rowCount !== 0) {
            return res.status(400).json({ 'mensagem': 'Área já cadastrada.' })
        }

        const novaArea = await conexao.query('INSERT INTO area (area) VALUES ( $1 )', [area]);

        if (novaArea.rowCount === 0) {
            return res.status(400).json({ 'mensagem': 'Não foi possível inserir a nova área.' })
        }

        res.status(201).json({ 'mensagem': 'Área Cadastrada' })
    } catch (error) {
        return res.status(400).json(error)
    }
}



module.exports = {
    cadastrarHabilidade, listarHabilidade, cadastrarHorario, listarHorario, listarAreas, cadastrarAreas
}