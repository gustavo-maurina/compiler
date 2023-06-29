const INTEGER = "INTEGER";
const OPERATOR = "OPERATOR";
const EOF = "EOF";

export class Lexer {
  private input: string;
  private position: number;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  private error() {
    throw new Error("Invalid character");
  }

  private advance() {
    this.position++;
    if (this.position > this.input.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.input[this.position];
    }
  }

  private skipWhitespace() {
    while (this.currentChar != null && this.currentChar == " ") {
      this.advance();
    }
  }

  private integer() {
    let result = "";
    while (this.currentChar != null && this.isDigit(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return parseInt(result);
  }

  private isDigit(char: string) {
    return /[0-9]+/.test(char);
  }

  private isOperator(char: string) {
    return /[+/*-]/.test(char);
  }



  public getNextToken() {
    while (this.currentChar != null) {
      if (this.currentChar == " ") {
        this.skipWhitespace();
        continue;
      }
      if (this.isDigit(this.currentChar)) {
        return new Token(INTEGER, this.integer());
      }
      if (this.isOperator(this.currentChar)) {
        const token = new Token(OPERATOR, this.currentChar);
        this.advance();
        return token;
      }
      this.error();
    }
    return new Token(EOF, null);
  }
}

export class Token {
  type: string;
  value: any;

  constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
}

export class Interpreter {
  private lexer: Lexer;
  private currentToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  private error() {
    throw new Error("Invalid syntax");
  }

  private eat(tokenType: string) {
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error();
    }
  }

  private factor() {
    const token = this.currentToken;
    this.eat(INTEGER);
    return token.value;
  }

  private term() {
    let result = this.factor();
    while (
      this.currentToken.type == OPERATOR &&
      (this.currentToken.value == "*" || this.currentToken.value == "/")
    ) {
      const token = this.currentToken;
      if (token.value == "*") {
        this.eat(OPERATOR);
        result *= this.factor();
      } else if (token.value == "/") {
        this.eat(OPERATOR);
        result /= this.factor();
      }
    }
    return result;
  }

  public expr() {
    let result = this.term();
    while (
      this.currentToken.type == OPERATOR &&
      (this.currentToken.value == "+" || this.currentToken.value == "-")
    ) {
      const token = this.currentToken;
      if (token.value == "+") {
        this.eat(OPERATOR);
        result += this.term();
      } else if (token.value == "-") {
        this.eat(OPERATOR);
        result -= this.term();
      }
    }
    return result;
  }
}
