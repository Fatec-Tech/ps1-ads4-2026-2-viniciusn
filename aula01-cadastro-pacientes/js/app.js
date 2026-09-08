// Array que guarda os pacientes cadastrados

const pacientes = [];

// Referências aos elementos do DOM

const formulario = document.getElementById('form-paciente');

const tabela = document.getElementById('tabela-pacientes');

const total = document.getElementById('pacientes');

const busca = document.getElementById('busca');

const ordenarNome = document.getElementById('ordenar-nome');


// Carrega os pacientes do localStorage quando a página abre

const pacientesSalvos = localStorage.getItem('pacientes');

if (pacientesSalvos) {
	const dados = JSON.parse(pacientesSalvos);

	dados.forEach((paciente) => {
		pacientes.push(paciente);
	});
}


// Função responsável por adicionar um paciente ao array

function adicionarPaciente(nome, email, nascimento, telefone) {

	const novoPaciente = {
		nome,
		email,
		nascimento,
		telefone
	};

	pacientes.push(novoPaciente);

	salvarPacientes();

}


// Salva o array no localStorage

function salvarPacientes() {

	localStorage.setItem(
		'pacientes',
		JSON.stringify(pacientes)
	);

}


// Atualiza o contador

function atualizarTotal() {

	total.textContent = pacientes.length;

}


// Função responsável por desenhar a tabela

function renderizarTabela(lista = pacientes) {

	tabela.innerHTML = '';

	lista.forEach((paciente) => {

		const linha = document.createElement('tr');

		linha.innerHTML = `
			<td>${paciente.nome}</td>
			<td>${paciente.email}</td>
			<td>${formatarData(paciente.nascimento)}</td>
			<td>${calcularIdade(paciente.nascimento)}</td>
			<td>${paciente.telefone}</td>
		`;

		// Cria a célula do botão remover

		const colunaAcoes = document.createElement('td');

		const botaoRemover = document.createElement('button');

		botaoRemover.textContent = 'Remover';

		botaoRemover.classList.add(
			'btn',
			'btn-danger',
			'btn-sm'
		);

		// Evento para remover o paciente

		botaoRemover.addEventListener('click', () => {

			const indice = pacientes.indexOf(paciente);

			pacientes.splice(indice, 1);

			salvarPacientes();

			renderizarTabela();

			atualizarTotal();

		});


		colunaAcoes.appendChild(botaoRemover);

		linha.appendChild(colunaAcoes);

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


// Função para formatar a data

function formatarData(dataISO) {

	const [ano, mes, dia] = dataISO.split('-');

	return `${dia}/${mes}/${ano}`;

}


// Evento disparado quando o formulário é enviado

formulario.addEventListener('submit', (event) => {

	event.preventDefault();


	const nome = document.getElementById('nome').value;

	const email = document.getElementById('email').value;

	const nascimento = document.getElementById('nascimento').value;

	const telefone = document.getElementById('telefone').value;


	// Verifica se já existe um paciente com esse e-mail

	const emailExiste = pacientes.some((paciente) => {

		return paciente.email === email;

	});


	if (emailExiste) {

		alert('Este e-mail já está cadastrado!');

		return;

	}


	adicionarPaciente(
		nome,
		email,
		nascimento,
		telefone
	);


	renderizarTabela();

	atualizarTotal();


	formulario.reset();

});


// Busca em tempo real

busca.addEventListener('input', () => {

	const textoBusca = busca.value.toLowerCase();


	const pacientesFiltrados = pacientes.filter((paciente) => {

		return paciente.nome
			.toLowerCase()
			.includes(textoBusca);

	});


	renderizarTabela(pacientesFiltrados);

});


// Ordenação por nome

ordenarNome.addEventListener('click', () => {

	pacientes.sort((a, b) => {

		return a.nome.localeCompare(b.nome);

	});


	salvarPacientes();

	renderizarTabela();

});


// Renderiza os pacientes quando a página abre

renderizarTabela();

atualizarTotal();