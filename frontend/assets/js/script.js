// ================= CONFIGURAÇÕES E CONSTANTES =================
const API_BASE_URL = 'http://localhost:3000/api/produtos';

const DOM = {
    listaCardapio: document.getElementById('lista-produtos'),
    
    createModal: {
        overlay: document.getElementById('create-modal'),
        openBtn: document.getElementById('btn-open-create'),
        closeBtn: document.querySelector('.close-create'),
        form: document.getElementById('form-create-product'),
        btnAddIng: document.getElementById('btn-add-ingredient-field'),
        containerIng: document.getElementById('ingredients-container'),
        inputs: {
            nome: document.getElementById('new-nome'),
            desc: document.getElementById('new-desc'),
            preco: document.getElementById('new-price'),
            categoria: document.getElementById('new-category')
        }
    },

    detailsModal: {
        overlay: document.getElementById('product-modal'),
        closeBtn: document.querySelector('.close-details'),
        title: document.getElementById('modal-title'),
        desc: document.getElementById('modal-desc'),
        price: document.getElementById('modal-price'),
        img: document.getElementById('modal-img'),
        ingredientsList: document.getElementById('modal-ingredients-list'),
        totalPrice: document.getElementById('btn-total-price'),
        qty: document.getElementById('qty-number'),
        btnPlus: document.getElementById('btn-plus'),
        btnMinus: document.getElementById('btn-minus')
    }
};

let detailsState = { price: 0, qty: 1 };

// ================= MÓDULO 1: API =================
const ApiService = {
    async listar() {
        const response = await fetch(API_BASE_URL);
        return await response.json();
    },
    async criar(produto) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });
        if (!response.ok) throw new Error('Erro ao criar produto');
        return response;
    },
    async excluir(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir produto');
        return response;
    }
};

