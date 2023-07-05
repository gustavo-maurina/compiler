import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Code } from "react-feather";
import { Erro } from "../compilers/parser";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24] as const;
const BASE_FONT_SIZE_INDEX = 2 as const;

type TerminalProps = {
  erros: Erro[];
};

export const Terminal = ({ erros }: TerminalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] =
    useState<number>(BASE_FONT_SIZE_INDEX);

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
      } bottom-0 absolute w-9/12 py-2 px-4 bg-zinc-900 border-t-1 border-t-zinc-600 border-opacity-50 overflow-hidden`}
    >
      <div className="flex flex-row justify-between w-full">
        <div></div>

        <div className="text-green-300 flex gap-2 items-center font-mono text-base">
          {erros.length ? (
            <AlertCircle size={18} className="text-red-400" />
          ) : (
            <Code size={18} />
          )}
          <span className={`mt-1 ${erros.length && "text-red-400"}`}>
            Terminal
          </span>
        </div>
        <div className="flex gap-6 text-white font-bold cursor-pointer">
          <div onClick={() => setIsOpen((curr) => !curr)}>
            {isOpen ? (
              <button title="Collapse terminal">
                <ChevronDown size={18} className="mt-1" />
              </button>
            ) : (
              <button title="Expand terminal">
                <ChevronUp size={18} className="mt-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="text-slate-300 font-mono"
        style={{ fontSize: FONT_SIZES[fontSizeIndex] }}
      >
        {!!erros.length && <span className="text-red-400">{erros[0]}</span>}
      </div>

      <div
        className={`${
          isOpen ? "absolute" : "invisible"
        } bottom-2 flex gap-2 right-2 text-lg absolute`}
      >
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
