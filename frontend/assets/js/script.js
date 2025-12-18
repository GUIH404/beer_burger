const btnAdicionar = document.getElementById('btn-adicionar');
const listaCardapio = document.getElementById('lista-produtos');

const inputNome = document.getElementById('nome-produto');
const inputDesc = document.getElementById('desc-produto');
const inputPreco = document.getElementById('preço-produto');
const selectCategoria = document.getElementById('Categorias');

async function adicionarItem(event) {
    const nome = inputNome.value.trim(); 
    const desc = inputDesc.value.trim();
    const precoBruto = inputPreco.value.trim();
    const categoria = selectCategoria.value;

    if (nome === '' || desc === '' || precoBruto === '' || categoria === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    const dadosParaEnviar = {
        nome: nome,
        desc: desc,
        preco: parseFloat(precoBruto),
        categoria: categoria 
    };

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnviar)
        });

        if (!response.ok) throw new Error('Falha ao salvar no banco de dados');

        // Recarrega a página ou limpa e carrega para mostrar o novo item com ID correto
        location.reload(); 

    } catch (error) {
        console.error('Error:', error);
        alert('Houve um erro ao salvar o produto.');
    }
}

btnAdicionar.addEventListener('click', adicionarItem); 

async function carregarProdutosDoBanco() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const produtos = await response.json();

        produtos.forEach(p => {
            const preco = parseFloat(p.preco).toFixed(2);
            const categoria = p.categoria;

            let blocoCategoria = document.getElementById(`bloco-${categoria}`);
            let containerGrid;

            if (!blocoCategoria) {
                const areaPrincipal = document.getElementById('lista-produtos');
                const novoSetor = document.createElement('div');
                novoSetor.className = 'category-block';
                novoSetor.id = `bloco-${categoria}`;
                
                // CORREÇÃO: Usando a classe 'products-grid-list' (com S) para ativar o CSS de 2 colunas
                novoSetor.innerHTML = `
                    <h2 class="category-title" style="text-transform: capitalize;">${categoria}</h2>
                    <div class="products-grid-list" id="grid-${categoria}"></div>
                `;
                areaPrincipal.appendChild(novoSetor);
                containerGrid = novoSetor.querySelector(`#grid-${categoria}`);
            } else {
                containerGrid = document.getElementById(`grid-${categoria}`);
            }

            // Inserindo o Card com o botão de excluir
            const cardHTML = `
                <div class="product-card-horizontal" data-id="${p.id}">
                    <div class="card-content">
                        <h3>${p.nome}</h3>
                        <p>${p.descricao}</p>
                        <span class="price">R$ ${preco}</span>
                        <button class="btn-excluir" onclick="excluirProduto(${p.id})">
                            <i class="fa-solid fa-trash"></i> Excluir
                        </button>
                    </div>
                    <div class="card-image"><img src="" alt=""></div>
                </div>
            `;

            if (containerGrid) {
                containerGrid.insertAdjacentHTML('beforeend', cardHTML);
            }
        });
    } catch (error) {
        console.error("Erro ao carregar do banco:", error);
    }
}

// FUNÇÃO PARA EXCLUIR (Frontend)
async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este item?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove o card da tela sem precisar atualizar a página
            const card = document.querySelector(`[data-id="${id}"]`);
            if (card) card.remove();
        } else {
            alert('Erro ao excluir o produto do banco de dados.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

window.onload = carregarProdutosDoBanco;