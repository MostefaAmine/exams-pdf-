import { useState } from 'react';
import { createEmptyQuestion, createEmptyTable } from '../data/initialExam';
import TableEditor from './TableEditor';

const ARABIC_SUB_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];

export default function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleField = (field) => (e) => {
    onChange({ ...question, [field]: e.target.value });
  };

  const subquestions = question.subquestions || [];
  const table = question.table || createEmptyTable();

  const handleAddSubquestion = () => {
    const nextSub = createEmptyQuestion();
    onChange({
      ...question,
      subquestions: [
        ...subquestions,
        { id: nextSub.id, text: '', mark: '' },
      ],
    });
  };

  const handleUpdateSubquestion = (subId, updated) => {
    onChange({
      ...question,
      subquestions: subquestions.map((sq) => (sq.id === subId ? updated : sq)),
    });
  };

  const handleDeleteSubquestion = (subId) => {
    onChange({
      ...question,
      subquestions: subquestions.filter((sq) => sq.id !== subId),
    });
  };

  const handleMoveSubquestion = (subIndex, direction) => {
    const targetIndex = subIndex + direction;
    if (targetIndex < 0 || targetIndex >= subquestions.length) return;
    const copy = [...subquestions];
    const [moved] = copy.splice(subIndex, 1);
    copy.splice(targetIndex, 0, moved);
    onChange({ ...question, subquestions: copy });
  };

  const toggleTable = () => {
    onChange({
      ...question,
      hasTable: !question.hasTable,
      table: question.table || createEmptyTable(),
    });
  };

  return (
    <div className="bg-paper border border-border rounded-sm p-3 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-olive-light text-forest rounded-sm">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-muted">السؤال {index + 1}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="btn-ghost"
            title="تحريك لأعلى"
            aria-label="تحريك السؤال لأعلى"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="btn-ghost"
            title="تحريك لأسفل"
            aria-label="تحريك السؤال لأسفل"
          >
            ↓
          </button>

          {confirmDelete ? (
            <span className="inline-flex items-center gap-1 bg-danger-light px-2 py-0.5 rounded-sm text-xs">
              <button
                type="button"
                onClick={onDelete}
                className="text-danger font-semibold hover:underline cursor-pointer"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-muted hover:text-charcoal cursor-pointer"
              >
                إلغاء
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (question.text?.trim() || subquestions.length > 0 || question.hasTable) {
                  setConfirmDelete(true);
                } else {
                  onDelete();
                }
              }}
              className="btn-danger-ghost"
              title="حذف السؤال"
            >
              حذف
            </button>
          )}
        </div>
      </div>

      {/* Question text & optional mark */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-9">
          <textarea
            rows={2}
            dir="auto"
            className="academic-input text-sm"
            value={question.text}
            onChange={handleField('text')}
            placeholder="اكتب نص السؤال هنا..."
          />
        </div>
        <div className="sm:col-span-3">
          <input
            type="text"
            dir="auto"
            className="academic-input text-sm"
            value={question.mark}
            onChange={handleField('mark')}
            placeholder="النقطة (مثال: 2 ن)"
            aria-label="تنقيط السؤال"
          />
        </div>
      </div>

      {/* Subquestions */}
      {subquestions.length > 0 && (
        <div className="pr-4 border-r-2 border-olive/30 space-y-2 pt-1">
          {subquestions.map((sq, sqIdx) => (
            <div
              key={sq.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-ivory/70 border border-border/80 p-2 rounded-sm"
            >
              <span className="text-xs font-bold text-olive shrink-0 px-1" dir="ltr">
                ({ARABIC_SUB_LETTERS[sqIdx] || sqIdx + 1}
              </span>
              <input
                type="text"
                dir="auto"
                className="academic-input text-xs py-1.5 flex-1"
                value={sq.text}
                onChange={(e) =>
                  handleUpdateSubquestion(sq.id, { ...sq, text: e.target.value })
                }
                placeholder="نص السؤال الفرعي..."
              />
              <input
                type="text"
                dir="auto"
                className="academic-input text-xs py-1.5 sm:w-24"
                value={sq.mark}
                onChange={(e) =>
                  handleUpdateSubquestion(sq.id, { ...sq, mark: e.target.value })
                }
                placeholder="النقطة"
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveSubquestion(sqIdx, -1)}
                  disabled={sqIdx === 0}
                  className="btn-ghost px-1.5"
                  title="تحريك لأعلى"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSubquestion(sqIdx, 1)}
                  disabled={sqIdx === subquestions.length - 1}
                  className="btn-ghost px-1.5"
                  title="تحريك لأسفل"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSubquestion(sq.id)}
                  className="btn-danger-ghost px-1.5"
                  title="حذف السؤال الفرعي"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional Table inside Question */}
      {question.hasTable && (
        <TableEditor
          table={table}
          onChange={(nextTable) => onChange({ ...question, table: nextTable })}
        />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleAddSubquestion}
          className="text-xs text-olive hover:text-forest font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <span>+ إضافة سؤال فرعي</span>
        </button>

        <button
          type="button"
          onClick={toggleTable}
          className="text-xs text-olive hover:text-forest font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <span>
            {question.hasTable ? '− إزالة الجدول من السؤال' : '+ إضافة جدول داخل السؤال'}
          </span>
        </button>
      </div>
    </div>
  );
}
