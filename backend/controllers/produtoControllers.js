const ProdutoService = require('../services/produtoService');

class ProdutoController {
    async Adicionar(req, res) {
        try {
            const result = await ProdutoService.Criar(req.body);
            res.status(201).json({ message: "Lanche Salvo", id: result.produtoId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    }

    async Listar(req, res) {
        try {
             const produtos = await ProdutoService.ListarTodos(req.body);
            res.json(produtos)
        } catch (error) {
            res.status(500).json({error: error.message})
        }
       
    } 
}

module.exports = new ProdutoController();