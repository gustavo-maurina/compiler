import re

# Definir os padrões de expressões regulares para os tokens
patterns = [
    (r'\bvariables\b', 'VARIABLES'),
    (r'\bnumber\b', 'NUMBER'),
    (r'\bstring\b', 'STRING'),
    (r'\bbegin\b', 'BEGIN'),
    (r'\bend\b', 'END'),
    (r'\bif\b', 'IF'),
    (r'\belse\b', 'ELSE'),
    (r'\bprint\b', 'PRINT'),
    (r'[a-zA-Z_][a-zA-Z0-9_]*', 'IDENTIFIER'),
    (r'\b\d+(\.\d+)?\b', 'NUMBER_VAL'),
    (r"'[^']*'", 'STRING_VAL'),
    (r'=', 'EQUALS'),
    (r'<', 'LESS_THAN'),
    (r'>', 'GREATER_THAN'),
    (r'==', 'EQUIVALENT'),
    (r'!=', 'NOT_EQUIVALENT'),
    (r'>=', 'GREATER_EQUAL'),
    (r'<=', 'LESS_EQUAL'),
    (r'\+', 'PLUS'),
    (r'-', 'MINUS'),
    (r'\*', 'MULTIPLY'),
    (r'/', 'DIVIDE'),
    (r'!', 'NOT'),
    (r'&&', 'AND'),
    (r'\|\|', 'OR'),
    (r'[;{}(),]', 'SYMBOL'),
    (r'\s+', None)  # Ignorar espaços em branco
]


# Função de análise léxica
def lex(code):
    tokens = []
    position = 0
    while position < len(code):
        match = None
        for pattern, token_type in patterns:
            regex = re.compile(pattern)
            match = regex.match(code, position)
            if match:
                if token_type:
                    tokens.append((token_type, match.group()))
                break
        if not match:
            raise ValueError(f"Erro léxico: caractere inesperado '{code[position]}' na posição {position}.")
        position = match.end()
    return tokens


# Função de análise sintática
def parse(tokens):
    position = 0

    def match(expected_type):
        nonlocal position
        # verifica se o tipo esperado é uma string ou uma lista de strings
        if isinstance(expected_type, str):
            print(f"Posição: '{position}', Tupla: '{tokens[position]}'")
            if position < len(tokens) and (
                    tokens[position][0] == expected_type or tokens[position][1] == expected_type):
                position += 1
            else:
                raise ValueError(
                    f"Erro sintático: token '{expected_type}' esperado, mas '{tokens[position][0]}' encontrado.")

        elif isinstance(expected_type, list):
            print(f"Posição: '{position}', Tupla: '{tokens[position]}'")
            for expected in expected_type:
                if position < len(tokens) and (tokens[position][0] == expected or tokens[position][1] == expected):
                    position += 1
                    return
            raise ValueError(
                f"Erro sintático: token '{expected_type}' esperado, mas '{tokens[position][0]}' encontrado.")

    def variables():
        match('VARIABLES')
        match('{')
        while tokens[position][1] != '}':
            match(['NUMBER', 'STRING'])
            match('IDENTIFIER')
            match(';')
        match('}')
        match(';')

    def begin():
        match('BEGIN')
        match('{')
        while tokens[position][1] != 'end':
            statement()
        match('END')
        match('}')
        match(';')

    def statement():
        if tokens[position][0] == 'IDENTIFIER':
            atribution()
        elif tokens[position][0] == 'PRINT':
            match('PRINT')
            match('(')
            value()
            match(')')
            match(';')
        elif tokens[position][0] == 'IF':
            match('IF')
            match('(')
            expression()
            match(')')
            match('{')
            while tokens[position][1] != '}':
                statement()
            match('}')
            if tokens[position][0] == 'ELSE':
                match('ELSE')
                match('{')
                while tokens[position][1] != '}':
                    statement()
                match('}')

    def value():
        match(['IDENTIFIER', 'STRING_VAL', 'NUMBER_VAL'])

    def atribution():
        value()
        match('EQUALS')
        value()
        match(';')

    def condition():
        value()
        match(['LESS_THAN', 'GREATER_THAN', 'EQUIVALENT', 'NOT_EQUIVALENT', 'GREATER_EQUAL', 'LESS_EQUAL'])
        value()

    def extra_condition():
        match(['AND', 'OR'])
        condition()

    def expression():
        while tokens[position][1] != ')':
            condition()
            if tokens[position][0] == 'AND' or tokens[position][0] == 'OR':
                extra_condition()

    # Chamada inicial da análise sintática
    variables()
    begin()


# Código de exemplo
entry = """
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
"""

# Chamada da análise léxica
tokens_list = lex(entry)

# Imprimir a lista de tokens com 3 tuplas por linha
print("Lista de tokens:")
# print(tokens_list)
for i in range(0, len(tokens_list), 3):
    print(tokens_list[i:i + 3])

print("\n")

# Chamada da análise sintática
parse(tokens_list)
print("Análise sintática concluída com sucesso!")
