import { autoformatArrow, autoformatLegal, autoformatLegalHtml, autoformatMath, autoformatPunctuation, autoformatSmartQuotes } from "@udecode/plate-autoformat";

import { autoformatBlocks } from "@/components/plate-ui/utils/autoformatBlocks";
import { autoformatIndentLists } from "@/components/plate-ui/utils/autoformatIndentLists";
import { autoformatMarks } from "@/components/plate-ui/utils/autoformatMarks";
import { MyAutoformatRule } from "@/components/plate-ui/utils/plate-types";

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
