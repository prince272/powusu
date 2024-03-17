"use client";

import React, { useRef } from "react";
import { cn } from "@udecode/cn";
import { CommentsProvider } from "@udecode/plate-comments";
import { Plate } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { CommentsPopover } from "@/components/ui/editor/comments-popover";
import { CursorOverlay } from "@/components/ui/editor/cursor-overlay";
import { Editor } from "@/components/ui/editor/editor";
import { FixedToolbar } from "@/components/ui/editor/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/ui/editor/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/ui/editor/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/ui/editor/floating-toolbar-buttons";
import { MentionCombobox } from "@/components/ui/editor/mention-combobox";
import { commentsUsers, myUserId } from "@/components/ui/editor/utils/comments";
import { MENTIONABLES } from "@/components/ui/editor/utils/mentionables";
import { plugins } from "@/components/ui/editor/utils/plate-plugins";

import { TooltipProvider } from "./tooltip";

export function PlateEditor() {
  const containerRef = useRef(null);

  const initialValue = [
    {
      id: "1",
      type: ELEMENT_PARAGRAPH,
      children: [{ text: "Hello, World!" }]
    }
  ];

  return (
    <TooltipProvider disableHoverableContent delayDuration={500} skipDelayDuration={0}>
      <DndProvider backend={HTML5Backend}>
        <CommentsProvider users={commentsUsers} myUserId={myUserId}>
          <Plate plugins={plugins} initialValue={initialValue}>
            <div
              ref={containerRef}
              className={cn(
                "relative",
                // Block selection
                "[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
              )}
            >
              <FixedToolbar>
                <FixedToolbarButtons />
              </FixedToolbar>

              <Editor className="px-[96px] py-16" autoFocus focusRing={false} variant="ghost" size="md" />

              <FloatingToolbar>
                <FloatingToolbarButtons />
              </FloatingToolbar>

              <MentionCombobox items={MENTIONABLES} />

              <CommentsPopover />

              <CursorOverlay containerRef={containerRef} />
            </div>
          </Plate>
        </CommentsProvider>
      </DndProvider>
    </TooltipProvider>
  );
}
