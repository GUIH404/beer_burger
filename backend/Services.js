const db = require('./db');

class ProdutoService {
    async Criar(Produto) {
        
        const { nome, desc, preco, categoria } = Produto;
        const sql = 'INSERT INTO produtos (nome, descricao, preco, categoria) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome, desc, preco, categoria]);
        return result;
    } catch (error) {
        throw error;
    }

    async ListarTodos () {
        
        const [rows] = await db.query('SELECT * FROM produtos');
        return rows;
    }
}

module.exports = new ProdutoService();