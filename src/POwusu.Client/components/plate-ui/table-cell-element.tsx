import React from "react";
import { cn, withProps, withRef } from "@udecode/cn";
import { PlateElement } from "@udecode/plate-common";
import { useTableCellElement, useTableCellElementResizable, useTableCellElementResizableState, useTableCellElementState } from "@udecode/plate-table";

import { ResizeHandle } from "./resizable";

export const TableCellElement = withRef<
  typeof PlateElement,
  {
    hideBorder?: boolean;
    isHeader?: boolean;
  }
>(({ children, className, style, hideBorder, isHeader, ...props }, ref) => {
  const { element } = props;

  const { colIndex, rowIndex, readOnly, selected, hovered, hoveredLeft, rowSize, borders, isSelectingCell, colSpan } = useTableCellElementState();
  const { props: cellProps } = useTableCellElement({ element: props.element });
  const resizableState = useTableCellElementResizableState({
    colIndex,
    rowIndex,
    colSpan
  });

  const { rightProps, bottomProps, leftProps, hiddenLeft } = useTableCellElementResizable(resizableState);

  const Cell = isHeader ? "th" : "td";

  return (
    <PlateElement
      ref={ref}
      asChild
      className={cn(
        "relative h-full overflow-visible border-none bg-background p-0",
        hideBorder && "before:border-none",
        element.background ? "bg-[--cellBackground]" : "bg-background",
        !hideBorder &&
          cn(
            isHeader && "text-left [&_>_*]:m-0",
            "before:size-full",
            selected && "before:bg-muted before:z-10",
            "before:absolute before:box-border before:select-none before:content-['']",
            borders &&
              cn(
                borders.bottom?.size && `before:border-b-default-200 before:border-b`,
                borders.right?.size && `before:border-r-default-200 before:border-r`,
                borders.left?.size && `before:border-l-default-200 before:border-l`,
                borders.top?.size && `before:border-t-default-200 before:border-t`
              )
          ),
        className
      )}
      {...cellProps}
      {...props}
      style={
        {
          "--cellBackground": element.background,
          ...style
        } as React.CSSProperties
      }
    >
      <Cell>
        <div
          className="relative z-20 box-border h-full px-3 py-2"
          style={{
            minHeight: rowSize
          }}
        >
          {children}
        </div>

        {!isSelectingCell && (
          <div className="size-full group absolute top-0 select-none" contentEditable={false} suppressContentEditableWarning={true}>
            {!readOnly && (
              <>
                <ResizeHandle {...rightProps} className="-top-3 right-[-5px] w-[10px]" />
                <ResizeHandle {...bottomProps} className="bottom-[-5px] h-[10px]" />
                {!hiddenLeft && <ResizeHandle {...leftProps} className="-top-3 left-[-5px] w-[10px]" />}

                {hovered && <div className={cn("bg-ring absolute -top-3 z-30 h-[calc(100%_+_12px)] w-1", "right-[-1.5px]")} />}
                {hoveredLeft && <div className={cn("bg-ring absolute -top-3 z-30 h-[calc(100%_+_12px)] w-1", "left-[-1.5px]")} />}
              </>
            )}
          </div>
        )}
      </Cell>
    </PlateElement>
  );
});
TableCellElement.displayName = "TableCellElement";

export const TableCellHeaderElement = withProps(TableCellElement, {
  isHeader: true
});
