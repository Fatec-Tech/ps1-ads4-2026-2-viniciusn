const pacientes = [];

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');
const contadorOrigem = document.getElementById('contador-origem');

let pacientesJSON = 0;
let pacientesManuais = 0;

function adicionarPaciente(nome, email, nascimento) {
	pacientes.push({ nome, email, nascimento });
}

function renderizarTabela() {
	tabela.innerHTML = '';

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
    `;

		tabela.appendChild(linha);
	});
}

function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');

	return `${dia}/${mes}/${ano}`;
}

function atualizarContador() {
	contadorOrigem.textContent =
		`Pacientes do JSON: ${pacientesJSON} | Cadastrados manualmente: ${pacientesManuais}`;
}

// Busca os pacientes iniciais a partir do arquivo JSON
async function carregarPacientesIniciais() {
	try {

		// Simula um tempo de carregamento de 1 segundo
		await new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});

		const resposta = await fetch('data/pacientes.json');

		console.log(resposta);

		// Verifica se a resposta foi bem-sucedida
		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}

		const dados = await resposta.json();

		// Verifica se o arquivo JSON está vazio
		if (dados.length === 0) {
			mensagemCarregando.textContent =
				'Nenhum paciente cadastrado ainda';

			atualizarContador();

			return;
		}

		// Adiciona os pacientes vindos do JSON
		dados.forEach((paciente) => {
			adicionarPaciente(
				paciente.nome,
				paciente.email,
				paciente.nascimento
			);

			pacientesJSON++;
		});

		renderizarTabela();
		atualizarContador();

	} catch (erro) {

		console.error('Não foi possível carregar os pacientes:', erro);

		mensagemCarregando.textContent =
			'Não foi possível carregar os pacientes. Tente novamente mais tarde.';

		return;
	}

	mensagemCarregando.textContent =
		'Dados carregados com sucesso.';
}

// Cadastro manual de pacientes
formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;

	adicionarPaciente(nome, email, nascimento);

	pacientesManuais++;

	renderizarTabela();
	atualizarContador();

	formulario.reset();
});

// Carrega os dados assim que o script é executado
carregarPacientesIniciais();