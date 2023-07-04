import { useState } from "react";
import { Token } from "../compilers/parser";
import { DollarSign, HelpCircle } from "react-feather";
import { LanguageExampleModal } from "./LanguageExampleModal";

type TokensProps = {
  tokens: Token[];
};

export const Tokens = ({ tokens }: TokensProps) => {
  const [exampleModalOpen, setExampleModalOpen] = useState(false);

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden pt-4 flex items-center flex-col gap-4 w-3/12 bg-zinc-900 drop-shadow-2xl text-green-300 border-l-1 border-l-zinc-600 border-opacity-50">
        <div className="font-mono flex justify-between items-center w-full px-8">
            <div></div>
            <div className="flex gap-1">

          <DollarSign size={16} className="mt-[2px]" />
          <span>Tokens</span>
            </div>
          <div
            className="flex float-right cursor-pointer"
            onMouseEnter={() => setExampleModalOpen(true)}
            onMouseLeave={() => setExampleModalOpen(false)}
          >
            <HelpCircle size={19} className="w-full h-full"/>
          </div>
        </div>
        {!!tokens.length && (
          <table className="table table-fixed bg-green-950 text-slate-300 w-5/6 border-collapse p-0">
            <thead className="w-full">
              <tr>
                <th className="py-2 px-4 text-center border-1 border-zinc-100 border-opacity-30 w-1/2">
                  TIPO
                </th>
                <th className="py-2 px-4 text-center border-1 border-zinc-100 border-opacity-30 w-1/2">
                  VALOR
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {tokens.map((token, idx) => (
                <tr
                  key={`${token.value}${idx}`}
                  className={`w-full ${
                    idx % 2 === 0 ? "bg-green-925" : "bg-green-950"
                  }`}
                >
                  <td className="py-2 px-4 text-center border-1 border-zinc-100 border-opacity-30 w-1/2 break-words font-mono">
                    {token.type}
                  </td>
                  <td className="py-2 px-4 text-center border-1 border-zinc-100 border-opacity-30 w-1/2 break-words font-mono">
                    {token.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {exampleModalOpen && <LanguageExampleModal isOpen={exampleModalOpen}/>}
    </>
  );
};
