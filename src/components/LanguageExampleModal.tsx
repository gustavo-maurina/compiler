import { createPortal } from "react-dom";

export const LanguageExampleModal = ({ isOpen }: { isOpen: true }) => {
  return createPortal(
    <div className="bg-black flex items-center justify-center bg-opacity-60 w-screen h-screen absolute pointer-events-none">
      <dialog
        open={isOpen}
        className="text-left bg-zinc-900 text-gray-300 font-mono rounded text-lg"
      >
        <span className="mr-6 text-sm text-green-300 opacity-50">1</span>
        <span className="text-pink-300">variables</span>{" "}
        <span className="text-yellow-300">&#123;</span>
        <br />
        <span className="mr-8 text-sm text-green-300 opacity-50">2</span>
        <span className="text-blue-300">number</span> numero<span className="text-gray-400">;</span>
        <br />
        <span className="mr-8 text-sm text-green-300 opacity-50">3</span>
        <span className="text-blue-300">string</span> palavra<span className="text-gray-400">;</span>
        <br />
        <span className="mr-6 text-sm text-green-300 opacity-50">4</span>
        <span className="text-yellow-300">&#125;</span><span className="text-gray-400">;</span><br />
        <br />
        <span className="mr-6 text-sm text-green-300 opacity-50">5</span>
        <span className="text-pink-300">begin</span>{" "}
        <span className="text-yellow-300">&#123;</span><br />
        <span className="mr-8 text-sm text-green-300 opacity-50">6</span>numero
        = <span className="text-purple-300">1</span><span className="text-gray-400">;</span><br />
        <span className="mr-8 text-sm text-green-300 opacity-50">7</span>palavra
        = <span className="text-green-300">'hello world'</span><span className="text-gray-400">;</span><br />
        <br />
        <span className="mr-8 text-sm text-green-300 opacity-50">8</span>
        <span className="text-cyan-200">if</span>{" "}
        <span className="text-emerald-200">(</span>numero &gt;{" "}
        <span className="text-purple-300">0</span>
        <span className="text-emerald-200">)</span>{" "}
        <span className="text-yellow-300">&#123;</span>
        <br />
        <span className="mr-11 text-sm text-green-300 opacity-50">9</span>
        <span className="text-rose-300">print</span>
        <span className="text-emerald-200">(</span>palavra
        <span className="text-emerald-200">)</span><span className="text-gray-400">;</span><br />
        <span className="mr-7 text-sm text-green-300 opacity-50">10</span>
        <span className="text-yellow-300">&#125;</span> else{" "}
        <span className="text-yellow-300">&#123;</span>
        <br />
        <span className="mr-10 text-sm text-green-300 opacity-50">11</span>
        <span className="text-rose-300">print</span>
        <span className="text-emerald-200">(</span>numero
        <span className="text-emerald-200">)</span><span className="text-gray-400">;</span><br />
        <span className="mr-7 text-sm text-green-300 opacity-50">12</span>
        <span className="text-yellow-300">&#125;</span><br />
        <span className="mr-7 text-sm text-green-300 opacity-50">13</span>
        <span className="text-pink-300">end</span>
        <br />
        <span className="mr-5 text-sm text-green-300 opacity-50">14</span>
        <span className="text-yellow-300">&#125;</span><span className="text-gray-400">;</span>
      </dialog>
    </div>,
    document.getElementById("main") as HTMLElement
  );
};
