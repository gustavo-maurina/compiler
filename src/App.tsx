import { useEffect, useState } from "react";
import "./App.css";
import { Erro, Token, lexico, sintatico } from "./compilers/parser";
import { Terminal } from "./components/Terminal";
import { Tokens } from "./components/Tokens";
import { CustomTextArea } from "./components/CustomTextArea";

function App() {
  const [input, setInput] = useState<string>();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [erros, setErros] = useState<Erro[]>([]);

  useEffect(() => {
    if (!input) return;

    try {
      const [tokens, erros] = lexico(input);
      setTokens(tokens);
      setErros(erros);
      sintatico(tokens);
    } catch (err: any) {
      if (err.message) {
        setErros([err.message]);
      } else {
        setErros([JSON.stringify(err)]);
      }
    }
  }, [input]);

  return (
    <>
      <div id="main" className="flex w-screen h-screen bg-zinc-950">
        <div className="flex flex-col w-4/5">
          <CustomTextArea setInput={setInput} input={input} />
          <Terminal erros={erros} />
        </div>
        <Tokens tokens={tokens} />
      </div>
    </>
  );
}

export default App;
