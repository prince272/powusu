import { autoformatArrow, autoformatLegal, autoformatLegalHtml, autoformatMath, autoformatPunctuation, autoformatSmartQuotes } from "@udecode/plate-autoformat";

import { autoformatBlocks } from "@/components/ui/editor/utils/autoformatBlocks";
import { autoformatIndentLists } from "@/components/ui/editor/utils/autoformatIndentLists";
import { autoformatMarks } from "@/components/ui/editor/utils/autoformatMarks";
import { MyAutoformatRule } from "@/components/ui/editor/utils/plate-types";

export const autoformatRules = [
  ...autoformatBlocks,
  ...autoformatIndentLists,
  ...autoformatMarks,
  ...(autoformatSmartQuotes as MyAutoformatRule[]),
  ...(autoformatPunctuation as MyAutoformatRule[]),
  ...(autoformatLegal as MyAutoformatRule[]),
  ...(autoformatLegalHtml as MyAutoformatRule[]),
  ...(autoformatArrow as MyAutoformatRule[]),
  ...(autoformatMath as MyAutoformatRule[])
];
