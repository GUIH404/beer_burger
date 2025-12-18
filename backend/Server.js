const express = require('express');
const cors = require('cors');
const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/produtos', produtoRoutes);
app.use('/api/auth/register', authRoutes);

app.listen (3000, () =>{
    console.log('Servidor Rodando na porta 3000')
});