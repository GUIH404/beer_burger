const db = require('../config/db');

class ProdutoService {
    async Criar(Produto) {
        const { nome, desc, preco, categoria, ingredientes } = Produto;

        try {
            // 1. Inserir na tabela de produtos
            // Importante: Verifique se no seu banco a coluna se chama 'descricao' ou 'desc'
            const sql = 'INSERT INTO produtos (nome, descricao, preco, categoria) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(sql, [nome, desc, preco, categoria]);
            
            const produtoId = result.insertId;

            // 2. Se o lanche tiver ingredientes, insere na tabela relacional
            if (ingredientes && ingredientes.length > 0) {
                const sqlIngredientes = 'INSERT INTO ingredientes (produto_id, nome_ingrediente) VALUES ?';
                
                // O segredo está aqui: o array de valores deve estar dentro de outro array [ [valores] ]
                const valores = ingredientes.map(ing => [produtoId, ing]);

                await db.query(sqlIngredientes, [valores]); 
            }

            return result;
        } catch (error) {
            // Este log vai mostrar no seu terminal do VS Code o motivo real do erro 500
            console.error("ERRO AO CRIAR PRODUTO:", error.sqlMessage || error.message);
            throw error;
        }
    }

// No seu ProdutoService.js, substitua o ListarTodos por este:
    async ListarTodos() {
        try {
            // Usamos p.* para pegar tudo e tratamos o alias da categoria e descrição
            const sql = `
                SELECT p.*, GROUP_CONCAT(i.nome_ingrediente) as lista_ingredientes
                FROM produtos p
                LEFT JOIN ingredientes i ON p.id = i.produto_id
                GROUP BY p.id
            `;

            const [rows] = await db.query(sql);

            if (!rows || rows.length === 0) return [];

            return rows.map(p => ({
                ...p,
                // Importante: Verifique se sua coluna no banco é 'desc' ou 'descricao'
                // Se o front espera 'desc', garantimos que ele receba 'desc'
                desc: p.descricao || p.desc, 
                ingredientes: p.lista_ingredientes ? p.lista_ingredientes.split(',') : []
            }));
        } catch (error) {
            console.error("ERRO AO BUSCAR PRODUTOS:", error.message);
            throw error;
        }
    }
}

module.exports = new ProdutoService();