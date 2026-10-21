import { Node as ProsemirrorNode, Schema } from "@tiptap/pm/model";

import { createTable } from "./createTable.js";
import { getTableNodeTypes } from "./getTableNodeTypes.js";

/**
 * The minimum width of the automatically numbered (rank) column in pixels.
 */
export const RANK_COLUMN_WIDTH = 40;

/**
 * Creates a table with an extra, narrow column on the left that is reserved
 * for automatic row numbering. The numbers themselves are drawn by CSS
 * counters, so they never have to be typed or maintained by hand.
 */
export function createNumberedTable(
  schema: Schema,
  rowsCount: number,
  colsCount: number,
  withHeaderRow: boolean,
  defaultCellAttrs?: { colwidth?: number[] }
): ProsemirrorNode {
  const types = getTableNodeTypes(schema);
  const table = createTable(
    schema,
    rowsCount,
    colsCount,
    withHeaderRow,
    undefined,
    defaultCellAttrs
  );

  const rows: ProsemirrorNode[] = [];
  table.forEach((row) => {
    const isHeader = row.firstChild?.type === types.header_cell;
    const rankCell = (isHeader ? types.header_cell : types.cell).createAndFill(
      { ...defaultCellAttrs, colwidth: [RANK_COLUMN_WIDTH] },
      null
    );
    if (!rankCell) return;

    const cells: ProsemirrorNode[] = [];
    row.forEach((cell) => cells.push(cell));
    rows.push(row.type.create(row.attrs, [rankCell, ...cells]));
  });

  return types.table.create({ ...table.attrs, numbered: true }, rows);
}
