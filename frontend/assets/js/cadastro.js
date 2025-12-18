const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('cad-nome').value;
        const email = document.getElementById('cad-email').value;
        const senha = document.getElementById('cad-senha').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Cadastro realizado com sucesso! Redirecionando para o login...');
                window.location.href = 'login.html';
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Não foi possível conectar ao servidor.');
        }
    });
}