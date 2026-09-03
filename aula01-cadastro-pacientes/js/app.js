// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)

const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes

const formulario = document.getElementById('form-paciente');

const tabela = document.getElementById('tabela-pacientes');

const total= document.getElementById('pacientes');
// Função responsável por adicionar um paciente ao array

function adicionarPaciente(nome, email, nascimento, telefone) {

    const novoPaciente = { nome, email, nascimento, telefone };

    pacientes.push(novoPaciente);

}

// Função responsável por desenhar a tabela inteira a partir do array

function renderizarTabela() {

    tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

    pacientes.forEach((paciente) => {

        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${paciente.nome}</td>
            <td>${paciente.email}</td>
            <td>${formatarData(paciente.nascimento)}</td>
            <td>${calcularIdade(paciente.nascimento)}</td>
            <td>${paciente.telefone}</td>
        `;

        tabela.appendChild(linha);

    });

}



// Função para calcular a idade

function calcularIdade(dataISO) {

    const [ano, mes, dia] = dataISO.split('-');

    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;

    // Verifica se a pessoa ainda não fez aniversário neste ano

    if (
        hoje.getMonth() + 1 < mes ||
        (hoje.getMonth() + 1 == mes && hoje.getDate() < dia)
    ) {
        idade--;
    }

    return idade;

}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa

function formatarData(dataISO) {

    const [ano, mes, dia] = dataISO.split('-');

    return `${dia}/${mes}/${ano}`;

}



// Evento disparado quando o formulário é enviado

formulario.addEventListener('submit', (event) => {

    event.preventDefault(); // evita o recarregamento da página

    const nome = document.getElementById('nome').value;

    const email = document.getElementById('email').value;

    const nascimento = document.getElementById('nascimento').value;

    const telefone = document.getElementById('telefone').value;

    adicionarPaciente(nome, email, nascimento, telefone);

    renderizarTabela();

	let totalAtualizado=Number(total.textContent)+1;
	total.textContent = totalAtualizado;

    formulario.reset(); // limpa os campos do formulário

});