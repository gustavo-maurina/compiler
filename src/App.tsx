import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Terminal } from "./components/Terminal";
import { debounce } from "./utils/functions/debounce";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24] as const;
const BASE_FONT_SIZE_INDEX = 1 as const;

function App() {
  const [editorText, setEditorText] = useState<string>();
  const [fontSizeIndex, setFontSizeIndex] =
    useState<number>(BASE_FONT_SIZE_INDEX);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    editorRef.current?.addEventListener("keyup", (event) => {
      const numberOfLines = editorRef.current?.value.split("\n").length;

      lineNumbersRef.current!.innerHTML = Array(numberOfLines)
        .fill("<span></span>")
        .join("");
    });
  }, []);

  function changeFontSize(type: "increase" | "decrease") {
    setFontSizeIndex((curr) => {
      if (type === "increase") {
        return curr === FONT_SIZES.length - 1 ? curr : ++curr;
      }
      return curr === 0 ? curr : --curr;
    });
  }

  const handleInput =
    debounce((value: string) => setEditorText(value), 1000);


  return (
    <div id="main" className="flex w-screen h-screen bg-zinc-950">
      <div className="flex flex-col w-4/5">
        <div
          className={`h-full relative inline-flex gap-2 font-mono leading-6 px-2 py-2`}
        >
          <div
            ref={lineNumbersRef}
            id="line-numbers"
            className={`w-5 text-green-300`}
            style={{ fontSize: FONT_SIZES[fontSizeIndex] }}
          >
            <span></span>
          </div>
          <textarea
            style={{ fontSize: FONT_SIZES[fontSizeIndex] }}
            className={`font-mono text-left leading-6 w-full h-full border-none bg-transparent p-0 resize-none text-gray-300 focus:outline-none`}
            spellCheck={false}
            ref={editorRef}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => {
              if (!editorRef.current) return;

              const value = editorRef.current.value;
              const selectionStart = editorRef.current.selectionStart;
              const selectionEnd = editorRef.current.selectionEnd;

              if (e.key === "Tab" && !e.shiftKey) {
                e.preventDefault();
                editorRef.current.value =
                  value.substring(0, selectionStart) +
                  "  " +
                  value.substring(selectionEnd);
                editorRef.current.selectionStart =
                  editorRef.current.selectionEnd =
                    selectionEnd + 2 - (selectionEnd - selectionStart);
              } else if (e.key === "Tab" && e.shiftKey) {
                e.preventDefault();

                const beforeStart = value
                  .substring(0, selectionStart)
                  .split("")
                  .reverse()
                  .join("");
                const indexOfTab = beforeStart.indexOf("  ");
                const indexOfNewline = beforeStart.indexOf("\n");

                if (indexOfTab !== -1 && indexOfTab < indexOfNewline) {
                  editorRef.current.value =
                    beforeStart
                      .substring(indexOfTab + 2)
                      .split("")
                      .reverse()
                      .join("") +
                    beforeStart
                      .substring(0, indexOfTab)
                      .split("")
                      .reverse()
                      .join("") +
                    value.substring(selectionEnd);

                  editorRef.current.selectionStart = selectionStart - 2;
                  editorRef.current.selectionEnd = selectionEnd - 2;
                }
              }
            }}
          />

          <div className="absolute top-2 flex gap-2 right-2 text-lg">
            <button
              className="bg-gradient-to-br from-cyan-200 to-green-300 w-7 font-bold  h-7 flex items-center justify-center"
              onClick={() => changeFontSize("decrease")}
            >
              -
            </button>
            <button
              className="bg-gradient-to-br from-cyan-200 to-green-300 w-7 font-bold  h-7 flex items-center justify-center"
              onClick={() => changeFontSize("increase")}
            >
              +
            </button>
          </div>
        </div>

        <Terminal text={editorText ?? ""} />
      </div>

      <div className="flex items-center justify-center w-1/5 bg-zinc-900 drop-shadow-2xl text-green-300 border-l-1 border-l-zinc-600 border-opacity-50">
        TABELA
      </div>
    </div>
  );
}

export default App;
