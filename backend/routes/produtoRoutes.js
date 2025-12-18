const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoControllers');

router.post('/', produtoController.Adicionar);
router.get('/', produtoController.Listar);

module.exports = router;