// ================= MÓDULO 2: RENDERIZAÇÃO =================
const RenderService = {
    criarBlocoCategoria(categoria) {
        const div = document.createElement('div');
        div.className = 'category-block';
        div.id = `bloco-${categoria}`;
        div.innerHTML = `
            <h2 class="category-title" style="text-transform: capitalize; margin: 20px 0 10px 0;">${categoria}</h2>
            <div class="products-grid-list" id="grid-${categoria}" style="display: grid; gap: 20px;"></div>
        `;
        return div;
    },

// ... dentro do RenderService no seu script.js

    criarCardProduto(p) {
        const preco = parseFloat(p.preco || 0).toFixed(2);
        // Link de um hambúrguer genérico profissional
        const imgPadrao = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop";
        const img = p.imagem || imgPadrao; 
        
        const ingJson = p.ingredientes ? JSON.stringify(p.ingredientes).replace(/"/g, '&quot;') : '[]';
        const descricao = p.desc || p.descricao || 'Sem descrição disponível';

        return `
            <div class="product-card-horizontal" 
                data-id="${p.id}" data-nome="${p.nome}" data-desc="${descricao}" 
                data-preco="${preco}" data-img="${img}" data-ingredientes="${ingJson}">
                
                <button class="btn-excluir" data-id="${p.id}" title="Excluir Produto">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="card-content">
                    <h3>${p.nome}</h3>
                    <p>${descricao}</p>
                    <span class="price">R$ ${preco}</span>
                </div>
                <div class="card-image">
                    <img src="${img}" onerror="this.src='${imgPadrao}'">
                </div>
            </div>
        `;
    },

    abrirModalDetalhes(nome, desc, preco, img, ingredientes) {
        detailsState.price = parseFloat(preco);
        detailsState.qty = 1;

        DOM.detailsModal.title.innerText = nome;
        DOM.detailsModal.desc.innerText = desc;
        DOM.detailsModal.img.src = img;
        
        DOM.detailsModal.ingredientsList.innerHTML = '';
        if (Array.isArray(ingredientes) && ingredientes.length > 0) {
            ingredientes.forEach(ing => {
                const li = document.createElement('li');
                li.innerText = ing;
                DOM.detailsModal.ingredientsList.appendChild(li);
            });
        } else {
            DOM.detailsModal.ingredientsList.innerHTML = '<li style="color:#999; list-style:none;">Sem ingredientes listados.</li>';
        }

        this.atualizarPrecoDetalhes();
        DOM.detailsModal.overlay.classList.add('active');
    },

    atualizarPrecoDetalhes() {
        DOM.detailsModal.qty.innerText = detailsState.qty;
        DOM.detailsModal.price.innerText = `R$ ${detailsState.price.toFixed(2)}`;
        
        const total = detailsState.price * detailsState.qty;
        if (DOM.detailsModal.totalPrice) {
            DOM.detailsModal.totalPrice.innerText = `R$ ${total.toFixed(2)}`;
        }
    },

    toggleModalCriacao(show) {
        if(show) DOM.createModal.overlay.classList.add('active');
        else {
            DOM.createModal.overlay.classList.remove('active');
            DOM.createModal.form.reset();
            DOM.createModal.containerIng.innerHTML = ''; 
        }
    },

    adicionarCampoIngrediente() {
        const div = document.createElement('div');
        div.className = 'ingredient-row';
        div.innerHTML = `
            <input type="text" class="input-ingrediente" placeholder="Ex: Bacon Crocante">
            <button type="button" class="btn-remove-ing" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        DOM.createModal.containerIng.appendChild(div);
        div.querySelector('input').focus();
    }
};

// ================= MÓDULO 3: LÓGICA DE NEGÓCIO =================

async function carregarProdutos() {
    DOM.listaCardapio.innerHTML = ''; 
    try {
        const produtos = await ApiService.listar();
        console.log("Produtos recebidos:", produtos);

        if (!Array.isArray(produtos) || produtos.length === 0) {
            DOM.listaCardapio.innerHTML = '<p style="text-align:center; padding:20px;">Cardápio vazio.</p>';
            return;
        }

        produtos.forEach(p => {
            const catId = p.categoria ? p.categoria.toLowerCase().trim() : 'outros';
            let containerGrid = document.getElementById(`grid-${catId}`);
            
            if (!containerGrid) {
                const novoSetor = RenderService.criarBlocoCategoria(catId);
                DOM.listaCardapio.appendChild(novoSetor);
                containerGrid = document.getElementById(`grid-${catId}`);
            }
            
            const cardHTML = RenderService.criarCardProduto(p);
            containerGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
    }
}

async function handleSalvarNovoProduto(event) {
    event.preventDefault();
    const inputs = DOM.createModal.inputs;
    
    const ingElements = document.querySelectorAll('.input-ingrediente');
    const listaIngredientes = Array.from(ingElements)
        .map(input => input.value.trim())
        .filter(valor => valor !== "");

    const dados = {
        nome: inputs.nome.value.trim(),
        desc: inputs.desc.value.trim(),
        preco: parseFloat(inputs.preco.value.trim()),
        categoria: inputs.categoria.value,
        ingredientes: listaIngredientes 
    };

    if (!dados.nome || !dados.desc || isNaN(dados.preco)) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    try {
        await ApiService.criar(dados);
        RenderService.toggleModalCriacao(false);
        carregarProdutos();
    } catch (error) {
        alert('Erro ao salvar produto.');
    }
}

async function handleExcluirItem(id, cardElement) {
    if (!confirm('Deseja excluir este item?')) return;
    try {
        await ApiService.excluir(id);
        if (cardElement) cardElement.remove();
    } catch (error) {
        alert('Erro ao excluir.');
    }
}

// ================= MÓDULO 4: EVENTOS =================

document.addEventListener('DOMContentLoaded', carregarProdutos);
DOM.createModal.openBtn.addEventListener('click', () => RenderService.toggleModalCriacao(true));
DOM.createModal.closeBtn.addEventListener('click', () => RenderService.toggleModalCriacao(false));
DOM.createModal.btnAddIng.addEventListener('click', RenderService.adicionarCampoIngrediente);
DOM.createModal.form.addEventListener('submit', handleSalvarNovoProduto);

DOM.listaCardapio.addEventListener('click', (e) => {
    const btnExcluir = e.target.closest('.btn-excluir');
    const card = e.target.closest('.product-card-horizontal');

    if (btnExcluir) {
        e.stopPropagation();
        handleExcluirItem(btnExcluir.dataset.id, card);
        return; 
    }

    if (card) {
        const { nome, desc, preco, img, ingredientes } = card.dataset;
        let listaIng = [];
        try {
            listaIng = ingredientes ? JSON.parse(ingredientes) : [];
        } catch(err) {
            console.error("Erro ao processar ingredientes", err);
        }
        RenderService.abrirModalDetalhes(nome, desc, preco, img, listaIng);
    }
});

DOM.detailsModal.closeBtn.addEventListener('click', () => DOM.detailsModal.overlay.classList.remove('active'));
DOM.detailsModal.btnPlus.addEventListener('click', () => { detailsState.qty++; RenderService.atualizarPrecoDetalhes(); });
DOM.detailsModal.btnMinus.addEventListener('click', () => { if (detailsState.qty > 1) { detailsState.qty--; RenderService.atualizarPrecoDetalhes(); }});
DOM.detailsModal.overlay.addEventListener('click', (e) => { if(e.target === DOM.detailsModal.overlay) DOM.detailsModal.overlay.classList.remove('active'); });