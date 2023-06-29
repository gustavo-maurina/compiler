import { GrammarStruct } from "./lexer";

export const GRAMMAR: GrammarStruct[] = [
  // Comments
  {
    id: "single_line_comment_begin",
    match: ">>>"
  },
  {
    id: "multi_line_comment_begin",
    match: ">>"
  },
  {
    id: "multi_line_comment_end",
    match: "<<"
  }
  // ...
]