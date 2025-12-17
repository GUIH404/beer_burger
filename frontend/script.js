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

    // CORREÇÃO: Nome da propriedade 'categoria' corrigido
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

        if (!response.ok) {
            throw new Error('Falha ao salvar no banco de dados');
        }

        const resultado = await response.json();
        console.log('Sucesso:', resultado);

        const preco = parseFloat(precoBruto).toFixed(2);

        let blocoCategoria = document.getElementById(`bloco-${categoria}`);
        let containerGrid;

        if (!blocoCategoria) {
            const areaPrincipal = document.getElementById('lista-produtos');
            const novoSetor = document.createElement('div');
            novoSetor.className = 'category-block';
            novoSetor.id = `bloco-${categoria}`;
            novoSetor.innerHTML = `
                <h2 class="category-title" style="text-transform: capitalize;">${categoria}</h2>
                <div class="product-grid-list" id="grid-${categoria}"></div>
            `;
            areaPrincipal.appendChild(novoSetor);
            containerGrid = novoSetor.querySelector(`#grid-${categoria}`);
        } else {
            containerGrid = document.getElementById(`grid-${categoria}`);
        }

        const cardHTML = `
            <div class="product-card-horizontal">
                <div class="card-content">
                    <h3>${nome}</h3>
                    <p>${desc}</p>
                    <span class="price">R$ ${preco}</span>
                </div>
                <div class="card-image"><img src="" alt=""></div>
            </div>
        `;

        if (containerGrid) {
            containerGrid.insertAdjacentHTML('beforeend', cardHTML);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Houve um erro ao salvar o produto no banco de dados.');
    }

    inputNome.value = '';
    inputDesc.value = '';
    inputPreco.value = '';
    selectCategoria.value = '';
}

btnAdicionar.addEventListener('click', adicionarItem); 

async function carregarProdutosDoBanco() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const produtos = await response.json();

        produtos.forEach(p => {
            // CORREÇÃO: Usando os dados do objeto 'p' que vem do banco
            // IMPORTANTE: p.desc ou p.descricao deve bater com o nome da coluna no Workbench
            const preco = parseFloat(p.preco).toFixed(2);
            const categoria = p.categoria;

            let blocoCategoria = document.getElementById(`bloco-${categoria}`);
            let containerGrid;

            if (!blocoCategoria) {
                const areaPrincipal = document.getElementById('lista-produtos');
                const novoSetor = document.createElement('div');
                novoSetor.className = 'category-block';
                novoSetor.id = `bloco-${categoria}`;
                novoSetor.innerHTML = `
                    <h2 class="category-title" style="text-transform: capitalize;">${categoria}</h2>
                    <div class="product-grid-list" id="grid-${categoria}"></div>
                `;
                areaPrincipal.appendChild(novoSetor);
                containerGrid = novoSetor.querySelector(`#grid-${categoria}`);
            } else {
                containerGrid = document.getElementById(`grid-${categoria}`);
            }

            const cardHTML = `
                <div class="product-card-horizontal">
                    <div class="card-content">
                        <h3>${p.nome}</h3>
                        <p>${p.descricao}</p>
                        <span class="price">R$ ${preco}</span>
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

// Chamar ao carregar a página
window.onload = carregarProdutosDoBanco;