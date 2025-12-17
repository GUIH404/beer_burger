const express = require('express');
const router = express.Router();
const produtoController = require('../backend/Controllers');

router.post('/produtos', produtoController.Adicionar);
router.get('/produtos', produtoController.Listar);

module.exports = router;