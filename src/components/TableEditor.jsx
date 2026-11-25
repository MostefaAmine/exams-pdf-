import { createId } from '../data/initialExam';

export default function TableEditor({ table, onChange }) {
  const handleAddTableCol = () => {
    const nextCols = [...table.columns, `العمود ${table.columns.length + 1}`];
    const nextRows = table.rows.map((r) => ({
      ...r,
      cells: [...r.cells, ''],
    }));
    onChange({ ...table, columns: nextCols, rows: nextRows });
  };

  const handleRemoveTableCol = (colIdx) => {
    if (table.columns.length <= 2) return;
    const nextCols = table.columns.filter((_, idx) => idx !== colIdx);
    const nextRows = table.rows.map((r) => ({
      ...r,
      cells: r.cells.filter((_, idx) => idx !== colIdx),
    }));
    onChange({ ...table, columns: nextCols, rows: nextRows });
  };

  const handleAddTableRow = () => {
    onChange({
      ...table,
      rows: [
        ...table.rows,
        {
          id: createId('row'),
          subrows: 1,
          cells: Array(table.columns.length).fill(''),
        },
      ],
    });
  };

  const handleDeleteTableRow = (rowId) => {
    onChange({
      ...table,
      rows: table.rows.filter((r) => r.id !== rowId),
    });
  };

  return (
    <div className="p-3 bg-ivory/60 border border-border rounded-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-forest">
          محرر الجدول (<code className="font-mono" dir="ltr">\examtable</code>)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddTableCol}
            className="btn-secondary text-xs py-1 px-2"
          >
            + عمود
          </button>
          <button
            type="button"
            onClick={handleAddTableRow}
            className="btn-secondary text-xs py-1 px-2"
          >
            + صف
          </button>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${table.columns.length}, minmax(0, 1fr))` }}
      >
        {table.columns.map((col, colIdx) => (
          <div key={colIdx} className="flex items-center gap-1">
            <input
              type="text"
              className="academic-input bg-paper text-xs font-semibold py-1"
              value={col}
              onChange={(e) => {
                const nextCols = [...table.columns];
                nextCols[colIdx] = e.target.value;
                onChange({ ...table, columns: nextCols });
              }}
              placeholder={`العمود ${colIdx + 1}`}
            />
            {table.columns.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveTableCol(colIdx)}
                className="btn-danger-ghost px-1.5"
                title="حذف العمود"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {table.rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center gap-2 bg-paper p-2 border border-border/80 rounded-sm"
          >
            <div
              className="flex-1 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${table.columns.length}, minmax(0, 1fr))` }}
            >
              {table.columns.map((_, colIdx) => (
                <input
                  key={colIdx}
                  type="text"
                  className="academic-input bg-ivory/40 text-xs py-1"
                  value={row.cells[colIdx] || ''}
                  onChange={(e) => {
                    const nextCells = [...row.cells];
                    nextCells[colIdx] = e.target.value;
                    onChange({
                      ...table,
                      rows: table.rows.map((r) =>
                        r.id === row.id ? { ...r, cells: nextCells } : r
                      ),
                    });
                  }}
                  placeholder={colIdx === 0 ? 'محتوى العمود 1' : 'فارغ للتعبئة'}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <label className="text-[11px] text-muted">تفرعات:</label>
              <input
                type="number"
                min="1"
                max="6"
                className="academic-input w-12 text-xs py-1 text-center"
                value={row.subrows || 1}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(6, Number(e.target.value) || 1));
                  onChange({
                    ...table,
                    rows: table.rows.map((r) =>
                      r.id === row.id ? { ...r, subrows: val } : r
                    ),
                  });
                }}
                title="عدد الصفوف الفرعية (splitrow)"
              />
              <button
                type="button"
                onClick={() => handleDeleteTableRow(row.id)}
                className="btn-danger-ghost px-1.5"
                title="حذف الصف"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

