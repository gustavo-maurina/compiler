import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Code, Trash2 } from "react-feather";
import  { Interpreter, Lexer } from "../compiler_shitty/lexer";
import { GRAMMAR } from "../compiler_shitty/grammar";
import { lexico } from "../compilers/parser";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24] as const;
const BASE_FONT_SIZE_INDEX = 4 as const;

export const Terminal = ({text}:{text: string}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [fontSizeIndex, setFontSizeIndex] =
  useState<number>(BASE_FONT_SIZE_INDEX);

  const [compilerResponse, setCompilerResponse] = useState<string>()

  useEffect(() => {
    try {
      console.log(text); // 7
      if(!text) return
      const [tokens, erros] = lexico(text)
      if(erros.length) {
        throw erros[0]
      }
      setCompilerResponse('success')
    } catch(err: any) {
      console.log(err)
      if(err.message) {
        setCompilerResponse(err.message)
        return
      }
      setCompilerResponse(JSON.stringify(err))
    }
  }, [text])

  function changeFontSize(type: "increase" | "decrease") {
    setFontSizeIndex((curr) => {
      if (type === "increase") {
        return curr === FONT_SIZES.length - 1 ? curr : ++curr;
      }
      return curr === 0 ? curr : --curr;
    });
  }


  return (
    <div
      style={{ transition: "500ms" }}
      className={`flex flex-col justify-start items-start gap-3 ease-in-out ${
        isOpen ? "h-1/3" : "h-12"
      } bottom-0 absolute w-4/5 py-2 px-4 bg-zinc-900 border-t-1 border-t-zinc-600 border-opacity-50 overflow-hidden`}
    >
      <div className="flex flex-row justify-between w-full">
        <div></div>

        <div className="text-green-300 flex gap-2 items-center font-mono text-base">
          <Code size={18} />
          <span className="mt-1">Terminal</span>
        </div>
        <div className="flex gap-6 text-white font-bold cursor-pointer">
          <Trash2 size={17} className="mt-1" />
          <div onClick={()=>setIsOpen(curr => !curr)}>
            {isOpen ? (
              <ChevronDown size={18} className="mt-1" />
            ) : (
              <ChevronUp size={18} className="mt-1" />
            )}
          </div>
        </div>
      </div>

      <div className="text-slate-300" style={{fontSize: FONT_SIZES[fontSizeIndex]}}>
        {compilerResponse}
      </div>

      <div className={`${isOpen ? 'absolute' : 'invisible'} bottom-2 flex gap-2 right-2 text-lg absolute`}>
            <button
              className="bg-gradient-to-br from-cyan-200 to-green-300 w-6 font-bold  h-6 flex items-center justify-center"
              onClick={() => changeFontSize("decrease")}
            >
              -
            </button>
            <button
              className="bg-gradient-to-br from-cyan-200 to-green-300 w-6 font-bold  h-6 flex items-center justify-center"
              onClick={() => changeFontSize("increase")}
            >
              +
            </button>
          </div>
    </div>
  );
};
