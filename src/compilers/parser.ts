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
export function lexico(input: string): Array<Record<string, string>[] | string[]> {
	let inputAux = input;
	const erros: string[] = [];
	let tokens: Record<string, string>[] = [];

	let newInput: string[] = []
	//fazer o split por quebras de linha e espaços em branco
	newInput = input.trim().split(/([{}();.,]|[\s\n\r]+|'.*?'|\w+)/g).filter((str) => str.trim() !== '');

	// eslint-disable-next-line prefer-const
	for (let [index, i] of newInput.entries()) {
		for (const p of patterns) {
			i = i.replace(p[0], function(match) {
				if (p[1]) {
					tokens.push({type: p[1] as string, value: match});
				}
				return '';
			});
		}
		newInput[index] = i;
	}

	const joinedInput = newInput.join('');

	if(joinedInput.length > 0){
		for (let i = 0; i < joinedInput.length; i++) {
			// acha a primeira instância de erro
			const error = inputAux.indexOf(joinedInput[i]);
			// pega o trecho do erro
			const errorText = joinedInput[i];
			// pega a linha do erro
			const line = inputAux.substring(0, error).split('\n').length;
			// pega a coluna do erro
			// eslint-disable-next-line
			const aux = inputAux.substring(0, error).trim().split('\n')
			if(!aux) {throw new Error('houston we got a problem')}
			const column = aux.length + 1;
			// retorna o erro
			erros.push(`Erro léxico: token inválido. '${errorText}' na linha ${line}, caractere ${column}`);
			inputAux = inputAux.replace(joinedInput[i], '');
		}
	}

	// remove itens de type skip
	tokens = tokens.filter((item) => item.type !== 'skip');

	return [tokens, erros];
}

// Função de análise sintática
export function sintatico(tokens: Record<string, string>[]) {
	let position = 0;

	function match(expected_type: string | string[]) {
		// verifica se o tipo esperado é uma string ou uma lista de strings
		if (typeof expected_type === 'string') {
			// console.log(`Posição: '${position}', Tupla: {type: ${tokens[position].type}, value: '${tokens[position].value}'}`);
			if (position < tokens.length && (tokens[position].type === expected_type || tokens[position].value === expected_type)) {
				position++;
			} else {
				throw new Error(`Erro sintático: token '${expected_type}' esperado, mas '${tokens[position].type}' encontrado.`);
			}
		} else if (Array.isArray(expected_type)) {
			// console.log(`Posição: '${position}', Tupla: {type: ${tokens[position].type}, value: '${tokens[position].value}'}`);
			for (const expected of expected_type) {
				if (position < tokens.length && (tokens[position].type === expected || tokens[position].value === expected)) {
					position++;
					return;
				}
			}
			throw new Error(`Erro sintático: token '${expected_type.join(', ')}' esperado, mas '${tokens[position].type}' encontrado.`);
		}
	}

	function variables() {
		match('VARIABLES');
		match('{');
		while (tokens[position].value !== '}') {
			match(['NUMBER', 'STRING']);
			match('IDENTIFIER');
			match(';');
		}
		match('}');
		match(';');
	}

	function begin() {
		match('BEGIN');
		match('{');
		while (tokens[position].value !== 'end') {
			statement();
		}
		match('END');
		match('}');
		match(';');
	}

	function statement() {
		if (tokens[position].type === 'IDENTIFIER') {
			atribution();
		} else if (tokens[position].type === 'PRINT') {
			match('PRINT');
			match('(');
			value();
			match(')');
			match(';');
		} else if (tokens[position].type === 'IF') {
			match('IF');
			match('(');
			expression();
			match(')');
			match('{');
			while (tokens[position].value !== '}') {
				statement();
			}
			match('}');
			if (tokens[position].type === 'ELSE') {
				match('ELSE');
				match('{');
				while (tokens[position].value !== '}') {
					statement();
				}
				match('}');
			}
		}
	}

	function value() {
		match(['IDENTIFIER', 'STRING_VAL', 'NUMBER_VAL']);
	}

	function atribution() {
		value();
		match('=');
		value();
		match(';');
	}

	function condition() {
		value();
		match(['<', '>', '==', '!=', '>=', '<=']);
		value();
	}

	function extra_condition() {
		match(['&', '|']);
		condition();
	}

	function expression() {
		while (tokens[position].value !== ')') {
			condition();
			if (tokens[position].type === '&' || tokens[position].type === '|') {
				extra_condition();
			}
		}
	}

	// Chamada inicial da análise sintática
	variables();
	begin();
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
    })
end
};
`;



