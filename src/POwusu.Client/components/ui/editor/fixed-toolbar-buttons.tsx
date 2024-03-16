import React from "react";
import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_STRIKETHROUGH, MARK_UNDERLINE } from "@udecode/plate-basic-marks";
import { useEditorReadOnly } from "@udecode/plate-common";
import { MARK_BG_COLOR, MARK_COLOR } from "@udecode/plate-font";
import { ListStyleType } from "@udecode/plate-indent-list";
import { ELEMENT_IMAGE } from "@udecode/plate-media";

import { AlignDropdownMenu } from "@/components/ui/editor/align-dropdown-menu";
import { ColorDropdownMenu } from "@/components/ui/editor/color-dropdown-menu";
import { CommentToolbarButton } from "@/components/ui/editor/comment-toolbar-button";
import { EmojiDropdownMenu } from "@/components/ui/editor/emoji-dropdown-menu";
import { Icons, iconVariants } from "@/components/ui/editor/icons";
import { IndentListToolbarButton } from "@/components/ui/editor/indent-list-toolbar-button";
import { IndentToolbarButton } from "@/components/ui/editor/indent-toolbar-button";
import { LineHeightDropdownMenu } from "@/components/ui/editor/line-height-dropdown-menu";
import { LinkToolbarButton } from "@/components/ui/editor/link-toolbar-button";
import { MediaToolbarButton } from "@/components/ui/editor/media-toolbar-button";
import { MoreDropdownMenu } from "@/components/ui/editor/more-dropdown-menu";
import { OutdentToolbarButton } from "@/components/ui/editor/outdent-toolbar-button";
import { TableDropdownMenu } from "@/components/ui/editor/table-dropdown-menu";

import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: "translateX(calc(-1px))"
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton tooltip="Bold (⌘+B)" nodeType={MARK_BOLD}>
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Italic (⌘+I)" nodeType={MARK_ITALIC}>
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Underline (⌘+U)" nodeType={MARK_UNDERLINE}>
                <Icons.underline />
              </MarkToolbarButton>

              <MarkToolbarButton tooltip="Strikethrough (⌘+⇧+M)" nodeType={MARK_STRIKETHROUGH}>
                <Icons.strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Code (⌘+E)" nodeType={MARK_CODE}>
                <Icons.code />
              </MarkToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ColorDropdownMenu nodeType={MARK_COLOR} tooltip="Text Color">
                <Icons.color className={iconVariants({ variant: "toolbar" })} />
              </ColorDropdownMenu>
              <ColorDropdownMenu nodeType={MARK_BG_COLOR} tooltip="Highlight Color">
                <Icons.bg className={iconVariants({ variant: "toolbar" })} />
              </ColorDropdownMenu>
            </ToolbarGroup>

            <ToolbarGroup>
              <AlignDropdownMenu />

              <LineHeightDropdownMenu />

              <IndentListToolbarButton nodeType={ListStyleType.Disc} />
              <IndentListToolbarButton nodeType={ListStyleType.Decimal} />

              <OutdentToolbarButton />
              <IndentToolbarButton />
            </ToolbarGroup>

            <ToolbarGroup>
              <LinkToolbarButton />

              <MediaToolbarButton nodeType={ELEMENT_IMAGE} />

              <TableDropdownMenu />

              <EmojiDropdownMenu />

              <MoreDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />

        <ToolbarGroup noSeparator>
          <CommentToolbarButton />
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
