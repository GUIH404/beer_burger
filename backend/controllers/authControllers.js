// Usarei para a autenticação do login

const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function registrarUsuario (req, res) {
    const { nome, email, senha } = req.body;

    //Validação de campo preenchido
    if ( !nome || !email || !senha) {
        return res.status(400).json({error: 'Preencha todos os campos!'});
    }

    try {
        //Verificar se usuário já existe
        const  [usuarioExistente] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarioExistente.length > 0) {
            return res.status(400).json({error: 'E-mail já está cadastrado.'})
        }

        //Criptografas senha
        const salt = await bcrypt.genSalt(10)
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        //Salvando na Tabela Usuário
        const sql = 'INSERT INTO usuarios (nome, email, senha, admin) VALUES (?,?,?,?)';
        await pool.query(sql, [nome, email, senhaCriptografada, true]);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Erro ao registrar usuário'});
    }
}

module.exports = { registrarUsuario };