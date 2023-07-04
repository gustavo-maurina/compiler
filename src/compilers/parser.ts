type Pattern = [RegExp, string];

const patterns: Pattern[] = [
    [/variables/, "VARIABLES"],
    [/'[^']*'/, "STRING_VAL"],
    [/number/, "NUMBER"],
    [/string/, "STRING"],
    [/begin/, "BEGIN"],
    [/end/, "END"],
    [/if/, "IF"],
    [/else/, "ELSE"],
    [/print/, "PRINT"],
    [/while/, "WHILE"],
    [/for/, "FOR"],
    [/[a-zA-Z_][a-zA-Z0-9_]*/, "IDENTIFIER"],
    [/\b\d+(\.\d+)?\b/, "NUMBER_VAL"],
    [/==/, "=="],
    [/>=/, ">="],
    [/!=/, "!="],
    [/<=/, "<="],
    [/=/, "="],
    [/</, "<"],
    [/>/, ">"],
    [/\+/, "PLUS"],
    [/-/, "MINUS"],
    [/\*/, "MULTIPLY"],
    [/\//, "DIVIDE"],
    [/&/, "AND"],
    [/\|/, "OR"],
    [/;/, ";"],
    [/[{]/, "{"],
    [/[}]/, "}"],
    [/[(]/, "("],
    [/[)]/, ")"],
    [/,/, ","],
    [/\s+/g, "skip"],
];

export type Token = { type: string; value: string };
export type Erro = string;

// Função de análise léxica
export function lexico(input: string): [Token[], Erro[]] {
    let inputAux = input;
    const erros: string[] = [];
    let tokens: Token[] = [];

    let newInput: string[] = [];
    //fazer o split por quebras de linha e espaços em branco
    newInput = input
        .trim()
        .split(/([{}();.,]|[\s\n\r]+|'.*?'|\w+)/g)
        .filter((str) => str.trim() !== "");

    // eslint-disable-next-line prefer-const
    for (let [index, i] of newInput.entries()) {
        for (const p of patterns) {
            i = i.replace(p[0], function (match) {
                if (p[1]) {
                    tokens.push({type: p[1], value: match});
                }
                return "";
            });
        }
        newInput[index] = i;
    }

    const joinedInput = newInput.join("");

    if (joinedInput.length > 0) {
        for (let i = 0; i < joinedInput.length; i++) {
            // acha a primeira instância de erro
            const error = inputAux.indexOf(joinedInput[i]);
            // pega o trecho do erro
            const errorText = joinedInput[i];
            // pega a linha do erro
            const line = inputAux.substring(0, error).split("\n").length;
            // pega a coluna do erro
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const column = inputAux.substring(0, error).split("\n").pop().length;
            // retorna o erro
            erros.push(
                `Erro léxico: token inválido. '${errorText}' na linha ${line}, caractere ${column}`
            );
            inputAux = inputAux.replace(joinedInput[i], "");
        }
    }

    // remove itens de type skip
    tokens = tokens.filter((item) => item.type !== "skip");

    return [tokens, erros];
}

// Função de análise sintática
export function sintatico(tokens: Record<string, string>[]) {
    let position = 0;

    function match(expected_type: string | string[]) {
        // verifica se o tipo esperado é uma string ou uma lista de strings
        if (typeof expected_type === "string") {
            // console.log(`Posição: '${position}', Tupla: {type: ${tokens[position].type}, value: '${tokens[position].value}'}`);
            if (
                position < tokens.length && tokens[position] &&
                (tokens[position].type === expected_type ||
                    tokens[position].value === expected_type)
            ) {
                position++;
            } else {
                throw new Error(
                    `Erro sintático: token "${expected_type}" esperado na posição ${position}, 
                    mas "${tokens[position]?.type ?? "fim do arquivo"}" encontrado.`
                );
            }
        } else if (Array.isArray(expected_type)) {
            // console.log(`Posição: '${position}', Tupla: {type: ${tokens[position].type}, value: '${tokens[position].value}'}`);
            for (const expected of expected_type) {
                if (
                    position < tokens.length && tokens[position] &&
                    (tokens[position].type === expected ||
                        tokens[position].value === expected)
                ) {
                    position++;
                    return;
                }
            }
            throw new Error(
                `Erro sintático: token "${expected_type.join(", ")}"  esperado na posição ${position},
                 mas "${tokens[position]?.type ?? "fim do arquivo"}" encontrado.`
            );
        }
    }

    function variables() {
        match("VARIABLES");
        match("{");
        while (tokens[position].type !== "}") {
            match(["NUMBER", "STRING"]);
            match("IDENTIFIER");
            match(";");
        }
        match("}");
        match(";");
    }

    function begin() {
        match("BEGIN");
        match("{");
        while (tokens[position].type !== "END") {
            statement();
        }
        match("END");
        match("}");
        match(";");
    }

    function statement() {
        if (tokens[position].type === "IDENTIFIER") {
            attribution();
        } else if (tokens[position].type === "PRINT") {
            match("PRINT");
            match("(");
            value();
            match(")");
            match(";");
        } else if (tokens[position].type === "IF") {
            match("IF");
            match("(");
            expression();
            match(")");
            match("{");
            while (tokens[position].type !== "}") {
                statement();
            }
            match("}");
            if (tokens[position].type === "ELSE") {
                match("ELSE");
                match("{");
                while (tokens[position].type !== "}") {
                    statement();
                }
                match("}");
            }
        } else if (tokens[position].type === "WHILE") {
            match("WHILE");
            match("(");
            expression();
            match(")");
            match("{");
            while (tokens[position].type !== "}") {
                statement();
            }
            match("}");
        } else if (tokens[position].type === "FOR") {
            match("FOR");
            match("(");
            attribution();
            condition();
            match(";");
            value();
            match(")");
            match("{");
            while (tokens[position].type !== "}") {
                statement();
            }
            match("}");
        } else {
            throw new Error(
                `Erro sintático: token '${tokens[position].type}' não esperado na posição ${position}.`
            );
        }
    }

    function value() {
        match(["IDENTIFIER", "STRING_VAL", "NUMBER_VAL"]);
    }

    function attribution() {
        value();
        match("=");
        value();
        match(";");
    }

    function condition() {
        value();
        match(["!=", "==", ">=", "<=", "<", ">"]);
        value();
    }

    function expression() {
        do {
            condition();
            if (tokens[position].type === "AND" || tokens[position].type === "OR") {
                match(["&", "|"]);
                expression();
            }
        } while (tokens[position].type !== ")");
    }

    // Chamada inicial da análise sintática
    variables();
    begin();
}

// Código de exemplo
// const entry = `
// variables {
//     number numero;
//     string palavra;
// };
//
// begin {
// 	numero = 1;
// 	palavra = 'hello world';
//     if (numero > 0) {
//         print(palavra);
//     } else {
//         print(numero);
//     })
// end
// };
// `;
