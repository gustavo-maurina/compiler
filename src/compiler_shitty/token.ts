import { Lexer } from ".";

interface TokenData {
  value?: string;
  id?: string;
  line?: number;
  column?: number;
  length?: number;
}

export class Token implements TokenData {
  value?: string;
  id?: string;
  line?: number;
  column?: number;
  length?: number;
  private lexer: Lexer;

  constructor(params: TokenData, ctx: Lexer) {
    this.lexer = ctx;
    this.set(params, false);
  }

  setValue(newValue: string, update = true) {
    this.value = newValue;
    this.length = newValue.length;
    if (update) {
      this.lexer.update();
    }
    return this;
  }

  public moveTo(line?: number, column?: number, update = true) {
    line && (this.line = line);
    column && (this.column = column);
    if (update) {
      this.lexer.update();
    }
    return this;
  }

  public moveBy(line?: number, column?: number, update = true) {
    line && this.line && (this.line += line);
    column && this.column && (this.column += column);
    if (update) {
      this.lexer.update();
    }
    return this;
  }

  set(params: Partial<TokenData>, update = true) {
    this.value = params.value || this.value;
    this.id = params.id || this.id;
    this.line = params.line || this.line;
    this.column = params.column || this.column;
    this.length = params.length || this.length;
    if (update) {
      this.lexer.update();
    }
    return this;
  }

  remove() {
    this.value = undefined;
    this.id = undefined;
    this.line = undefined;
    this.column = undefined;
    this.length = undefined;
    this.lexer.update();
  }
}
