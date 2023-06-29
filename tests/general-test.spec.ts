import { test, expect, describe } from "vitest";
import { lexico } from "../src/compilers/parser";

describe("General tests", () => {
  test("Case 1", () => {
    const [tokens, erros] = lexico(`
      if(1+2){
        print('test')
      }
    `);
    expect(tokens.length).toBe(12);
    expect(erros.length).toBe(0);
  });

  test("Case 2", () => {
    const [tokens, erros] = lexico(`
    variables {
      int var = 1
    }
    var = 2
    print('testestestestestestestestestestestestestestestes')
  `);
    expect(tokens.length).toBe(14);
    expect(erros.length).toBe(0);
  });
});
