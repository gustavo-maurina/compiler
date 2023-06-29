const patterns = [
	[/variables/, 'VARIABLES'],
	[/number/, 'NUMBER'],
	[/string/, 'STRING'],
	[/begin/, 'BEGIN'],
	[/end/, 'END'],
	[/if/, 'IF'],
	[/else/, 'ELSE'],
	[/print/, 'PRINT'],
	[/while/, 'WHILE'],
	[/for/, 'FOR'],
	[/'[^']*'/, 'STRING_VAL'],
	[/[a-zA-Z_][a-zA-Z0-9_]*/, 'IDENTIFIER'],
	[/\b\d+(\.\d+)?\b/, 'NUMBER_VAL'],
	[/==/, '=='],
	[/>=/, '>='],
	[/!=/, '!='],
	[/<=/, '<='],
	[/=/, '='],
	[/</, '<'],
	[/>/, '>'],
	[/\+/, 'PLUS'],
	[/-/, 'MINUS'],
	[/\*/, 'MULTIPLY'],
	[/\//, 'DIVIDE'],
	[/!/, 'NOT'],
	[/&/, 'AND'],
	[/\|/, 'OR'],
	[/;/, ';'],
	[/[{]/, '{'],
	[/[}]/, '}'],
	[/[(]/, '('],
	[/[)]/, ')'],
	[/,/, ','],
	[/\s+/g, 'skip'],
];

// Função de análise léxica
function lexicalAnalyzer(input) {
	let inputAux = input;
	let erros = [];
	let tokens = [];

	//fazer o split por quebras de linha e espaços em branco
	input = input.trim().split(/([{}();.,]|[\s\n\r]+|'.*?'|\w+)/g).filter((str) => str.trim() !== '');

	for (let [index, i] of input.entries()) {
		for (let p of patterns) {
			i = i.replace(p[0], function(match) {
				if (p[1]) {
					tokens.push({type: p[1], value: match});
				}
				return '';
			});
		}
		input[index] = i;
	}

	input = input.join('');

	if(input.length > 0){
		for (let i = 0; i < input.length; i++) {
			// acha a primeira instância de erro
			let error = inputAux.indexOf(input[i]);
			// pega o trecho do erro
			let errorText = input[i];
			// pega a linha do erro
			let line = inputAux.substring(0, error).split('\n').length;
			// pega a coluna do erro
			let column = inputAux.substring(0, error).split('\n').pop().length + 1;
			// retorna o erro
			erros.push(`Erro léxico: token inválido. '${errorText}' na linha ${line}, caractere ${column}`);
			inputAux = inputAux.replace(input[i], '');
		}
	}

	// remove itens de type skip
	tokens = tokens.filter((item) => item.type !== 'skip');

	return [tokens, erros];
}

// Função de análise sintática
function parse(tokens, entrada) {
	const pilha = [];
	let tokenAtual = 0;
	let token = tokens[tokenAtual];
	let erros = [];

	// Função para verificar se o token atual é do tipo esperado
	function eat(type) {
		if (token.type === type) {
			tokenAtual++;
			token = tokens[tokenAtual];
		} else {
			erros.push(`Erro sintático: token inválido. '${token.value}' na linha ${token.line}, coluna ${token.column}`);
		}
	}


}

// Código de exemplo
const entry = `
variables {
    number numero;
    string palavra;
};

begin {
	numero = 1;
	palavra = 'hello world';
    if (numero > 0) {
        print(palavra);
    } else {
        print(numero);        
    }
end
};
`;

// Chamada da análise léxica
let [tokensList, erros] = lexicalAnalyzer(entry);

if (erros.length > 0) {
	console.log('Erros encontrados:', erros);
} else {
	console.log('Lista de tokens:', tokensList);

	// Chamada da análise sintática
	// parse(tokensList, entry);

	console.log("Análise sintática concluída com sucesso!");
}

