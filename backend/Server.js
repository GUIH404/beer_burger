const express = require('express')
const cors = require('cors')
const produtoRoutes = require('./Routes')
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api', produtoRoutes);

app.listen (3000, () =>{
    console.log('Servidor Rodando na porta 3000')
});